import { TRPCError } from "@trpc/server";
import { SignJWT, jwtVerify } from "jose";
import { z } from "zod";
import {
  createArticle,
  deleteArticle,
  getAllArticles,
  getAllSubscribers,
  getAnalyticsSummary,
  getArticleBySlug,
  getEventsByPageViewId,
  getPageViewById,
  getPublishedArticles,
  getRecentHits,
  getRealTimeHits,
  getSessionTimeline,
  getSubscriberCount,
  subscribeNewsletter,
  trackPageView,
  trackVisitorEvent,
  updateArticle,
  updatePageViewEngagement,
} from "./db";
import { extractIp, extractReferrerDomain, lookupGeo, parseUserAgent } from "./analytics";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

// ─── Admin password & JWT secret ─────────────────────────────────────────────
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "qwai-admin-2026";
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "qwai-jwt-secret-change-in-production"
);
const JWT_EXPIRY = "7d";

// --- Admin middleware: reads Bearer token from Authorization header ---
const adminProcedure = publicProcedure.use(async ({ ctx, next }) => {
  const authHeader = ctx.req.headers["authorization"] as string | undefined;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Admin authentication required" });
  }
  try {
    await jwtVerify(token, JWT_SECRET, { audience: "qwai-admin" });
  } catch {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid or expired admin session" });
  }
  return next({ ctx: { ...ctx, adminToken: token } });
});

// ─── Article input schema ─────────────────────────────────────────────────────
const articleInput = z.object({
  slug: z.string().min(1).max(256),
  title: z.string().min(1).max(512),
  excerpt: z.string().min(1),
  content: z.string().min(1),
  author: z.string().min(1).max(256),
  category: z.string().min(1).max(128),
  imageUrl: z.string().optional(),
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
  linkedinUrl: z.string().optional(),
  publishedAt: z.date().optional(),
});

