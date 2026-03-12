import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Calendar, User } from "lucide-react";

/**
 * Design Philosophy: Quantum Futurism
 * - Dark backgrounds with cyan/magenta accents
 * - Glassmorphism cards for article previews
 * - Easily updatable article data structure
 * - Smooth hover effects and transitions
 */

// EASILY UPDATABLE: Add or modify articles here
const articles = [
  {
    slug: "quantum-computing-breakthrough",
    title: "Quantum Computing Breakthrough: 1000x Performance Gains",
    excerpt:
      "Discover how our latest quantum processors achieve unprecedented computational speeds, enabling solutions to previously intractable problems.",
    date: "2026-03-10",
    author: "Dr. Sarah Chen",
    category: "Technology",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/97664517/AZgbj2ZwAKxooAM5AQuEWd/quantum-particles-Nt2LXRvuGyeohhFZekUSAz.webp",
  },
  {
    slug: "ai-neural-networks-evolution",
    title: "The Evolution of Neural Networks: From Theory to Practice",
    excerpt:
      "Explore how artificial neural networks have evolved from theoretical concepts to practical, production-grade systems powering modern AI.",
    date: "2026-03-08",
    author: "Prof. James Mitchell",
    category: "AI Research",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/97664517/AZgbj2ZwAKxooAM5AQuEWd/ai-neural-network-S5YsLBDJBTTNPepoT5Y9Rw.webp",
  },
  {
    slug: "wave-function-applications",
    title: "Wave Function Optimization: Practical Applications in Industry",
    excerpt:
      "Learn how wave function optimization techniques are revolutionizing optimization problems across finance, logistics, and manufacturing.",
    date: "2026-03-05",
    author: "Dr. Michael Rodriguez",
    category: "Applications",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/97664517/AZgbj2ZwAKxooAM5AQuEWd/wave-function-abstract-S3WSdJqLUfjhh4G6Tdda6W.webp",
  },
  {
    slug: "quantum-ai-synergy",
    title: "The Synergy Between Quantum Computing and Artificial Intelligence",
    excerpt:
      "Understand how quantum computing and AI complement each other, creating exponential improvements in problem-solving capabilities.",
    date: "2026-03-01",
    author: "Dr. Lisa Wang",
    category: "Research",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/97664517/AZgbj2ZwAKxooAM5AQuEWd/quantum-hero-bg-YerM3ndorop85QQiK2iBkf.webp",
  },
  {
    slug: "enterprise-quantum-adoption",
    title: "Enterprise Guide: Adopting Quantum AI Solutions",
    excerpt:
      "A comprehensive guide for enterprises looking to integrate quantum AI technologies into their existing infrastructure and workflows.",
    date: "2026-02-28",
    author: "David Thompson",
    category: "Enterprise",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/97664517/AZgbj2ZwAKxooAM5AQuEWd/tech-circuit-pattern-crHWqCYoUGCbwyqjYFWPoW.webp",
  },
  {
    slug: "future-of-quantum-ai",
    title: "The Future of Quantum AI: Predictions and Possibilities",
    excerpt:
      "Explore expert predictions on how quantum AI will shape industries, society, and scientific discovery in the next decade.",
    date: "2026-02-25",
    author: "Dr. Emma Johnson",
    category: "Future",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/97664517/AZgbj2ZwAKxooAM5AQuEWd/quantum-particles-Nt2LXRvuGyeohhFZekUSAz.webp",
  },
];

export default function Articles() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-background/50 border-b border-border">
        <div className="container flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold glow-cyan">ψ</div>
            <span className="text-xl font-bold">qw.ai</span>
          </Link>
          <div className="flex items-center gap-8">
            <Link href="/" className="hover:text-accent transition-colors">
              Home
            </Link>
            <Link href="/articles" className="text-accent font-semibold">
              Articles
            </Link>
            <Button className="bg-accent text-background hover:bg-accent/90">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="pt-32 pb-16 border-b border-border">
        <div className="container text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Quantum Wave <span className="glow-cyan">Insights</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore cutting-edge research, industry insights, and expert
            perspectives on quantum computing and artificial intelligence.
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Link key={article.slug} href={`/articles/${article.slug}`}>
                <div className="glass rounded-lg overflow-hidden hover:glow-pulse transition-all duration-300 cursor-pointer h-full flex flex-col">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-muted">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-accent/20 text-accent text-sm font-semibold rounded-full">
                        {article.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold mb-3 line-clamp-2 hover:text-accent transition-colors">
                      {article.title}
                    </h3>

                    <p className="text-muted-foreground mb-4 line-clamp-2 flex-grow">
                      {article.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="space-y-3 pt-4 border-t border-border/50">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date(article.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        {article.author}
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-6 pt-4 border-t border-border/50">
                      <div className="flex items-center gap-2 text-accent font-semibold hover:gap-3 transition-all">
                        Read Article
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-background/50">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    API Reference
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 text-center text-muted-foreground">
            <p>&copy; 2026 Quantum Wave AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
