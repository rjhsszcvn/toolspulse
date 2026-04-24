import { siteConfig } from "@/config/site";
import { tools, categories } from "@/config/tools";

export const metadata = {
  title: "About",
  alternates: {
    canonical: `${siteConfig.url}/about`,
  },
  description: `About ${siteConfig.name} — free online tools for PDF, image, audio, and text processing. Built with privacy first.`,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">About {siteConfig.name}</h1>
      <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
        <p className="text-base text-gray-700">
          {siteConfig.name} is a collection of {tools.length}+ free online tools built for everyday tasks — from converting PDFs
          and compressing images to generating QR codes and trimming audio. Every tool runs entirely in your browser, which means
          your files never leave your device.
        </p>
        <h2 className="text-xl font-semibold text-gray-900 mt-10">Our Mission</h2>
        <p>
          We believe simple online tools should be free, private, and accessible to everyone. Too many tool websites upload your
          files to their servers, require signups, slap on watermarks, or hide features behind paywalls. We built {siteConfig.name} to
          be different — no uploads, no accounts, no limits.
        </p>
        <h2 className="text-xl font-semibold text-gray-900 mt-10">How It Works</h2>
        <p>
          Every tool on {siteConfig.name} uses modern browser technologies like the Canvas API, Web Audio API, and WebAssembly to
          process your files directly on your device. This approach has three major advantages: your data stays completely private,
          processing is instant (no upload/download wait times), and the tools work even with slow internet connections.
        </p>
        <h2 className="text-xl font-semibold text-gray-900 mt-10">What We Offer</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
          {Object.entries(categories).map(([key, cat]) => {
            const count = tools.filter((t) => t.category === key).length;
            if (count === 0) return null;
            return (
              <div key={key} className="rounded-xl border border-gray-200 bg-white p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{count}</p>
                <p className="text-xs text-gray-500 mt-1">{cat.label}</p>
              </div>
            );
          })}
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mt-10">Privacy First</h2>
        <p>
          We take privacy seriously. Unlike most online tool websites, {siteConfig.name} processes all files locally in your browser.
          We do not upload, store, or transmit your files to any server. We cannot see your data even if we wanted to. Read our
          full <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a> for more details.
        </p>
        <h2 className="text-xl font-semibold text-gray-900 mt-10">Always Improving</h2>
        <p>
          We add new tools regularly based on what users need most. If you have a suggestion for a tool you would like to see,
          please <a href="/contact" className="text-blue-600 hover:underline">contact us</a>. We read every message.
        </p>
        <h2 className="text-xl font-semibold text-gray-900 mt-10">Built With</h2>
        <p>
          {siteConfig.name} is built with Next.js, TypeScript, and Tailwind CSS, deployed on Vercel global edge network for
          maximum speed and reliability. The tools themselves use open-source libraries like pdf-lib, Tesseract.js, sharp, and
          the browser native APIs.
        </p>
      </div>
    </div>
  );
}
