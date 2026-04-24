import Link from "next/link";
import { tools, categories, type ToolCategory } from "@/config/tools";
import { siteConfig } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Use ToolsePulse — Complete Guide",
  description: "Learn how to use ToolsePulse free online tools. Step-by-step guide for PDF, image, audio, developer, and AI tools. No signup, no uploads, 100% private.",
  alternates: {
    canonical: `https://toolsepulse.co/how-to-use`,
  },
};

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  pdf: { bg: "bg-red-100", text: "text-red-600", border: "border-red-200" },
  image: { bg: "bg-emerald-100", text: "text-emerald-600", border: "border-emerald-200" },
  converter: { bg: "bg-blue-100", text: "text-blue-600", border: "border-blue-200" },
  audio: { bg: "bg-orange-100", text: "text-orange-600", border: "border-orange-200" },
  text: { bg: "bg-amber-100", text: "text-amber-600", border: "border-amber-200" },
  generator: { bg: "bg-indigo-100", text: "text-indigo-600", border: "border-indigo-200" },
  developer: { bg: "bg-violet-100", text: "text-violet-600", border: "border-violet-200" },
  ai: { bg: "bg-pink-100", text: "text-pink-600", border: "border-pink-200" },
};

export default function HowToUsePage() {
  const popularTools = tools.filter((t) => t.isPopular).slice(0, 8);

  return (
    <div className="min-h-[80vh]">
      {/* Hero */}
      <div className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 mb-5 shadow-sm">
              <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>
              <span className="text-xs font-semibold text-slate-600">Complete Guide</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight">How to Use {siteConfig.name}</h1>
            <p className="mt-3 text-base text-slate-500 max-w-2xl mx-auto">
              Everything you need to know about using our {tools.length} free online tools.
              No technical knowledge required — if you can use a web browser, you can use {siteConfig.name}.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">

        {/* Quick Start */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Quick Start — 3 Simple Steps</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Find your tool",
                desc: "Browse by category or use the search bar on the homepage. Every tool is clearly labeled with what it does.",
                icon: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z",
                color: "bg-blue-100 text-blue-600",
                link: "/",
                linkText: "Browse all tools",
              },
              {
                step: "2",
                title: "Upload or enter data",
                desc: "Drag and drop your file onto the upload area, or paste text directly. No signup, no account creation — just start using it.",
                icon: "M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5",
                color: "bg-emerald-100 text-emerald-600",
                link: "/tools/pdf-to-word",
                linkText: "Try PDF to Word",
              },
              {
                step: "3",
                title: "Download results",
                desc: "Your processed file downloads instantly. Everything happened in your browser — your files were never uploaded to any server.",
                icon: "M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3",
                color: "bg-violet-100 text-violet-600",
                link: "/about",
                linkText: "Learn about privacy",
              },
            ].map((s) => (
              <div key={s.step} className="rounded-2xl border border-slate-200 bg-white p-6 relative">
                <div className="absolute -top-4 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white text-sm font-bold">{s.step}</div>
                <div className={"inline-flex h-12 w-12 items-center justify-center rounded-xl mt-2 mb-4 " + s.color}>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d={s.icon} /></svg>
                </div>
                <h3 className="text-base font-bold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                <Link href={s.link} className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800">
                  {s.linkText}
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* How Privacy Works */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">How Privacy Works on {siteConfig.name}</h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-6">
            Unlike other online tool websites that upload your files to remote servers for processing,
            {siteConfig.name} does everything differently. Here is exactly what happens when you use a tool:
          </p>

          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
            {[
              { step: "You select a file", desc: "Your browser reads the file from your device into its local memory. The file stays on your computer.", color: "bg-blue-50" },
              { step: "Browser processes it", desc: "JavaScript, WebAssembly, and browser APIs (Canvas, Web Audio, etc.) process the file entirely within your browser tab. No network requests are made.", color: "bg-white" },
              { step: "Results are generated", desc: "The processed output (converted file, compressed image, extracted text, etc.) is created in your browser's memory.", color: "bg-blue-50" },
              { step: "You download the result", desc: "The output file is saved directly from your browser to your device. At no point did any data leave your computer.", color: "bg-white" },
              { step: "You close the tab", desc: "All data is immediately erased from browser memory. There is nothing stored anywhere — no cookies, no cache, no server logs.", color: "bg-blue-50" },
            ].map((item, i) => (
              <div key={i} className={"flex gap-4 p-5 border-b border-slate-100 last:border-0 " + item.color}>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white text-xs font-bold flex-shrink-0">{i + 1}</div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{item.step}</h3>
                  <p className="mt-0.5 text-sm text-slate-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-200 p-4 flex gap-3">
            <svg className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
            <p className="text-sm text-emerald-800">
              <strong>Verify it yourself:</strong> Open your browser's Developer Tools (F12), go to the Network tab, and use any tool. You will see zero file upload requests.
            </p>
          </div>
        </div>

        {/* Category Guides */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Tools by Category</h2>
          <div className="space-y-4">
            {(Object.entries(categories) as [ToolCategory, typeof categories[ToolCategory]][]).map(([key, cat]) => {
              const color = categoryColors[key];
              const catTools = tools.filter((t) => t.category === key);
              return (
                <div key={key} className="rounded-2xl border border-slate-200 bg-white p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={"flex h-10 w-10 items-center justify-center rounded-xl " + color.bg + " " + color.text}>
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63" /></svg>
                    </div>
                    <div>
                      <Link href={"/category/" + key} className="text-base font-bold text-slate-900 hover:text-blue-600 transition-colors">{cat.label}</Link>
                      <p className="text-xs text-slate-500">{catTools.length} tools available</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                    {catTools.map((tool) => (
                      <Link key={tool.slug} href={"/tools/" + tool.slug} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all">
                        {tool.name}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Popular Tools Quick Links */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Most Popular Tools</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {popularTools.map((tool) => {
              const color = categoryColors[tool.category];
              return (
                <Link key={tool.slug} href={"/tools/" + tool.slug} className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 hover:shadow-md hover:border-slate-300 transition-all">
                  <div className={"flex h-11 w-11 items-center justify-center rounded-xl flex-shrink-0 " + color.bg + " " + color.text}>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63" /></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{tool.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{tool.shortDescription}</p>
                  </div>
                  <svg className="h-4 w-4 text-slate-300 group-hover:text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Tips for Best Results */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Tips for Best Results</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { title: "Use high-quality source files", desc: "The output quality depends on your input. Higher resolution images, text-based PDFs, and clean audio files produce the best results.", icon: "M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" },
              { title: "Use a modern browser", desc: "Chrome, Firefox, Safari, and Edge all work great. Make sure your browser is updated to the latest version for best compatibility.", icon: "M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" },
              { title: "Desktop for large files", desc: "While all tools work on mobile, processing large files (50MB+) is faster and more reliable on desktop computers with more memory.", icon: "M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" },
              { title: "Download before closing", desc: "Since everything runs in your browser, closing the tab erases all data. Always download your results before navigating away.", icon: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" },
            ].map((tip) => (
              <div key={tip.title} className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 mb-3">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d={tip.icon} /></svg>
                </div>
                <h3 className="text-sm font-bold text-slate-900">{tip.title}</h3>
                <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Common Questions</h2>
          <div className="space-y-2">
            {[
              { q: "Do I need to create an account?", a: "No. Every tool on " + siteConfig.name + " works instantly without any signup, login, or personal information. Just open a tool and start using it." },
              { q: "Is it really free? What's the catch?", a: "It's genuinely free. We support the site through minimal, non-intrusive ads. There are no premium tiers, no hidden fees, no usage limits, and no watermarks on your output." },
              { q: "Are my files safe?", a: "Yes. Your files are processed entirely in your browser using JavaScript and WebAssembly. They are never uploaded to any server. We physically cannot access your files because they never leave your device." },
              { q: "What file formats are supported?", a: "It depends on the tool. PDF tools support .pdf, .doc, .docx. Image tools support .jpg, .png, .webp, .svg, .heic. Audio tools support .mp3, .wav, .ogg, .flac. Check each tool page for specific format support." },
              { q: "Why is processing slow on my phone?", a: "All processing happens on your device's CPU. Phones have less processing power than desktop computers, so large files take longer. For files over 50MB, we recommend using a desktop browser." },
              { q: "Can I use these tools for commercial work?", a: "Yes. There are no restrictions on how you use the output from our tools. Use them for personal projects, client work, business documents, or anything else you need." },
              { q: "What browsers are supported?", a: "All modern browsers work: Chrome, Firefox, Safari, Edge, Brave, and Opera. We recommend keeping your browser updated for the best experience." },
              { q: "What if a tool doesn't work?", a: "Try refreshing the page and uploading again. If the issue persists, try a different browser. Some tools may not work with very old browsers or severely outdated devices. Contact us if you continue having problems." },
            ].map((faq, i) => (
              <details key={i} className="group rounded-xl border border-slate-200 bg-white">
                <summary className="flex cursor-pointer items-center justify-between p-4 text-sm font-semibold text-slate-900">
                  {faq.q}
                  <svg className="h-4 w-4 text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                </summary>
                <p className="px-4 pb-4 text-sm text-slate-500 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 p-8 sm:p-10 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
          <div className="relative">
            <h2 className="text-2xl font-bold">Ready to get started?</h2>
            <p className="mt-2 text-sm text-white/80 max-w-md mx-auto">
              No signup needed. Pick a tool and start working in seconds.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/" className="rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors">
                Browse All Tools
              </Link>
              <Link href="/blog" className="rounded-lg bg-white/20 border border-white/30 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/30 transition-colors">
                Read Our Blog
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
