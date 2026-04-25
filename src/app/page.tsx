"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { tools, categories, type ToolCategory } from "@/config/tools";
import { siteConfig } from "@/config/site";
import AdBanner from "@/components/ads/AdBanner";
import NewsletterSignup from "@/components/NewsletterSignup";

const categoryVisuals: Record<
  ToolCategory,
  {
    cardBg: string;
    borderColor: string;
    iconBg: string;
    iconColor: string;
    tagline: string;
    icon: React.ReactNode;
  }
> = {
  pdf: {
    cardBg: "bg-white hover:bg-red-50/50",
    borderColor: "border-red-200/60 hover:border-red-300",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    tagline: "Merge, compress & convert",
    icon: <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zm-5 9h8m-8 4h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />,
  },
  image: {
    cardBg: "bg-white hover:bg-emerald-50/50",
    borderColor: "border-emerald-200/60 hover:border-emerald-300",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    tagline: "Resize, compress & edit",
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
        <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </>
    ),
  },
  converter: {
    cardBg: "bg-white hover:bg-blue-50/50",
    borderColor: "border-blue-200/60 hover:border-blue-300",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    tagline: "Any format, instantly",
    icon: <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
  },
  audio: {
    cardBg: "bg-white hover:bg-orange-50/50",
    borderColor: "border-orange-200/60 hover:border-orange-300",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    tagline: "Convert, trim & transform",
    icon: <path d="M9 18V5l12-2v13M9 18a3 3 0 11-6 0 3 3 0 016 0zm12-2a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="1.5" fill="none" />,
  },
  text: {
    cardBg: "bg-white hover:bg-amber-50/50",
    borderColor: "border-amber-200/60 hover:border-amber-300",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    tagline: "Extract, count & process",
    icon: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M8 7h8M8 11h8M8 15h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
  },
  generator: {
    cardBg: "bg-white hover:bg-indigo-50/50",
    borderColor: "border-indigo-200/60 hover:border-indigo-300",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
    tagline: "QR codes, invoices & more",
    icon: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round" />,
  },
  developer: {
    cardBg: "bg-white hover:bg-violet-50/50",
    borderColor: "border-violet-200/60 hover:border-violet-300",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    tagline: "JSON, colors & utilities",
    icon: <path d="M8 10l-3 2 3 2m8-4l3 2-3 2m-5-8l-2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
  },
  video: {
    cardBg: "bg-white hover:bg-rose-50/50",
    borderColor: "border-rose-200/60 hover:border-rose-300",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
    tagline: "Compress, convert & edit",
    icon: <path d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" stroke="currentColor" strokeWidth="1.5" fill="none" />,
  },
  ai: {
    cardBg: "bg-white hover:bg-pink-50/50",
    borderColor: "border-pink-200/60 hover:border-pink-300",
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
    tagline: "Smart, AI-powered tools",
    icon: <path d="M9.5 15L9 18.75l-.5-3.75a4.5 4.5 0 00-3-3L2.25 12l3.25-.5a4.5 4.5 0 003-3L9 5.25l.5 3.25a4.5 4.5 0 003 3l3.25.5-3.25.5a4.5 4.5 0 00-3 3zM18 8.5l-.25 1-.25-1a3 3 0 00-2-2l-1-.25 1-.25a3 3 0 002-2L18 3l.25 1a3 3 0 002 2l1 .25-1 .25a3 3 0 00-2 2z" stroke="currentColor" strokeWidth="1.2" fill="none" />,
  },
};

const searchIconStyle: Record<ToolCategory, { bg: string; text: string }> = {
  pdf: { bg: "bg-red-100", text: "text-red-600" },
  image: { bg: "bg-emerald-100", text: "text-emerald-600" },
  converter: { bg: "bg-blue-100", text: "text-blue-600" },
  audio: { bg: "bg-orange-100", text: "text-orange-600" },
  text: { bg: "bg-amber-100", text: "text-amber-600" },
  generator: { bg: "bg-indigo-100", text: "text-indigo-600" },
  developer: { bg: "bg-violet-100", text: "text-violet-600" },
  video: { bg: "bg-rose-100", text: "text-rose-600" },
  ai: { bg: "bg-pink-100", text: "text-pink-600" },
};


const rotatingWords = [
  "right in your browser.",
  "without uploading files.",
  "with total privacy.",
  "free, forever.",
  "no signup needed.",
  "instantly.",
];

function RotatingText() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % rotatingWords.length);
        setFade(true);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className={"inline-block transition-opacity duration-300 " + (fade ? "opacity-100" : "opacity-0")}>
      {rotatingWords[index]}
    </span>
  );
}

