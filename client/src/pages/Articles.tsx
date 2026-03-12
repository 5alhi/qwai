import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { useState } from "react";
import { Search, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";

const CATEGORIES = [
  "All",
  "QWAI Philosophy",
  "Quantum Computing",
  "Artificial Intelligence",
  "Cryptography & Security",
  "Energy & Sustainability",
  "Research & Theory",
  "Industry Insights",
];

export default function Articles() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const articlesQuery = trpc.articles.list.useQuery();
  const articles = articlesQuery.data ?? [];

  const filtered = articles.filter((a) => {
    const matchesCategory = activeCategory === "All" || a.category === activeCategory;
    const matchesSearch =
      !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      a.author.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SiteNav />

      <section className="pt-32 pb-16 relative overflow-hidden">
        <div
          className="absolute inset-0 z-0 opacity-15"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 50% 0%, oklch(0.6 0.25 262 / 0.5) 0%, transparent 70%)",
          }}
        />
        <div className="container relative z-10 text-center">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent text-xs font-mono uppercase tracking-widest">
            Thought Leadership
          </div>
          <h1 className="mb-4">
            QWAI <span className="text-accent glow-cyan">Articles</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Exploring the convergence of quantum physics and artificial intelligence — from theoretical foundations to practical implications.
          </p>
        </div>
      </section>

      <section className="border-b border-border/50 bg-card/20 sticky top-16 z-40 backdrop-blur-md">
        <div className="container py-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="relative flex-1 max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 bg-input border-border text-sm"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    activeCategory === cat
                      ? "bg-accent text-background"
                      : "border border-border text-muted-foreground hover:border-accent/50 hover:text-accent"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1 py-12">
        <div className="container">
          {articlesQuery.isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="glass rounded-xl p-6 animate-pulse">
                  <div className="h-3 bg-muted/50 rounded mb-3 w-1/3" />
                  <div className="h-5 bg-muted/50 rounded mb-2 w-4/5" />
                  <div className="h-4 bg-muted/50 rounded mb-1 w-full" />
                  <div className="h-4 bg-muted/50 rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-5xl mb-4 text-accent">ψ</div>
              <p className="text-muted-foreground text-lg mb-2">No articles found</p>
              <p className="text-muted-foreground/60 text-sm">
                {search || activeCategory !== "All"
                  ? "Try adjusting your search or category filter."
                  : "Articles will appear here once published. Use the admin panel to create your first article."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((article) => (
                <Link key={article.id} href={`/articles/${article.slug}`}>
                  <div className="glass rounded-xl overflow-hidden hover:border-accent/40 transition-all duration-300 group h-full flex flex-col cursor-pointer">
                    {article.imageUrl && (
                      <div className="h-44 overflow-hidden">
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono text-accent uppercase tracking-widest">
                          {article.category}
                        </span>
                        {article.featured && (
                          <span className="text-xs text-yellow-400 border border-yellow-500/30 bg-yellow-500/10 px-2 py-0.5 rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-foreground mb-2 group-hover:text-accent transition-colors leading-snug">
                        {article.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                        {article.excerpt}
                      </p>
                      <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground/60">
                        <span>{article.author}</span>
                        <div className="flex items-center gap-2">
                          {article.publishedAt && (
                            <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                          )}
                          {article.linkedinUrl && (
                            <a
                              href={article.linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-accent hover:text-accent/80 transition-colors"
                              title="View on LinkedIn"
                            >
                              <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
