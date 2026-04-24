import Link from "next/link";
import { type Tool, categories, getToolBySlug } from "@/config/tools";
import ToolJsonLd from "./ToolJsonLd";
import { getToolContent } from "@/config/tool-content";

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
  const content = getToolContent(tool.slug);

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
            <Link href={`/category/${tool.category}`} className="hover:text-gray-900 transition-colors">
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

      {/* Rich SEO Content */}
      {content && (
        <div className="border-t border-gray-100 bg-gray-50">
          <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">

            {/* How To Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{content.howTo.title}</h2>
              <div className="space-y-4">
                {content.howTo.steps.map((step: { title: string; description: string }, i: number) => (
                  <div key={i} className="flex gap-4 rounded-xl border border-gray-200 bg-white p-5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-sm font-bold flex-shrink-0">{i + 1}</div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">{step.title}</h3>
                      <p className="mt-1 text-sm text-gray-600 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {content.howTo.tips.length > 0 && (
                <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5">
                  <h3 className="text-sm font-bold text-amber-800 mb-3">Pro Tips</h3>
                  <ul className="space-y-2">
                    {content.howTo.tips.map((tip: string, i: number) => (
                      <li key={i} className="flex gap-2 text-sm text-amber-900">
                        <span className="text-amber-500 flex-shrink-0">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Use Cases */}
            {content.useCases.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-bold text-gray-900 mb-4">When to Use {tool.name}</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {content.useCases.map((uc: { title: string; description: string }, i: number) => (
                    <div key={i} className="rounded-xl border border-gray-200 bg-white p-5">
                      <h3 className="text-sm font-bold text-gray-900">{uc.title}</h3>
                      <p className="mt-1 text-sm text-gray-600 leading-relaxed">{uc.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ Section */}
            {content.faq.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                <div className="space-y-2">
                  {content.faq.map((item: { question: string; answer: string }, i: number) => (
                    <details key={i} className="group rounded-xl border border-gray-200 bg-white">
                      <summary className="flex cursor-pointer items-center justify-between p-4 text-sm font-semibold text-gray-900">
                        {item.question}
                        <svg className="h-4 w-4 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                      </summary>
                      <p className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">{item.answer}</p>
                    </details>
                  ))}
                </div>
              </div>
            )}

            {/* Alternatives Section */}
            {content.alternatives.tools.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{tool.name} vs Alternatives</h2>
                <p className="text-sm text-gray-600 mb-4">{content.alternatives.intro}</p>
                <div className="space-y-3">
                  {content.alternatives.tools.map((alt: { name: string; description: string; differentiator: string }, i: number) => (
                    <div key={i} className="rounded-xl border border-gray-200 bg-white p-4">
                      <h3 className="text-sm font-bold text-gray-900">{alt.name}</h3>
                      <p className="text-sm text-gray-600 mt-0.5">{alt.description}</p>
                      <p className="text-xs text-gray-500 mt-2 bg-gray-50 rounded-lg p-2 border border-gray-100">
                        <span className="font-medium text-gray-700">Key difference:</span> {alt.differentiator}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-xl border-2 border-blue-200 bg-blue-50 p-5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="rounded-full bg-blue-600 px-2.5 py-0.5 text-[9px] font-bold text-white uppercase">Our advantage</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{content.alternatives.whyUs}</p>
                </div>
              </div>
            )}

            {/* Key Features */}
            <div className="mb-12">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Key Features</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-200 bg-white p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                    <h3 className="text-sm font-bold text-gray-900">100% Free</h3>
                  </div>
                  <p className="text-sm text-gray-600">No hidden fees, no premium tiers, no limits on how much you use it. Free today, free tomorrow, free forever.</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                    <h3 className="text-sm font-bold text-gray-900">Complete Privacy</h3>
                  </div>
                  <p className="text-sm text-gray-600">Your files never leave your device. Everything is processed locally in your browser — we physically cannot access your data.</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                    <h3 className="text-sm font-bold text-gray-900">No Registration</h3>
                  </div>
                  <p className="text-sm text-gray-600">Start using the tool immediately. No account, no email, no personal information required. Just open and use.</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                    <h3 className="text-sm font-bold text-gray-900">Works Everywhere</h3>
                  </div>
                  <p className="text-sm text-gray-600">Compatible with Chrome, Firefox, Safari, and Edge on desktop and mobile. Works offline once the page has loaded.</p>
                </div>
              </div>
            </div>

            {/* Deep links to subpages */}
            <div className="grid gap-3 sm:grid-cols-3">
              <Link href={`/tools/${tool.slug}/how-to`} className="rounded-xl border border-gray-200 bg-white p-5 hover:border-blue-300 hover:shadow-md transition-all group">
                <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue-600">Full Step-by-Step Guide</h4>
                <p className="mt-1 text-xs text-gray-500">Detailed walkthrough with screenshots and pro tips for getting the best results.</p>
              </Link>
              <Link href={`/tools/${tool.slug}/faq`} className="rounded-xl border border-gray-200 bg-white p-5 hover:border-blue-300 hover:shadow-md transition-all group">
                <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue-600">All FAQ</h4>
                <p className="mt-1 text-xs text-gray-500">Every common question answered — file limits, privacy, compatibility, and more.</p>
              </Link>
              <Link href={`/tools/${tool.slug}/alternatives`} className="rounded-xl border border-gray-200 bg-white p-5 hover:border-blue-300 hover:shadow-md transition-all group">
                <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue-600">Compare Alternatives</h4>
                <p className="mt-1 text-xs text-gray-500">See how {tool.name} compares to paid and free alternatives.</p>
              </Link>
            </div>

            {/* Related Tools */}
            {tool.relatedTools && tool.relatedTools.length > 0 && (
              <div className="mt-12">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Related Tools You Might Need</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {tool.relatedTools.map((slug) => {
                    const related = getToolBySlug(slug);
                    if (!related) return null;
                    return (
                      <Link key={slug} href={`/tools/${slug}`} className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 hover:border-blue-300 hover:shadow-md transition-all group">
                        <div className={"flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0 " + (categoryIconColors[related.category] || "bg-gray-100 text-gray-600")}>
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{related.name}</h3>
                          <p className="text-xs text-gray-500 truncate">{related.shortDescription}</p>
                        </div>
                        <svg className="h-4 w-4 text-gray-300 group-hover:text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
