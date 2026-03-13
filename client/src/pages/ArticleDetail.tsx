import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "wouter";
import { ArrowLeft, Calendar, User, ExternalLink } from "lucide-react";
import { usePageTracker } from "@/hooks/usePageTracker";
import { useEffect } from "react";

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  usePageTracker(slug);

  const articleQuery = trpc.articles.bySlug.useQuery(
    { slug: slug ?? "" },
    { enabled: !!slug }
  );

  // Update document title and meta tags when article loads
  useEffect(() => {
    if (articleQuery.data) {
      const a = articleQuery.data;
      document.title = `${a.title} | qw.ai`;
      const setMeta = (name: string, content: string, prop = false) => {
        const attr = prop ? 'property' : 'name';
        let el = document.querySelector(`meta[${attr}='${name}']`) as HTMLMetaElement | null;
        if (!el) { el = document.createElement('meta'); el.setAttribute(attr, name); document.head.appendChild(el); }
        el.setAttribute('content', content);
      };
      setMeta('description', a.excerpt);
      setMeta('og:title', `${a.title} | qw.ai`, true);
      setMeta('og:description', a.excerpt, true);
      setMeta('og:url', `https://qw.ai/articles/${a.slug}`, true);
      setMeta('og:type', 'article', true);
      if (a.imageUrl) setMeta('og:image', a.imageUrl, true);
      setMeta('twitter:title', `${a.title} | qw.ai`);
      setMeta('twitter:description', a.excerpt);
      // Add canonical link
      let canonical = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
      if (!canonical) { canonical = document.createElement('link'); canonical.setAttribute('rel', 'canonical'); document.head.appendChild(canonical); }
      canonical.setAttribute('href', `https://qw.ai/articles/${a.slug}`);
      // Article JSON-LD
      let ld = document.getElementById('article-jsonld') as HTMLScriptElement | null;
      if (!ld) { ld = document.createElement('script') as HTMLScriptElement; ld.id = 'article-jsonld'; ld.type = 'application/ld+json'; document.head.appendChild(ld); }
      ld.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": a.title,
        "description": a.excerpt,
        "author": { "@type": "Person", "name": a.author },
        "datePublished": a.publishedAt,
        "publisher": { "@type": "Organization", "name": "Quantum Wave AI", "url": "https://qw.ai" },
        "url": `https://qw.ai/articles/${a.slug}`,
        ...(a.imageUrl ? { "image": a.imageUrl } : {}),
      });
    }
    return () => { document.title = 'Quantum Wave AI | qw.ai'; };
  }, [articleQuery.data]);

  if (articleQuery.isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SiteNav />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-accent text-6xl wave-animate">ψ</div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (articleQuery.isError || !articleQuery.data) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SiteNav />
        <div className="flex-1 flex items-center justify-center text-center">
          <div>
            <div className="text-accent text-6xl mb-4">ψ</div>
            <h2 className="text-2xl font-bold mb-2 text-foreground">Article Not Found</h2>
            <p className="text-muted-foreground mb-6">
              This article may have been moved or is not yet published.
            </p>
            <Link href="/articles">
              <Button variant="outline" className="border-accent/50 text-accent hover:bg-accent/10">
                <ArrowLeft size={16} className="mr-2" />
                Back to Articles
              </Button>
            </Link>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const article = articleQuery.data;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SiteNav />

      {/* Hero */}
      <section className="pt-24 pb-0 relative overflow-hidden">
        {article.imageUrl && (
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url('${article.imageUrl}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.25,
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/80 to-background z-10" />

        <div className="container relative z-20 max-w-4xl py-16">
          <Link href="/articles">
            <Button
              variant="ghost"
              size="sm"
              className="mb-6 text-muted-foreground hover:text-accent gap-2"
            >
              <ArrowLeft size={14} />
              Back to Articles
            </Button>
          </Link>

          <div className="mb-4">
            <span className="text-xs font-mono text-accent uppercase tracking-widest">
              {article.category}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6 text-foreground">
            {article.title}
          </h1>

          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            {article.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground/70 pb-8 border-b border-border/50">
            <div className="flex items-center gap-2">
              <User size={14} />
              <span>{article.author}</span>
            </div>
            {article.publishedAt && (
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <span>
                  {new Date(article.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            )}
            {article.linkedinUrl && (
              <a
                href={article.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
              >
                <ExternalLink size={14} />
                <span>View on LinkedIn</span>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Article content */}
      <main className="flex-1 py-12">
        <div className="container max-w-4xl">
          {article.imageUrl && (
            <div className="mb-10 rounded-2xl overflow-hidden">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full max-h-96 object-cover"
              />
            </div>
          )}

          <article
            className="prose prose-invert max-w-none
              prose-headings:text-foreground prose-headings:font-bold
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4
              prose-strong:text-foreground
              prose-blockquote:border-l-accent prose-blockquote:text-muted-foreground prose-blockquote:bg-card/30 prose-blockquote:py-1 prose-blockquote:rounded-r-lg
              prose-code:text-accent prose-code:bg-card/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
              prose-ul:text-muted-foreground prose-ol:text-muted-foreground
              prose-li:mb-1
              prose-a:text-accent prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Back nav */}
          <div className="mt-16 pt-8 border-t border-border/50">
            <Link href="/articles">
              <Button variant="outline" className="border-accent/40 text-accent hover:bg-accent/10">
                <ArrowLeft size={16} className="mr-2" />
                Back to All Articles
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
