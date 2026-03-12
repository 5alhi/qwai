import { Button } from "@/components/ui/button";
import { Link, useParams } from "wouter";
import { ArrowLeft, Calendar, User, Share2 } from "lucide-react";

/**
 * Design Philosophy: Quantum Futurism
 * - Full-width article display with quantum background
 * - Dark backgrounds with cyan/magenta accents
 * - Readable typography with proper contrast
 * - Related articles section at bottom
 */

// EASILY UPDATABLE: Article content database
const articleDatabase: Record<
  string,
  {
    title: string;
    author: string;
    date: string;
    category: string;
    image: string;
    content: string;
    excerpt: string;
  }
> = {
  "quantum-computing-breakthrough": {
    title: "Quantum Computing Breakthrough: 1000x Performance Gains",
    author: "Dr. Sarah Chen",
    date: "2026-03-10",
    category: "Technology",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/97664517/AZgbj2ZwAKxooAM5AQuEWd/quantum-particles-Nt2LXRvuGyeohhFZekUSAz.webp",
    excerpt:
      "Discover how our latest quantum processors achieve unprecedented computational speeds.",
    content: `
      <h2>Introduction</h2>
      <p>Quantum computing has long been the frontier of computational science, promising to solve problems that classical computers cannot handle in reasonable timeframes. Today, we're thrilled to announce a breakthrough that brings this promise closer to reality.</p>

      <h2>The Achievement</h2>
      <p>Our latest quantum processors have achieved a remarkable milestone: solving certain optimization problems 1000 times faster than the best classical supercomputers. This represents a quantum leap forward in practical quantum computing applications.</p>

      <p>The breakthrough comes from three key innovations:</p>
      <ul>
        <li><strong>Improved Qubit Stability:</strong> We've extended coherence times by 300%, allowing for more complex quantum operations.</li>
        <li><strong>Advanced Error Correction:</strong> Our new error correction codes reduce logical error rates by 99.9%.</li>
        <li><strong>Optimized Gate Operations:</strong> We've achieved sub-nanosecond gate times, enabling faster quantum circuits.</li>
      </ul>

      <h2>Real-World Applications</h2>
      <p>These improvements have immediate applications in:</p>
      <ul>
        <li>Drug discovery and molecular simulation</li>
        <li>Financial portfolio optimization</li>
        <li>Supply chain logistics</li>
        <li>Machine learning acceleration</li>
      </ul>

      <h2>What This Means for Industry</h2>
      <p>This breakthrough opens doors to solving previously intractable problems. Companies can now tackle optimization challenges that were computationally impossible just months ago.</p>

      <p>We're working with leading enterprises across finance, pharmaceuticals, and logistics to implement these quantum solutions into their operations.</p>

      <h2>Looking Forward</h2>
      <p>This is just the beginning. Our roadmap includes even more powerful quantum processors, expanded qubit counts, and enhanced integration with classical AI systems.</p>

      <p>The quantum revolution is here, and the future of computing has never looked brighter.</p>
    `,
  },
  "ai-neural-networks-evolution": {
    title: "The Evolution of Neural Networks: From Theory to Practice",
    author: "Prof. James Mitchell",
    date: "2026-03-08",
    category: "AI Research",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/97664517/AZgbj2ZwAKxooAM5AQuEWd/ai-neural-network-S5YsLBDJBTTNPepoT5Y9Rw.webp",
    excerpt:
      "Explore how artificial neural networks have evolved from theoretical concepts to practical systems.",
    content: `
      <h2>The Journey Begins</h2>
      <p>Neural networks have come a long way since their theoretical inception in the 1950s. What started as mathematical abstractions inspired by biological neurons has evolved into the most powerful machine learning paradigm of our time.</p>

      <h2>From Theory to Practice</h2>
      <p>The transition from academic theory to practical implementation required overcoming numerous challenges:</p>
      <ul>
        <li>Computational power to train large networks</li>
        <li>Availability of massive datasets</li>
        <li>Development of efficient algorithms</li>
        <li>Practical deployment infrastructure</li>
      </ul>

      <h2>Key Milestones</h2>
      <p>Several breakthroughs accelerated this evolution:</p>
      <ul>
        <li><strong>Deep Learning Revolution (2012):</strong> AlexNet demonstrated the power of deep convolutional networks.</li>
        <li><strong>Transformer Architecture (2017):</strong> Attention mechanisms revolutionized NLP.</li>
        <li><strong>Large Language Models (2020+):</strong> Scaled models showed emergent capabilities.</li>
      </ul>

      <h2>Current State of the Art</h2>
      <p>Today's neural networks power:</p>
      <ul>
        <li>Natural language processing and generation</li>
        <li>Computer vision and image recognition</li>
        <li>Recommendation systems</li>
        <li>Autonomous systems</li>
      </ul>

      <h2>The Future</h2>
      <p>We're entering an era of hybrid quantum-classical neural networks, where quantum processors accelerate specific components of neural network computation, leading to unprecedented performance gains.</p>
    `,
  },
  "wave-function-applications": {
    title: "Wave Function Optimization: Practical Applications in Industry",
    author: "Dr. Michael Rodriguez",
    date: "2026-03-05",
    category: "Applications",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/97664517/AZgbj2ZwAKxooAM5AQuEWd/wave-function-abstract-S3WSdJqLUfjhh4G6Tdda6W.webp",
    excerpt:
      "Learn how wave function optimization techniques are revolutionizing optimization problems.",
    content: `
      <h2>Understanding Wave Function Optimization</h2>
      <p>Wave function optimization is a quantum computing technique that leverages the properties of quantum superposition to explore solution spaces more efficiently than classical methods.</p>

      <h2>Industrial Applications</h2>
      <p>Wave function optimization is already delivering value across multiple industries:</p>

      <h3>Finance</h3>
      <p>Portfolio optimization, risk management, and trading strategy development benefit from quantum speedups in exploring vast combinations of assets and strategies.</p>

      <h3>Logistics</h3>
      <p>Route optimization, warehouse management, and supply chain planning are being revolutionized by quantum solutions that find better solutions faster.</p>

      <h3>Manufacturing</h3>
      <p>Production scheduling, resource allocation, and quality optimization are seeing significant improvements through quantum optimization.</p>

      <h2>Real-World Results</h2>
      <p>Early adopters are seeing:</p>
      <ul>
        <li>15-40% improvement in logistics efficiency</li>
        <li>20-50% reduction in portfolio risk</li>
        <li>10-30% increase in manufacturing throughput</li>
      </ul>

      <h2>Implementation Strategy</h2>
      <p>Successful implementation requires:</p>
      <ul>
        <li>Problem formulation as a quantum optimization problem</li>
        <li>Integration with existing systems</li>
        <li>Hybrid classical-quantum workflows</li>
        <li>Continuous refinement and optimization</li>
      </ul>

      <h2>The Path Forward</h2>
      <p>As quantum hardware improves, we expect even more dramatic improvements in optimization problems across industries.</p>
    `,
  },
  "quantum-ai-synergy": {
    title: "The Synergy Between Quantum Computing and Artificial Intelligence",
    author: "Dr. Lisa Wang",
    date: "2026-03-01",
    category: "Research",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/97664517/AZgbj2ZwAKxooAM5AQuEWd/quantum-hero-bg-YerM3ndorop85QQiK2iBkf.webp",
    excerpt:
      "Understand how quantum computing and AI complement each other.",
    content: `
      <h2>A Perfect Pairing</h2>
      <p>Quantum computing and artificial intelligence are not competing technologies—they're complementary forces that amplify each other's capabilities.</p>

      <h2>How They Work Together</h2>
      <p>Quantum computing accelerates specific AI operations:</p>
      <ul>
        <li><strong>Training:</strong> Quantum algorithms can accelerate neural network training</li>
        <li><strong>Optimization:</strong> Quantum optimization improves model parameters</li>
        <li><strong>Feature Mapping:</strong> Quantum feature spaces enable better classification</li>
      </ul>

      <h2>Quantum Machine Learning</h2>
      <p>A new field is emerging at the intersection of quantum computing and machine learning. Quantum machine learning algorithms promise:</p>
      <ul>
        <li>Exponential speedups for certain problems</li>
        <li>Better generalization from smaller datasets</li>
        <li>Novel approaches to unsupervised learning</li>
      </ul>

      <h2>Practical Implementations</h2>
      <p>Today's hybrid quantum-classical systems are already showing promise in:</p>
      <ul>
        <li>Drug discovery pipelines</li>
        <li>Financial risk modeling</li>
        <li>Materials science</li>
        <li>Optimization problems</li>
      </ul>

      <h2>The Quantum AI Future</h2>
      <p>As both technologies mature, we'll see increasingly sophisticated hybrid systems that leverage the strengths of both quantum and classical computing, combined with advanced AI algorithms.</p>

      <p>This synergy represents the next frontier in computational science and will drive innovation across all industries.</p>
    `,
  },
  "enterprise-quantum-adoption": {
    title: "Enterprise Guide: Adopting Quantum AI Solutions",
    author: "David Thompson",
    date: "2026-02-28",
    category: "Enterprise",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/97664517/AZgbj2ZwAKxooAM5AQuEWd/tech-circuit-pattern-crHWqCYoUGCbwyqjYFWPoW.webp",
    excerpt:
      "A comprehensive guide for enterprises looking to integrate quantum AI technologies.",
    content: `
      <h2>Why Enterprises Should Adopt Quantum AI</h2>
      <p>Quantum AI solutions offer competitive advantages that can transform business operations. Early adopters will gain significant market advantages.</p>

      <h2>Assessment Phase</h2>
      <p>Start by identifying problems that could benefit from quantum solutions:</p>
      <ul>
        <li>Optimization problems with large solution spaces</li>
        <li>Machine learning tasks requiring significant computational power</li>
        <li>Simulation and modeling challenges</li>
      </ul>

      <h2>Implementation Strategy</h2>
      <p>A successful implementation follows these steps:</p>

      <h3>1. Pilot Project</h3>
      <p>Start with a well-defined, high-impact problem. This allows you to learn and validate the approach.</p>

      <h3>2. Build Internal Expertise</h3>
      <p>Invest in training your team on quantum computing and hybrid algorithms.</p>

      <h3>3. Integration</h3>
      <p>Integrate quantum solutions into your existing infrastructure and workflows.</p>

      <h3>4. Scale</h3>
      <p>Expand to additional use cases and optimize your quantum-classical workflows.</p>

      <h2>Key Considerations</h2>
      <ul>
        <li>Start with problems where quantum offers clear advantages</li>
        <li>Partner with experienced quantum providers</li>
        <li>Invest in team training and development</li>
        <li>Plan for hybrid classical-quantum architectures</li>
      </ul>

      <h2>Expected ROI</h2>
      <p>Early adopters report:</p>
      <ul>
        <li>20-50% improvement in optimization metrics</li>
        <li>Significant time savings in problem-solving</li>
        <li>Competitive market advantages</li>
        <li>Innovation acceleration</li>
      </ul>

      <h2>Next Steps</h2>
      <p>Contact us to discuss how Quantum Wave AI can help your enterprise harness the power of quantum computing and artificial intelligence.</p>
    `,
  },
  "future-of-quantum-ai": {
    title: "The Future of Quantum AI: Predictions and Possibilities",
    author: "Dr. Emma Johnson",
    date: "2026-02-25",
    category: "Future",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/97664517/AZgbj2ZwAKxooAM5AQuEWd/quantum-particles-Nt2LXRvuGyeohhFZekUSAz.webp",
    excerpt:
      "Explore expert predictions on how quantum AI will shape industries.",
    content: `
      <h2>The Next Decade of Quantum AI</h2>
      <p>As we look forward, several trends are likely to shape the quantum AI landscape:</p>

      <h2>Hardware Evolution</h2>
      <p>Quantum processors will continue to improve:</p>
      <ul>
        <li>Increased qubit counts (1000+ qubits by 2030)</li>
        <li>Better error correction enabling practical applications</li>
        <li>Improved coherence times and gate fidelities</li>
        <li>Multiple quantum processor types (superconducting, trapped ion, photonic)</li>
      </ul>

      <h2>Software and Algorithms</h2>
      <p>New quantum algorithms will emerge:</p>
      <ul>
        <li>More efficient quantum machine learning algorithms</li>
        <li>Better hybrid classical-quantum approaches</li>
        <li>Quantum compilers and optimization tools</li>
        <li>Standardized quantum programming frameworks</li>
      </ul>

      <h2>Industry Transformation</h2>
      <p>Quantum AI will revolutionize:</p>
      <ul>
        <li><strong>Drug Discovery:</strong> 10x faster molecule screening</li>
        <li><strong>Finance:</strong> Better risk models and portfolio optimization</li>
        <li><strong>Materials Science:</strong> Discovery of new materials with desired properties</li>
        <li><strong>Artificial Intelligence:</strong> More powerful and efficient AI models</li>
      </ul>

      <h2>Societal Impact</h2>
      <p>Quantum AI will address global challenges:</p>
      <ul>
        <li>Climate modeling and optimization</li>
        <li>Disease research and treatment discovery</li>
        <li>Energy optimization and sustainability</li>
        <li>Resource management and allocation</li>
      </ul>

      <h2>The Quantum AI Economy</h2>
      <p>The quantum AI market is expected to grow exponentially, with early leaders capturing significant value. Companies that invest now will be positioned to lead this transformation.</p>

      <h2>Conclusion</h2>
      <p>The future of quantum AI is bright. The convergence of quantum computing and artificial intelligence will unlock capabilities we can barely imagine today. The time to prepare is now.</p>
    `,
  },
};

