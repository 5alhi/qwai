import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, Mail, FileText, Image, Package } from "lucide-react";
import { usePageTracker } from "@/hooks/usePageTracker";

const LOGO_ICON_PNG = "https://d2xsxph8kpxj0f.cloudfront.net/97664517/AZgbj2ZwAKxooAM5AQuEWd/qwai-logo-icon_13ea35d9.png";
const LOGO_TRANSPARENT_PNG = "https://d2xsxph8kpxj0f.cloudfront.net/97664517/AZgbj2ZwAKxooAM5AQuEWd/qwai-logo-transparent_746870b5.png";
const LOGO_BANNER_PNG = "https://d2xsxph8kpxj0f.cloudfront.net/97664517/AZgbj2ZwAKxooAM5AQuEWd/qwai-banner_fece1715.png";
const LOGO_ICON_SVG = "https://d2xsxph8kpxj0f.cloudfront.net/97664517/AZgbj2ZwAKxooAM5AQuEWd/qwai-logo-v4_01bf6b82.svg";
const LOGO_TRANSPARENT_SVG = "https://d2xsxph8kpxj0f.cloudfront.net/97664517/AZgbj2ZwAKxooAM5AQuEWd/qwai-logo-transparent_a1f9e017.svg";
const LOGO_BANNER_SVG = "https://d2xsxph8kpxj0f.cloudfront.net/97664517/AZgbj2ZwAKxooAM5AQuEWd/qwai-banner_efe8705b.svg";
const HERO_BANNER = "https://d2xsxph8kpxj0f.cloudfront.net/97664517/AZgbj2ZwAKxooAM5AQuEWd/qwai-hero-banner-bcVfhu6MKXoeg8zGX7Ebcw.webp";

const logoAssets = [
  {
    label: "Logo Mark — Dark Background",
    description: "Square icon with dark background. Use on light surfaces or as app icon.",
    preview: LOGO_ICON_PNG,
    bg: "bg-background",
    downloads: [
      { label: "PNG (512×512)", url: LOGO_ICON_PNG, ext: "png" },
      { label: "SVG (Vector)", url: LOGO_ICON_SVG, ext: "svg" },
    ],
  },
  {
    label: "Logo Mark — Transparent",
    description: "Icon with transparent background. Use on dark-coloured surfaces.",
    preview: LOGO_TRANSPARENT_PNG,
    bg: "bg-[#080810]",
    downloads: [
      { label: "PNG (512×512)", url: LOGO_TRANSPARENT_PNG, ext: "png" },
      { label: "SVG (Vector)", url: LOGO_TRANSPARENT_SVG, ext: "svg" },
    ],
  },
  {
    label: "Horizontal Banner",
    description: "Logo mark + qw.ai wordmark. Use in headers, email signatures, and presentations.",
    preview: LOGO_BANNER_PNG,
    bg: "bg-[#080810]",
    downloads: [
      { label: "PNG (500×120)", url: LOGO_BANNER_PNG, ext: "png" },
      { label: "SVG (Vector)", url: LOGO_BANNER_SVG, ext: "svg" },
    ],
  },
  {
    label: "Hero Banner",
    description: "Full-width cinematic image for articles, social posts, and presentations.",
    preview: HERO_BANNER,
    bg: "bg-background",
    downloads: [
      { label: "WebP (3168×1344)", url: HERO_BANNER, ext: "webp" },
    ],
  },
];

const brandColors = [
  { name: "Quantum Cyan", hex: "#00D4FF", usage: "Primary accent, links, highlights" },
  { name: "Quantum Magenta", hex: "#C800FF", usage: "Gradient end, secondary accent" },
  { name: "Deep Space", hex: "#080810", usage: "Primary background" },
  { name: "Surface Dark", hex: "#0f0f1a", usage: "Card backgrounds" },
  { name: "Foreground", hex: "#e8e8f0", usage: "Body text" },
  { name: "Muted", hex: "#6b6b8a", usage: "Secondary text, captions" },
];

