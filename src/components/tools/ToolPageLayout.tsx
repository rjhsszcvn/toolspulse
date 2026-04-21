import Link from "next/link";
import { type Tool, categories } from "@/config/tools";
import ToolJsonLd from "./ToolJsonLd";

const categoryIconColors: Record<string, string> = {
  pdf: "bg-red-100 text-red-600",
  image: "bg-green-100 text-green-600",
  converter: "bg-cyan-100 text-cyan-600",
  audio: "bg-orange-100 text-orange-600",
  text: "bg-yellow-100 text-yellow-600",
  developer: "bg-purple-100 text-purple-600",
  generator: "bg-blue-100 text-blue-600",
  ai: "bg-pink-100 text-pink-600",
};

interface ToolPageLayoutProps {
  tool: Tool;
  children: React.ReactNode;
}

export default function ToolPageLayout({ tool, children }: ToolPageLayoutProps) {
  return (
    <div className="min-h-[80vh]">
      <ToolJsonLd tool={tool} />

      {/* Breadcrumb */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 py-3 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
            <Link href={`/#${tool.category}`} className="hover:text-gray-900 transition-colors">
              {categories[tool.category].label}
            </Link>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
            <span className="text-gray-900 font-medium">{tool.name}</span>
          </nav>
        </div>
      </div>

      {/* Tool Header */}
      <div className="mx-auto max-w-4xl px-4 pt-10 pb-6 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className={`inline-flex rounded-xl p-3 ${categoryIconColors[tool.category]} mb-4`}>
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">{tool.name}</h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">{tool.description}</p>
          <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              Free
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              No signup
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              Private
            </span>
          </div>
        </div>
      </div>

      {/* Tool Content */}
      <div className="mx-auto max-w-4xl px-4 pb-8 sm:px-6 lg:px-8">
        {children}
      </div>

      {/* SEO Content Section */}
      <div className="border-t border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
            <h2 className="text-xl font-bold text-gray-900">About {tool.name}</h2>
            <p>
              {tool.name} by ToolsePulse is a free online tool that lets you {tool.shortDescription.toLowerCase()} directly in your browser.
              Unlike other services, your files are never uploaded to any server — all processing happens locally on your device,
              ensuring complete privacy and security.
            </p>
            <h3 className="text-lg font-semibold text-gray-900">Key Features</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <svg className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                <span><strong>100% Free</strong> — No hidden fees, no premium tiers, no limits on usage.</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                <span><strong>Complete Privacy</strong> — Your files never leave your device. We cannot access your data.</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                <span><strong>No Registration</strong> — Start using the tool immediately. No account or email required.</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                <span><strong>Works Everywhere</strong> — Compatible with Chrome, Firefox, Safari, Edge on desktop and mobile.</span>
              </li>
            </ul>
            <h3 className="text-lg font-semibold text-gray-900">How It Works</h3>
            <p>
              Simply upload your file using the tool above, adjust any settings to your preference, and download the result.
              The entire process happens in your web browser using modern JavaScript APIs, which means there is no server involved
              and your data stays completely private. This also means the tool works offline once the page has loaded.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
