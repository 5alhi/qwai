import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { Link } from "wouter";

const philosophyPillars = [
  {
    symbol: "ψ",
    title: "The Wave Function",
    color: "text-accent",
    glow: "glow-cyan",
    description:
      "In quantum mechanics, ψ (psi) represents the wave function — a mathematical description of the quantum state of a system. QWAI borrows this concept: instead of encoding data as discrete bits, we theorize encoding it as probability amplitudes across a wavefunction. The result is a system that holds multiple states simultaneously until observation collapses it into a definitive answer.",
  },
  {
    symbol: "⊗",
    title: "Superposition & Parallel Processing",
    color: "text-purple-400",
    glow: "glow-magenta",
    description:
      "Classical neural networks process sequentially. Quantum superposition allows a qubit to exist as 0 and 1 simultaneously. Applied to AI, this means a QWAI system could evaluate exponentially more hypotheses in parallel — not by brute-force scaling of GPUs, but by leveraging the fundamental physics of quantum states.",
  },
  {
    symbol: "∞",
    title: "The Convergence Point",
    color: "text-cyan-400",
    glow: "glow-cyan",
    description:
      "Neural networks fail at the boundary of their training data — the edge where patterns dissolve into noise. Quantum wavefunctions collapse at the moment of measurement. QWAI theorizes that these two failure modes are the same phenomenon: both systems reach a point of maximum uncertainty. This convergence is not a weakness — it is the interface where the two systems can be unified.",
  },
  {
    symbol: "⊕",
    title: "Quantum Interference",
    color: "text-blue-400",
    glow: "glow-cyan",
    description:
      "Quantum interference allows probability amplitudes to reinforce or cancel each other. In QWAI, this maps to attention mechanisms in transformers — where certain features are amplified and others suppressed. By grounding attention in quantum interference mathematics, we theorize a more physically principled and energy-efficient form of selective reasoning.",
  },
  {
    symbol: "🔒",
    title: "Physical Immunity & Cryptography",
    color: "text-green-400",
    glow: "",
    description:
      "Current encryption is a mathematical speedbump — hard enough to buy time, but not physically impossible to crack. QWAI's Quantum Sentinel concept proposes a world where privacy is native: Blind Training allows AI to learn from data without ever reading it in plaintext. Entanglement Fidelity ensures that if a model weight is tampered with, the system physically collapses and alerts the network. Math can be solved. Code can be cracked. But you cannot collapse a wave without being detected.",
  },
  {
    symbol: "⚡",
    title: "Energy Arbitrage",
    color: "text-yellow-400",
    glow: "",
    description:
      "The AI industry is building Gigawatt-scale data centers to train trillion-parameter models. This is unsustainable. QWAI's Energy Arbitrage model proposes encoding massive datasets into ψ wavefunctions — making AI exponentially more efficient through quantum superposition and interference. The future of intelligence is not a power struggle. It is a collapsible wave.",
  },
];

const quantumFacts = [
  {
    title: "Unbreakable Encryption",
    body: "Quantum Key Distribution (QKD) uses the laws of quantum mechanics to create encryption keys that are physically impossible to intercept without detection. Any eavesdropping attempt collapses the quantum state, alerting both parties immediately.",
  },
  {
    title: "Tamper-Proof Systems",
    body: "Quantum entanglement creates correlations between particles that cannot be replicated or forged. Systems built on entanglement can detect any unauthorized access or modification at the physical level — not just the software level.",
  },
  {
    title: "Exponential Processing",
    body: "A quantum computer with 300 qubits can represent more states simultaneously than there are atoms in the observable universe. For certain problem classes — optimization, simulation, cryptanalysis — this represents an exponential speedup over classical computation.",
  },
  {
    title: "Quantum Supremacy",
    body: "In 2019, Google's Sycamore processor performed a specific calculation in 200 seconds that would take the world's most powerful classical supercomputer approximately 10,000 years. This milestone demonstrated that quantum advantage is not theoretical — it is real.",
  },
  {
    title: "Post-Quantum Cryptography",
    body: "When sufficiently powerful quantum computers arrive, they will break RSA and ECC encryption — the backbone of internet security. NIST has already standardized post-quantum cryptographic algorithms to prepare for this transition.",
  },
  {
    title: "Quantum Machine Learning",
    body: "Quantum algorithms like HHL (Harrow-Hassidim-Lloyd) offer exponential speedups for linear algebra operations — the mathematical foundation of neural networks. This is the theoretical basis for quantum-accelerated AI training.",
  },
];

