import {
  boolean,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Articles table: stores all blog/insight articles for qw.ai
 */
export const articles = mysqlTable("articles", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 256 }).notNull().unique(),
  title: varchar("title", { length: 512 }).notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  author: varchar("author", { length: 256 }).notNull(),
  category: varchar("category", { length: 128 }).notNull(),
  imageUrl: text("imageUrl"),
  published: boolean("published").default(false).notNull(),
  featured: boolean("featured").default(false).notNull(),
  linkedinUrl: text("linkedinUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  publishedAt: timestamp("publishedAt"),
});

export type Article = typeof articles.$inferSelect;
export type InsertArticle = typeof articles.$inferInsert;

/**
 * Admin sessions: password-based admin authentication tokens
 */
export const adminSessions = mysqlTable("admin_sessions", {
  id: int("id").autoincrement().primaryKey(),
  token: varchar("token", { length: 256 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
});

export type AdminSession = typeof adminSessions.$inferSelect;

/**
 * Page views: comprehensive visitor tracking for analytics
 * Captures every available signal from each hit.
 */
export const pageViews = mysqlTable("page_views", {
  id: int("id").autoincrement().primaryKey(),

  // Navigation
  path: varchar("path", { length: 512 }).notNull(),
  referrer: varchar("referrer", { length: 1024 }),
  referrerDomain: varchar("referrerDomain", { length: 256 }),
  articleSlug: varchar("articleSlug", { length: 256 }),

  // UTM / campaign tracking
  utmSource: varchar("utmSource", { length: 256 }),
  utmMedium: varchar("utmMedium", { length: 256 }),
  utmCampaign: varchar("utmCampaign", { length: 256 }),
  utmContent: varchar("utmContent", { length: 256 }),
  utmTerm: varchar("utmTerm", { length: 256 }),

  // Session
  sessionId: varchar("sessionId", { length: 128 }),
  isNewVisitor: boolean("isNewVisitor").default(true),

  // Device & browser
  userAgent: text("userAgent"),
  device: mysqlEnum("device", ["desktop", "mobile", "tablet"]).default("desktop"),
  browser: varchar("browser", { length: 128 }),
  browserVersion: varchar("browserVersion", { length: 64 }),
  os: varchar("os", { length: 128 }),
  osVersion: varchar("osVersion", { length: 64 }),
  screenWidth: int("screenWidth"),
  screenHeight: int("screenHeight"),
  viewportWidth: int("viewportWidth"),
  viewportHeight: int("viewportHeight"),
  colorDepth: int("colorDepth"),
  language: varchar("language", { length: 32 }),
  connectionType: varchar("connectionType", { length: 64 }),

  // Geo (resolved server-side from IP)
  ip: varchar("ip", { length: 64 }),
  country: varchar("country", { length: 128 }),
  countryCode: varchar("countryCode", { length: 8 }),
  region: varchar("region", { length: 128 }),
  city: varchar("city", { length: 128 }),
  latitude: varchar("latitude", { length: 32 }),
  longitude: varchar("longitude", { length: 32 }),
  timezone: varchar("timezone", { length: 64 }),
  isp: varchar("isp", { length: 256 }),

  // Engagement (updated via separate event)
  scrollDepth: int("scrollDepth").default(0),   // max % scrolled
  timeOnPage: int("timeOnPage").default(0),      // seconds
  pageLoadTime: int("pageLoadTime"),             // ms

  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PageView = typeof pageViews.$inferSelect;
export type InsertPageView = typeof pageViews.$inferInsert;

/**
 * Visitor events: individual interactions within a page view
 * (clicks, scroll milestones, form interactions, etc.)
 */
export const visitorEvents = mysqlTable("visitor_events", {
  id: int("id").autoincrement().primaryKey(),
  pageViewId: int("pageViewId"),   // FK to page_views.id
  sessionId: varchar("sessionId", { length: 128 }),
  eventType: varchar("eventType", { length: 64 }).notNull(), // click | scroll | exit | focus | copy
  eventTarget: varchar("eventTarget", { length: 512 }),      // CSS selector or element tag
  eventText: varchar("eventText", { length: 512 }),          // visible text of clicked element
  eventHref: varchar("eventHref", { length: 1024 }),         // href if it's a link
  positionX: int("positionX"),
  positionY: int("positionY"),
  scrollPercent: int("scrollPercent"),
  metadata: text("metadata"),                                // JSON blob for extra data
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type VisitorEvent = typeof visitorEvents.$inferSelect;
export type InsertVisitorEvent = typeof visitorEvents.$inferInsert;

/**
 * Newsletter subscribers: email capture for updates
 */
export const newsletterSubscribers = mysqlTable("newsletter_subscribers", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 256 }),
  subscribedAt: timestamp("subscribedAt").defaultNow().notNull(),
  active: boolean("active").default(true).notNull(),
  source: varchar("source", { length: 128 }).default("homepage"),
});

export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type InsertNewsletterSubscriber = typeof newsletterSubscribers.$inferInsert;
