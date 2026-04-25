"use client";

import { use } from "react";
import Link from "next/link";
import { tools, categories, type ToolCategory } from "@/config/tools";

const categoryMeta: Record<
  string,
  {
    headerBg: string;
    accent: string;
    accentDark: string;
    iconBg: string;
    badgeBg: string;
    badgeText: string;
    longDescription: string;
    howTo: { step: string; desc: string }[];
    icon: React.ReactNode;
    pattern: React.ReactNode;
  }
> = {
  pdf: {
    headerBg: "from-red-50 via-rose-50 to-orange-50",
    accent: "text-red-600",
    accentDark: "text-red-700",
    iconBg: "bg-red-100",
    badgeBg: "bg-red-50 border-red-200",
    badgeText: "text-red-700",
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
        <rect x="75%" y="8%" width="60" height="80" rx="5" fill="currentColor" opacity="0.04" transform="rotate(8)" />
        <rect x="85%" y="40%" width="40" height="55" rx="4" fill="currentColor" opacity="0.03" transform="rotate(-5)" />
      </>
    ),
  },
  image: {
    headerBg: "from-emerald-50 via-green-50 to-teal-50",
    accent: "text-emerald-600",
    accentDark: "text-emerald-700",
    iconBg: "bg-emerald-100",
    badgeBg: "bg-emerald-50 border-emerald-200",
    badgeText: "text-emerald-700",
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
        <circle cx="80%" cy="20%" r="35" fill="currentColor" opacity="0.03" />
        <circle cx="90%" cy="60%" r="20" fill="currentColor" opacity="0.02" />
      </>
    ),
  },
  converter: {
    headerBg: "from-sky-50 via-blue-50 to-cyan-50",
    accent: "text-blue-600",
    accentDark: "text-blue-700",
    iconBg: "bg-blue-100",
    badgeBg: "bg-blue-50 border-blue-200",
    badgeText: "text-blue-700",
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
        <path d="M260,25 L295,60 L260,95 L225,60 Z" fill="currentColor" opacity="0.03" />
        <line x1="70%" y1="5%" x2="95%" y2="65%" stroke="currentColor" strokeWidth="1" opacity="0.03" strokeDasharray="6 6" />
      </>
    ),
  },
  audio: {
    headerBg: "from-orange-50 via-amber-50 to-yellow-50",
    accent: "text-orange-600",
    accentDark: "text-orange-700",
    iconBg: "bg-orange-100",
    badgeBg: "bg-orange-50 border-orange-200",
    badgeText: "text-orange-700",
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
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x={`${68 + i * 4.5}%`} y={`${22 + Math.sin(i * 1.1) * 15}%`} width="4" height={`${18 + i * 5}%`} rx="2" fill="currentColor" opacity="0.04" />
        ))}
      </>
    ),
  },
  text: {
    headerBg: "from-amber-50 via-yellow-50 to-lime-50",
    accent: "text-amber-600",
    accentDark: "text-amber-700",
    iconBg: "bg-amber-100",
    badgeBg: "bg-amber-50 border-amber-200",
    badgeText: "text-amber-700",
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
        <line x1="65%" y1="22%" x2="92%" y2="22%" stroke="currentColor" strokeWidth="2" opacity="0.04" />
        <line x1="70%" y1="38%" x2="90%" y2="38%" stroke="currentColor" strokeWidth="2" opacity="0.03" />
        <line x1="67%" y1="54%" x2="85%" y2="54%" stroke="currentColor" strokeWidth="2" opacity="0.05" />
        <line x1="72%" y1="70%" x2="88%" y2="70%" stroke="currentColor" strokeWidth="2" opacity="0.03" />
      </>
    ),
  },
  generator: {
    headerBg: "from-indigo-50 via-blue-50 to-violet-50",
    accent: "text-indigo-600",
    accentDark: "text-indigo-700",
    iconBg: "bg-indigo-100",
    badgeBg: "bg-indigo-50 border-indigo-200",
    badgeText: "text-indigo-700",
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
        <polygon points="275,20 293,48 275,76 257,48" fill="currentColor" opacity="0.04" />
        <circle cx="78%" cy="30%" r="4" fill="currentColor" opacity="0.06" />
        <circle cx="88%" cy="65%" r="3" fill="currentColor" opacity="0.04" />
      </>
    ),
  },
  developer: {
    headerBg: "from-violet-50 via-purple-50 to-fuchsia-50",
    accent: "text-violet-600",
    accentDark: "text-violet-700",
    iconBg: "bg-violet-100",
    badgeBg: "bg-violet-50 border-violet-200",
    badgeText: "text-violet-700",
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
        <text x="70%" y="25%" fontFamily="monospace" fontSize="11" fill="currentColor" opacity="0.04">{"{ }"}</text>
        <text x="82%" y="52%" fontFamily="monospace" fontSize="9" fill="currentColor" opacity="0.03">{"</>"}</text>
        <rect x="72%" y="62%" width="18%" height="2" rx="1" fill="currentColor" opacity="0.04" />
      </>
    ),
  },
  video: {
    headerBg: "from-rose-50 via-red-50 to-orange-50",
    accent: "text-rose-600",
    accentDark: "text-rose-700",
    iconBg: "bg-rose-100",
    badgeBg: "bg-rose-50 border-rose-200",
    badgeText: "text-rose-700",
    longDescription:
      "Compress, convert, and transform video files directly in your browser. Extract audio from videos, create animated GIFs, and reduce file sizes — all processed locally on your device with no uploads to any server.",
    howTo: [
      { step: "Choose a video tool", desc: "Pick the tool that matches your task — compress, convert, or extract." },
      { step: "Upload your video", desc: "Drag and drop your MP4, WebM, or MOV file." },
      { step: "Download results", desc: "Get your compressed video, GIF, or audio file instantly." },
    ],
    icon: (
      <path d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" stroke="currentColor" strokeWidth="1.5" fill="none" />
    ),
    pattern: (
      <>
        <rect x="75%" y="15%" width="30" height="20" rx="3" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.05" />
        <polygon points="82%,20% 82%,30% 90%,25%" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.04" />
        <rect x="85%" y="55%" width="25" height="17" rx="3" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.04" />
      </>
    ),
  },
  ai: {
    headerBg: "from-pink-50 via-rose-50 to-fuchsia-50",
    accent: "text-pink-600",
    accentDark: "text-pink-700",
    iconBg: "bg-pink-100",
    badgeBg: "bg-pink-50 border-pink-200",
    badgeText: "text-pink-700",
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
        <circle cx="78%" cy="25%" r="22" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.05" />
        <circle cx="78%" cy="25%" r="9" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.04" />
        <circle cx="90%" cy="60%" r="15" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.04" />
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
      <div className="text-center py-20 min-h-[60vh]">
        <p className="text-slate-500">Category not found</p>
        <Link href="/" className="mt-3 inline-block text-sm text-blue-600 font-medium hover:text-blue-700">Go home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh]">
      {/* ═══ HEADER ═══ */}
      <div className={`relative overflow-hidden bg-gradient-to-br ${meta.headerBg}`}>
        <svg className={`absolute inset-0 w-full h-full pointer-events-none ${meta.accent}`} preserveAspectRatio="none">
          {meta.pattern}
        </svg>

        <div className="relative mx-auto max-w-5xl px-4 pt-8 pb-12 sm:px-6 sm:pt-12 sm:pb-16">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 mb-6 transition-colors">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            All Tools
          </Link>

          <div className="flex items-start gap-5">
            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${meta.iconBg} ${meta.accent} flex-shrink-0`}>
              <svg width="32" height="32" viewBox="0 0 24 24">{meta.icon}</svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className={`text-3xl font-extrabold ${meta.accentDark} sm:text-4xl tracking-tight`}>{category.label}</h1>
                <span className={`rounded-full ${meta.badgeBg} border px-3 py-1 text-xs font-semibold ${meta.badgeText}`}>
                  {categoryTools.length} tools
                </span>
              </div>
              <p className="mt-3 max-w-2xl text-sm text-slate-500 leading-relaxed sm:text-base">
                {meta.longDescription}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ FEATURED TOOL ═══ */}
      {featured && (
        <div className="mx-auto max-w-5xl px-4 sm:px-6 -mt-6 relative z-10">
          <Link
            href={`/tools/${featured.slug}`}
            className="group block rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-lg shadow-slate-100 hover:shadow-xl hover:border-slate-300 transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${meta.accent}`}>Featured Tool</span>
                  <svg className="h-3.5 w-3.5 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-slate-900 sm:text-2xl group-hover:text-blue-600 transition-colors">
                  {featured.name}
                </h2>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed max-w-xl">{featured.description}</p>
              </div>
              <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors flex-shrink-0">
                <svg className="h-5 w-5 text-slate-400 group-hover:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg px-3 py-1.5 border border-blue-200 group-hover:bg-blue-100 transition-colors">
                Open tool
                <svg className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </span>
              {featured.isPopular && (
                <span className="rounded bg-amber-100 border border-amber-200 px-2 py-1 text-[10px] font-bold text-amber-700 uppercase">Popular</span>
              )}
            </div>
          </Link>
        </div>
      )}

      {/* ═══ HOW IT WORKS ═══ */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 mt-14">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">How it works</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {meta.howTo.map((step, i) => (
            <div key={i} className="flex gap-4 rounded-xl border border-slate-200 bg-white p-5">
              <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${meta.iconBg} ${meta.accent} text-sm font-bold flex-shrink-0`}>
                {i + 1}
              </span>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">{step.step}</h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ ALL TOOLS ═══ */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 mt-14 pb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
            {otherTools.length > 0 ? "All tools" : "Tools"}
          </h2>
          <span className="text-xs text-slate-400">{categoryTools.length} total</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(otherTools.length > 0 ? otherTools : categoryTools).map((tool) => (
            <Link
              key={tool.id}
              href={`/tools/${tool.slug}`}
              className="group rounded-2xl border border-slate-200 bg-white p-5 hover:border-slate-300 hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-start gap-4">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${meta.iconBg} flex-shrink-0`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" className={meta.accent}>{meta.icon}</svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">{tool.name}</h3>
                    {tool.isNew && (
                      <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 uppercase flex-shrink-0">New</span>
                    )}
                    {tool.isPopular && !tool.isNew && (
                      <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-700 uppercase flex-shrink-0">Popular</span>
                    )}
                  </div>
                  <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">{tool.shortDescription}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">Free &middot; No signup</span>
                <svg className="h-4 w-4 text-slate-300 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
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
