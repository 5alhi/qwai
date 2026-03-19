import { and, count, desc, eq, gt, gte, sql, isNotNull } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  adminSessions,
  articles,
  InsertArticle,
  InsertNewsletterSubscriber,
  InsertPageView,
  InsertUser,
  InsertVisitorEvent,
  newsletterSubscribers,
  pageViews,
  users,
  visitorEvents,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else if (user.openId === ENV.ownerOpenId) { values.role = 'admin'; updateSet.role = 'admin'; }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) { console.error("[Database] Failed to upsert user:", error); throw error; }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ─── Article helpers ──────────────────────────────────────────────────────────

export async function getPublishedArticles() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(articles).where(eq(articles.published, true)).orderBy(desc(articles.publishedAt));
}

export async function getAllArticles() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(articles).orderBy(desc(articles.createdAt));
}

export async function getArticleBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(articles).where(eq(articles.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createArticle(data: InsertArticle) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(articles).values(data);
  const result = await db.select().from(articles).where(eq(articles.slug, data.slug)).limit(1);
  return result[0];
}

export async function updateArticle(id: number, data: Partial<InsertArticle>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(articles).set(data).where(eq(articles.id, id));
  const result = await db.select().from(articles).where(eq(articles.id, id)).limit(1);
  return result[0];
}

export async function deleteArticle(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(articles).where(eq(articles.id, id));
}

// ─── Admin session helpers ────────────────────────────────────────────────────

export async function createAdminSession(token: string, expiresAt: Date) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(adminSessions).values({ token, expiresAt });
}

export async function getAdminSession(token: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(adminSessions)
    .where(and(eq(adminSessions.token, token), gt(adminSessions.expiresAt, new Date()))).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function deleteAdminSession(token: string) {
  const db = await getDb();
  if (!db) return;
  await db.delete(adminSessions).where(eq(adminSessions.token, token));
}

// ─── Analytics helpers ────────────────────────────────────────────────────────

export async function trackPageView(data: InsertPageView) {
  const db = await getDb();
  if (!db) return null;
  try {
    const result = await db.insert(pageViews).values(data);
    // Return the inserted ID so client can reference it for event tracking
    return (result as unknown as { insertId: number }).insertId ?? null;
  } catch (e) {
    console.warn("[Analytics] Failed to track page view:", e);
    return null;
  }
}

export async function updatePageViewEngagement(id: number, scrollDepth: number, timeOnPage: number) {
  const db = await getDb();
  if (!db) return;
  try {
    await db.update(pageViews)
      .set({ scrollDepth, timeOnPage })
      .where(eq(pageViews.id, id));
  } catch (e) {
    console.warn("[Analytics] Failed to update engagement:", e);
  }
}

export async function trackVisitorEvent(data: InsertVisitorEvent) {
  const db = await getDb();
  if (!db) return;
  try {
    await db.insert(visitorEvents).values(data);
  } catch (e) {
    console.warn("[Analytics] Failed to track visitor event:", e);
  }
}

export async function getAnalyticsSummary(days = 30) {
  const db = await getDb();
  if (!db) return null;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const [totalViews] = await db
    .select({ count: count() })
    .from(pageViews)
    .where(gte(pageViews.createdAt, since));

  const [uniqueSessions] = await db
    .select({ count: sql<number>`COUNT(DISTINCT ${pageViews.sessionId})` })
    .from(pageViews)
    .where(gte(pageViews.createdAt, since));

  const [newVisitors] = await db
    .select({ count: count() })
    .from(pageViews)
    .where(and(gte(pageViews.createdAt, since), eq(pageViews.isNewVisitor, true)));

  const topPages = await db
    .select({ path: pageViews.path, count: count() })
    .from(pageViews)
    .where(gte(pageViews.createdAt, since))
    .groupBy(pageViews.path)
    .orderBy(desc(count()))
    .limit(10);

  const topReferrers = await db
    .select({ referrer: pageViews.referrerDomain, count: count() })
    .from(pageViews)
    .where(and(gte(pageViews.createdAt, since), isNotNull(pageViews.referrerDomain), sql`${pageViews.referrerDomain} != ''`))
    .groupBy(pageViews.referrerDomain)
    .orderBy(desc(count()))
    .limit(10);

  const deviceBreakdown = await db
    .select({ device: pageViews.device, count: count() })
    .from(pageViews)
    .where(gte(pageViews.createdAt, since))
    .groupBy(pageViews.device)
    .orderBy(desc(count()));

  const browserBreakdown = await db
    .select({ browser: pageViews.browser, count: count() })
    .from(pageViews)
    .where(and(gte(pageViews.createdAt, since), isNotNull(pageViews.browser)))
    .groupBy(pageViews.browser)
    .orderBy(desc(count()))
    .limit(10);

  const osBreakdown = await db
    .select({ os: pageViews.os, count: count() })
    .from(pageViews)
    .where(and(gte(pageViews.createdAt, since), isNotNull(pageViews.os)))
    .groupBy(pageViews.os)
    .orderBy(desc(count()))
    .limit(10);

  const countryBreakdown = await db
    .select({ country: pageViews.country, countryCode: pageViews.countryCode, count: count() })
    .from(pageViews)
    .where(and(gte(pageViews.createdAt, since), isNotNull(pageViews.country)))
    .groupBy(pageViews.country, pageViews.countryCode)
    .orderBy(desc(count()))
    .limit(20);

  const cityBreakdown = await db
    .select({ city: pageViews.city, country: pageViews.country, lat: pageViews.latitude, lng: pageViews.longitude, count: count() })
    .from(pageViews)
    .where(and(gte(pageViews.createdAt, since), isNotNull(pageViews.city)))
    .groupBy(pageViews.city, pageViews.country, pageViews.latitude, pageViews.longitude)
    .orderBy(desc(count()))
    .limit(50);

  const utmSources = await db
    .select({ source: pageViews.utmSource, medium: pageViews.utmMedium, campaign: pageViews.utmCampaign, count: count() })
    .from(pageViews)
    .where(and(gte(pageViews.createdAt, since), isNotNull(pageViews.utmSource)))
    .groupBy(pageViews.utmSource, pageViews.utmMedium, pageViews.utmCampaign)
    .orderBy(desc(count()))
    .limit(20);

  const topArticles = await db
    .select({ articleSlug: pageViews.articleSlug, count: count() })
    .from(pageViews)
    .where(and(gte(pageViews.createdAt, since), isNotNull(pageViews.articleSlug)))
    .groupBy(pageViews.articleSlug)
    .orderBy(desc(count()))
    .limit(10);

  const avgEngagement = await db
    .select({
      avgScroll: sql<number>`AVG(${pageViews.scrollDepth})`,
      avgTime: sql<number>`AVG(${pageViews.timeOnPage})`,
      avgLoad: sql<number>`AVG(${pageViews.pageLoadTime})`,
    })
    .from(pageViews)
    .where(gte(pageViews.createdAt, since));

  const dailyViews = await db
    .select({
      date: sql<string>`DATE(${pageViews.createdAt})`,
      count: count(),
      sessions: sql<number>`COUNT(DISTINCT ${pageViews.sessionId})`,
    })
    .from(pageViews)
    .where(gte(pageViews.createdAt, since))
    .groupBy(sql`DATE(${pageViews.createdAt})`)
    .orderBy(sql`DATE(${pageViews.createdAt})`);

  return {
    totalViews: totalViews?.count ?? 0,
    uniqueSessions: Number(uniqueSessions?.count ?? 0),
    newVisitors: newVisitors?.count ?? 0,
    topPages,
    topReferrers,
    deviceBreakdown,
    browserBreakdown,
    osBreakdown,
    countryBreakdown,
    cityBreakdown,
    utmSources,
    topArticles,
    avgEngagement: avgEngagement[0] ?? { avgScroll: 0, avgTime: 0, avgLoad: 0 },
    dailyViews,
  };
}

export async function getRecentHits(limit = 100, offset = 0, search?: string) {
  const db = await getDb();
  if (!db) return { hits: [], total: 0 };
  
  const whereClause = search
    ? sql`(${pageViews.path} LIKE ${`%${search}%`} OR ${pageViews.ip} LIKE ${`%${search}%`} OR ${pageViews.city} LIKE ${`%${search}%`} OR ${pageViews.country} LIKE ${`%${search}%`} OR ${pageViews.referrer} LIKE ${`%${search}%`})`
    : undefined;

  const hits = await db
    .select()
    .from(pageViews)
    .where(whereClause)
    .orderBy(desc(pageViews.createdAt))
    .limit(limit)
    .offset(offset);

  const [totalResult] = await db
    .select({ count: count() })
    .from(pageViews)
    .where(whereClause);

  return { hits, total: totalResult?.count ?? 0 };
}

export async function getPageViewById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(pageViews).where(eq(pageViews.id, id)).limit(1);
  return result[0] ?? null;
}

