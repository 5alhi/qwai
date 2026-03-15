import { useState } from "react";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  TrendingUp,
  Shield,
  Zap,
  Globe,
  Lock,
  Atom,
  ChevronRight,
  BarChart3,
  Cpu,
  Brain,
  Waves,
} from "lucide-react";

const thesisPoints = [
  {
    icon: Atom,
    title: "The Quantum Advantage is Real",
    description:
      "Quantum computers are not science fiction. Google's Willow chip and Microsoft's Majorana platform have demonstrated computational advantages that classical systems cannot match. The question is no longer if; it's when and who.",
  },
  {
    icon: Brain,
    title: "AI Has Hit a Wall",
    description:
      "Classical neural networks are approaching fundamental limits. Scaling laws are flattening. The next leap in AI capability will not come from more GPUs; it will come from a fundamentally different computational substrate. That substrate is quantum.",
  },
  {
    icon: Waves,
    title: "The Convergence Point",
    description:
      "QWAI's core thesis: there exists a precise mathematical point where the neural network fails and the quantum wave function takes over. Finding and engineering that convergence point is the defining challenge and opportunity of this decade.",
  },
  {
    icon: Lock,
    title: "Unbreakable Security",
    description:
      "Quantum cryptography offers information-theoretic security, provably unbreakable by any classical or quantum adversary. The market for post-quantum security is projected to exceed $9.5B by 2030.",
  },
  {
    icon: Zap,
    title: "Exponential Processing",
    description:
      "A 300-qubit quantum computer can represent more states simultaneously than there are atoms in the observable universe. The implications for drug discovery, materials science, financial modelling, and logistics optimisation are staggering.",
  },
  {
    icon: Globe,
    title: "First-Mover Positioning",
    description:
      "The quantum AI space is nascent. The companies that establish the foundational frameworks today will define the industry for decades. QWAI is positioning for that founding role.",
  },
];

const milestones = [
  { phase: "Phase 0", label: "Conceptual Framework", status: "current", description: "Developing the theoretical foundations of QWAI: the mathematical model of neural-quantum convergence." },
  { phase: "Phase 1", label: "Research Publication", status: "upcoming", description: "Publishing peer-reviewed papers establishing the QWAI framework in top-tier physics and AI venues." },
  { phase: "Phase 2", label: "Prototype Development", status: "future", description: "Building the first hybrid quantum-classical prototype demonstrating the convergence point in a controlled environment." },
  { phase: "Phase 3", label: "Seed Round", status: "future", description: "Raising seed capital to assemble the core research team and acquire access to quantum hardware." },
  { phase: "Phase 4", label: "Commercial Applications", status: "future", description: "Translating the research into commercial products: quantum-secure communications, hybrid AI accelerators, and more." },
];

