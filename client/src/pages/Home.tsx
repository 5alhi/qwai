import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Brain, Cpu, Shield, Atom, Waves } from "lucide-react";
import { Link } from "wouter";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/97664517/AZgbj2ZwAKxooAM5AQuEWd/quantum-hero-bg_66e85d4b.png";
const CIRCUIT_BG = "https://d2xsxph8kpxj0f.cloudfront.net/97664517/AZgbj2ZwAKxooAM5AQuEWd/tech-circuit-pattern_15b4cc8d.png";
const NEURAL_BG = "https://d2xsxph8kpxj0f.cloudfront.net/97664517/AZgbj2ZwAKxooAM5AQuEWd/ai-neural-network_db02c636.png";

const pillars = [
  {
    icon: Atom,
    title: "Quantum Superposition",
    desc: "Encode AI states as quantum wavefunctions — holding exponentially more hypotheses simultaneously than classical neural networks.",
    color: "text-accent",
  },
  {
    icon: Brain,
    title: "Neural-Quantum Convergence",
    desc: "Where neural networks fail at the edge of training data, and wavefunctions collapse at measurement — QWAI theorizes these are the same phenomenon.",
    color: "text-purple-400",
  },
  {
    icon: Shield,
    title: "Physical Immunity",
    desc: "Quantum entanglement-based tamper detection. If a model weight is altered, the system physically collapses and alerts the network. Math can be cracked. Physics cannot.",
    color: "text-green-400",
  },
  {
    icon: Waves,
    title: "Wave Function Intelligence",
    desc: "ψ (psi) — the quantum state descriptor — becomes the fundamental unit of AI representation, replacing discrete binary weights with probability amplitudes.",
    color: "text-cyan-400",
  },
  {
    icon: Zap,
    title: "Energy Arbitrage",
    desc: "Encoding massive datasets into ψ wavefunctions makes AI exponentially more efficient. The future of intelligence is not a power struggle — it is a collapsible wave.",
    color: "text-yellow-400",
  },
  {
    icon: Cpu,
    title: "Post-Quantum Cryptography",
    desc: "When quantum computers arrive, RSA and ECC fall. QWAI's architecture is built for the post-quantum world — where privacy is native, not bolted on.",
    color: "text-blue-400",
  },
];

