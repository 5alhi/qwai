import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export default function Legal() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SiteNav />

      <main className="flex-1 pt-28 pb-20">
        <div className="container max-w-3xl">
          <div className="mb-10">
            <div className="inline-block mb-4 px-3 py-1 rounded-full border border-destructive/30 bg-destructive/10 text-destructive text-xs font-mono uppercase tracking-widest">
              Legal · Disclaimer
            </div>
            <h1 className="text-4xl font-bold mb-4">Legal Disclaimer</h1>
            <p className="text-muted-foreground">Last updated: March 2026</p>
          </div>

          <div className="space-y-8 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">1. Nature of QWAI</h2>
              <p>
                Quantum Wave Artificial Intelligence (QWAI) and the domain qw.ai represent a <strong className="text-foreground">conceptual framework and theoretical thought experiment</strong> currently in early ideation stages. QWAI is not a commercially available product, service, platform, or technology. It has not been built, deployed, or validated as a working system.
              </p>
              <p className="mt-3">
                All content on this website — including articles, philosophy pages, technical descriptions, and any other materials — is <strong className="text-foreground">speculative, theoretical, and intended solely for intellectual exploration and discussion</strong>. The ideas presented represent potential future directions for research and development, not current capabilities.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">2. No Investment Advice</h2>
              <p>
                Nothing on this website constitutes financial, investment, or legal advice. Any reference to potential market opportunities, technological advantages, or future developments is purely speculative. Do not make financial decisions based on content found on this website.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">3. No Product Offer</h2>
              <p>
                The content on qw.ai does not constitute an offer to sell, a solicitation to buy, or a commitment to deliver any product, service, or technology. Any descriptions of potential QWAI capabilities are theoretical and do not represent commitments or guarantees of future development, availability, or performance.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">4. Intellectual Property</h2>
              <p>
                All original content, concepts, theoretical frameworks, and written materials on this website are the intellectual property of Samer Salhi and qw.ai. The QWAI concept, "The Way of QWAI" series, and associated theoretical frameworks are original works. Reproduction or use of these materials requires explicit written permission.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">5. Third-Party References</h2>
              <p>
                References to third-party technologies, companies, research, or platforms (including but not limited to quantum computing hardware manufacturers, AI companies, and academic institutions) are for illustrative and educational purposes only. Such references do not imply endorsement, partnership, or affiliation.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">6. Accuracy of Information</h2>
              <p>
                While we strive for accuracy in our descriptions of quantum computing and AI concepts, the field is rapidly evolving. Information on this website may not reflect the most current state of the art. We make no warranties regarding the completeness, accuracy, or timeliness of any information presented.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">7. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by applicable law, qw.ai and its contributors shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from your use of, or reliance on, any content found on this website.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">8. Contact</h2>
              <p>
                For questions regarding this disclaimer or the content on this website, please reach out via{" "}
                <a
                  href="https://www.linkedin.com/in/samsalhi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  LinkedIn
                </a>
                .
              </p>
            </section>

            {/* Summary box */}
            <div className="mt-10 p-6 rounded-xl border border-destructive/30 bg-destructive/5">
              <h3 className="font-bold text-foreground mb-2">Summary</h3>
              <p className="text-sm">
                QWAI is a <strong className="text-foreground">concept in early thinking stages</strong>. It is not a product. It is not an investment opportunity. It is not a guarantee of anything. It is an idea — a theoretical framework exploring what becomes possible when quantum physics and artificial intelligence converge. Engage with it as such.
              </p>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