export default function Investors() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    firm: "",
    type: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const subscribeMutation = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Thank you. We'll be in touch as we progress.");
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.name) {
      toast.error("Please fill in your name and email.");
      return;
    }
    subscribeMutation.mutate({
      email: formData.email,
      name: formData.name,
      source: `investors:${formData.type || "general"}`,
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-fuchsia-950/20" />
        <div className="container relative z-10 max-w-4xl mx-auto text-center px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-400 text-sm font-medium mb-6">
            <TrendingUp className="w-4 h-4" />
            Investor Relations
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            The Next{" "}
            <span className="bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              Computing Paradigm
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            QWAI is in its earliest stage, the conceptual phase where the theoretical foundations are being laid. We are not raising capital yet. But we are building relationships with investors who understand that the most transformative opportunities are found before the crowd arrives.
          </p>
          <div className="mt-8 p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 text-amber-400 text-sm max-w-xl mx-auto">
            <strong>Important:</strong> QWAI is a conceptual framework in active development. This is not a solicitation for investment. No securities are being offered.
          </div>
        </div>
      </section>

      {/* Investment Thesis */}
      <section className="py-20 border-t border-border/30">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">The Investment Thesis</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Six reasons why the quantum-AI convergence represents the most significant technological opportunity of the next decade.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {thesisPoints.map((point) => (
              <div
                key={point.title}
                className="p-6 rounded-xl border border-border/50 bg-card/20 hover:border-fuchsia-500/40 hover:bg-fuchsia-500/5 transition-all duration-300"
              >
                <point.icon className="w-8 h-8 text-fuchsia-400 mb-4" />
                <h3 className="text-lg font-semibold mb-3">{point.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Market Size */}
      <section className="py-20 border-t border-border/30">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Market Opportunity</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { metric: "$850B+", label: "Global AI Market by 2030", icon: Brain, color: "cyan" },
              { metric: "$450B+", label: "Quantum Computing Market by 2035", icon: Atom, color: "fuchsia" },
              { metric: "$9.5B+", label: "Post-Quantum Security by 2030", icon: Lock, color: "emerald" },
            ].map((item) => (
              <div
                key={item.label}
                className={`p-8 rounded-2xl border text-center ${
                  item.color === "cyan"
                    ? "border-cyan-500/30 bg-cyan-500/5"
                    : item.color === "fuchsia"
                    ? "border-fuchsia-500/30 bg-fuchsia-500/5"
                    : "border-emerald-500/30 bg-emerald-500/5"
                }`}
              >
                <item.icon
                  className={`w-10 h-10 mx-auto mb-4 ${
                    item.color === "cyan"
                      ? "text-cyan-400"
                      : item.color === "fuchsia"
                      ? "text-fuchsia-400"
                      : "text-emerald-400"
                  }`}
                />
                <div
                  className={`text-4xl font-bold mb-2 ${
                    item.color === "cyan"
                      ? "text-cyan-400"
                      : item.color === "fuchsia"
                      ? "text-fuchsia-400"
                      : "text-emerald-400"
                  }`}
                >
                  {item.metric}
                </div>
                <div className="text-muted-foreground text-sm">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-20 border-t border-border/30">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Development Roadmap</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Where we are and where we're going.
          </p>
          <div className="space-y-4">
            {milestones.map((milestone, i) => (
              <div
                key={milestone.phase}
                className={`flex gap-6 p-6 rounded-xl border transition-all ${
                  milestone.status === "current"
                    ? "border-cyan-500/50 bg-cyan-500/5"
                    : milestone.status === "upcoming"
                    ? "border-fuchsia-500/30 bg-fuchsia-500/5"
                    : "border-border/30 bg-card/10 opacity-60"
                }`}
              >
                <div className="shrink-0 flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      milestone.status === "current"
                        ? "bg-cyan-500 text-black"
                        : milestone.status === "upcoming"
                        ? "bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/40"
                        : "bg-border/20 text-muted-foreground"
                    }`}
                  >
                    {i + 1}
                  </div>
                  {i < milestones.length - 1 && (
                    <div className="w-px h-full min-h-4 bg-border/30 mt-2" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-mono text-muted-foreground">{milestone.phase}</span>
                    {milestone.status === "current" && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                        Current
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{milestone.label}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Express Interest Form */}
      <section className="py-20 border-t border-border/30">
        <div className="container max-w-2xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Stay Informed</h2>
            <p className="text-muted-foreground">
              We're not raising capital yet. But if you're an investor, family office, or strategic partner who wants to follow the QWAI journey from the beginning, leave your details and we'll keep you updated on our progress.
            </p>
          </div>

          {submitted ? (
            <div className="text-center p-10 rounded-2xl border border-fuchsia-500/30 bg-fuchsia-500/5">
              <div className="text-5xl mb-4">ψ</div>
              <h3 className="text-xl font-bold text-fuchsia-400 mb-2">You're on the list.</h3>
              <p className="text-muted-foreground">
                We'll reach out as we progress. Thank you for your interest in the quantum frontier.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded-xl border border-border/50 bg-card/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-fuchsia-500/60 focus:bg-card/50 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@firm.com"
                    className="w-full px-4 py-3 rounded-xl border border-border/50 bg-card/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-fuchsia-500/60 focus:bg-card/50 transition-all"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Firm / Organisation</label>
                <input
                  type="text"
                  value={formData.firm}
                  onChange={(e) => setFormData({ ...formData, firm: e.target.value })}
                  placeholder="Acme Ventures / Family Office / Independent"
                  className="w-full px-4 py-3 rounded-xl border border-border/50 bg-card/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-fuchsia-500/60 focus:bg-card/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Investor Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border/50 bg-card/30 text-foreground focus:outline-none focus:border-fuchsia-500/60 transition-all"
                >
                  <option value="">Select type...</option>
                  <option value="vc">Venture Capital</option>
                  <option value="angel">Angel Investor</option>
                  <option value="family-office">Family Office</option>
                  <option value="strategic">Strategic / Corporate</option>
                  <option value="research">Research Institution</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message (optional)</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="What draws you to the quantum-AI space? Any specific areas of interest?"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-border/50 bg-card/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-fuchsia-500/60 focus:bg-card/50 transition-all resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={subscribeMutation.isPending}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {subscribeMutation.isPending ? "Submitting..." : "Stay Informed →"}
              </button>
              <p className="text-xs text-center text-muted-foreground">
                This is not a solicitation for investment. No securities are being offered. Your data is never shared.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* Direct contact */}
      <section className="py-6 border-t border-border/30">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">
            Prefer to reach out directly?{" "}
            <a href="mailto:investors@qw.ai" className="text-accent hover:underline font-medium">investors@qw.ai</a>
          </p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
