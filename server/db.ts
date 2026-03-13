import { and, count, desc, eq, gt, gte, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  adminSessions,
  articles,
  InsertArticle,
  InsertNewsletterSubscriber,
  InsertPageView,
  InsertUser,
  newsletterSubscribers,
  pageViews,
  users,
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
  if (!db) return;
  try {
    await db.insert(pageViews).values(data);
  } catch (e) {
    console.warn("[Analytics] Failed to track page view:", e);
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

  const topPages = await db
    .select({ path: pageViews.path, count: count() })
    .from(pageViews)
    .where(gte(pageViews.createdAt, since))
    .groupBy(pageViews.path)
    .orderBy(desc(count()))
    .limit(10);

  const topReferrers = await db
    .select({ referrer: pageViews.referrer, count: count() })
    .from(pageViews)
    .where(and(gte(pageViews.createdAt, since), sql`${pageViews.referrer} IS NOT NULL AND ${pageViews.referrer} != ''`))
    .groupBy(pageViews.referrer)
    .orderBy(desc(count()))
    .limit(10);

  const deviceBreakdown = await db
    .select({ device: pageViews.device, count: count() })
    .from(pageViews)
    .where(gte(pageViews.createdAt, since))
    .groupBy(pageViews.device)
    .orderBy(desc(count()));

  const topArticles = await db
    .select({ articleSlug: pageViews.articleSlug, count: count() })
    .from(pageViews)
    .where(and(gte(pageViews.createdAt, since), sql`${pageViews.articleSlug} IS NOT NULL`))
    .groupBy(pageViews.articleSlug)
    .orderBy(desc(count()))
    .limit(10);

  // Daily views for the last 30 days
  const dailyViews = await db
    .select({
      date: sql<string>`DATE(${pageViews.createdAt})`,
      count: count(),
    })
    .from(pageViews)
    .where(gte(pageViews.createdAt, since))
    .groupBy(sql`DATE(${pageViews.createdAt})`)
    .orderBy(sql`DATE(${pageViews.createdAt})`);

  return {
    totalViews: totalViews?.count ?? 0,
    uniqueSessions: Number(uniqueSessions?.count ?? 0),
    topPages,
    topReferrers,
    deviceBreakdown,
    topArticles,
    dailyViews,
  };
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
