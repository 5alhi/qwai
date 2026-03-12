import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function SiteNav() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/philosophy", label: "The Way of QWAI" },
    { href: "/articles", label: "Articles" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-background/60 border-b border-border">
      <div className="container flex items-center justify-between py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline">
          <div className="text-2xl font-bold glow-cyan text-accent">ψ</div>
          <span className="text-xl font-bold text-foreground">qw.ai</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
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
            {links.map((l) => (
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
