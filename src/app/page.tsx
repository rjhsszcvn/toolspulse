"use client";

import React, { useState } from "react";
import Link from "next/link";
import { tools, categories, type ToolCategory } from "@/config/tools";
import { siteConfig } from "@/config/site";

/* ────────────────────────────────────────────
   Each category gets a unique decorative SVG
   pattern, color palette, and personality.
   ──────────────────────────────────────────── */
const categoryVisuals: Record<
  ToolCategory,
  {
    bg: string;
    accent: string;
    accentLight: string;
    tagline: string;
    icon: React.ReactNode;
    pattern: React.ReactNode;
  }
> = {
  pdf: {
    bg: "bg-gradient-to-br from-rose-950 via-red-900 to-rose-800",
    accent: "text-rose-400",
    accentLight: "bg-rose-500/20",
    tagline: "Merge, compress & convert",
    icon: (
      <path
        d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zm-5 9h8m-8 4h5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    ),
    pattern: (
      <>
        <rect x="70%" y="10%" width="60" height="80" rx="4" fill="white" opacity="0.04" transform="rotate(12 220 40)" />
        <rect x="80%" y="30%" width="40" height="55" rx="3" fill="white" opacity="0.03" transform="rotate(-8 260 70)" />
        <rect x="60%" y="60%" width="30" height="40" rx="2" fill="white" opacity="0.05" transform="rotate(6 200 120)" />
        <line x1="65%" y1="0" x2="95%" y2="100%" stroke="white" strokeWidth="0.5" opacity="0.06" />
      </>
    ),
  },
  image: {
    bg: "bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-800",
    accent: "text-emerald-400",
    accentLight: "bg-emerald-500/20",
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
        <circle cx="78%" cy="25%" r="30" fill="white" opacity="0.04" />
        <circle cx="85%" cy="65%" r="18" fill="white" opacity="0.05" />
        <circle cx="65%" cy="75%" r="10" fill="white" opacity="0.03" />
        <path d="M200,20 Q240,80 280,40" stroke="white" strokeWidth="1" fill="none" opacity="0.06" />
      </>
    ),
  },
  converter: {
    bg: "bg-gradient-to-br from-sky-950 via-blue-900 to-cyan-800",
    accent: "text-sky-400",
    accentLight: "bg-sky-500/20",
    tagline: "Any format, instantly",
    icon: (
      <path
        d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    ),
    pattern: (
      <>
        <path d="M220,20 L260,60 L220,100 L180,60 Z" fill="white" opacity="0.03" />
        <path d="M260,50 L280,70 L260,90 L240,70 Z" fill="white" opacity="0.05" />
        <line x1="60%" y1="0" x2="100%" y2="80%" stroke="white" strokeWidth="0.5" opacity="0.06" strokeDasharray="4 4" />
      </>
    ),
  },
  audio: {
    bg: "bg-gradient-to-br from-orange-950 via-orange-900 to-amber-800",
    accent: "text-orange-400",
    accentLight: "bg-orange-500/20",
    tagline: "Convert, trim & transform",
    icon: (
      <path
        d="M9 18V5l12-2v13M9 18a3 3 0 11-6 0 3 3 0 016 0zm12-2a3 3 0 11-6 0 3 3 0 016 0z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
    ),
    pattern: (
      <>
        {[20, 35, 50, 65, 80].map((x, i) => (
          <rect key={i} x={`${60 + x * 0.4}%`} y={`${30 + Math.sin(i * 1.2) * 20}%`} width="3" height={`${18 + i * 6}%`} rx="1.5" fill="white" opacity="0.05" />
        ))}
      </>
    ),
  },
  text: {
    bg: "bg-gradient-to-br from-amber-950 via-yellow-900 to-amber-800",
    accent: "text-amber-400",
    accentLight: "bg-amber-500/20",
    tagline: "Extract, count & process",
    icon: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M8 7h8M8 11h8M8 15h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
    pattern: (
      <>
        <line x1="62%" y1="25%" x2="90%" y2="25%" stroke="white" strokeWidth="1" opacity="0.05" />
        <line x1="66%" y1="40%" x2="88%" y2="40%" stroke="white" strokeWidth="1" opacity="0.04" />
        <line x1="64%" y1="55%" x2="82%" y2="55%" stroke="white" strokeWidth="1" opacity="0.06" />
        <line x1="68%" y1="70%" x2="86%" y2="70%" stroke="white" strokeWidth="1" opacity="0.03" />
      </>
    ),
  },
  generator: {
    bg: "bg-gradient-to-br from-indigo-950 via-indigo-900 to-blue-800",
    accent: "text-indigo-400",
    accentLight: "bg-indigo-500/20",
    tagline: "QR codes, invoices & more",
    icon: (
      <path
        d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinejoin="round"
      />
    ),
    pattern: (
      <>
        <polygon points="240,20 260,50 240,80 220,50" fill="white" opacity="0.04" />
        <polygon points="270,40 285,60 270,80 255,60" fill="white" opacity="0.03" />
        <circle cx="75%" cy="30%" r="3" fill="white" opacity="0.08" />
        <circle cx="82%" cy="70%" r="2" fill="white" opacity="0.06" />
      </>
    ),
  },
  developer: {
    bg: "bg-gradient-to-br from-violet-950 via-purple-900 to-violet-800",
    accent: "text-violet-400",
    accentLight: "bg-violet-500/20",
    tagline: "JSON, colors & utilities",
    icon: (
      <path
        d="M8 10l-3 2 3 2m8-4l3 2-3 2m-5-8l-2 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    ),
    pattern: (
      <>
        <text x="65%" y="30%" fontFamily="monospace" fontSize="10" fill="white" opacity="0.04">{"{ }"}</text>
        <text x="75%" y="55%" fontFamily="monospace" fontSize="8" fill="white" opacity="0.03">{"</>"}</text>
        <rect x="70%" y="65%" width="20%" height="1" fill="white" opacity="0.05" />
        <rect x="72%" y="72%" width="15%" height="1" fill="white" opacity="0.04" />
      </>
    ),
  },
  ai: {
    bg: "bg-gradient-to-br from-fuchsia-950 via-pink-900 to-rose-800",
    accent: "text-pink-400",
    accentLight: "bg-pink-500/20",
    tagline: "Smart, AI-powered tools",
    icon: (
      <path
        d="M9.5 15L9 18.75l-.5-3.75a4.5 4.5 0 00-3-3L2.25 12l3.25-.5a4.5 4.5 0 003-3L9 5.25l.5 3.25a4.5 4.5 0 003 3l3.25.5-3.25.5a4.5 4.5 0 00-3 3zM18 8.5l-.25 1-.25-1a3 3 0 00-2-2l-1-.25 1-.25a3 3 0 002-2L18 3l.25 1a3 3 0 002 2l1 .25-1 .25a3 3 0 00-2 2z"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
      />
    ),
    pattern: (
      <>
        <circle cx="72%" cy="30%" r="20" stroke="white" strokeWidth="0.5" fill="none" opacity="0.06" />
        <circle cx="72%" cy="30%" r="8" stroke="white" strokeWidth="0.5" fill="none" opacity="0.04" />
        <circle cx="85%" cy="65%" r="14" stroke="white" strokeWidth="0.5" fill="none" opacity="0.05" />
        <circle cx="85%" cy="65%" r="5" fill="white" opacity="0.03" />
      </>
    ),
  },
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
      <section className="relative overflow-hidden bg-slate-950">
        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0z' fill='none' stroke='white' stroke-width='.5'/%3E%3C/svg%3E\")" }} />
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-500/10 rounded-full blur-[120px]" />

        <div className="relative mx-auto max-w-5xl px-4 pt-16 pb-14 sm:pt-24 sm:pb-20">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-800/50 backdrop-blur-sm px-4 py-1.5 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-medium text-slate-300">{tools.length} tools — 100% free &amp; private</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl leading-[1.1]">
              Your browser is the
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                tool you need.
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-base text-slate-400 leading-relaxed sm:text-lg">
              PDF, image, audio, developer &amp; AI tools that run entirely client&#8209;side.
              Nothing uploaded. Nothing stored.
            </p>

            {/* Search */}
            <div className="mx-auto mt-10 max-w-xl">
              <div className="relative">
                <div className="flex items-center rounded-2xl border border-slate-700/50 bg-slate-800/60 backdrop-blur-md px-5 py-3.5 focus-within:border-blue-500/60 focus-within:ring-1 focus-within:ring-blue-500/30 transition-all shadow-lg shadow-black/20">
                  <svg className="h-5 w-5 text-slate-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search 31 tools…"
                    className="w-full bg-transparent text-sm text-white placeholder-slate-500 outline-none"
                  />
                  {search ? (
                    <button onClick={() => setSearch("")} className="text-slate-500 hover:text-white ml-2 transition-colors">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                    </button>
                  ) : (
                    <kbd className="hidden sm:inline-flex items-center rounded-md border border-slate-700 bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-500 ml-2">/</kbd>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-950 to-transparent" />
      </section>

      {/* ═══ SEARCH RESULTS ═══ */}
      {search.trim() && (
        <section className="bg-slate-950 pb-12">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <p className="text-sm text-slate-500 mb-4">
              <span className="font-semibold text-white">{searchResults.length}</span> result
              {searchResults.length !== 1 ? "s" : ""} for &ldquo;{search}&rdquo;
            </p>
            {searchResults.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-slate-500">No tools found. Try a different search.</p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {searchResults.map((tool) => {
                  const vis = categoryVisuals[tool.category];
                  return (
                    <Link
                      key={tool.id}
                      href={`/tools/${tool.slug}`}
                      className="group flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/80 p-4 hover:border-slate-600 hover:bg-slate-800/80 transition-all"
                    >
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${vis.accentLight} flex-shrink-0`}>
                        <svg width="20" height="20" viewBox="0 0 24 24" className={vis.accent}>
                          {vis.icon}
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">{tool.name}</h3>
                        <p className="text-xs text-slate-500 truncate">{tool.shortDescription}</p>
                      </div>
                      <svg className="h-4 w-4 text-slate-700 group-hover:text-blue-500 flex-shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                      </svg>
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
        <section className="bg-slate-950 pb-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-bold text-white">Browse by category</h2>
              <span className="text-xs text-slate-600">{Object.keys(categories).length} categories</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(categories).map(([key, cat]) => {
                const vis = categoryVisuals[key as ToolCategory];
                const catTools = tools.filter((t) => t.category === key);
                const featured = catTools.find((t) => t.isPopular) || catTools[0];
                if (catTools.length === 0) return null;

                return (
                  <Link
                    key={key}
                    href={`/category/${key}`}
                    className={`group relative overflow-hidden rounded-2xl ${vis.bg} transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40`}
                    style={{ minHeight: "240px" }}
                  >
                    {/* Decorative pattern layer */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                      {vis.pattern}
                    </svg>

                    {/* Subtle noise texture */}
                    <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.4'/%3E%3C/svg%3E\")" }} />

                    {/* Content */}
                    <div className="relative z-10 flex flex-col h-full p-6">
                      {/* Top row: icon + tool count */}
                      <div className="flex items-start justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
                          <svg width="24" height="24" viewBox="0 0 24 24" className="text-white">{vis.icon}</svg>
                        </div>
                        <span className="rounded-full bg-black/20 backdrop-blur-sm px-3 py-1 text-[11px] font-semibold text-white/80 border border-white/5">
                          {catTools.length} tools
                        </span>
                      </div>

                      {/* Title + tagline */}
                      <div className="mt-auto pt-8">
                        <h2 className="text-xl font-bold text-white tracking-tight">{cat.label}</h2>
                        <p className="mt-1 text-sm text-white/60">{vis.tagline}</p>
                      </div>

                      {/* Featured tool pill */}
                      <div className="mt-4 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white/90 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/5">
                          <svg className="h-3 w-3 text-white/50" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                          </svg>
                          {featured.name}
                        </span>
                      </div>

                      {/* Hover arrow */}
                      <div className="absolute bottom-6 right-6 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-200">
                        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══ STATS ═══ */}
      {!search.trim() && (
        <section className="border-y border-slate-800 bg-slate-900">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
              {[
                { value: `${tools.length}+`, label: "Online Tools", accent: "text-blue-400" },
                { value: "0", label: "Files Uploaded", accent: "text-emerald-400" },
                { value: "100%", label: "Free Forever", accent: "text-amber-400" },
                { value: "24/7", label: "Available", accent: "text-violet-400" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className={`text-3xl font-extrabold ${stat.accent} sm:text-4xl`}>{stat.value}</p>
                  <p className="mt-1 text-xs text-slate-500 font-medium uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ ALL TOOLS ═══ */}
      {!search.trim() && (
        <section id="all-tools" className="bg-slate-950">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-bold text-white">All tools</h2>
              <span className="text-xs text-slate-600">{tools.length} total</span>
            </div>
            <div className="grid gap-px bg-slate-800/50 rounded-2xl overflow-hidden sm:grid-cols-2 lg:grid-cols-3 border border-slate-800">
              {tools
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((tool) => {
                  const vis = categoryVisuals[tool.category];
                  return (
                    <Link
                      key={tool.id}
                      href={`/tools/${tool.slug}`}
                      className="flex items-center gap-3 bg-slate-900 p-4 hover:bg-slate-800/80 transition-colors group"
                    >
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${vis.accentLight} flex-shrink-0`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" className={vis.accent}>
                          {vis.icon}
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors truncate">
                          {tool.name}
                        </h3>
                      </div>
                      {tool.isNew && (
                        <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 text-[8px] font-bold text-emerald-400 uppercase">
                          New
                        </span>
                      )}
                      {tool.isPopular && !tool.isNew && (
                        <span className="rounded bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 text-[8px] font-bold text-amber-400 uppercase">
                          Hot
                        </span>
                      )}
                    </Link>
                  );
                })}
            </div>
          </div>
        </section>
      )}

      {/* ═══ WHY SECTION ═══ */}
      {!search.trim() && (
        <section className="bg-slate-900 border-t border-slate-800">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
            <h2 className="text-lg font-bold text-white mb-10 text-center">
              Why {siteConfig.name}?
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: "🔒", title: "Total Privacy", desc: "Files never leave your device. Zero server uploads.", color: "from-emerald-500/20 to-emerald-500/5" },
                { icon: "⚡", title: "Instant Results", desc: "No uploads. No waiting. Pure browser speed.", color: "from-blue-500/20 to-blue-500/5" },
                { icon: "🎯", title: "No Signup", desc: "Just open a tool and start working.", color: "from-amber-500/20 to-amber-500/5" },
                { icon: "♾️", title: "Unlimited Use", desc: "No caps. No watermarks. No limits.", color: "from-violet-500/20 to-violet-500/5" },
              ].map((f) => (
                <div key={f.title} className={`rounded-2xl bg-gradient-to-b ${f.color} border border-slate-800 p-6 text-center`}>
                  <span className="text-3xl">{f.icon}</span>
                  <h3 className="mt-3 font-semibold text-white text-sm">{f.title}</h3>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ FAQ ═══ */}
      {!search.trim() && (
        <section className="border-t border-slate-800 bg-slate-950">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
            <h2 className="text-lg font-bold text-white mb-8 text-center">FAQ</h2>
            <div className="space-y-2">
              {[
                { q: "Is it really free?", a: "Yes, completely free. No hidden fees, no premium tiers." },
                { q: "Are my files private?", a: "All processing happens in your browser. Files never leave your device — we can't see them even if we wanted to." },
                { q: "Do I need to create an account?", a: "No. Every tool works instantly without any registration." },
                { q: "Does it work on mobile?", a: "Yes. All tools are fully responsive and work across all devices and browsers." },
              ].map((faq, i) => (
                <details key={i} className="group rounded-xl border border-slate-800 bg-slate-900/50">
                  <summary className="flex cursor-pointer items-center justify-between p-4 text-sm font-medium text-slate-200 hover:text-white transition-colors">
                    {faq.q}
                    <svg className="h-4 w-4 text-slate-600 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </summary>
                  <p className="px-4 pb-4 text-xs text-slate-400 leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