export async function getEventsByPageViewId(pageViewId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(visitorEvents)
    .where(eq(visitorEvents.pageViewId, pageViewId))
    .orderBy(visitorEvents.createdAt);
}

export async function getSessionTimeline(sessionId: string) {
  const db = await getDb();
  if (!db) return { pageViews: [], events: [] };
  
  const pvs = await db.select().from(pageViews)
    .where(eq(pageViews.sessionId, sessionId))
    .orderBy(pageViews.createdAt);
  
  const evts = await db.select().from(visitorEvents)
    .where(eq(visitorEvents.sessionId, sessionId))
    .orderBy(visitorEvents.createdAt);

  return { pageViews: pvs, events: evts };
}

export async function getRealTimeHits(minutes = 60) {
  const db = await getDb();
  if (!db) return [];
  const since = new Date(Date.now() - minutes * 60 * 1000);
  return db.select().from(pageViews)
    .where(gte(pageViews.createdAt, since))
    .orderBy(desc(pageViews.createdAt))
    .limit(200);
}

// ─── Newsletter helpers ───────────────────────────────────────────────────────

export async function subscribeNewsletter(data: InsertNewsletterSubscriber) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(newsletterSubscribers).values(data)
    .onDuplicateKeyUpdate({ set: { active: true } });
}

export async function getAllSubscribers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(newsletterSubscribers)
    .where(eq(newsletterSubscribers.active, true))
    .orderBy(desc(newsletterSubscribers.subscribedAt));
}

export async function getSubscriberCount() {
  const db = await getDb();
  if (!db) return 0;
  const [result] = await db.select({ count: count() })
    .from(newsletterSubscribers)
    .where(eq(newsletterSubscribers.active, true));
  return result?.count ?? 0;
}