export default function Home() {
  const articlesQuery = trpc.articles.list.useQuery();
  const featuredArticles = (articlesQuery.data ?? []).filter((a) => a.featured).slice(0, 3);
  const recentArticles = (articlesQuery.data ?? []).slice(0, 6);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden flex flex-col">
      <SiteNav />

      {/* ─── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('${HERO_BG}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.55,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/60 to-background z-10" />
        {/* Radial glow overlays */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 20% 50%, oklch(0.6 0.25 262 / 0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 30%, oklch(0.5 0.35 300 / 0.12) 0%, transparent 60%)",
          }}
        />

        {/* Content */}
        <div className="container relative z-20 text-center">
          <div className="space-y-8 fade-in-up">
            {/* Concept badge */}
            <div className="inline-block px-4 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent text-xs font-mono uppercase tracking-widest">
              Conceptual Framework · Early Ideation Stage
            </div>

            {/* Psi symbol */}
            <div className="text-8xl md:text-9xl font-bold glow-cyan text-accent wave-animate select-none">
              ψ
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="glow-cyan text-accent">Quantum Wave</span>
              <br />
              <span className="text-foreground">Artificial Intelligence</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              A theoretical framework exploring the convergence of quantum wave mechanics and artificial neural networks — where both systems reach their limits, and something new emerges.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/philosophy">
                <Button size="lg" className="bg-accent text-background hover:bg-accent/90 text-base px-8 font-semibold">
                  The Way of QWAI
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/articles">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-accent/50 text-accent hover:bg-accent/10 text-base px-8"
                >
                  Read the Articles
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-muted-foreground/50">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-accent/50 to-transparent" />
        </div>
      </section>

      {/* ─── Six Pillars ──────────────────────────────────────────────────────── */}
      <section className="py-24 relative">
        <div
          className="absolute inset-0 z-0 opacity-10"
          style={{
            backgroundImage: `url('${NEURAL_BG}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="container relative z-10">
          <div className="text-center mb-16">
            <h2 className="mb-4">
              Six Pillars of <span className="text-accent glow-cyan">QWAI</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The theoretical foundations that define Quantum Wave AI as a distinct paradigm — not just faster AI, but fundamentally different AI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="glass rounded-xl p-6 hover:border-accent/40 transition-all duration-300 group"
              >
                <pillar.icon
                  className={`h-8 w-8 mb-4 ${pillar.color} group-hover:scale-110 transition-transform`}
                />
                <h3 className="text-lg font-bold mb-2 text-foreground">{pillar.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/philosophy">
              <Button variant="outline" className="border-accent/40 text-accent hover:bg-accent/10">
                Explore the Full Philosophy →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Featured Articles ─────────────────────────────────────────────────── */}
      {featuredArticles.length > 0 && (
        <section className="py-24 bg-card/20 border-y border-border/50">
          <div className="container">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="mb-2">Featured <span className="text-accent">Articles</span></h2>
                <p className="text-muted-foreground">Thought leadership on quantum AI convergence</p>
              </div>
              <Link href="/articles" className="text-sm text-accent hover:underline hidden md:block">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredArticles.map((article) => (
                <Link key={article.id} href={`/articles/${article.slug}`}>
                  <div className="glass rounded-xl overflow-hidden hover:border-accent/40 transition-all duration-300 group h-full flex flex-col">
                    {article.imageUrl && (
                      <div className="h-40 overflow-hidden">
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-5 flex flex-col flex-1">
                      <span className="text-xs font-mono text-accent uppercase tracking-widest mb-2">
                        {article.category}
                      </span>
                      <h3 className="text-base font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                        {article.excerpt}
                      </p>
                      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground/60">
                        <span>{article.author}</span>
                        {article.publishedAt && (
                          <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Recent Articles (if no featured) ────────────────────────────────── */}
      {featuredArticles.length === 0 && recentArticles.length > 0 && (
        <section className="py-24 bg-card/20 border-y border-border/50">
          <div className="container">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="mb-2">Latest <span className="text-accent">Articles</span></h2>
                <p className="text-muted-foreground">Thought leadership on quantum AI convergence</p>
              </div>
              <Link href="/articles" className="text-sm text-accent hover:underline hidden md:block">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentArticles.slice(0, 3).map((article) => (
                <Link key={article.id} href={`/articles/${article.slug}`}>
                  <div className="glass rounded-xl p-5 hover:border-accent/40 transition-all duration-300 group h-full flex flex-col">
                    <span className="text-xs font-mono text-accent uppercase tracking-widest mb-2">
                      {article.category}
                    </span>
                    <h3 className="text-base font-bold text-foreground mb-2 group-hover:text-accent transition-colors flex-1">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{article.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── LinkedIn Series CTA ──────────────────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('${CIRCUIT_BG}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.3,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/70 z-10" />

        <div className="container relative z-20 text-center max-w-3xl mx-auto">
          <div className="text-6xl font-bold glow-cyan text-accent mb-6">ψ</div>
          <h2 className="mb-6">
            Follow "The Way of <span className="text-accent">QWAI</span>"
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed text-lg">
            An ongoing LinkedIn series exploring the theoretical foundations of Quantum Wave AI — from the Quantum Green Paradox to the Quantum Sentinel, and beyond.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://www.linkedin.com/posts/samsalhi_wave-quantum-superposition-ugcPost-7437201471357480961-xT3H"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" className="bg-accent text-background hover:bg-accent/90 font-semibold">
                Part 1: The Quantum Green Paradox →
              </Button>
            </a>
            <a
              href="https://www.linkedin.com/posts/samsalhi_speedbump-agi-decryption-ugcPost-7437627555215470594-fBxQ"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" variant="outline" className="border-accent/50 text-accent hover:bg-accent/10">
                Part 2: The Quantum Sentinel →
              </Button>
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
