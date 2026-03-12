import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Brain, Cpu } from "lucide-react";
import { Link } from "wouter";

/**
 * Design Philosophy: Quantum Futurism
 * - Hero with quantum wave background image
 * - Dark backgrounds, electric cyan/magenta accents
 * - Glassmorphism cards with glow effects
 * - Smooth animations and transitions
 */

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-background/50 border-b border-border">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold glow-cyan">ψ</div>
            <span className="text-xl font-bold">qw.ai</span>
          </div>
          <div className="flex items-center gap-8">
            <Link href="/" className="hover:text-accent transition-colors">
              Home
            </Link>
            <Link href="/articles" className="hover:text-accent transition-colors">
              Articles
            </Link>
            <Button className="bg-accent text-background hover:bg-accent/90">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              "url('https://d2xsxph8kpxj0f.cloudfront.net/97664517/AZgbj2ZwAKxooAM5AQuEWd/quantum-hero-bg-YerM3ndorop85QQiK2iBkf.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.8,
          }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background z-10" />

        {/* Content */}
        <div className="container relative z-20 text-center">
          <div className="space-y-8 fade-in-up">
            <h1 className="text-6xl md:text-7xl font-bold leading-tight">
              <span className="glow-cyan">Quantum Wave</span>
              <br />
              <span>Artificial Intelligence</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Harnessing the power of quantum computing and advanced AI to solve
              tomorrow's challenges today. Experience the future of intelligent
              systems.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button size="lg" className="bg-accent text-background hover:bg-accent/90 text-lg px-8">
                Explore Our Technology
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-accent text-accent hover:bg-accent/10 text-lg px-8"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-background via-background/95 to-background">
        <div className="container">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Why Choose <span className="glow-cyan">Quantum Wave AI</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass p-8 rounded-lg glow-box-cyan hover:glow-pulse transition-all duration-300">
              <div className="mb-6">
                <Zap className="h-12 w-12 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Quantum Computing</h3>
              <p className="text-muted-foreground leading-relaxed">
                Leverage quantum processors to solve complex problems at
                unprecedented speeds. Experience exponential computational power.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass p-8 rounded-lg glow-box-cyan hover:glow-pulse transition-all duration-300">
              <div className="mb-6">
                <Brain className="h-12 w-12 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Advanced AI</h3>
              <p className="text-muted-foreground leading-relaxed">
                State-of-the-art machine learning models trained on massive
                datasets. Intelligent systems that learn and adapt in real-time.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass p-8 rounded-lg glow-box-cyan hover:glow-pulse transition-all duration-300">
              <div className="mb-6">
                <Cpu className="h-12 w-12 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Enterprise Scale</h3>
              <p className="text-muted-foreground leading-relaxed">
                Built for enterprise reliability and performance. Secure,
                scalable infrastructure supporting mission-critical operations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 md:py-32">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              "url('https://d2xsxph8kpxj0f.cloudfront.net/97664517/AZgbj2ZwAKxooAM5AQuEWd/tech-circuit-pattern-crHWqCYoUGCbwyqjYFWPoW.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.4,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/60 z-10" />

        <div className="container relative z-20 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Join leading enterprises using Quantum Wave AI to drive innovation
            and competitive advantage.
          </p>
          <Button size="lg" className="bg-accent text-background hover:bg-accent/90 text-lg px-8">
            Start Your Journey
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
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
