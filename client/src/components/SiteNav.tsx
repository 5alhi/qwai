import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const LOGO_MARK_URL = "https://d2xsxph8kpxj0f.cloudfront.net/97664517/AZgbj2ZwAKxooAM5AQuEWd/qwai-logo-icon_cda1bf4c.png";

export default function SiteNav() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const mainLinks = [
    { href: "/", label: "Home" },
    { href: "/philosophy", label: "The Way of QWAI" },
    { href: "/articles", label: "Articles" },
  ];

  const companyLinks = [
    { href: "/careers", label: "Careers" },
    { href: "/investors", label: "Investors" },
    { href: "/press", label: "Press & Media" },
    { href: "/legal", label: "Legal" },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCompanyOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isCompanyActive = companyLinks.some((l) => location === l.href);

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-background/60 border-b border-border">
      <div className="container flex items-center justify-between py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline">
          <img
            src={LOGO_MARK_URL}
            alt="QWAI Logo"
            className="w-9 h-9 rounded-lg object-contain"
          />
          <span className="text-xl font-bold text-foreground">qw.ai</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {mainLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm transition-colors hover:text-accent ${
                location === l.href ? "text-accent" : "text-muted-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}

          {/* Company dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setCompanyOpen(!companyOpen)}
              className={`flex items-center gap-1 text-sm transition-colors hover:text-accent ${
                isCompanyActive ? "text-accent" : "text-muted-foreground"
              }`}
            >
              Company
              <ChevronDown
                className={`w-3 h-3 transition-transform ${companyOpen ? "rotate-180" : ""}`}
              />
            </button>
            {companyOpen && (
              <div className="absolute top-full right-0 mt-2 w-44 rounded-xl border border-border/60 bg-background/95 backdrop-blur-md shadow-xl overflow-hidden">
                {companyLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setCompanyOpen(false)}
                    className={`block px-4 py-3 text-sm transition-colors hover:bg-accent/10 hover:text-accent ${
                      location === l.href ? "text-accent bg-accent/5" : "text-muted-foreground"
                    }`}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/admin">
            <Button size="sm" className="bg-accent text-background hover:bg-accent/90 font-semibold">
              Admin
            </Button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md">
          <div className="container py-4 flex flex-col gap-4">
            {mainLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-sm transition-colors hover:text-accent ${
                  location === l.href ? "text-accent" : "text-muted-foreground"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <div className="border-t border-border/30 pt-3">
              <p className="text-xs text-muted-foreground/50 uppercase tracking-wider mb-2">Company</p>
              {companyLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`block py-2 text-sm transition-colors hover:text-accent ${
                    location === l.href ? "text-accent" : "text-muted-foreground"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
            </div>
            <Link href="/admin" onClick={() => setMobileOpen(false)}>
              <Button size="sm" className="w-full bg-accent text-background hover:bg-accent/90 font-semibold">
                Admin
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