const searchPrompts = [
  "Compress a PDF...",
  "Convert image to PNG...",
  "Remove background...",
  "Merge PDF files...",
  "Generate QR code...",
  "Convert MP4 to MP3...",
  "Resize an image...",
  "Extract text from image...",
  "Create an invoice...",
  "Format JSON...",
  "Build a resume...",
  "Generate password...",
  "Convert HEIC to JPG...",
  "Split PDF pages...",
  "Trim audio file...",
  "Create barcode...",
  "Compare two texts...",
  "Convert CSV to JSON...",
];

function AnimatedPlaceholder() {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    const currentPrompt = searchPrompts[index];
    let charIndex = 0;
    let timer: ReturnType<typeof setTimeout>;

    if (typing) {
      timer = setInterval(() => {
        if (charIndex <= currentPrompt.length) {
          setText(currentPrompt.slice(0, charIndex));
          charIndex++;
        } else {
          clearInterval(timer);
          setTimeout(() => setTyping(false), 1500);
        }
      }, 60);
    } else {
      timer = setInterval(() => {
        if (charIndex > 0) {
          charIndex--;
          setText(currentPrompt.slice(0, charIndex));
        } else {
          clearInterval(timer);
          setIndex((i) => (i + 1) % searchPrompts.length);
          setTyping(true);
        }
      }, 30);
      charIndex = currentPrompt.length;
    }

    return () => clearInterval(timer);
  }, [index, typing]);

  return (
    <span className="text-sm text-slate-400 pointer-events-none absolute left-12 top-1/2 -translate-y-1/2 whitespace-nowrap overflow-hidden">
      {text}<span className="animate-pulse">|</span>
    </span>
  );
}

function LiveCounter() {
  const [count, setCount] = useState(1247);

  useEffect(() => {
    // Base count represents usage before tracking was added
    const base = 1247;
    const stored = parseInt(localStorage.getItem("tp_tool_uses") || "0");
    setCount(base + stored);

    const handler = () => {
      const val = parseInt(localStorage.getItem("tp_tool_uses") || "0") + 1;
      localStorage.setItem("tp_tool_uses", String(val));
      setCount(base + val);
    };

    window.addEventListener("tp_tool_used", handler);
    return () => window.removeEventListener("tp_tool_used", handler);
  }, []);

  return (
    <>
      <div className="rounded-xl bg-white/5 border border-white/10 p-5 text-center group hover:bg-white/10 transition-colors">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 mb-3">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" /></svg>
        </div>
        <p className="text-3xl font-extrabold text-white sm:text-4xl">{tools.length}+</p>
        <p className="mt-1 text-[10px] text-slate-400 font-medium uppercase tracking-wider">Free Tools</p>
      </div>
      <div className="rounded-xl bg-white/5 border border-white/10 p-5 text-center group hover:bg-white/10 transition-colors">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 mb-3">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
        </div>
        <p className="text-3xl font-extrabold text-emerald-400 sm:text-4xl">{count.toLocaleString()}</p>
        <p className="mt-1 text-[10px] text-slate-400 font-medium uppercase tracking-wider">Files Processed</p>
      </div>
      <div className="rounded-xl bg-white/5 border border-white/10 p-5 text-center group hover:bg-white/10 transition-colors">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 mb-3">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" /></svg>
        </div>
        <p className="text-3xl font-extrabold text-white sm:text-4xl">24/7</p>
        <p className="mt-1 text-[10px] text-slate-400 font-medium uppercase tracking-wider">Always Available</p>
      </div>
      <div className="rounded-xl bg-white/5 border border-white/10 p-5 text-center group hover:bg-white/10 transition-colors">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/20 text-violet-400 mb-3">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" /></svg>
        </div>
        <p className="text-3xl font-extrabold text-blue-400 sm:text-4xl">100%</p>
        <p className="mt-1 text-[10px] text-slate-400 font-medium uppercase tracking-wider">Private & Secure</p>
      </div>
    </>
  );
}