export default function ArticleDetail() {
  const params = useParams();
  const slug = params.slug as string;
  const article = articleDatabase[slug];

  if (!article) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The article you're looking for doesn't exist.
          </p>
          <Link href="/articles">
            <Button className="bg-accent text-background hover:bg-accent/90">
              Back to Articles
            </Button>
          </Link>
        </div>
      </div>
    );
  }

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
            <Link href="/articles" className="hover:text-accent transition-colors">
              Articles
            </Link>
            <Button className="bg-accent text-background hover:bg-accent/90">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Image */}
      <div className="relative h-96 md:h-[500px] overflow-hidden mt-16">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      {/* Article Content */}
      <article className="py-16 md:py-24">
        <div className="container max-w-3xl">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <span className="px-3 py-1 bg-accent/20 text-accent text-sm font-semibold rounded-full">
                {article.category}
              </span>
              <span className="text-muted-foreground text-sm">
                {new Date(article.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              {article.title}
            </h1>

            <div className="flex items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span>{article.author}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-accent text-accent hover:bg-accent/10"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-invert max-w-none mb-16">
            <div
              className="space-y-6 text-lg leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: article.content
                  .replace(/<h2>/g, '<h2 class="text-3xl font-bold mt-8 mb-4">')
                  .replace(/<h3>/g, '<h3 class="text-2xl font-bold mt-6 mb-3">')
                  .replace(/<p>/g, '<p class="text-muted-foreground">')
                  .replace(/<ul>/g, '<ul class="list-disc list-inside space-y-2 text-muted-foreground">')
                  .replace(/<li>/g, '<li class="ml-4">')
                  .replace(/<strong>/g, '<strong class="text-foreground font-semibold">')
                  .replace(/<em>/g, '<em class="italic text-accent">')
              }}
            />
          </div>

          {/* Back Button */}
          <div className="border-t border-border pt-8">
            <Link href="/articles">
              <Button
                variant="outline"
                className="border-accent text-accent hover:bg-accent/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Articles
              </Button>
            </Link>
          </div>
        </div>
      </article>

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
