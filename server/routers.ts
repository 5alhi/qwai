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
  getPublishedArticles,
  getSubscriberCount,
  subscribeNewsletter,
  trackPageView,
  updateArticle,
} from "./db";
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

  // ─── Analytics (admin only) ───────────────────────────────────────────────────
  analytics: router({
    track: publicProcedure
      .input(z.object({
        path: z.string().max(512),
        referrer: z.string().max(1024).optional(),
        userAgent: z.string().optional(),
        device: z.enum(["desktop", "mobile", "tablet"]).optional(),
        sessionId: z.string().max(128).optional(),
        articleSlug: z.string().max(256).optional(),
      }))
      .mutation(async ({ input }) => {
        await trackPageView({
          path: input.path,
          referrer: input.referrer ?? null,
          userAgent: input.userAgent ?? null,
          device: input.device ?? "desktop",
          sessionId: input.sessionId ?? null,
          articleSlug: input.articleSlug ?? null,
          country: null,
        });
        return { success: true };
      }),

    summary: adminProcedure
      .input(z.object({ days: z.number().min(1).max(365).default(30) }))
      .query(async ({ input }) => {
        return getAnalyticsSummary(input.days);
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
