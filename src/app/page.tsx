"use client";

import React, { useState } from "react";
import Link from "next/link";
import { tools, categories, type ToolCategory } from "@/config/tools";
import { siteConfig } from "@/config/site";

const categoryVisuals: Record<
  ToolCategory,
  {
    cardBg: string;
    textColor: string;
    subColor: string;
    iconBg: string;
    pillBg: string;
    pillText: string;
    tagline: string;
    icon: React.ReactNode;
    pattern: React.ReactNode;
  }
> = {
  pdf: {
    cardBg: "bg-gradient-to-br from-red-500 to-rose-600",
    textColor: "text-white",
    subColor: "text-white/70",
    iconBg: "bg-white/20",
    pillBg: "bg-white/20",
    pillText: "text-white",
    tagline: "Merge, compress & convert",
    icon: <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zm-5 9h8m-8 4h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />,
    pattern: (
      <>
        <rect x="72%" y="8%" width="50" height="70" rx="4" fill="white" opacity="0.06" transform="rotate(10)" />
        <rect x="82%" y="38%" width="35" height="50" rx="3" fill="white" opacity="0.04" transform="rotate(-6)" />
        <rect x="62%" y="62%" width="22" height="32" rx="2" fill="white" opacity="0.07" transform="rotate(5)" />
      </>
    ),
  },
  image: {
    cardBg: "bg-gradient-to-br from-emerald-500 to-teal-600",
    textColor: "text-white",
    subColor: "text-white/70",
    iconBg: "bg-white/20",
    pillBg: "bg-white/20",
    pillText: "text-white",
    tagline: "Resize, compress & edit",
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
        <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </>
    ),
    pattern: (
      <>
        <circle cx="78%" cy="22%" r="28" fill="white" opacity="0.06" />
        <circle cx="88%" cy="62%" r="16" fill="white" opacity="0.07" />
        <circle cx="65%" cy="74%" r="9" fill="white" opacity="0.04" />
      </>
    ),
  },
  converter: {
    cardBg: "bg-gradient-to-br from-blue-500 to-cyan-600",
    textColor: "text-white",
    subColor: "text-white/70",
    iconBg: "bg-white/20",
    pillBg: "bg-white/20",
    pillText: "text-white",
    tagline: "Any format, instantly",
    icon: <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
    pattern: (
      <>
        <path d="M220,18 L258,56 L220,94 L182,56 Z" fill="white" opacity="0.04" />
        <path d="M262,42 L282,62 L262,82 L242,62 Z" fill="white" opacity="0.06" />
      </>
    ),
  },
  audio: {
    cardBg: "bg-gradient-to-br from-orange-500 to-amber-600",
    textColor: "text-white",
    subColor: "text-white/70",
    iconBg: "bg-white/20",
    pillBg: "bg-white/20",
    pillText: "text-white",
    tagline: "Convert, trim & transform",
    icon: <path d="M9 18V5l12-2v13M9 18a3 3 0 11-6 0 3 3 0 016 0zm12-2a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="1.5" fill="none" />,
    pattern: (
      <>
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={`${64 + i * 6}%`} y={`${28 + Math.sin(i * 1.3) * 18}%`} width="4" height={`${16 + i * 7}%`} rx="2" fill="white" opacity="0.07" />
        ))}
      </>
    ),
  },
  text: {
    cardBg: "bg-gradient-to-br from-amber-500 to-yellow-600",
    textColor: "text-white",
    subColor: "text-white/70",
    iconBg: "bg-white/20",
    pillBg: "bg-white/20",
    pillText: "text-white",
    tagline: "Extract, count & process",
    icon: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M8 7h8M8 11h8M8 15h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
    pattern: (
      <>
        <line x1="62%" y1="25%" x2="92%" y2="25%" stroke="white" strokeWidth="2" opacity="0.06" />
        <line x1="66%" y1="42%" x2="88%" y2="42%" stroke="white" strokeWidth="2" opacity="0.05" />
        <line x1="64%" y1="58%" x2="84%" y2="58%" stroke="white" strokeWidth="2" opacity="0.07" />
        <line x1="68%" y1="74%" x2="86%" y2="74%" stroke="white" strokeWidth="2" opacity="0.04" />
      </>
    ),
  },
  generator: {
    cardBg: "bg-gradient-to-br from-indigo-500 to-blue-600",
    textColor: "text-white",
    subColor: "text-white/70",
    iconBg: "bg-white/20",
    pillBg: "bg-white/20",
    pillText: "text-white",
    tagline: "QR codes, invoices & more",
    icon: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round" />,
    pattern: (
      <>
        <polygon points="240,18 258,48 240,78 222,48" fill="white" opacity="0.05" />
        <polygon points="270,36 284,54 270,72 256,54" fill="white" opacity="0.04" />
        <circle cx="76%" cy="28%" r="3" fill="white" opacity="0.09" />
      </>
    ),
  },
  developer: {
    cardBg: "bg-gradient-to-br from-violet-500 to-purple-600",
    textColor: "text-white",
    subColor: "text-white/70",
    iconBg: "bg-white/20",
    pillBg: "bg-white/20",
    pillText: "text-white",
    tagline: "JSON, colors & utilities",
    icon: <path d="M8 10l-3 2 3 2m8-4l3 2-3 2m-5-8l-2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
    pattern: (
      <>
        <text x="66%" y="28%" fontFamily="monospace" fontSize="12" fill="white" opacity="0.06">{"{ }"}</text>
        <text x="78%" y="56%" fontFamily="monospace" fontSize="9" fill="white" opacity="0.05">{"</>"}</text>
        <rect x="70%" y="66%" width="20%" height="2" rx="1" fill="white" opacity="0.06" />
        <rect x="74%" y="74%" width="14%" height="2" rx="1" fill="white" opacity="0.05" />
      </>
    ),
  },
  ai: {
    cardBg: "bg-gradient-to-br from-pink-500 to-rose-600",
    textColor: "text-white",
    subColor: "text-white/70",
    iconBg: "bg-white/20",
    pillBg: "bg-white/20",
    pillText: "text-white",
    tagline: "Smart, AI-powered tools",
    icon: <path d="M9.5 15L9 18.75l-.5-3.75a4.5 4.5 0 00-3-3L2.25 12l3.25-.5a4.5 4.5 0 003-3L9 5.25l.5 3.25a4.5 4.5 0 003 3l3.25.5-3.25.5a4.5 4.5 0 00-3 3zM18 8.5l-.25 1-.25-1a3 3 0 00-2-2l-1-.25 1-.25a3 3 0 002-2L18 3l.25 1a3 3 0 002 2l1 .25-1 .25a3 3 0 00-2 2z" stroke="currentColor" strokeWidth="1.2" fill="none" />,
    pattern: (
      <>
        <circle cx="74%" cy="28%" r="20" stroke="white" strokeWidth="1" fill="none" opacity="0.07" />
        <circle cx="74%" cy="28%" r="8" stroke="white" strokeWidth="1" fill="none" opacity="0.05" />
        <circle cx="88%" cy="64%" r="14" stroke="white" strokeWidth="1" fill="none" opacity="0.06" />
        <circle cx="88%" cy="64%" r="5" fill="white" opacity="0.04" />
      </>
    ),
  },
};

