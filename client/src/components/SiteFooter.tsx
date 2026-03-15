import { Link } from "wouter";

const LOGO_MARK_URL = "https://d2xsxph8kpxj0f.cloudfront.net/97664517/AZgbj2ZwAKxooAM5AQuEWd/qwai-v10-icon_267c3c42.png";

export default function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background/80 mt-auto">
      {/* Main footer links */}
      <div className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img src={LOGO_MARK_URL} alt="QWAI Logo" className="w-8 h-8 object-contain" />
              <span className="text-lg font-bold text-foreground">qw.ai</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-2">
              Quantum Wave .Collapse. Artificial Intelligence
            </p>
            <p className="text-xs text-muted-foreground/60 leading-relaxed">
              Exploring the convergence of quantum wave mechanics and artificial neural networks.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-xs text-muted-foreground hover:text-accent transition-colors">Home</Link></li>
              <li><Link href="/philosophy" className="text-xs text-muted-foreground hover:text-accent transition-colors">The Way of QWAI</Link></li>
              <li><Link href="/articles" className="text-xs text-muted-foreground hover:text-accent transition-colors">Articles</Link></li>
              <li><Link href="/careers" className="text-xs text-muted-foreground hover:text-accent transition-colors">Careers</Link></li>
              <li><Link href="/investors" className="text-xs text-muted-foreground hover:text-accent transition-colors">Investors</Link></li>
              <li><Link href="/press" className="text-xs text-muted-foreground hover:text-accent transition-colors">Press &amp; Media</Link></li>
              <li><Link href="/legal" className="text-xs text-muted-foreground hover:text-accent transition-colors">Legal &amp; Disclaimer</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">Contact</h4>
            <ul className="space-y-2">
              <li>
                <a href="mailto:info@qw.ai" className="text-xs text-muted-foreground hover:text-accent transition-colors">info@qw.ai</a>
              </li>
              <li>
                <a href="mailto:press@qw.ai" className="text-xs text-muted-foreground hover:text-accent transition-colors">press@qw.ai</a>
              </li>
              <li>
                <a href="mailto:careers@qw.ai" className="text-xs text-muted-foreground hover:text-accent transition-colors">careers@qw.ai</a>
              </li>
              <li>
                <a href="mailto:investors@qw.ai" className="text-xs text-muted-foreground hover:text-accent transition-colors">investors@qw.ai</a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">Connect</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.linkedin.com/company/112269466"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-accent transition-colors"
                >
                  LinkedIn: QWAI Company
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/samsalhi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-accent transition-colors"
                >
                  LinkedIn: Samer Salhi
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Disclaimer bar */}
      <div className="border-t border-border/50 bg-card/30">
        <div className="container py-4">
          <p className="text-xs text-muted-foreground/70 leading-relaxed text-center">
            <span className="font-semibold text-muted-foreground">Disclaimer:</span>{" "}
            QWAI (Quantum Wave Artificial Intelligence) is a conceptual framework and thought experiment currently in early ideation stages. It does not represent a commercially available product, service, or technology. All content on this site is speculative, theoretical, and intended for intellectual exploration only. Nothing herein constitutes investment advice, a product offer, or a guarantee of future development.{" "}
            <Link href="/legal" className="underline hover:text-accent transition-colors">
              Full legal disclaimer →
            </Link>
          </p>
          <p className="text-xs text-muted-foreground/50 text-center mt-2">
            © {new Date().getFullYear()} Quantum Wave AI (qw.ai). All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