// ─── Router ───────────────────────────────────────────────────────────────────
export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // --- Admin auth: JWT-based, no cookies ---
  admin: router({
    login: publicProcedure
      .input(z.object({ password: z.string() }))
      .mutation(async ({ input }) => {
        if (input.password !== ADMIN_PASSWORD) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Incorrect password" });
        }
        const token = await new SignJWT({ role: "admin" })
          .setProtectedHeader({ alg: "HS256" })
          .setAudience("qwai-admin")
          .setIssuedAt()
          .setExpirationTime(JWT_EXPIRY)
          .sign(JWT_SECRET);
        return { success: true, token };
      }),

    check: publicProcedure
      .input(z.object({ token: z.string().optional() }))
      .query(async ({ input }) => {
        if (!input.token) return { authenticated: false };
        try {
          await jwtVerify(input.token, JWT_SECRET, { audience: "qwai-admin" });
          return { authenticated: true };
        } catch {
          return { authenticated: false };
        }
      }),
  }),

  // ─── Public articles ─────────────────────────────────────────────────────────
  articles: router({
    list: publicProcedure.query(async () => {
      return getPublishedArticles();
    }),

    bySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const article = await getArticleBySlug(input.slug);
        if (!article || !article.published) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Article not found" });
        }
        return article;
      }),
  }),

  // ─── Admin articles (protected) ───────────────────────────────────────────────
  adminArticles: router({
    list: adminProcedure.query(async () => {
      return getAllArticles();
    }),

    create: adminProcedure
      .input(articleInput)
      .mutation(async ({ input }) => {
        const data = {
          ...input,
          imageUrl: input.imageUrl ?? null,
          linkedinUrl: input.linkedinUrl ?? null,
          published: input.published ?? false,
          featured: input.featured ?? false,
          publishedAt: input.published ? (input.publishedAt ?? new Date()) : null,
        };
        return createArticle(data);
      }),

    update: adminProcedure
      .input(z.object({ id: z.number(), data: articleInput.partial() }))
      .mutation(async ({ input }) => {
        const updateData: Record<string, unknown> = { ...input.data };
        if (input.data.published === true && !input.data.publishedAt) {
          updateData.publishedAt = new Date();
        }
        return updateArticle(input.id, updateData as Parameters<typeof updateArticle>[1]);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteArticle(input.id);
        return { success: true };
      }),

    seedFoundationalContent: adminProcedure
      .mutation(async () => {
        const { seedFoundationalContent } = await import("./seedData");
        const result = await seedFoundationalContent();
        return result;
      }),

    togglePublish: adminProcedure
      .input(z.object({ id: z.number(), published: z.boolean() }))
      .mutation(async ({ input }) => {
        return updateArticle(input.id, {
          published: input.published,
          publishedAt: input.published ? new Date() : undefined,
        });
      }),
  }),

  // ─── Analytics ───────────────────────────────────────────────────────────────
  analytics: router({
    // Public: track a page view with full server-side enrichment
    track: publicProcedure
      .input(z.object({
        path: z.string().max(512),
        referrer: z.string().max(2048).optional(),
        sessionId: z.string().max(128).optional(),
        articleSlug: z.string().max(256).optional(),
        // Client-side data
        screenWidth: z.number().optional(),
        screenHeight: z.number().optional(),
        viewportWidth: z.number().optional(),
        viewportHeight: z.number().optional(),
        colorDepth: z.number().optional(),
        language: z.string().max(32).optional(),
        timezone: z.string().max(64).optional(),
        pageLoadTime: z.number().optional(),
        // UTM params
        utmSource: z.string().max(256).optional(),
        utmMedium: z.string().max(256).optional(),
        utmCampaign: z.string().max(256).optional(),
        utmContent: z.string().max(256).optional(),
        utmTerm: z.string().max(256).optional(),
        // Visitor type
        isNewVisitor: z.boolean().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const ua = (ctx.req.headers["user-agent"] as string) ?? "";
        const ip = extractIp({ headers: ctx.req.headers as Record<string, string | string[] | undefined>, socket: ctx.req.socket as { remoteAddress?: string } });
        const parsed = parseUserAgent(ua);
        const referrerDomain = extractReferrerDomain(input.referrer);

        // Geo lookup (async, non-blocking for response)
        const geo = await lookupGeo(ip).catch(() => null);

        const insertedId = await trackPageView({
          path: input.path,
          referrer: input.referrer ?? null,
          referrerDomain: referrerDomain || null,
          userAgent: ua || null,
          device: parsed.device,
          browser: parsed.browser || null,
          browserVersion: parsed.browserVersion || null,
          os: parsed.os || null,
          osVersion: parsed.osVersion || null,
          sessionId: input.sessionId ?? null,
          articleSlug: input.articleSlug ?? null,
          ip: ip || null,
          country: geo?.country ?? null,
          countryCode: geo?.countryCode ?? null,
          region: geo?.region ?? null,
          city: geo?.city ?? null,
          latitude: geo?.latitude ?? null,
          longitude: geo?.longitude ?? null,
          timezone: input.timezone ?? geo?.timezone ?? null,
          isp: geo?.isp ?? null,
          screenWidth: input.screenWidth ?? null,
          screenHeight: input.screenHeight ?? null,
          viewportWidth: input.viewportWidth ?? null,
          viewportHeight: input.viewportHeight ?? null,
          colorDepth: input.colorDepth ?? null,
          language: input.language ?? null,
          pageLoadTime: input.pageLoadTime ?? null,
          utmSource: input.utmSource ?? null,
          utmMedium: input.utmMedium ?? null,
          utmCampaign: input.utmCampaign ?? null,
          utmContent: input.utmContent ?? null,
          utmTerm: input.utmTerm ?? null,
          isNewVisitor: input.isNewVisitor ?? false,
        });

        return { success: true, id: insertedId };
      }),

    // Public: update engagement metrics (scroll depth, time on page)
    updateEngagement: publicProcedure
      .input(z.object({
        id: z.number(),
        scrollDepth: z.number().min(0).max(100),
        timeOnPage: z.number().min(0),
      }))
      .mutation(async ({ input }) => {
        await updatePageViewEngagement(input.id, input.scrollDepth, input.timeOnPage);
        return { success: true };
      }),

    // Public: track a visitor event (click, scroll milestone, etc.)
    trackEvent: publicProcedure
      .input(z.object({
        pageViewId: z.number().optional(),
        sessionId: z.string().max(128).optional(),
        eventType: z.string().max(64),
        eventTarget: z.string().max(512).optional(),
        eventValue: z.string().max(1024).optional(),
        positionX: z.number().optional(),
        positionY: z.number().optional(),
        path: z.string().max(512).optional(),
      }))
      .mutation(async ({ input }) => {
        await trackVisitorEvent({
          pageViewId: input.pageViewId ?? null,
          sessionId: input.sessionId ?? null,
          eventType: input.eventType,
          eventTarget: input.eventTarget ?? null,
          eventText: input.eventValue?.slice(0, 512) ?? null,
          positionX: input.positionX ?? null,
          positionY: input.positionY ?? null,
          metadata: input.path ? JSON.stringify({ path: input.path }) : null,
        });
        return { success: true };
      }),

    // Admin: summary dashboard
    summary: adminProcedure
      .input(z.object({ days: z.number().min(1).max(365).default(30) }))
      .query(async ({ input }) => {
        return getAnalyticsSummary(input.days);
      }),

    // Admin: paginated hit list with search
    hits: adminProcedure
      .input(z.object({
        limit: z.number().min(1).max(500).default(100),
        offset: z.number().min(0).default(0),
        search: z.string().optional(),
      }))
      .query(async ({ input }) => {
        return getRecentHits(input.limit, input.offset, input.search);
      }),

    // Admin: drill-down on a single hit
    hitDetail: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const hit = await getPageViewById(input.id);
        if (!hit) throw new TRPCError({ code: "NOT_FOUND", message: "Hit not found" });
        const events = await getEventsByPageViewId(input.id);
        return { hit, events };
      }),

    // Admin: full session timeline
    sessionTimeline: adminProcedure
      .input(z.object({ sessionId: z.string() }))
      .query(async ({ input }) => {
        return getSessionTimeline(input.sessionId);
      }),

    // Admin: real-time hits (last N minutes)
    realtime: adminProcedure
      .input(z.object({ minutes: z.number().min(1).max(1440).default(60) }))
      .query(async () => {
        return getRealTimeHits(60);
      }),

    subscribers: adminProcedure.query(async () => {
      return getAllSubscribers();
    }),
  }),

  // ─── Newsletter ───────────────────────────────────────────────────────────────
  newsletter: router({
    subscribe: publicProcedure
      .input(z.object({
        email: z.string().email(),
        name: z.string().max(256).optional(),
        source: z.string().max(128).optional(),
      }))
      .mutation(async ({ input }) => {
        await subscribeNewsletter({
          email: input.email,
          name: input.name ?? null,
          source: input.source ?? "homepage",
          active: true,
        });
        return { success: true };
      }),

    count: publicProcedure.query(async () => {
      return { count: await getSubscriberCount() };
    }),
  }),
});

export type AppRouter = typeof appRouter;