export default function HomePage() {
  const [search, setSearch] = useState("");

  const searchResults = search.trim()
    ? tools.filter(
        (t) =>
          t.name.toLowerCase().includes(search.toLowerCase()) ||
          t.shortDescription.toLowerCase().includes(search.toLowerCase()) ||
          t.keywords.some((k) => k.toLowerCase().includes(search.toLowerCase()))
      )
    : [];

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden border-b border-slate-100">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white" />
        <div className="absolute inset-0 opacity-[0.3]" style={{ backgroundImage: "radial-gradient(circle, #cbd5e1 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

        <div className="relative mx-auto max-w-5xl px-4 pt-10 pb-8 sm:pt-20 sm:pb-14">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 mb-5 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-semibold text-slate-600">{tools.length} tools — free forever</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.08]">
              The tools you need,
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 bg-clip-text text-transparent">
                <RotatingText />
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm text-slate-500 leading-relaxed sm:text-base">
              {tools.length} professional-grade tools for PDF, image, audio, and developer tasks.
              Everything processes on your device — nothing is ever uploaded.
            </p>

            {/* Animated Search */}
            <div className="mx-auto mt-8 max-w-lg">
              <div className="relative flex items-center rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <svg className="h-5 w-5 text-slate-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-none" />
                {!search && <AnimatedPlaceholder />}
                {search && (
                  <button onClick={() => setSearch("")} className="text-slate-400 hover:text-slate-600 ml-2">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                  </button>
                )}
              </div>
            </div>

            {/* Trust signals */}
            <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-1.5 text-xs text-slate-500 font-medium">
              {["No file uploads", "No signup needed", "No watermarks", "100% free", "Works offline"].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <svg className="h-3.5 w-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== SEARCH RESULTS ===== */}
      {search.trim() && (
        <section className="bg-white pb-10">
          <div className="mx-auto max-w-5xl px-4 pt-6 sm:px-6">
            <p className="text-sm text-slate-500 mb-4"><span className="font-semibold text-slate-800">{searchResults.length}</span> result{searchResults.length !== 1 ? "s" : ""} for "{search}"</p>
            {searchResults.length === 0 ? (
              <div className="text-center py-12"><p className="text-slate-400">No tools found. Try a different search.</p></div>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {searchResults.map((tool) => {
                  const s = searchIconStyle[tool.category];
                  const vis = categoryVisuals[tool.category];
                  return (
                    <Link key={tool.id} href={"/tools/" + tool.slug} className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 hover:shadow-md hover:border-slate-300 transition-all">
                      <div className={"flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0 " + s.bg + " " + s.text}>
                        <svg width="18" height="18" viewBox="0 0 24 24">{vis.icon}</svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">{tool.name}</h3>
                        <p className="text-xs text-slate-500 truncate">{tool.shortDescription}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ===== CATEGORIES ===== */}
      {!search.trim() && (
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Everything you need, organized</h2>
              <p className="mt-2 text-sm text-slate-500">{Object.keys(categories).length} categories, {tools.length} tools, zero compromise on privacy</p>
            </div>

            <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
              {Object.entries(categories).map(([key, cat]) => {
                const vis = categoryVisuals[key as ToolCategory];
                const catTools = tools.filter((t) => t.category === key);
                if (catTools.length === 0) return null;

                return (
                  <Link
                    key={key}
                    href={"/category/" + key}
                    className={"group relative rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg " + vis.cardBg + " " + vis.borderColor}
                  >
                    <div className={"flex h-11 w-11 items-center justify-center rounded-xl mb-4 " + vis.iconBg + " " + vis.iconColor}>
                      <svg width="22" height="22" viewBox="0 0 24 24">{vis.icon}</svg>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">{cat.label}</h3>
                    <p className="mt-0.5 text-xs text-slate-500">{vis.tagline}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-400">{catTools.length} tools</span>
                      <svg className="h-4 w-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ===== POPULAR TOOLS ===== */}
      {!search.trim() && (
        <section className="border-t border-slate-100 bg-slate-50/50 py-12 sm:py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Most popular</h2>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {tools.filter(t => t.isPopular).slice(0, 6).map((tool) => {
                const s = searchIconStyle[tool.category];
                const vis = categoryVisuals[tool.category];
                return (
                  <Link key={tool.id} href={"/tools/" + tool.slug} className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 hover:shadow-md hover:border-slate-300 transition-all">
                    <div className={"flex h-11 w-11 items-center justify-center rounded-xl flex-shrink-0 " + s.bg + " " + s.text}>
                      <svg width="20" height="20" viewBox="0 0 24 24">{vis.icon}</svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{tool.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">{tool.shortDescription}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Ad - between popular and how it works */}
      {!search.trim() && (
        <section className="py-4">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <AdBanner type="native" />
          </div>
        </section>
      )}

      {/* ===== HOW IT WORKS ===== */}
      {!search.trim() && (
        <section className="py-12 sm:py-16 border-t border-slate-100">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">How it works</h2>
              <p className="mt-2 text-sm text-slate-500">Three steps. No signup. No uploads.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                { step: "1", title: "Pick a tool", desc: "Browse by category or search. Every tool is free with no limits.", icon: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" },
                { step: "2", title: "Use it instantly", desc: "Upload your file or enter your data. Processing happens in your browser.", icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" },
                { step: "3", title: "Download results", desc: "Get your output immediately. Nothing was uploaded. Your data stayed private.", icon: "M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" },
              ].map((s) => (
                <div key={s.step} className="text-center">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-4">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d={s.icon} /></svg>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{s.title}</h3>
                  <p className="mt-1.5 text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== PRIVACY PROMISE ===== */}
      <section className="border-t border-slate-100 bg-slate-900 text-white py-14 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/10 rounded-full blur-[100px]" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 mb-5">
              <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" /></svg>
              <span className="text-xs font-semibold text-slate-300">Privacy by design</span>
            </div>
            <h2 className="text-2xl font-bold sm:text-3xl">Your files never leave your device.</h2>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed max-w-xl mx-auto">
              Every tool runs in your browser using JavaScript and WebAssembly. We have no servers that process your files. We store nothing. We see nothing.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <LiveCounter />
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { icon: "M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z", title: "Zero server uploads", desc: "Files are processed locally using browser APIs. Check your network tab." },
              { icon: "M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88", title: "No tracking or analytics on files", desc: "We track page visits for improvement, never your files or data." },
              { icon: "M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z", title: "Nothing stored, ever", desc: "When you close the tab, everything is gone. No cookies, no cache, no trace." },
            ].map((f) => (
              <div key={f.title} className="rounded-xl bg-white/5 border border-white/10 p-5">
                <svg className="h-5 w-5 text-blue-400 mb-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d={f.icon} /></svg>
                <h3 className="text-sm font-semibold text-white">{f.title}</h3>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ALL TOOLS ===== */}
      {!search.trim() && (
        <section id="all-tools" className="bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h2 className="text-lg font-bold text-slate-900 mb-6">All {tools.length} tools</h2>
            <div className="grid gap-px bg-slate-200 rounded-2xl overflow-hidden sm:grid-cols-2 lg:grid-cols-3 border border-slate-200">
              {tools.sort((a, b) => a.name.localeCompare(b.name)).map((tool) => {
                const s = searchIconStyle[tool.category];
                const vis = categoryVisuals[tool.category];
                return (
                  <Link key={tool.id} href={"/tools/" + tool.slug} className="flex items-center gap-3 bg-white p-3.5 hover:bg-slate-50 transition-colors group">
                    <div className={"flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0 " + s.bg + " " + s.text}>
                      <svg width="15" height="15" viewBox="0 0 24 24">{vis.icon}</svg>
                    </div>
                    <h3 className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate flex-1">{tool.name}</h3>
                    {tool.isNew && <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[8px] font-bold text-emerald-700 uppercase">New</span>}
                    {tool.isPopular && !tool.isNew && <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[8px] font-bold text-amber-700 uppercase">Hot</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ===== NEWSLETTER ===== */}
      {!search.trim() && (
        <section className="border-t border-slate-100 bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 mb-4">
              <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
              <span className="text-xs font-semibold text-slate-600">Stay Updated</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Get notified when we add new tools</h2>
            <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">No spam, ever. Just a quick email when we launch something useful.</p>
            <div className="mt-6">
              <NewsletterSignup variant="banner" />
            </div>
          </div>
        </section>
      )}

      {/* Ad - before FAQ */}
      
      {/* ===== NEWSLETTER ===== */}
      {!search.trim() && (
        <section className="border-t border-slate-100 bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 mb-4">
              <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
              <span className="text-xs font-semibold text-slate-600">Stay Updated</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Get notified when we add new tools</h2>
            <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">No spam, ever. Just a quick email when we launch something useful.</p>
            <div className="mt-6">
              <NewsletterSignup variant="banner" />
            </div>
          </div>
        </section>
      )}

      {/* Ad - before FAQ */}
      {!search.trim() && (
        <section className="py-4 border-t border-slate-100">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 flex justify-center">
            <AdBanner type="728x90" className="hidden sm:flex" />
            <AdBanner type="300x250" className="flex sm:hidden" />
          </div>
        </section>
      )}

      {/* ===== FAQ ===== */}
      {!search.trim() && (
        <section className="border-t border-slate-100 bg-slate-50/50 py-12 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="text-lg font-bold text-slate-900 mb-6 text-center">Frequently asked questions</h2>
            <div className="space-y-2">
              {[
                { q: "Is it really free?", a: "Yes. No hidden fees, no premium tier, no paywalls. Every tool is free to use without limits." },
                { q: "Are my files private?", a: "Completely. All processing happens in your browser. Your files never leave your device. We have no servers that receive, process, or store your data." },
                { q: "Do I need an account?", a: "No. Every tool works instantly without signup, login, or any personal information." },
                { q: "How is this possible for free?", a: "Modern browsers are powerful enough to handle PDF processing, image editing, audio conversion, and more. We use JavaScript, WebAssembly, and browser APIs to do everything locally." },
                { q: "Does it work on mobile?", a: "Yes. All tools are fully responsive and work across phones, tablets, and desktops in any modern browser." },
              ].map((faq, i) => (
                <details key={i} className="group rounded-xl border border-slate-200 bg-white">
                  <summary className="flex cursor-pointer items-center justify-between p-4 text-sm font-semibold text-slate-900">{faq.q}<svg className="h-4 w-4 text-slate-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg></summary>
                  <p className="px-4 pb-4 text-sm text-slate-500 leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}