import { useState } from "react";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Brain,
  Cpu,
  FlaskConical,
  Code2,
  Shield,
  Globe,
  Zap,
  Users,
  ChevronRight,
  Atom,
  Waves,
  Network,
  Lock,
} from "lucide-react";

const openRoles = [
  {
    title: "Quantum Algorithm Researcher",
    department: "Research",
    type: "Full-time · Remote",
    description:
      "Pioneer the intersection of quantum wave mechanics and neural network convergence. You will design and test novel quantum-classical hybrid algorithms.",
    requirements: ["PhD in Physics, Quantum Computing, or related field", "Experience with quantum circuit design", "Familiarity with variational quantum algorithms"],
    icon: Atom,
  },
  {
    title: "AI/ML Research Scientist",
    department: "Research",
    type: "Full-time · Remote",
    description:
      "Explore the boundaries where classical neural networks fail and quantum wave functions take over. Publish groundbreaking research at the frontier of AGI.",
    requirements: ["PhD in Machine Learning, Computer Science, or related field", "Deep expertise in neural network architectures", "Published research in top-tier venues (NeurIPS, ICML, Nature)"],
    icon: Brain,
  },
  {
    title: "Quantum Hardware Engineer",
    department: "Engineering",
    type: "Full-time · On-site",
    description:
      "Design and build cryogenic quantum processor systems. Work alongside world-class physicists to push qubit coherence times to new limits.",
    requirements: ["MS/PhD in Electrical Engineering, Physics, or Applied Physics", "Experience with superconducting qubits or photonic systems", "Hands-on cryogenic lab experience"],
    icon: Cpu,
  },
  {
    title: "Cryptography & Security Researcher",
    department: "Security",
    type: "Full-time · Remote",
    description:
      "Build the unbreakable cyphers of the post-quantum era. Design quantum-resistant cryptographic protocols that will secure the next generation of digital infrastructure.",
    requirements: ["Deep knowledge of post-quantum cryptography (NIST standards)", "Experience with lattice-based or code-based cryptography", "Background in classical cryptanalysis"],
    icon: Lock,
  },
  {
    title: "Full-Stack Engineer",
    department: "Engineering",
    type: "Full-time · Remote",
    description:
      "Build the tools, platforms, and interfaces that bring quantum AI research to the world. You will work on everything from simulation dashboards to API infrastructure.",
    requirements: ["5+ years full-stack experience (TypeScript, React, Node.js)", "Experience with scientific computing or data-heavy applications", "Strong interest in quantum computing or AI"],
    icon: Code2,
  },
  {
    title: "Theoretical Physicist",
    department: "Research",
    type: "Full-time · Remote",
    description:
      "Develop the mathematical foundations of the QWAI framework. Formalize the wave function collapse model as it applies to neural network convergence and AGI.",
    requirements: ["PhD in Theoretical Physics or Mathematical Physics", "Deep expertise in quantum field theory or quantum information", "Ability to bridge physics formalism with computational models"],
    icon: FlaskConical,
  },
];

const values = [
  {
    icon: Atom,
    title: "Physics First",
    description: "Every decision is grounded in physical reality. We don't chase hype; we follow the math.",
  },
  {
    icon: Waves,
    title: "Think in Waves",
    description: "Superposition, interference, entanglement: these aren't metaphors here. They are the architecture.",
  },
  {
    icon: Network,
    title: "Open Research",
    description: "We publish our findings. The quantum AI revolution belongs to humanity, not a single company.",
  },
  {
    icon: Globe,
    title: "Global by Default",
    description: "Quantum computing has no borders. Our team spans continents, time zones, and disciplines.",
  },
  {
    icon: Shield,
    title: "Safety Obsessed",
    description: "We take AGI safety seriously. The convergence of quantum and AI demands extreme responsibility.",
  },
  {
    icon: Zap,
    title: "Move Fast, Think Deep",
    description: "Speed without depth is noise. We move fast on execution but think deeply on foundations.",
  },
];

