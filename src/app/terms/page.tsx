import { siteConfig } from "@/config/site";

export const metadata = {
  title: "Terms of Service",
  description: `Terms of Service for ${siteConfig.name}.`,
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
      <p className="text-sm text-gray-400 mb-8">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

      <div className="prose prose-gray max-w-none space-y-6 text-sm text-gray-600 leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Acceptance of Terms</h2>
          <p>
            By accessing and using {siteConfig.name}, you agree to be bound by these Terms of Service. If you do not agree to these
            terms, please do not use our website or services.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Description of Service</h2>
          <p>
            {siteConfig.name} provides free online tools for file conversion, image editing, text processing, and other utilities.
            All tools run directly in your web browser and do not require file uploads to any server.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Use of Service</h2>
          <p>
            You may use our tools for personal and commercial purposes. You agree not to use the service for any unlawful purpose
            or in any way that could damage, disable, or impair the website. You are responsible for all content you process using our tools.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">No Warranty</h2>
          <p>
            Our services are provided "as is" without warranties of any kind, either express or implied. We do not guarantee that
            the tools will always be available, error-free, or produce specific results. We are not responsible for any data loss
            or damage resulting from the use of our tools.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Limitation of Liability</h2>
          <p>
            {siteConfig.name} shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting
            from your use of or inability to use the service. Since all processing happens in your browser, you are responsible for
            ensuring your files are backed up before using any tool.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Intellectual Property</h2>
          <p>
            The {siteConfig.name} website, including its design, code, and branding, is protected by intellectual property laws.
            You may not copy, modify, or distribute our website or its code without permission. Your files and content remain
            entirely yours — we claim no ownership over anything you process using our tools.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Advertising</h2>
          <p>
            We may display advertisements on our website to support the free availability of our tools. These ads may be provided
            by third-party advertising networks and may use cookies to serve relevant content.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance
            of the updated terms. We encourage you to review these terms periodically.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Contact</h2>
          <p>
            For questions about these Terms of Service, please visit our <a href="/contact" className="text-blue-600 hover:underline">contact page</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
