"use client";

import React, { useState } from "react";
import Link from "next/link";
import { tools, categories, type ToolCategory } from "@/config/tools";
import { siteConfig } from "@/config/site";

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
  ai: { bg: "bg-pink-100", text: "text-pink-600" },
};

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
              <span className="text-xs font-semibold text-slate-600">{tools.length} tools &mdash; free forever</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.08]">
              The tools you need,
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 bg-clip-text text-transparent">right in your browser.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm text-slate-500 leading-relaxed sm:text-base">
              {tools.length} professional-grade tools for PDF, image, audio, and developer tasks.
              Everything processes on your device &mdash; nothing is ever uploaded.
            </p>

            {/* Search */}
            <div className="mx-auto mt-8 max-w-lg">
              <div className="flex items-center rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <svg className="h-5 w-5 text-slate-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={"Search " + tools.length + " tools…"} className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-none" />
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
      {!search.trim() && (
        <section className="border-t border-slate-100 bg-slate-900 text-white py-12 sm:py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="grid gap-8 sm:grid-cols-2 items-center">
              <div>
                <h2 className="text-xl font-bold sm:text-2xl">Your files never leave your device.</h2>
                <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                  Every tool on {siteConfig.name} runs entirely in your browser using JavaScript, WebAssembly, and the Canvas API.
                  We don't have servers that process your files. We don't store anything. We physically cannot see your data.
                </p>
                <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                  This isn't a marketing promise — it's how the technology works. Open your browser's developer tools and watch the network tab. Zero file uploads.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: tools.length + "+", label: "Free Tools" },
                  { value: "0", label: "Files Uploaded" },
                  { value: "0", label: "Data Stored" },
                  { value: "100%", label: "Client-Side" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl bg-white/5 border border-white/10 p-4 text-center">
                    <p className="text-2xl font-extrabold text-white">{stat.value}</p>
                    <p className="mt-1 text-[10px] text-slate-400 font-medium uppercase tracking-wider">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

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