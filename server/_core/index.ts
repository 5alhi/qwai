import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { getPublishedArticles } from "../db";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Trust reverse proxy (Coolify/Nginx/Traefik) so req.protocol reflects HTTPS correctly
  // This ensures cookies are set with secure:true when served over HTTPS via proxy
  app.set("trust proxy", 1);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  // ─── RSS Feed ──────────────────────────────────────────────────────────────
  app.get("/feed.xml", async (_req, res) => {
    try {
      const articles = await getPublishedArticles();
      const items = articles.map(a => `
    <item>
      <title><![CDATA[${a.title}]]></title>
      <link>https://qw.ai/articles/${a.slug}</link>
      <guid isPermaLink="true">https://qw.ai/articles/${a.slug}</guid>
      <description><![CDATA[${a.excerpt}]]></description>
      <author>${a.author}</author>
      <category>${a.category}</category>
      ${a.publishedAt ? `<pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>` : ''}
      ${a.imageUrl ? `<enclosure url="${a.imageUrl}" type="image/jpeg" />` : ''}
    </item>`).join('');
      const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Quantum Wave AI | qw.ai</title>
    <link>https://qw.ai</link>
    <description>Exploring the convergence of quantum wave functions and artificial intelligence, where neural networks meet quantum superposition.</description>
    <language>en-us</language>
    <managingEditor>hello@qw.ai (Samer Salhi)</managingEditor>
    <webMaster>hello@qw.ai (Samer Salhi)</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://qw.ai/feed.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>https://qw.ai/og-image.png</url>
      <title>Quantum Wave AI</title>
      <link>https://qw.ai</link>
    </image>${items}
  </channel>
</rss>`;
      res.set('Content-Type', 'application/rss+xml; charset=utf-8');
      res.set('Cache-Control', 'public, max-age=3600');
      res.send(rss);
    } catch (e) {
      console.error('[RSS] Error generating feed:', e);
      res.status(500).send('Error generating RSS feed');
    }
  });

  // ─── Dynamic Sitemap ───────────────────────────────────────────────────────
  app.get("/sitemap.xml", async (_req, res) => {
    try {
      const articles = await getPublishedArticles();
      const staticPages: { url: string; priority: string; changefreq: string; lastmod?: string }[] = [
        { url: 'https://qw.ai/', priority: '1.0', changefreq: 'weekly' },
        { url: 'https://qw.ai/philosophy', priority: '0.9', changefreq: 'monthly' },
        { url: 'https://qw.ai/articles', priority: '0.8', changefreq: 'daily' },
        { url: 'https://qw.ai/legal', priority: '0.3', changefreq: 'yearly' },
      ];
      const articleUrls = articles.map(a => ({
        url: `https://qw.ai/articles/${a.slug}`,
        priority: '0.7',
        changefreq: 'monthly',
        lastmod: a.publishedAt ? new Date(a.publishedAt).toISOString().split('T')[0] : undefined,
      }));
      const allPages = [...staticPages, ...articleUrls];
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(p => `  <url>
    <loc>${p.url}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
    ${p.lastmod ? `<lastmod>${p.lastmod}</lastmod>` : ''}
  </url>`).join('\n')}
</urlset>`;
      res.set('Content-Type', 'application/xml; charset=utf-8');
      res.set('Cache-Control', 'public, max-age=3600');
      res.send(sitemap);
    } catch (e) {
      console.error('[Sitemap] Error:', e);
      res.status(500).send('Error generating sitemap');
    }
  });

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