/* Search-results icon bg (light) for when cards aren't colored */
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
      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: "radial-gradient(circle, #e2e8f0 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-blue-100/50 via-cyan-50/30 to-transparent rounded-full blur-[80px]" />

        <div className="relative mx-auto max-w-5xl px-4 pt-8 pb-6 sm:pt-16 sm:pb-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 mb-4 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[11px] font-medium text-slate-600">{tools.length} free tools — 100% private</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.1]">
              Free tools that run
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 bg-clip-text text-transparent">in your browser.</span>
            </h1>
            <p className="mx-auto mt-3 max-w-md text-sm text-slate-500 leading-relaxed sm:text-base sm:mt-4">
              PDF, image, audio, developer &amp; AI tools. No uploads, no signups, no limits.
            </p>

            <div className="mx-auto mt-6 max-w-lg sm:mt-8">
              <div className="flex items-center rounded-2xl border border-slate-200 bg-white px-4 py-3 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all shadow-sm">
                <svg className="h-5 w-5 text-slate-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={`Search ${tools.length} tools…`} className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-none" />
                {search ? (
                  <button onClick={() => setSearch("")} className="text-slate-400 hover:text-slate-600 ml-2"><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg></button>
                ) : (
                  <span className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white flex-shrink-0 ml-2">Search</span>
                )}
              </div>
            </div>

            {/* Quick trust strip */}
            <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-1 text-[11px] text-slate-400 font-medium sm:mt-8">
              <span className="flex items-center gap-1"><svg className="h-3.5 w-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>No file uploads</span>
              <span className="flex items-center gap-1"><svg className="h-3.5 w-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>No signup needed</span>
              <span className="flex items-center gap-1"><svg className="h-3.5 w-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>No watermarks</span>
              <span className="flex items-center gap-1"><svg className="h-3.5 w-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>100% free</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SEARCH RESULTS ═══ */}
      {search.trim() && (
        <section className="bg-slate-50 pb-10">
          <div className="mx-auto max-w-5xl px-4 pt-4 sm:px-6">
            <p className="text-sm text-slate-500 mb-4"><span className="font-semibold text-slate-800">{searchResults.length}</span> result{searchResults.length !== 1 ? "s" : ""} for &ldquo;{search}&rdquo;</p>
            {searchResults.length === 0 ? (
              <div className="text-center py-12"><p className="text-slate-500">No tools found. Try a different search.</p></div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {searchResults.map((tool) => {
                  const s = searchIconStyle[tool.category];
                  const vis = categoryVisuals[tool.category];
                  return (
                    <Link key={tool.id} href={`/tools/${tool.slug}`} className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 hover:shadow-md hover:border-slate-300 transition-all">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${s.bg} ${s.text} flex-shrink-0`}>
                        <svg width="20" height="20" viewBox="0 0 24 24">{vis.icon}</svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{tool.name}</h3>
                        <p className="text-xs text-slate-500 truncate">{tool.shortDescription}</p>
                      </div>
                      <svg className="h-4 w-4 text-slate-300 group-hover:text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ═══ CATEGORY CARDS ═══ */}
      {!search.trim() && (
        <section className="bg-slate-50/60 pb-16">
          <div className="mx-auto max-w-5xl px-4 pt-1 sm:px-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-bold text-slate-900">Browse by category</h2>
              <span className="text-xs text-slate-400">{Object.keys(categories).length} categories</span>
            </div>

            <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
              {Object.entries(categories).map(([key, cat]) => {
                const vis = categoryVisuals[key as ToolCategory];
                const catTools = tools.filter((t) => t.category === key);
                const featured = catTools.find((t) => t.isPopular) || catTools[0];
                if (catTools.length === 0) return null;

                return (
                  <Link
                    key={key}
                    href={`/category/${key}`}
                    className={`group relative overflow-hidden rounded-2xl ${vis.cardBg} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
                    style={{ minHeight: "190px" }}
                  >
                    <svg className="absolute inset-0 w-full h-full pointer-events-none text-white" preserveAspectRatio="none">{vis.pattern}</svg>

                    <div className="relative z-10 flex flex-col h-full p-4 sm:p-5">
                      <div className="flex items-start justify-between">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${vis.iconBg} backdrop-blur-sm ${vis.textColor}`}>
                          <svg width="20" height="20" viewBox="0 0 24 24">{vis.icon}</svg>
                        </div>
                        <span className={`rounded-full ${vis.pillBg} backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-bold ${vis.pillText}`}>{catTools.length}</span>
                      </div>

                      <div className="mt-auto pt-6">
                        <h2 className={`text-base font-bold ${vis.textColor} sm:text-lg tracking-tight`}>{cat.label}</h2>
                        <p className={`mt-0.5 text-xs ${vis.subColor}`}>{vis.tagline}</p>
                      </div>

                      <div className="mt-2.5 hidden sm:block">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-medium ${vis.pillText} ${vis.pillBg} backdrop-blur-sm rounded-md px-2 py-1`}>
                          <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>
                          {featured.name}
                        </span>
                      </div>

                      <div className="absolute bottom-4 right-4 flex h-7 w-7 items-center justify-center rounded-full bg-white/20 opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-200">
                        <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══ POPULAR TOOLS ═══ */}
      {!search.trim() && (
        <section className="bg-white py-14">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h2 className="text-base font-bold text-slate-900 mb-6">Most popular tools</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {tools.filter(t => t.isPopular).slice(0, 6).map((tool) => {
                const s = searchIconStyle[tool.category];
                const vis = categoryVisuals[tool.category];
                return (
                  <Link key={tool.id} href={`/tools/${tool.slug}`} className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 hover:shadow-md hover:border-slate-300 transition-all">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.bg} ${s.text} flex-shrink-0`}>
                      <svg width="20" height="20" viewBox="0 0 24 24">{vis.icon}</svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{tool.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{tool.shortDescription}</p>
                    </div>
                    <svg className="h-4 w-4 text-slate-300 group-hover:text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══ STATS ═══ */}
      {!search.trim() && (
        <section className="bg-slate-900">
          <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 text-center">
              {[
                { value: `${tools.length}+`, label: "Online Tools" },
                { value: "0", label: "Files Uploaded" },
                { value: "100%", label: "Free Forever" },
                { value: "24/7", label: "Available" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-extrabold text-white sm:text-3xl">{stat.value}</p>
                  <p className="mt-1 text-[10px] text-slate-400 font-medium uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ ALL TOOLS ═══ */}
      {!search.trim() && (
        <section id="all-tools" className="bg-slate-50">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
            <h2 className="text-base font-bold text-slate-900 mb-6">All {tools.length} tools</h2>
            <div className="grid gap-px bg-slate-200 rounded-2xl overflow-hidden sm:grid-cols-2 lg:grid-cols-3">
              {tools.sort((a, b) => a.name.localeCompare(b.name)).map((tool) => {
                const s = searchIconStyle[tool.category];
                const vis = categoryVisuals[tool.category];
                return (
                  <Link key={tool.id} href={`/tools/${tool.slug}`} className="flex items-center gap-3 bg-white p-3.5 hover:bg-blue-50/50 transition-colors group">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${s.bg} ${s.text} flex-shrink-0`}>
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

      {/* ═══ WHY ═══ */}
      {!search.trim() && (
        <section className="bg-white py-14">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h2 className="text-base font-bold text-slate-900 mb-8 text-center">Why {siteConfig.name}?</h2>
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
              {[
                { icon: "🔒", title: "Total Privacy", desc: "Files never leave your device.", bg: "bg-emerald-50 border-emerald-200/60" },
                { icon: "⚡", title: "Instant Results", desc: "No uploads. No waiting.", bg: "bg-blue-50 border-blue-200/60" },
                { icon: "🎯", title: "No Signup", desc: "Just open and use.", bg: "bg-amber-50 border-amber-200/60" },
                { icon: "♾️", title: "Unlimited", desc: "No caps. No watermarks.", bg: "bg-violet-50 border-violet-200/60" },
              ].map((f) => (
                <div key={f.title} className={`rounded-xl ${f.bg} border p-5 text-center`}>
                  <span className="text-2xl">{f.icon}</span>
                  <h3 className="mt-2 font-semibold text-slate-900 text-xs sm:text-sm">{f.title}</h3>
                  <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ FAQ ═══ */}
      {!search.trim() && (
        <section className="border-t border-slate-200 bg-slate-50 pb-16">
          <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
            <h2 className="text-base font-bold text-slate-900 mb-6 text-center">FAQ</h2>
            <div className="space-y-2">
              {[
                { q: "Is it really free?", a: "Yes, completely free. No hidden fees, no premium tiers, no paywalls." },
                { q: "Are my files private?", a: "All processing happens in your browser. Files never leave your device — we never see them." },
                { q: "Do I need an account?", a: "No. Every tool works instantly without any signup or registration." },
                { q: "Works on mobile?", a: "Yes. All tools are fully responsive and work across all devices and browsers." },
              ].map((faq, i) => (
                <details key={i} className="group rounded-xl border border-slate-200 bg-white">
                  <summary className="flex cursor-pointer items-center justify-between p-4 text-sm font-medium text-slate-900">{faq.q}<svg className="h-4 w-4 text-slate-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg></summary>
                  <p className="px-4 pb-4 text-xs text-slate-500 leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
