import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "wouter";
import { ArrowLeft, Calendar, User, ExternalLink, Share2, Link2, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { usePageTracker } from "@/hooks/usePageTracker";

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  usePageTracker(slug);

  // ALL hooks must be declared before any conditional returns
  const [copied, setCopied] = useState(false);

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
          <div className="text-accent text-6xl wave-animate">psi</div>
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
            <div className="text-accent text-6xl mb-4">psi</div>
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

  const articleUrl = typeof window !== "undefined" ? window.location.href : `https://qw.ai/articles/${article?.slug ?? ""}`;
  const shareText = article ? `${article.title} - ${article.excerpt.slice(0, 100)}...` : "";

  const shareLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`;
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=600");
  };

  const shareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(articleUrl)}&via=qwai`;
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=400");
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(articleUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

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

          {/* Share section */}
          <div className="mt-16 pt-8 border-t border-border/50">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <Link href="/articles">
                <Button variant="outline" className="border-accent/40 text-accent hover:bg-accent/10">
                  <ArrowLeft size={16} className="mr-2" />
                  Back to All Articles
                </Button>
              </Link>

              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Share2 size={14} />
                  Share
                </span>
                {/* LinkedIn */}
                <button
                  onClick={shareLinkedIn}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0077B5]/10 border border-[#0077B5]/30 text-[#0077B5] hover:bg-[#0077B5]/20 transition-colors text-sm font-medium"
                  title="Share on LinkedIn"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </button>
                {/* Twitter/X */}
                <button
                  onClick={shareTwitter}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-foreground/5 border border-border hover:bg-foreground/10 transition-colors text-sm font-medium text-foreground"
                  title="Share on X (Twitter)"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  X
                </button>
                {/* Copy link */}
                <button
                  onClick={copyLink}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20 transition-colors text-sm font-medium"
                  title="Copy link"
                >
                  {copied ? <Check size={14} /> : <Link2 size={14} />}
                  {copied ? "Copied!" : "Copy Link"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
