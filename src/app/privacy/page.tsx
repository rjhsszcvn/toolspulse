import { siteConfig } from "@/config/site";

export const metadata = {
  title: "Privacy Policy",
  alternates: {
    canonical: `${siteConfig.url}/privacy`,
  },
  description: `Privacy Policy for ${siteConfig.name}. Learn how we handle your data — spoiler: we don't collect any.`,
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
      <p className="text-sm text-gray-400 mb-8">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

      <div className="prose prose-gray max-w-none space-y-6 text-sm text-gray-600 leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">The Short Version</h2>
          <p>
            {siteConfig.name} is designed with privacy as a core principle. All file processing happens directly in your browser.
            Your files are never uploaded to our servers. We cannot see, access, or store any files you use with our tools.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Information We Do Not Collect</h2>
          <p>
            We do not collect, store, or process any of the files you use with our tools. When you compress an image, merge a PDF,
            or use any other tool, all processing happens locally in your web browser using JavaScript. No data is sent to any server.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Information We May Collect</h2>
          <p>
            We may use privacy-respecting analytics to understand how visitors use our site. This may include anonymous data such as
            pages visited, browser type, device type, and approximate location (country level). This data is aggregated and cannot be
            used to identify individual users.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Cookies</h2>
          <p>
            We may use essential cookies to ensure the website functions properly. If we display ads, our advertising partners may also
            use cookies. You can control cookie settings through your browser preferences.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Third-Party Services</h2>
          <p>
            We may use third-party services for analytics and advertising. These services have their own privacy policies.
            We recommend reviewing their policies for more information on how they handle data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Data Security</h2>
          <p>
            Since your files never leave your device, they are as secure as your own computer. We use HTTPS encryption for all
            connections to our website to ensure that any data transmitted between your browser and our servers is encrypted.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Children's Privacy</h2>
          <p>
            Our services are available to users of all ages. We do not knowingly collect any personal information from anyone,
            including children under 13.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes will be reflected on this page with an updated revision date.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please visit our <a href="/contact" className="text-blue-600 hover:underline">contact page</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
