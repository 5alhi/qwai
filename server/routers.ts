import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { z } from "zod";
import {
  createAdminSession,
  createArticle,
  deleteAdminSession,
  deleteArticle,
  getAllArticles,
  getAdminSession,
  getArticleBySlug,
  getPublishedArticles,
  updateArticle,
} from "./db";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

// ─── Admin password ──────────────────────────────────────────────────────────
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "qwai-admin-2026";
const ADMIN_TOKEN_COOKIE = "qwai_admin_token";

// ─── Admin middleware ─────────────────────────────────────────────────────────
const adminProcedure = publicProcedure.use(async ({ ctx, next }) => {
  const token = ctx.req.cookies?.[ADMIN_TOKEN_COOKIE] as string | undefined;
  if (!token) throw new TRPCError({ code: "UNAUTHORIZED", message: "Admin authentication required" });
  const session = await getAdminSession(token);
  if (!session) throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid or expired admin session" });
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

  // ─── Admin auth ─────────────────────────────────────────────────────────────
  admin: router({
    login: publicProcedure
      .input(z.object({ password: z.string() }))
      .mutation(async ({ input, ctx }) => {
        if (input.password !== ADMIN_PASSWORD) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Incorrect password" });
        }
        const token = nanoid(64);
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days
        await createAdminSession(token, expiresAt);
        // With trust proxy enabled, req.protocol correctly reflects https behind Coolify/Nginx
        const isSecure = ctx.req.protocol === "https" || process.env.NODE_ENV === "production";
        ctx.res.cookie(ADMIN_TOKEN_COOKIE, token, {
          httpOnly: true,
          secure: isSecure,
          sameSite: isSecure ? "none" : "lax",
          path: "/",
          expires: expiresAt,
        });
        return { success: true };
      }),

    logout: adminProcedure.mutation(async ({ ctx }) => {
      await deleteAdminSession(ctx.adminToken);
      ctx.res.clearCookie(ADMIN_TOKEN_COOKIE, { path: "/" });
      return { success: true };
    }),

    check: publicProcedure.query(async ({ ctx }) => {
      const token = ctx.req.cookies?.[ADMIN_TOKEN_COOKIE] as string | undefined;
      if (!token) return { authenticated: false };
      const session = await getAdminSession(token);
      return { authenticated: !!session };
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

    togglePublish: adminProcedure
      .input(z.object({ id: z.number(), published: z.boolean() }))
      .mutation(async ({ input }) => {
        return updateArticle(input.id, {
          published: input.published,
          publishedAt: input.published ? new Date() : undefined,
        });
      }),
  }),
});

export type AppRouter = typeof appRouter;