export default function Philosophy() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SiteNav />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(ellipse at 50% 0%, oklch(0.6 0.25 262 / 0.4) 0%, transparent 70%), radial-gradient(ellipse at 80% 50%, oklch(0.5 0.35 300 / 0.3) 0%, transparent 60%)",
          }}
        />
        <div className="container relative z-10 text-center">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent text-xs font-mono uppercase tracking-widest">
            Conceptual Framework · Early Ideation
          </div>
          <h1 className="mb-6 glow-cyan">
            The Way of <span className="text-accent">QWAI</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            A theoretical exploration of where quantum wave mechanics and artificial neural networks converge — and what emerges at the boundary where both systems reach their limits.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3 text-sm text-muted-foreground/60">
            <span>By</span>
            <a
              href="https://www.linkedin.com/in/samsalhi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              Samer Salhi
            </a>
            <span>·</span>
            <span>Series on LinkedIn</span>
          </div>
        </div>
      </section>

      {/* Core thesis */}
      <section className="py-16 border-y border-border/50">
        <div className="container max-w-4xl">
          <div className="glass rounded-2xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
              The Central Thesis
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Neural networks fail at the edge of their training distribution — the boundary where learned patterns dissolve into uncertainty. Quantum wavefunctions collapse at the moment of measurement — the boundary where quantum superposition resolves into a classical state. <strong className="text-foreground">QWAI theorizes that these are not two separate problems. They are the same problem, expressed in two different physical systems.</strong>
              </p>
              <p>
                The convergence point — where the neural network's gradient vanishes and the wavefunction collapses — is not a dead end. It is an interface. QWAI proposes that by encoding neural network states as quantum wavefunctions, we can leverage quantum superposition to explore the uncertainty space that classical AI cannot navigate, and use quantum measurement to collapse that exploration into actionable intelligence.
              </p>
              <p>
                This is not about making AI faster by adding quantum hardware. It is about making AI <em>fundamentally different</em> by grounding it in quantum physics — achieving not just speed, but physical immunity, energy efficiency, and a new class of reasoning that classical systems cannot replicate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Six pillars */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="mb-4">Six Pillars of <span className="text-accent">QWAI</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The theoretical foundations that define Quantum Wave Artificial Intelligence as a distinct paradigm.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {philosophyPillars.map((pillar) => (
              <div
                key={pillar.title}
                className="glass rounded-xl p-6 hover:border-accent/40 transition-all duration-300 group"
              >
                <div className={`text-4xl font-bold mb-4 ${pillar.color} ${pillar.glow} group-hover:scale-110 transition-transform inline-block`}>
                  {pillar.symbol}
                </div>
                <h3 className="text-lg font-bold mb-3 text-foreground">{pillar.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quantum computing facts */}
      <section className="py-20 bg-card/20 border-y border-border/50">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="mb-4">Quantum Computing <span className="text-accent">Today</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The real-world quantum capabilities that form the technological foundation QWAI builds upon.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {quantumFacts.map((fact) => (
              <div key={fact.title} className="flex gap-4 p-5 rounded-xl border border-border/50 hover:border-accent/30 transition-colors">
                <div className="w-1 rounded-full bg-gradient-to-b from-accent to-purple-500 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-foreground mb-2">{fact.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{fact.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LinkedIn series CTA */}
      <section className="py-20">
        <div className="container max-w-3xl text-center">
          <div className="text-5xl mb-6 glow-cyan text-accent font-bold">ψ</div>
          <h2 className="mb-4">Follow the Series</h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            "The Way of QWAI" is an ongoing series of articles on LinkedIn exploring the theoretical foundations, implications, and potential applications of Quantum Wave Artificial Intelligence. New installments are published regularly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://www.linkedin.com/posts/samsalhi_wave-quantum-superposition-ugcPost-7437201471357480961-xT3H"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-accent text-background font-semibold hover:bg-accent/90 transition-colors"
            >
              Part 1: The Quantum Green Paradox →
            </a>
            <a
              href="https://www.linkedin.com/posts/samsalhi_speedbump-agi-decryption-ugcPost-7437627555215470594-fBxQ"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-accent/40 text-accent font-semibold hover:bg-accent/10 transition-colors"
            >
              Part 2: The Quantum Sentinel →
            </a>
          </div>
          <div className="mt-8">
            <Link href="/articles" className="text-sm text-muted-foreground hover:text-accent transition-colors underline">
              Browse all articles on qw.ai →
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
