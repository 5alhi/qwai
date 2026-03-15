import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) { console.error("DATABASE_URL not set"); process.exit(1); }

const conn = await mysql.createConnection(DB_URL);

// Helper: insert or skip if slug already exists
async function upsertArticle(article) {
  const [existing] = await conn.execute("SELECT id FROM articles WHERE slug = ?", [article.slug]);
  if (existing.length > 0) {
    console.log(`  SKIP (exists): ${article.slug}`);
    return;
  }
  await conn.execute(
    `INSERT INTO articles (slug, title, excerpt, content, author, category, imageUrl, published, featured, linkedinUrl, publishedAt, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [
      article.slug,
      article.title,
      article.excerpt,
      article.content,
      article.author,
      article.category,
      article.imageUrl ?? null,
      article.published ?? true,
      article.featured ?? false,
      article.linkedinUrl ?? null,
      article.publishedAt ?? new Date(),
    ]
  );
  console.log(`  INSERT: ${article.slug}`);
}

// ─── Article #3: The Way of the QWAI - The Classical Capex Cliff ─────────────
const article3 = {
  slug: "the-way-of-qwai-part-3-the-classical-capex-cliff",
  title: "The Way of the QWAI, Part 3: The Classical Capex Cliff",
  excerpt: "A rigorous look at the unit economics of quantum vs. classical compute: why the GPU tax, the power bill, and linear scaling laws make QWAI's exponential density model not just compelling, but inevitable.",
  content: `<h2>The Classical Capex Cliff</h2>
<p>To understand QWAI's feasibility, one must first look at the current alternative.</p>

<h3>The GPU Tax</h3>
<p>Training a trillion-parameter LLM in 2026 can cost between $5 million and $10 million in cluster rentals alone.</p>

<h3>The Power Bill</h3>
<p>High-end GPU clusters (like NVIDIA's H200) consume massive energy, with operational costs increasingly dominated by the cooling infrastructure required to dissipate kilowatts of heat.</p>

<h3>The Stagnation</h3>
<p>Despite 45% price cuts in cloud GPU rates recently, the underlying architecture still requires a linear increase in hardware to achieve a linear increase in intelligence.</p>

<h2>The QWAI Unit Economics: From Qubits to Q-Fidelity</h2>
<p>Quantum hardware is undeniably expensive today, but it follows a different scaling law: exponential density.</p>

<p><strong>Hardware Barrier:</strong> A 1,000-qubit quantum system currently carries a development and operational price tag exceeding $100 million.</p>

<p><strong>The Cost Per Qubit:</strong> In superconducting systems, a single physical qubit costs between $10,000 and $50,000.</p>

<p><strong>The Efficiency Arbitrage:</strong> While the "price per unit" of quantum is higher, the information density is the equalizer. Because 50 qubits can theoretically represent over a quadrillion parameters, more than any classical LLM, the "Cost per Parameter" for a qw.ai model could eventually drop orders of magnitude below classical silicon.</p>

<h2>Operational Feasibility: The "Cold" Efficiency</h2>
<p>A common critique is that quantum computers require specialized cryogenic cooling (dilution refrigerators) that can cost between $500,000 and $3 million.</p>

<p><strong>The Reality:</strong> These systems consume roughly 25kW to 50kW of power.</p>

<p><strong>The Comparison:</strong> While significant, this is a fraction of the Gigawatt-scale demands predicted for the next generation of classical GPU "mega-farms." We are not cooling a city-sized data center; we are cooling a single, high-density quantum core.</p>

<h2>Roadmap to Commercialization (QaaS)</h2>
<p>We are not asking enterprises to build their own cryo-labs. The path to qw.ai feasibility is Quantum-as-a-Service (QaaS).</p>

<p><strong>Cloud Access:</strong> Major providers currently offer quantum cloud access for approximately $0.01 to $1.00 per second per qubit.</p>

<p><strong>Hybrid Integration:</strong> Current QWAI prototypes utilize hybrid quantum-classical workflows. We use classical GPUs for standard processing and "offload" high-dimensional optimization to the quantum wave, maximizing ROI.</p>

<p><strong>Accuracy Gains:</strong> Early research into quantum-enhanced LLMs shows up to a 3.14% improvement in accuracy over classical baselines of comparable size.</p>

<h2>The QWAI Feasibility Matrix</h2>
<table>
  <thead>
    <tr><th>Metric</th><th>Classical LLM (2026)</th><th>QWAI Concept (Theoretical)</th></tr>
  </thead>
  <tbody>
    <tr><td>Scaling Law</td><td>Linear (More GPUs = More Power)</td><td>Exponential (More Qubits = More Density)</td></tr>
    <tr><td>Energy Profile</td><td>Gigawatt-scale farm cooling</td><td>Megawatt-scale cryogenic core</td></tr>
    <tr><td>Data Integrity</td><td>Vulnerable to Model Poisoning</td><td>Physically Tamper-Proof via Fidelity</td></tr>
    <tr><td>Cost Barrier</td><td>OpEx-heavy (Energy and Rental)</td><td>CapEx-heavy (Hardware development)</td></tr>
  </tbody>
</table>

<h2>Conclusion: The Inevitable Trade-off</h2>
<p>Feasibility is never about the absolute cost; it is about the cost of the alternative. If the choice is between a $1 billion power bill for a classical data center or a $100 million investment in a quantum-secure, energy-efficient QWAI node, the financial choice becomes as clear as the physical one.</p>

<p>Silicon has a ceiling. The wave has a horizon.</p>

<blockquote>
  <strong>Disclaimer (Working Concept):</strong> The financial and feasibility models described herein represent a theoretical research framework based on current industry trends. QWAI (qw.ai) is a visionary project exploring the economic transition to quantum-enhanced AI. These systems do not currently exist as functional commercial products and face significant hardware scaling and error-correction challenges.
</blockquote>`,
  author: "Samer Salhi",
  category: "The Way of the QWAI",
  imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/97664517/AZgbj2ZwAKxooAM5AQuEWd/qwai-article3-cover-UoXZgp5yJWqGjJF8C8kawb.webp",
  published: true,
  featured: false,
  linkedinUrl: "https://www.linkedin.com/in/samersalhi/",
  publishedAt: new Date("2026-03-15"),
};

// ─── 20 Foundational Quantum Computing Papers ─────────────────────────────────
const foundationalPapers = [
  {
    rank: 1,
    slug: "foundational-paper-superposition-and-entanglement",
    title: "Foundational Paper: Superposition and Entanglement",
    theory: "Superposition and Entanglement",
    year: 1935,
    authors: "Einstein, Podolsky, Rosen",
    paperUrl: "https://journals.aps.org",
    resourceUrl: "https://en.wikipedia.org/wiki/Quantum_entanglement",
    resourceName: "Quantum Entanglement (Wikipedia)",
    excerpt: "The 1935 EPR paper by Einstein, Podolsky, and Rosen introduced the concept of quantum entanglement, laying the theoretical groundwork for quantum information science and the principle of superposition.",
    description: "The EPR paradox paper challenged the completeness of quantum mechanics and introduced the concept of quantum entanglement, where two particles become correlated such that the quantum state of each cannot be described independently. This foundational work underpins all of quantum computing's core advantages: superposition allows qubits to represent multiple states simultaneously, while entanglement enables quantum parallelism and quantum teleportation.",
  },
  {
    rank: 2,
    slug: "foundational-paper-shors-algorithm",
    title: "Foundational Paper: Shor's Algorithm",
    theory: "Shor's Algorithm",
    year: 1994,
    authors: "Peter Shor",
    paperUrl: "https://arxiv.org",
    resourceUrl: "https://www.classiq.io/insights/shors-algorithm-explained",
    resourceName: "Shor's Algorithm Guide (Classiq)",
    excerpt: "Peter Shor's 1994 polynomial-time quantum algorithm for integer factorization demonstrated that quantum computers could break RSA encryption, fundamentally reshaping cryptography and national security.",
    description: "Shor's algorithm demonstrated that a quantum computer could factor large integers in polynomial time, compared to the exponential time required by the best known classical algorithms. This has profound implications for cryptography: RSA encryption, which secures most of the internet, relies on the difficulty of factoring large numbers. Shor's work is the primary motivation for post-quantum cryptography research and is central to QWAI's Quantum Sentinel security framework.",
  },
  {
    rank: 3,
    slug: "foundational-paper-bells-theorem",
    title: "Foundational Paper: Bell's Theorem",
    theory: "Bell's Theorem",
    year: 1964,
    authors: "John Stewart Bell",
    paperUrl: "https://cds.cern.ch",
    resourceUrl: "https://en.wikipedia.org/wiki/Bell%27s_theorem",
    resourceName: "Bell's Theorem (Wikipedia)",
    excerpt: "Bell's 1964 theorem proved that no local hidden-variable theory can reproduce all the predictions of quantum mechanics, establishing that quantum entanglement is a real, non-local physical phenomenon.",
    description: "Bell's theorem provides a mathematical proof that quantum mechanics cannot be explained by any local realistic theory. The Bell inequalities, when violated in experiments, confirm that quantum entanglement is a genuine non-local phenomenon, not a result of hidden classical variables. This theorem is foundational to quantum cryptography and quantum key distribution, where the security of communication is guaranteed by the laws of physics rather than computational hardness.",
  },
  {
    rank: 4,
    slug: "foundational-paper-grovers-algorithm",
    title: "Foundational Paper: Grover's Algorithm",
    theory: "Grover's Algorithm",
    year: 1996,
    authors: "Lov Grover",
    paperUrl: "https://arxiv.org",
    resourceUrl: "https://en.wikipedia.org/wiki/Grover%27s_algorithm",
    resourceName: "Grover's Algorithm (Wikipedia)",
    excerpt: "Grover's 1996 quantum search algorithm provides a quadratic speedup over classical search, enabling quantum computers to search unsorted databases in O(sqrt(N)) time instead of O(N).",
    description: "Grover's algorithm is a quantum algorithm for searching an unsorted database of N items in O(sqrt(N)) operations, compared to O(N) for classical search. While not exponential like Shor's algorithm, this quadratic speedup is significant for optimization problems and has broad applications in machine learning, cryptanalysis, and database search. The algorithm uses quantum amplitude amplification, a technique that is directly relevant to QWAI's approach to attention mechanisms in neural networks.",
  },
  {
    rank: 5,
    slug: "foundational-paper-quantum-fourier-transform",
    title: "Foundational Paper: Quantum Fourier Transform (QFT)",
    theory: "Quantum Fourier Transform (QFT)",
    year: 1994,
    authors: "Don Coppersmith",
    paperUrl: "https://arxiv.org",
    resourceUrl: "https://en.wikipedia.org/wiki/Quantum_Fourier_transform",
    resourceName: "QFT Explained (Wikipedia)",
    excerpt: "Coppersmith's Quantum Fourier Transform is the quantum analogue of the discrete Fourier transform, running exponentially faster and serving as the core subroutine in Shor's algorithm and quantum phase estimation.",
    description: "The Quantum Fourier Transform (QFT) is the quantum analogue of the classical discrete Fourier transform. It operates on quantum states and runs exponentially faster than the best classical FFT algorithms. The QFT is a core subroutine in many quantum algorithms, including Shor's factoring algorithm and quantum phase estimation. Its efficiency comes from quantum parallelism, where the transform is applied to all basis states simultaneously through superposition.",
  },
  {
    rank: 6,
    slug: "foundational-paper-variational-quantum-eigensolver",
    title: "Foundational Paper: Variational Quantum Eigensolver (VQE)",
    theory: "Variational Quantum Eigensolver (VQE)",
    year: 2014,
    authors: "Peruzzo et al.",
    paperUrl: "https://www.nature.com",
    resourceUrl: "https://en.wikipedia.org/wiki/Variational_quantum_eigensolver",
    resourceName: "VQE Overview (Wikipedia)",
    excerpt: "The 2014 VQE paper introduced a hybrid quantum-classical algorithm for finding the ground state energy of molecules, making quantum chemistry simulation practical on near-term quantum hardware.",
    description: "The Variational Quantum Eigensolver (VQE) is a hybrid quantum-classical algorithm designed to find the ground state energy of a quantum system. It uses a parameterized quantum circuit (ansatz) optimized by a classical computer to minimize the expectation value of a Hamiltonian. VQE is particularly relevant for near-term quantum devices (NISQ era) because it is tolerant of noise and requires fewer qubits than fully fault-tolerant algorithms. Its hybrid quantum-classical structure mirrors QWAI's proposed architecture.",
  },
  {
    rank: 7,
    slug: "foundational-paper-quantum-phase-estimation",
    title: "Foundational Paper: Quantum Phase Estimation (QPE)",
    theory: "Quantum Phase Estimation (QPE)",
    year: 1995,
    authors: "Alexei Kitaev",
    paperUrl: "https://arxiv.org",
    resourceUrl: "https://en.wikipedia.org/wiki/Quantum_phase_estimation_algorithm",
    resourceName: "QPE Algorithm (Wikipedia)",
    excerpt: "Kitaev's quantum phase estimation algorithm efficiently determines the eigenvalues of unitary operators, serving as a critical subroutine in Shor's algorithm, HHL, and quantum chemistry simulations.",
    description: "Quantum Phase Estimation (QPE) is an algorithm that estimates the phase (eigenvalue) of an eigenvector of a unitary operator. It is one of the most important subroutines in quantum computing, used as a building block in Shor's algorithm, the HHL algorithm for linear systems, and quantum chemistry simulations. QPE uses the quantum Fourier transform to extract phase information with exponential precision relative to the number of qubits used.",
  },
  {
    rank: 8,
    slug: "foundational-paper-hhl-algorithm",
    title: "Foundational Paper: HHL Algorithm",
    theory: "HHL Algorithm",
    year: 2009,
    authors: "Harrow, Hassidim, Lloyd",
    paperUrl: "https://journals.aps.org",
    resourceUrl: "https://people.eecs.berkeley.edu/~vazirani/f19quantum/notes/lec8.pdf",
    resourceName: "HHL Lecture Notes (UC Berkeley)",
    excerpt: "The 2009 HHL algorithm by Harrow, Hassidim, and Lloyd provides an exponential quantum speedup for solving systems of linear equations, with direct implications for quantum-accelerated machine learning.",
    description: "The HHL algorithm solves systems of linear equations Ax = b exponentially faster than classical methods for certain problem instances. Since linear algebra is the mathematical foundation of neural networks, HHL has profound implications for quantum-accelerated AI. The algorithm is directly relevant to QWAI's theoretical framework: if neural network training can be reformulated as a linear algebra problem amenable to HHL, quantum computers could train models exponentially faster than classical hardware.",
  },
  {
    rank: 9,
    slug: "foundational-paper-qaoa",
    title: "Foundational Paper: QAOA (Quantum Approximate Optimization Algorithm)",
    theory: "QAOA",
    year: 2014,
    authors: "Farhi, Goldstone, Gutmann",
    paperUrl: "https://arxiv.org",
    resourceUrl: "https://arxiv.org/abs/2306.09198",
    resourceName: "QAOA Perspective (arXiv)",
    excerpt: "Farhi, Goldstone, and Gutmann's 2014 QAOA paper introduced a hybrid quantum-classical algorithm for combinatorial optimization, offering a practical path to quantum advantage on near-term devices.",
    description: "The Quantum Approximate Optimization Algorithm (QAOA) is a hybrid quantum-classical algorithm designed to solve combinatorial optimization problems. It applies alternating layers of problem-specific and mixing unitaries to find approximate solutions. QAOA is one of the most promising near-term quantum algorithms because it can run on current NISQ hardware and has potential applications in logistics, finance, drug discovery, and machine learning optimization.",
  },
  {
    rank: 10,
    slug: "foundational-paper-quantum-error-correction",
    title: "Foundational Paper: Quantum Error Correction and the Threshold Theorem",
    theory: "Quantum Error Correction / Threshold",
    year: 1995,
    authors: "Peter Shor",
    paperUrl: "https://journals.aps.org",
    resourceUrl: "https://learn.microsoft.com/en-us/azure/quantum/concepts-error-correction",
    resourceName: "Quantum Algorithm Concepts (Microsoft)",
    excerpt: "Shor's 1995 quantum error correction paper proved that quantum computation can be made fault-tolerant, establishing that a quantum computer can operate reliably despite physical qubit errors.",
    description: "Quantum error correction (QEC) addresses the fundamental challenge of quantum computing: qubits are fragile and prone to decoherence and gate errors. Shor's 1995 paper introduced the first quantum error-correcting code, showing that quantum information can be protected by encoding logical qubits across multiple physical qubits. The threshold theorem, a key result in QEC, proves that if the physical error rate is below a certain threshold, arbitrarily long quantum computations can be performed reliably.",
  },
  {
    rank: 11,
    slug: "foundational-paper-deutsch-jozsa-algorithm",
    title: "Foundational Paper: Deutsch-Jozsa Algorithm",
    theory: "Deutsch-Jozsa Algorithm",
    year: 1992,
    authors: "Deutsch and Jozsa",
    paperUrl: "https://royalsocietypublishing.org",
    resourceUrl: "https://learning.quantum.ibm.com/tutorial/deutsch-jozsa-algorithm",
    resourceName: "Deutsch-Jozsa Explained (Qiskit)",
    excerpt: "The 1992 Deutsch-Jozsa algorithm was the first to demonstrate an exponential quantum speedup over classical computation, proving that quantum computers can solve certain problems fundamentally faster.",
    description: "The Deutsch-Jozsa algorithm was the first quantum algorithm to demonstrate an exponential speedup over classical computation for a specific problem. While the problem it solves (determining whether a function is constant or balanced) has limited practical applications, the algorithm's significance is historical and theoretical: it proved for the first time that quantum computers can solve certain problems exponentially faster than any classical computer, establishing the theoretical basis for quantum computational advantage.",
  },
  {
    rank: 12,
    slug: "foundational-paper-simons-algorithm",
    title: "Foundational Paper: Simon's Algorithm",
    theory: "Simon's Algorithm",
    year: 1994,
    authors: "Daniel Simon",
    paperUrl: "https://ieeexplore.ieee.org",
    resourceUrl: "https://learning.quantum.ibm.com/tutorial/simons-algorithm",
    resourceName: "Simon's Algorithm (IBM Quantum Learning)",
    excerpt: "Simon's 1994 algorithm demonstrated an exponential quantum speedup for a black-box problem and directly inspired Shor's algorithm, establishing the quantum period-finding technique.",
    description: "Simon's algorithm solves a specific black-box problem exponentially faster than any classical algorithm. The problem involves finding a hidden period in a function, and the quantum approach uses superposition and interference to identify the period in polynomial time. Simon's algorithm was historically important because it directly inspired Peter Shor to develop his factoring algorithm, and it established the quantum period-finding technique that underlies many quantum speedups.",
  },
  {
    rank: 13,
    slug: "foundational-paper-bernstein-vazirani",
    title: "Foundational Paper: Bernstein-Vazirani Algorithm",
    theory: "Bernstein-Vazirani",
    year: 1993,
    authors: "Bernstein and Vazirani",
    paperUrl: "https://dl.acm.org",
    resourceUrl: "https://www.bluequbit.io/quantum-algorithms/bernstein-vazirani-algorithm",
    resourceName: "Bernstein-Vazirani Guide (BlueQubit)",
    excerpt: "The Bernstein-Vazirani algorithm demonstrated a quantum speedup for finding a hidden bit string, and the same paper introduced the complexity class BQP, formally defining the power of quantum computation.",
    description: "The Bernstein-Vazirani algorithm finds a hidden bit string using a single quantum query, compared to n classical queries. More importantly, the 1993 paper introduced the complexity class BQP (Bounded-error Quantum Polynomial time), which formally defines the class of problems solvable by a quantum computer in polynomial time with bounded error probability. BQP is the quantum analogue of the classical complexity class P and is central to understanding the theoretical power of quantum computation.",
  },
  {
    rank: 14,
    slug: "foundational-paper-quantum-teleportation",
    title: "Foundational Paper: Quantum Teleportation",
    theory: "Quantum Teleportation",
    year: 1993,
    authors: "Bennett et al.",
    paperUrl: "https://journals.aps.org",
    resourceUrl: "https://en.wikipedia.org/wiki/Quantum_teleportation",
    resourceName: "Quantum Teleportation (Wikipedia)",
    excerpt: "The 1993 Bennett et al. paper introduced quantum teleportation, a protocol for transmitting quantum states using entanglement and classical communication, foundational to quantum networking.",
    description: "Quantum teleportation is a protocol for transmitting an unknown quantum state from one location to another using a shared entangled pair and classical communication. The 1993 paper by Bennett, Brassard, Crepeau, Jozsa, Peres, and Wootters established this protocol, which has since been experimentally demonstrated over increasing distances. Quantum teleportation is foundational to quantum networking and quantum internet protocols, enabling the transfer of quantum information without physically moving the quantum system.",
  },
  {
    rank: 15,
    slug: "foundational-paper-quantum-simulation-lloyds",
    title: "Foundational Paper: Quantum Simulation (Lloyd's)",
    theory: "Quantum Simulation (Lloyd's)",
    year: 1996,
    authors: "Seth Lloyd",
    paperUrl: "https://www.science.org",
    resourceUrl: "https://www.nature.com/articles/s41567-022-01651-7",
    resourceName: "Quantum Simulation (Nature)",
    excerpt: "Seth Lloyd's 1996 paper proved that quantum computers can efficiently simulate quantum physical systems, opening the door to drug discovery, materials science, and quantum chemistry applications.",
    description: "Lloyd's 1996 paper proved that quantum computers can efficiently simulate the time evolution of quantum systems, a task that is exponentially hard for classical computers. This is one of the most practically significant quantum speedups: simulating molecular interactions for drug discovery, designing new materials, and modeling chemical reactions are all problems where quantum simulation could provide transformative advantages. Richard Feynman originally proposed this idea in 1982, and Lloyd's paper provided the formal proof.",
  },
  {
    rank: 16,
    slug: "foundational-paper-surface-code-qec",
    title: "Foundational Paper: Surface Code (Quantum Error Correction)",
    theory: "Surface Code (QEC)",
    year: 1997,
    authors: "Alexei Kitaev",
    paperUrl: "https://arxiv.org",
    resourceUrl: "https://arxiv.org/abs/quant-ph/9707021",
    resourceName: "Surface Codes for Beginners (arXiv)",
    excerpt: "Kitaev's 1997 surface code is the leading quantum error correction scheme for fault-tolerant quantum computing, used by Google, IBM, and Microsoft as the foundation for their quantum hardware roadmaps.",
    description: "The surface code, introduced by Kitaev in 1997, is a topological quantum error-correcting code that has become the leading approach for fault-tolerant quantum computing. It encodes logical qubits in a 2D array of physical qubits and can correct errors using only local operations. The surface code has a high error threshold (approximately 1%), making it compatible with near-term hardware. Google, IBM, and Microsoft all base their fault-tolerant quantum computing roadmaps on surface code architectures.",
  },
  {
    rank: 17,
    slug: "foundational-paper-quantum-walks",
    title: "Foundational Paper: Quantum Walks",
    theory: "Quantum Walks",
    year: 1993,
    authors: "Aharonov et al.",
    paperUrl: "https://journals.aps.org",
    resourceUrl: "https://en.wikipedia.org/wiki/Quantum_walk",
    resourceName: "Quantum Walks Overview (Wikipedia)",
    excerpt: "Aharonov's 1993 quantum walk paper introduced the quantum analogue of classical random walks, providing a powerful algorithmic primitive for quantum speedups in graph problems and search algorithms.",
    description: "Quantum walks are the quantum analogue of classical random walks, where a quantum particle moves through a graph in superposition, exploring multiple paths simultaneously. Quantum walks provide exponential speedups for certain graph problems and serve as a universal model of quantum computation. They are used in quantum search algorithms, quantum transport models, and quantum simulation. The interference patterns in quantum walks are directly analogous to the wave function interference that QWAI proposes to leverage in neural network attention mechanisms.",
  },
  {
    rank: 18,
    slug: "foundational-paper-bqp-complexity-class",
    title: "Foundational Paper: BQP Complexity Class",
    theory: "BQP Complexity Class",
    year: 1997,
    authors: "Bernstein and Vazirani",
    paperUrl: "https://epubs.siam.org",
    resourceUrl: "https://complexityzoo.net/Complexity_Zoo:B#bqp",
    resourceName: "BQP Definition (Complexity Zoo)",
    excerpt: "The BQP complexity class formally defines the set of problems efficiently solvable by quantum computers, establishing the theoretical boundaries of quantum computational advantage over classical systems.",
    description: "BQP (Bounded-error Quantum Polynomial time) is the class of decision problems solvable by a quantum computer in polynomial time with an error probability of at most 1/3. BQP is the quantum analogue of the classical class P. Understanding BQP is essential for identifying which problems quantum computers can solve efficiently. The relationship between BQP and classical complexity classes (P, NP, PSPACE) defines the theoretical limits and advantages of quantum computation, including which machine learning tasks could benefit from quantum speedups.",
  },
  {
    rank: 19,
    slug: "foundational-paper-amplitude-amplification",
    title: "Foundational Paper: Amplitude Amplification",
    theory: "Amplitude Amplification",
    year: 2000,
    authors: "Brassard et al.",
    paperUrl: "https://arxiv.org",
    resourceUrl: "https://en.wikipedia.org/wiki/Amplitude_amplification",
    resourceName: "Amplitude Amplification (Wikipedia)",
    excerpt: "Brassard's 2000 amplitude amplification paper generalized Grover's search algorithm into a universal quantum technique for boosting the probability of desired outcomes, with broad applications in quantum AI.",
    description: "Amplitude amplification is a generalization of Grover's search algorithm that can amplify the probability amplitude of a desired outcome in a quantum superposition. The technique provides a quadratic speedup for any algorithm that can be expressed as a search problem. Amplitude amplification is a fundamental primitive in quantum computing with applications in quantum machine learning, quantum Monte Carlo methods, and quantum optimization. QWAI's theoretical framework for quantum attention mechanisms draws directly on amplitude amplification principles.",
  },
  {
    rank: 20,
    slug: "foundational-paper-quantum-volume",
    title: "Foundational Paper: Quantum Volume",
    theory: "Quantum Volume",
    year: 2019,
    authors: "Cross et al.",
    paperUrl: "https://journals.aps.org",
    resourceUrl: "https://research.ibm.com/blog/quantum-volume-256",
    resourceName: "Understanding Quantum Volume (IBM)",
    excerpt: "IBM's 2019 Quantum Volume paper introduced a holistic benchmark for quantum computer performance, measuring not just qubit count but gate fidelity, connectivity, and error rates together.",
    description: "Quantum Volume (QV) is a single-number benchmark introduced by IBM to measure the overall performance of a quantum computer. Unlike qubit count alone, QV accounts for gate fidelity, qubit connectivity, circuit depth, and error rates together. A quantum computer with QV = 2^n can reliably execute random circuits of width and depth n. Quantum Volume provides a practical metric for tracking progress toward quantum advantage and helps researchers understand the real-world capabilities of current quantum hardware.",
  },
];

// ─── CDN image URLs for each foundational paper ─────────────────────────────
const paperImages = {
  1: "https://d2xsxph8kpxj0f.cloudfront.net/97664517/AZgbj2ZwAKxooAM5AQuEWd/qwai-paper-superposition-frCER4m44QGE2B85uwdeMT.webp",
  2: "https://d2xsxph8kpxj0f.cloudfront.net/97664517/AZgbj2ZwAKxooAM5AQuEWd/qwai-paper-shor-96gKDBNaSEGrsJsTtzDHCr.webp",
  3: "https://d2xsxph8kpxj0f.cloudfront.net/97664517/AZgbj2ZwAKxooAM5AQuEWd/qwai-paper-bell-XCgb2ZKCoZcZPbrnGszmdq.webp",
  4: "https://d2xsxph8kpxj0f.cloudfront.net/97664517/AZgbj2ZwAKxooAM5AQuEWd/qwai-paper-grover-Qm7i3XTnLbhuFDJQiV6Gzt.webp",
  5: "https://d2xsxph8kpxj0f.cloudfront.net/97664517/AZgbj2ZwAKxooAM5AQuEWd/qwai-paper-qft-GphXsNAcnTKKwiTVDsAyPF.webp",
  6: "https://d2xsxph8kpxj0f.cloudfront.net/97664517/AZgbj2ZwAKxooAM5AQuEWd/qwai-paper-vqe-YYhKKkxES22GMDiF6udx7o.webp",
  7: "https://d2xsxph8kpxj0f.cloudfront.net/97664517/AZgbj2ZwAKxooAM5AQuEWd/qwai-paper-qpe-bd5irVXYUvpUaiGrKPRcPc.webp",
  8: "https://d2xsxph8kpxj0f.cloudfront.net/97664517/AZgbj2ZwAKxooAM5AQuEWd/qwai-paper-hhl-mocrffHoRstzUGG9pzMaQY.webp",
  9: "https://d2xsxph8kpxj0f.cloudfront.net/97664517/AZgbj2ZwAKxooAM5AQuEWd/qwai-paper-qaoa-fCLNozU5kvYiErcnXZg2Cu.webp",
  10: "https://d2xsxph8kpxj0f.cloudfront.net/97664517/AZgbj2ZwAKxooAM5AQuEWd/qwai-paper-qec-ebwrzRfPpnKkFuiStLXYWG.webp",
  11: "https://d2xsxph8kpxj0f.cloudfront.net/97664517/AZgbj2ZwAKxooAM5AQuEWd/qwai-paper-deutsch-jozsa-4eh9zmZ3P9FRQD8b5yfbSB.webp",
  12: "https://d2xsxph8kpxj0f.cloudfront.net/97664517/AZgbj2ZwAKxooAM5AQuEWd/qwai-paper-simon-M9BuCptLcJdcUqY3urMiwp.webp",
  13: "https://d2xsxph8kpxj0f.cloudfront.net/97664517/AZgbj2ZwAKxooAM5AQuEWd/qwai-paper-bernstein-vazirani-8EPTFzVyV3nTLXaenXj5tH.webp",
  14: "https://d2xsxph8kpxj0f.cloudfront.net/97664517/AZgbj2ZwAKxooAM5AQuEWd/qwai-paper-teleportation-RELCQuDm7tGvgFS4rQCPHS.webp",
  15: "https://d2xsxph8kpxj0f.cloudfront.net/97664517/AZgbj2ZwAKxooAM5AQuEWd/qwai-paper-quantum-simulation-QbXRnouipnzGjbam8U9dXi.webp",
  16: "https://d2xsxph8kpxj0f.cloudfront.net/97664517/AZgbj2ZwAKxooAM5AQuEWd/qwai-paper-surface-code-2DUV8ext3MC2XhayS2g9z5.webp",
  17: "https://d2xsxph8kpxj0f.cloudfront.net/97664517/AZgbj2ZwAKxooAM5AQuEWd/qwai-paper-quantum-walks-oVsG42MvDSJGj9A3vmrZmA.webp",
  18: "https://d2xsxph8kpxj0f.cloudfront.net/97664517/AZgbj2ZwAKxooAM5AQuEWd/qwai-paper-bqp-W7BNDVL4X7NpVMQDwDVxwD.webp",
  19: "https://d2xsxph8kpxj0f.cloudfront.net/97664517/AZgbj2ZwAKxooAM5AQuEWd/qwai-paper-amplitude-amplification-o9CcUdWRuYZS2S9qGLVfvF.webp",
  20: "https://d2xsxph8kpxj0f.cloudfront.net/97664517/AZgbj2ZwAKxooAM5AQuEWd/qwai-paper-quantum-volume-5LtVrptRaZZgg8vbZUGmEU.webp",
};

// ─── Build article content for foundational papers ────────────────────────────
function buildPaperContent(paper) {
  return `<h2>${paper.theory}</h2>
<p>${paper.description}</p>

<h3>Original Research</h3>
<p>The foundational paper by <strong>${paper.authors}</strong> (${paper.year}) is available at: <a href="${paper.paperUrl}" target="_blank" rel="noopener noreferrer">${paper.paperUrl}</a></p>

<h3>Learn More</h3>
<p>For an accessible introduction and deeper exploration, see: <a href="${paper.resourceUrl}" target="_blank" rel="noopener noreferrer">${paper.resourceName}</a></p>

<h3>Relevance to QWAI</h3>
<p>This theory is one of the 20 foundational pillars of quantum computing that inform the QWAI theoretical framework. Understanding these foundations is essential to grasping how quantum wave mechanics and artificial intelligence converge at the boundary where classical systems reach their limits.</p>

<blockquote>
  <strong>Note:</strong> This article is part of the QWAI Foundational Papers series, a curated reference library of the most important quantum computing research for researchers, engineers, and curious minds exploring the intersection of quantum physics and artificial intelligence.
</blockquote>`;
}

// ─── Seed all articles ────────────────────────────────────────────────────────
console.log("\nSeeding Article #3...");
await upsertArticle(article3);

console.log("\nSeeding 20 Foundational Papers...");
for (const paper of foundationalPapers) {
  const article = {
    slug: paper.slug,
    title: paper.title,
    excerpt: paper.excerpt,
    content: buildPaperContent(paper),
    author: "QWAI Research",
    category: "Foundational Papers",
    imageUrl: paperImages[paper.rank] || null,
    published: true,
    featured: false,
    linkedinUrl: null,
    publishedAt: new Date("2026-03-15"),
  };
  await upsertArticle(article);
}

await conn.end();
console.log("\nDone.");