function downloadAsset(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export default function Press() {
  usePageTracker();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SiteNav />

      {/* Hero */}
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 20% 50%, oklch(0.6 0.25 262 / 0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 30%, oklch(0.5 0.35 300 / 0.06) 0%, transparent 60%)",
          }}
        />
        <div className="container relative z-10 max-w-5xl">
          <div className="mb-4">
            <span className="text-xs font-mono text-accent uppercase tracking-widest">Press &amp; Media</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            <span className="glow-cyan text-accent">Media Kit</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Official brand assets, company description, and contact information for journalists,
            bloggers, and media partners covering QWAI.
          </p>
        </div>
      </section>

      {/* Company Description */}
      <section className="py-16 border-t border-border/30">
        <div className="container max-w-5xl">
          <div className="flex items-center gap-3 mb-8">
            <FileText size={20} className="text-accent" />
            <h2 className="text-2xl font-bold">Company Description</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* One-liner */}
            <div className="bg-card/40 border border-border/50 rounded-2xl p-6 space-y-3">
              <div className="text-xs font-mono text-accent uppercase tracking-widest">One-liner</div>
              <p className="text-foreground font-medium leading-relaxed">
                QWAI (Quantum Wave Artificial Intelligence) is a theoretical framework exploring the convergence of quantum wave mechanics and artificial neural networks.
              </p>
              <button
                onClick={() => navigator.clipboard.writeText("QWAI (Quantum Wave Artificial Intelligence) is a theoretical framework exploring the convergence of quantum wave mechanics and artificial neural networks.")}
                className="text-xs text-accent hover:text-accent/80 transition-colors"
              >
                Copy text
              </button>
            </div>

            {/* Short paragraph */}
            <div className="bg-card/40 border border-border/50 rounded-2xl p-6 space-y-3">
              <div className="text-xs font-mono text-accent uppercase tracking-widest">Short Paragraph</div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                QWAI is an early-stage research initiative founded by Samer Salhi, exploring the theoretical intersection of quantum wave mechanics and artificial intelligence. The framework proposes that both quantum systems and neural networks share a fundamental convergence point — where the wave function ψ becomes the native representation of machine intelligence, enabling physically immune AI, exponential energy efficiency, and post-quantum cryptographic security.
              </p>
              <button
                onClick={() => navigator.clipboard.writeText("QWAI is an early-stage research initiative founded by Samer Salhi, exploring the theoretical intersection of quantum wave mechanics and artificial intelligence. The framework proposes that both quantum systems and neural networks share a fundamental convergence point — where the wave function ψ becomes the native representation of machine intelligence, enabling physically immune AI, exponential energy efficiency, and post-quantum cryptographic security.")}
                className="text-xs text-accent hover:text-accent/80 transition-colors"
              >
                Copy text
              </button>
            </div>
          </div>

          {/* Key facts */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Founded", value: "2024" },
              { label: "Stage", value: "Conceptual / Early Ideation" },
              { label: "Founder", value: "Samer Salhi" },
              { label: "Domain", value: "qw.ai" },
            ].map((f) => (
              <div key={f.label} className="bg-card/30 border border-border/40 rounded-xl p-4 text-center">
                <div className="text-xs text-muted-foreground mb-1">{f.label}</div>
                <div className="font-semibold text-foreground text-sm">{f.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Logo Assets */}
      <section className="py-16 border-t border-border/30">
        <div className="container max-w-5xl">
          <div className="flex items-center gap-3 mb-8">
            <Image size={20} className="text-accent" />
            <h2 className="text-2xl font-bold">Logo Assets</h2>
          </div>

          <div className="mb-6 p-4 rounded-xl bg-accent/5 border border-accent/20 text-sm text-muted-foreground">
            <strong className="text-foreground">Usage guidelines:</strong> Do not alter the logo colours, proportions, or orientation. Maintain a minimum clear space equal to the height of the logo mark on all sides. Do not place the logo on backgrounds that reduce legibility.
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {logoAssets.map((asset) => (
              <div key={asset.label} className="bg-card/40 border border-border/50 rounded-2xl overflow-hidden">
                {/* Preview */}
                <div className={`${asset.bg} flex items-center justify-center p-8 min-h-[160px]`}>
                  <img
                    src={asset.preview}
                    alt={asset.label}
                    className="max-h-24 max-w-full object-contain"
                  />
                </div>
                {/* Info + downloads */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{asset.label}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{asset.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {asset.downloads.map((dl) => (
                      <button
                        key={dl.label}
                        onClick={() => downloadAsset(dl.url, `qwai-logo.${dl.ext}`)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20 transition-colors text-xs font-medium"
                      >
                        <Download size={12} />
                        {dl.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Colours */}
      <section className="py-16 border-t border-border/30">
        <div className="container max-w-5xl">
          <div className="flex items-center gap-3 mb-8">
            <Package size={20} className="text-accent" />
            <h2 className="text-2xl font-bold">Brand Colours</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {brandColors.map((c) => (
              <div key={c.name} className="bg-card/40 border border-border/50 rounded-xl overflow-hidden">
                <div className="h-16" style={{ backgroundColor: c.hex }} />
                <div className="p-4">
                  <div className="font-medium text-foreground text-sm">{c.name}</div>
                  <div className="font-mono text-xs text-accent mt-0.5">{c.hex}</div>
                  <div className="text-xs text-muted-foreground mt-1">{c.usage}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Typography */}
      <section className="py-16 border-t border-border/30">
        <div className="container max-w-5xl">
          <h2 className="text-2xl font-bold mb-8">Typography</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Space Grotesk", role: "Display / Headings", weights: "400, 500, 600, 700", sample: "Quantum Wave AI" },
              { name: "Inter", role: "Body / UI", weights: "300, 400, 500, 600, 700", sample: "Exploring the convergence of quantum mechanics and AI." },
              { name: "IBM Plex Mono", role: "Code / Technical", weights: "400, 500, 600", sample: "ψ(x,t) = Ae^{i(kx−ωt)}" },
            ].map((t) => (
              <div key={t.name} className="bg-card/40 border border-border/50 rounded-xl p-5 space-y-3">
                <div>
                  <div className="font-semibold text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role} · {t.weights}</div>
                </div>
                <div className="text-sm text-foreground/80 italic">{t.sample}</div>
                <a
                  href={`https://fonts.google.com/specimen/${t.name.replace(/ /g, "+")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition-colors"
                >
                  <ExternalLink size={11} />
                  Google Fonts
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Contact */}
      <section className="py-16 border-t border-border/30">
        <div className="container max-w-5xl">
          <div className="bg-gradient-to-r from-accent/10 to-purple-500/10 border border-accent/20 rounded-2xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Media Inquiries</h2>
              <p className="text-muted-foreground text-sm max-w-lg">
                For press inquiries, interview requests, or editorial partnerships, please reach out directly. We aim to respond within 48 hours.
              </p>
            </div>
            <a href="mailto:press@qw.ai">
              <Button className="bg-accent text-background hover:bg-accent/90 font-semibold whitespace-nowrap">
                <Mail size={16} className="mr-2" />
                press@qw.ai
              </Button>
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