export default function Careers() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    linkedin: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const subscribeMutation = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Expression of interest received! We'll be in touch.");
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
      source: `careers:${formData.role || "general"}`,
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-cyan-950/20" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, oklch(0.7 0.2 200) 0%, transparent 50%), radial-gradient(circle at 80% 50%, oklch(0.6 0.25 320) 0%, transparent 50%)",
          }}
        />
        <div className="container relative z-10 max-w-4xl mx-auto text-center px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-sm font-medium mb-6">
            <Users className="w-4 h-4" />
            We're Building the Team
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Join the{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent">
              Quantum Frontier
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            QWAI is in its earliest, most exciting phase, the stage where the right people define what is possible. We are assembling a team of physicists, AI researchers, and engineers who believe the next breakthrough lives at the intersection of quantum waves and artificial intelligence.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" /> Conceptual Stage: Early Team</span>
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-fuchsia-400 animate-pulse" /> Remote-First</span>
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Mission-Driven</span>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 border-t border-border/30">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">How We Think</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Our values aren't a poster on a wall. They're the operating principles of a team that takes quantum physics seriously.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="p-6 rounded-xl border border-border/50 bg-card/30 hover:border-cyan-500/40 hover:bg-cyan-500/5 transition-all duration-300"
              >
                <value.icon className="w-8 h-8 text-cyan-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Roles */}
      <section className="py-20 border-t border-border/30">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Open Positions</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            These roles represent the shape of the team we're building. Express your interest and we'll reach out when the time is right.
          </p>
          <div className="space-y-4">
            {openRoles.map((role) => (
              <div
                key={role.title}
                className="p-6 rounded-xl border border-border/50 bg-card/20 hover:border-cyan-500/40 hover:bg-card/40 transition-all duration-300 group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 shrink-0">
                    <role.icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{role.title}</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20">
                        {role.department}
                      </span>
                      <span className="text-xs text-muted-foreground">{role.type}</span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-3 leading-relaxed">{role.description}</p>
                    <ul className="space-y-1">
                      {role.requirements.map((req) => (
                        <li key={req} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <ChevronRight className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
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
            <h2 className="text-3xl font-bold mb-4">Express Your Interest</h2>
            <p className="text-muted-foreground">
              We're not hiring formally yet, but we're building a list of exceptional people who want to be part of this from the beginning. Leave your details and we'll reach out when the time comes.
            </p>
          </div>

          {submitted ? (
            <div className="text-center p-10 rounded-2xl border border-cyan-500/30 bg-cyan-500/5">
              <div className="text-5xl mb-4">ψ</div>
              <h3 className="text-xl font-bold text-cyan-400 mb-2">You're on the list.</h3>
              <p className="text-muted-foreground">
                We'll reach out when we're ready to build. Thank you for believing in the quantum frontier.
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
                    placeholder="Dr. Jane Quantum"
                    className="w-full px-4 py-3 rounded-xl border border-border/50 bg-card/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyan-500/60 focus:bg-card/50 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jane@university.edu"
                    className="w-full px-4 py-3 rounded-xl border border-border/50 bg-card/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyan-500/60 focus:bg-card/50 transition-all"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Role of Interest</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border/50 bg-card/30 text-foreground focus:outline-none focus:border-cyan-500/60 transition-all"
                >
                  <option value="">Select a role...</option>
                  {openRoles.map((r) => (
                    <option key={r.title} value={r.title}>{r.title}</option>
                  ))}
                  <option value="Other">Other / General Interest</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">LinkedIn Profile</label>
                <input
                  type="url"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="w-full px-4 py-3 rounded-xl border border-border/50 bg-card/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyan-500/60 focus:bg-card/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Tell us about yourself</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="What draws you to the intersection of quantum physics and AI? What have you built or discovered that you're most proud of?"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-border/50 bg-card/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyan-500/60 focus:bg-card/50 transition-all resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={subscribeMutation.isPending}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {subscribeMutation.isPending ? "Submitting..." : "Express Interest →"}
              </button>
              <p className="text-xs text-center text-muted-foreground">
                No spam. We'll only reach out when we're ready to build. Your data is never shared.
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
            <a href="mailto:careers@qw.ai" className="text-accent hover:underline font-medium">careers@qw.ai</a>
          </p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
