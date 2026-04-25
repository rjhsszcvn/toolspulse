import Link from "next/link";
import { type Tool, categories, getToolBySlug } from "@/config/tools";
import ToolJsonLd from "./ToolJsonLd";
import ToolUseTracker from "./ToolUseTracker";
import BugReport from "./BugReport";
import AdBanner from "../ads/AdBanner";
import { getToolContent } from "@/config/tool-content";

const categoryIconColors: Record<string, string> = {
  pdf: "bg-red-100 text-red-600",
  image: "bg-green-100 text-green-600",
  converter: "bg-cyan-100 text-cyan-600",
  audio: "bg-orange-100 text-orange-600",
  text: "bg-yellow-100 text-yellow-600",
  developer: "bg-purple-100 text-purple-600",
  generator: "bg-blue-100 text-blue-600",
  video: "bg-rose-100 text-rose-600",
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
        <ToolUseTracker />
        <BugReport toolName={tool.name} />
      </div>

      {/* Ad - between tool and content */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-4">
        <AdBanner type="728x90" className="hidden sm:flex" />
        <AdBanner type="300x250" className="flex sm:hidden" />
      </div>

      {/* Visual Banner */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-4">
        <div className="rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 p-6 sm:p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm flex-shrink-0">
              <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold">{tool.name} runs 100% in your browser</h2>
              <p className="mt-1 text-sm text-white/80">Your files are never uploaded to any server. All processing happens locally on your device using modern browser technology. Private, fast, and free.</p>
            </div>
            <div className="hidden sm:flex gap-3 text-xs font-semibold">
              <div className="rounded-lg bg-white/20 px-3 py-2 text-center">
                <p className="text-lg font-extrabold">0</p>
                <p className="text-white/70">Uploads</p>
              </div>
              <div className="rounded-lg bg-white/20 px-3 py-2 text-center">
                <p className="text-lg font-extrabold">0</p>
                <p className="text-white/70">Stored</p>
              </div>
            </div>
          </div>
        </div>
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

            {/* Who Needs This */}
            <div className="mb-12">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Who needs {tool.name}?</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { icon: "M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5", label: "Students", desc: "Academic work and assignments" },
                  { icon: "M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0", label: "Professionals", desc: "Business and office tasks" },
                  { icon: "M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42", label: "Creatives", desc: "Design and content creation" },
                  { icon: "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z", label: "Everyone", desc: "Personal everyday tasks" },
                ].map((persona) => (
                  <div key={persona.label} className="rounded-xl border border-gray-200 bg-white p-4 text-center">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 mb-2">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d={persona.icon} /></svg>
                    </div>
                    <h3 className="text-xs font-bold text-gray-900">{persona.label}</h3>
                    <p className="text-[10px] text-gray-500 mt-0.5">{persona.desc}</p>
                  </div>
                ))}
              </div>
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

            {/* Ad - between FAQ and alternatives */}
            <div className="mb-12">
              <AdBanner type="native" />
            </div>

            {/* Ad - between FAQ and alternatives */}
            

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

            {/* Limitations - Transparency builds trust */}
            <div className="mb-12">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Good to know</h2>
              <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-5">
                <ul className="space-y-2.5">
                  <li className="flex gap-2.5 text-sm text-amber-900">
                    <svg className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>
                    <span>All processing happens in your browser. Very large files may be slower on mobile devices or older computers.</span>
                  </li>
                  <li className="flex gap-2.5 text-sm text-amber-900">
                    <svg className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>
                    <span>Results depend on the quality and format of your input. For best results, use high-quality source files.</span>
                  </li>
                  <li className="flex gap-2.5 text-sm text-amber-900">
                    <svg className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>
                    <span>Once you close the browser tab, all data is gone. Make sure to download your results before closing.</span>
                  </li>
                </ul>
              </div>
            </div>

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
            <div className="grid gap-4 sm:grid-cols-3">
              <Link href={`/tools/${tool.slug}/how-to`} className="rounded-2xl border border-gray-200 bg-white p-6 hover:border-blue-300 hover:shadow-lg hover:-translate-y-0.5 transition-all group">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600 mb-4">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" /></svg>
                </div>
                <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue-600">Full Step-by-Step Guide</h4>
                <p className="mt-2 text-xs text-gray-500 leading-relaxed">Detailed walkthrough with pro tips and best practices for getting the best results every time.</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:gap-2 transition-all">Read guide <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg></span>
              </Link>
              <Link href={`/tools/${tool.slug}/faq`} className="rounded-2xl border border-gray-200 bg-white p-6 hover:border-blue-300 hover:shadow-lg hover:-translate-y-0.5 transition-all group">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 mb-4">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" /></svg>
                </div>
                <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue-600">Frequently Asked Questions</h4>
                <p className="mt-2 text-xs text-gray-500 leading-relaxed">Every common question answered — file limits, privacy, supported formats, compatibility, and more.</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:gap-2 transition-all">View FAQ <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg></span>
              </Link>
              <Link href={`/tools/${tool.slug}/alternatives`} className="rounded-2xl border border-gray-200 bg-white p-6 hover:border-blue-300 hover:shadow-lg hover:-translate-y-0.5 transition-all group">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-600 mb-4">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>
                </div>
                <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue-600">Compare Alternatives</h4>
                <p className="mt-2 text-xs text-gray-500 leading-relaxed">See how {tool.name} stacks up against Adobe, Smallpdf, and other paid and free alternatives.</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:gap-2 transition-all">Compare now <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg></span>
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
