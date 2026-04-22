"use client";

import { use } from "react";
import Link from "next/link";
import { tools, categories, type ToolCategory } from "@/config/tools";

/* ────────────────────────────────────────────
   Category-specific copy & visual data
   ──────────────────────────────────────────── */
const categoryMeta: Record<
  string,
  {
    bg: string;
    accent: string;
    accentBg: string;
    accentBorder: string;
    longDescription: string;
    howTo: { step: string; desc: string }[];
    icon: React.ReactNode;
    pattern: React.ReactNode;
  }
> = {
  pdf: {
    bg: "from-rose-950 via-red-900 to-rose-800",
    accent: "text-rose-400",
    accentBg: "bg-rose-500/15",
    accentBorder: "border-rose-500/20",
    longDescription:
      "Work with PDFs without leaving your browser. Convert documents to and from PDF format, compress oversized files for easy sharing, and merge multiple PDFs into one — all processed locally on your device for complete privacy.",
    howTo: [
      { step: "Choose a tool", desc: "Pick the PDF tool that matches your task from the options below." },
      { step: "Upload your file", desc: "Drag and drop or click to select your PDF or document." },
      { step: "Download the result", desc: "Your processed file is ready instantly — no waiting, no watermarks." },
    ],
    icon: (
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zm-5 9h8m-8 4h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    ),
    pattern: (
      <>
        <rect x="75%" y="8%" width="80" height="110" rx="6" fill="white" opacity="0.03" transform="rotate(8)" />
        <rect x="85%" y="40%" width="50" height="70" rx="4" fill="white" opacity="0.02" transform="rotate(-5)" />
      </>
    ),
  },
  image: {
    bg: "from-emerald-950 via-emerald-900 to-teal-800",
    accent: "text-emerald-400",
    accentBg: "bg-emerald-500/15",
    accentBorder: "border-emerald-500/20",
    longDescription:
      "Optimize your images for the web, social media, and print. Compress without visible quality loss, resize to exact dimensions, or remove backgrounds with AI — all without uploading your photos to any server.",
    howTo: [
      { step: "Select your image", desc: "Upload any JPG, PNG, WebP, or SVG image from your device." },
      { step: "Adjust settings", desc: "Set your desired quality, dimensions, or output format." },
      { step: "Save your result", desc: "Download your optimized image instantly." },
    ],
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
        <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </>
    ),
    pattern: (
      <>
        <circle cx="80%" cy="20%" r="40" fill="white" opacity="0.03" />
        <circle cx="90%" cy="60%" r="25" fill="white" opacity="0.02" />
      </>
    ),
  },
  converter: {
    bg: "from-sky-950 via-blue-900 to-cyan-800",
    accent: "text-sky-400",
    accentBg: "bg-sky-500/15",
    accentBorder: "border-sky-500/20",
    longDescription:
      "Convert between image, document, and media formats without compatibility headaches. Whether you need to turn iPhone HEIC photos into JPGs, create PDFs from images, or switch between PNG and SVG — it all happens in your browser.",
    howTo: [
      { step: "Pick your format", desc: "Choose the converter that matches your source and target format." },
      { step: "Add your files", desc: "Drop in one or multiple files for batch conversion." },
      { step: "Convert & download", desc: "Get your converted files in seconds, ready to use." },
    ],
    icon: (
      <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    ),
    pattern: (
      <>
        <path d="M260,30 L300,80 L260,130 L220,80 Z" fill="white" opacity="0.02" />
        <line x1="70%" y1="0" x2="100%" y2="70%" stroke="white" strokeWidth="0.5" opacity="0.04" strokeDasharray="6 6" />
      </>
    ),
  },
  audio: {
    bg: "from-orange-950 via-orange-900 to-amber-800",
    accent: "text-orange-400",
    accentBg: "bg-orange-500/15",
    accentBorder: "border-orange-500/20",
    longDescription:
      "Handle all your audio tasks right in the browser. Convert between MP3, WAV, OGG and other formats, trim audio to the perfect length, and adjust quality settings — no software installation required.",
    howTo: [
      { step: "Upload audio", desc: "Drop any audio file — MP3, WAV, OGG, FLAC, AAC, and more." },
      { step: "Configure output", desc: "Choose your target format, bitrate, or trim points." },
      { step: "Export", desc: "Download your processed audio file instantly." },
    ],
    icon: (
      <path d="M9 18V5l12-2v13M9 18a3 3 0 11-6 0 3 3 0 016 0zm12-2a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="1.5" fill="none" />
    ),
    pattern: (
      <>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <rect key={i} x={`${68 + i * 4}%`} y={`${25 + Math.sin(i) * 15}%`} width="4" height={`${20 + i * 5}%`} rx="2" fill="white" opacity="0.03" />
        ))}
      </>
    ),
  },
  text: {
    bg: "from-amber-950 via-yellow-900 to-amber-800",
    accent: "text-amber-400",
    accentBg: "bg-amber-500/15",
    accentBorder: "border-amber-500/20",
    longDescription:
      "Extract text from images and screenshots using OCR, count words and characters, or process text data. Perfect for digitizing printed content, analyzing writing, and working with text across different formats.",
    howTo: [
      { step: "Input your content", desc: "Paste text or upload an image containing text." },
      { step: "Process", desc: "The tool extracts, counts, or transforms your text automatically." },
      { step: "Copy or download", desc: "Get your results instantly — copy to clipboard or save." },
    ],
    icon: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M8 7h8M8 11h8M8 15h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
    pattern: (
      <>
        <line x1="65%" y1="20%" x2="95%" y2="20%" stroke="white" strokeWidth="1.5" opacity="0.03" />
        <line x1="70%" y1="35%" x2="92%" y2="35%" stroke="white" strokeWidth="1.5" opacity="0.025" />
        <line x1="67%" y1="50%" x2="85%" y2="50%" stroke="white" strokeWidth="1.5" opacity="0.035" />
        <line x1="72%" y1="65%" x2="90%" y2="65%" stroke="white" strokeWidth="1.5" opacity="0.02" />
      </>
    ),
  },
  generator: {
    bg: "from-indigo-950 via-indigo-900 to-blue-800",
    accent: "text-indigo-400",
    accentBg: "bg-indigo-500/15",
    accentBorder: "border-indigo-500/20",
    longDescription:
      "Generate the things you need in seconds: QR codes for your links, professional invoices, polished resumes, strong passwords, and more. Every generator produces download-ready output with no signup required.",
    howTo: [
      { step: "Open the generator", desc: "Choose the generator tool for what you need to create." },
      { step: "Customize", desc: "Fill in your details and adjust settings to your preference." },
      { step: "Generate & save", desc: "Download your result as PDF, PNG, or the appropriate format." },
    ],
    icon: (
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
    ),
    pattern: (
      <>
        <polygon points="280,25 300,55 280,85 260,55" fill="white" opacity="0.03" />
        <circle cx="78%" cy="30%" r="4" fill="white" opacity="0.05" />
        <circle cx="88%" cy="65%" r="3" fill="white" opacity="0.04" />
      </>
    ),
  },
  developer: {
    bg: "from-violet-950 via-purple-900 to-violet-800",
    accent: "text-violet-400",
    accentBg: "bg-violet-500/15",
    accentBorder: "border-violet-500/20",
    longDescription:
      "Essential utilities for web developers and designers. Format and validate JSON, pick colors and generate palettes, create favicons — lightweight tools that do one job well, right in your browser tab.",
    howTo: [
      { step: "Pick your utility", desc: "Choose the developer tool that fits your current task." },
      { step: "Input your data", desc: "Paste code, upload an image, or enter your parameters." },
      { step: "Get results", desc: "Formatted output, generated assets, or validated data — instantly." },
    ],
    icon: (
      <path d="M8 10l-3 2 3 2m8-4l3 2-3 2m-5-8l-2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    ),
    pattern: (
      <>
        <text x="70%" y="25%" fontFamily="monospace" fontSize="11" fill="white" opacity="0.03">{"{ }"}</text>
        <text x="82%" y="50%" fontFamily="monospace" fontSize="9" fill="white" opacity="0.025">{"</>"}</text>
        <rect x="72%" y="60%" width="18%" height="1" fill="white" opacity="0.03" />
        <rect x="75%" y="68%" width="12%" height="1" fill="white" opacity="0.025" />
      </>
    ),
  },
  ai: {
    bg: "from-fuchsia-950 via-pink-900 to-rose-800",
    accent: "text-pink-400",
    accentBg: "bg-pink-500/15",
    accentBorder: "border-pink-500/20",
    longDescription:
      "Leverage artificial intelligence for tasks that need a smarter touch. Rewrite text with different tones, upscale blurry images to sharp clarity, or catch grammar mistakes — powered by AI models running where they can best serve you.",
    howTo: [
      { step: "Choose an AI tool", desc: "Pick the AI-powered tool that matches what you need." },
      { step: "Provide input", desc: "Upload your image or paste the text you want to process." },
      { step: "Review AI output", desc: "Get intelligent results you can refine, copy, or download." },
    ],
    icon: (
      <path d="M9.5 15L9 18.75l-.5-3.75a4.5 4.5 0 00-3-3L2.25 12l3.25-.5a4.5 4.5 0 003-3L9 5.25l.5 3.25a4.5 4.5 0 003 3l3.25.5-3.25.5a4.5 4.5 0 00-3 3zM18 8.5l-.25 1-.25-1a3 3 0 00-2-2l-1-.25 1-.25a3 3 0 002-2L18 3l.25 1a3 3 0 002 2l1 .25-1 .25a3 3 0 00-2 2z" stroke="currentColor" strokeWidth="1.2" fill="none" />
    ),
    pattern: (
      <>
        <circle cx="78%" cy="25%" r="25" stroke="white" strokeWidth="0.5" fill="none" opacity="0.04" />
        <circle cx="78%" cy="25%" r="10" stroke="white" strokeWidth="0.5" fill="none" opacity="0.03" />
        <circle cx="90%" cy="60%" r="18" stroke="white" strokeWidth="0.5" fill="none" opacity="0.03" />
      </>
    ),
  },
};

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const category = categories[slug as ToolCategory];
  const meta = categoryMeta[slug];
  const categoryTools = tools.filter((t) => t.category === slug);
  const featured = categoryTools.find((t) => t.isPopular) || categoryTools[0];
  const otherTools = categoryTools.filter((t) => t.id !== featured?.id);

  if (!category || !meta) {
    return (
      <div className="text-center py-20 bg-slate-950 min-h-[60vh]">
        <p className="text-slate-400">Category not found</p>
        <Link href="/" className="mt-3 inline-block text-sm text-blue-400 font-medium hover:text-blue-300">
          Go home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-slate-950">
      {/* ═══ CATEGORY HERO ═══ */}
      <div className={`relative overflow-hidden bg-gradient-to-br ${meta.bg}`}>
        {/* Pattern */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
          {meta.pattern}
        </svg>
        {/* Noise */}
        <div className="absolute inset-0 opacity-[0.12]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.4'/%3E%3C/svg%3E\")" }} />

        <div className="relative mx-auto max-w-5xl px-4 pt-8 pb-12 sm:px-6 sm:pt-12 sm:pb-16">
          {/* Breadcrumb */}
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white/80 mb-6 transition-colors">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            All Tools
          </Link>

          <div className="flex items-start gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 flex-shrink-0">
              <svg width="32" height="32" viewBox="0 0 24 24" className="text-white">{meta.icon}</svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl font-extrabold text-white sm:text-4xl tracking-tight">{category.label}</h1>
                <span className="rounded-full bg-white/10 backdrop-blur-sm border border-white/5 px-3 py-1 text-xs font-semibold text-white/70">
                  {categoryTools.length} tools
                </span>
              </div>
              <p className="mt-3 max-w-2xl text-sm text-white/60 leading-relaxed sm:text-base">
                {meta.longDescription}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ FEATURED TOOL ═══ */}
      {featured && (
        <div className="mx-auto max-w-5xl px-4 sm:px-6 -mt-6">
          <Link
            href={`/tools/${featured.slug}`}
            className={`group block rounded-2xl border ${meta.accentBorder} ${meta.accentBg} backdrop-blur-sm p-6 sm:p-8 hover:border-opacity-40 transition-all`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${meta.accent}`}>Featured Tool</span>
                  <svg className={`h-3.5 w-3.5 ${meta.accent}`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white sm:text-2xl group-hover:text-blue-400 transition-colors">
                  {featured.name}
                </h2>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed max-w-xl">
                  {featured.description}
                </p>
              </div>
              <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors flex-shrink-0">
                <svg className="h-5 w-5 text-white/60 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-400 bg-blue-500/10 rounded-lg px-3 py-1.5 border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                Open tool
                <svg className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </span>
              {featured.isPopular && (
                <span className="rounded bg-amber-500/10 border border-amber-500/20 px-2 py-1 text-[10px] font-bold text-amber-400 uppercase">
                  Popular
                </span>
              )}
            </div>
          </Link>
        </div>
      )}

      {/* ═══ HOW IT WORKS ═══ */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 mt-14">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">How it works</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {meta.howTo.map((step, i) => (
            <div key={i} className="flex gap-4 rounded-xl border border-slate-800 bg-slate-900/50 p-5">
              <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${meta.accentBg} ${meta.accent} text-sm font-bold flex-shrink-0`}>
                {i + 1}
              </span>
              <div>
                <h3 className="text-sm font-semibold text-white">{step.step}</h3>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ ALL TOOLS IN CATEGORY ═══ */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 mt-14 pb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">
            {otherTools.length > 0 ? "All tools" : "Tools"}
          </h2>
          <span className="text-xs text-slate-600">{categoryTools.length} total</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(otherTools.length > 0 ? otherTools : categoryTools).map((tool) => (
            <Link
              key={tool.id}
              href={`/tools/${tool.slug}`}
              className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-5 hover:border-slate-700 hover:bg-slate-800/60 transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-start gap-4">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${meta.accentBg} flex-shrink-0`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" className={meta.accent}>
                    {meta.icon}
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors truncate">
                      {tool.name}
                    </h3>
                    {tool.isNew && (
                      <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold text-emerald-400 uppercase flex-shrink-0">
                        New
                      </span>
                    )}
                    {tool.isPopular && !tool.isNew && (
                      <span className="rounded bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 text-[9px] font-bold text-amber-400 uppercase flex-shrink-0">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">{tool.shortDescription}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[11px] text-slate-600 font-medium">Free &middot; No signup</span>
                <svg className="h-4 w-4 text-slate-700 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
