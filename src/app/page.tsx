"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { tools, categories, type ToolCategory } from "@/config/tools";
import { siteConfig } from "@/config/site";

function CategoryIcon({ category, size = 24 }: { category: string; size?: number }) {
  const icons: Record<string, React.ReactNode> = {
    pdf: <><rect x="4" y="2" width="16" height="20" rx="2" fill="currentColor" opacity="0.15"/><path d="M14 2v6h6M8 13h8M8 17h5M14 2l6 6v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2h8z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/></>,
    image: <><rect x="3" y="3" width="18" height="18" rx="3" fill="currentColor" opacity="0.15"/><path d="M3 16l5-5a2 2 0 012.8 0L15 15.2M14 14l1.5-1.5a2 2 0 012.8 0L21 15M3 21h18a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/></>,
    converter: <><circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.15"/><path d="M16 3.13a9 9 0 010 17.74M8 3.13a9 9 0 000 17.74M3 12h18M12 3a15.3 15.3 0 014 9 15.3 15.3 0 01-4 9 15.3 15.3 0 01-4-9 15.3 15.3 0 014-9z" stroke="currentColor" strokeWidth="1.5" fill="none"/></>,
    audio: <><rect x="3" y="6" width="18" height="12" rx="3" fill="currentColor" opacity="0.15"/><path d="M9 9l10.5-3v12L9 15V9z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round"/><circle cx="6.5" cy="17.5" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="none"/><circle cx="17" cy="15.5" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="none"/></>,
    text: <><rect x="4" y="3" width="16" height="18" rx="2" fill="currentColor" opacity="0.15"/><path d="M8 7h8M8 11h8M8 15h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>,
    generator: <><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" opacity="0.15"/><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round"/></>,
    developer: <><rect x="2" y="4" width="20" height="16" rx="2" fill="currentColor" opacity="0.15"/><path d="M8 10l-3 2 3 2M16 10l3 2-3 2M13 8l-2 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></>,
    ai: <><circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.15"/><path d="M9.5 15L9 18.75l-.5-3.75a4.5 4.5 0 00-3-3L2.25 12l3.25-.5a4.5 4.5 0 003-3L9 5.25l.5 3.25a4.5 4.5 0 003 3l3.25.5-3.25.5a4.5 4.5 0 00-3 3zM18 8.5l-.25 1-.25-1a3 3 0 00-2-2l-1-.25 1-.25a3 3 0 002-2L18 3l.25 1a3 3 0 002 2l1 .25-1 .25a3 3 0 00-2 2z" stroke="currentColor" strokeWidth="1.2" fill="none"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {icons[category] || icons["generator"]}
    </svg>
  );
}

const categoryColors: Record<ToolCategory, { bg: string; text: string; gradient: string; light: string }> = {
  pdf: { bg: "bg-red-500", text: "text-red-500", gradient: "from-red-500 to-rose-600", light: "bg-red-50" },
  image: { bg: "bg-emerald-500", text: "text-emerald-500", gradient: "from-emerald-500 to-green-600", light: "bg-emerald-50" },
  converter: { bg: "bg-cyan-500", text: "text-cyan-500", gradient: "from-cyan-500 to-blue-600", light: "bg-cyan-50" },
  audio: { bg: "bg-orange-500", text: "text-orange-500", gradient: "from-orange-500 to-amber-600", light: "bg-orange-50" },
  text: { bg: "bg-amber-500", text: "text-amber-500", gradient: "from-amber-500 to-yellow-600", light: "bg-amber-50" },
  generator: { bg: "bg-blue-500", text: "text-blue-500", gradient: "from-blue-500 to-indigo-600", light: "bg-blue-50" },
  developer: { bg: "bg-violet-500", text: "text-violet-500", gradient: "from-violet-500 to-purple-600", light: "bg-violet-50" },
  ai: { bg: "bg-pink-500", text: "text-pink-500", gradient: "from-pink-500 to-rose-600", light: "bg-pink-50" },
};

type SortMode = "popular" | "new" | "az";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<ToolCategory | "all">("all");
  const [sortMode, setSortMode] = useState<SortMode>("popular");

  const filteredTools = useMemo(() => {
    let result = [...tools];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((t) => t.name.toLowerCase().includes(q) || t.shortDescription.toLowerCase().includes(q) || t.keywords.some((k) => k.toLowerCase().includes(q)));
    }
    if (activeCategory !== "all") result = result.filter((t) => t.category === activeCategory);
    switch (sortMode) {
      case "popular": result.sort((a, b) => { if (a.isPopular && !b.isPopular) return -1; if (!a.isPopular && b.isPopular) return 1; return a.name.localeCompare(b.name); }); break;
      case "new": result.sort((a, b) => { if (a.isNew && !b.isNew) return -1; if (!a.isNew && b.isNew) return 1; return a.name.localeCompare(b.name); }); break;
      case "az": result.sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return result;
  }, [search, activeCategory, sortMode]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950">
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)", backgroundSize: "40px 40px" }} />
        <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-4 pt-10 pb-12 sm:pt-14 sm:pb-16">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-blue-300 mb-5 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {tools.length}+ tools — all free, all private
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl leading-tight">
              Online Tools That<br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                Never Touch Your Files
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-md text-sm text-slate-400 leading-relaxed">
              Convert, compress, edit — everything runs locally in your browser. Your files never leave your device.
            </p>

            {/* Search */}
            <div className="mx-auto mt-8 max-w-md">
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search tools..."
                  className="w-full rounded-xl bg-white/[0.08] border border-white/[0.08] py-3 pl-11 pr-10 text-sm text-white placeholder-slate-500 outline-none focus:bg-white/[0.12] focus:border-white/20 transition-all"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools */}
      <section id="tools" className="mx-auto max-w-6xl px-4 pt-8 pb-12 sm:px-6 lg:px-8">
        {/* Category pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
          <button
            onClick={() => setActiveCategory("all")}
            className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
              activeCategory === "all" ? "bg-slate-900 text-white" : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
            }`}
          >
            All tools
          </button>
          {Object.entries(categories).map(([key, cat]) => {
            const colors = categoryColors[key as ToolCategory];
            const isActive = activeCategory === key;
            return (
              <button
                key={key}
                onClick={() => setActiveCategory(key as ToolCategory)}
                className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all flex items-center gap-2 ${
                  isActive ? `bg-gradient-to-r ${colors.gradient} text-white` : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
                }`}
              >
                <span className={isActive ? "text-white" : colors.text}>
                  <CategoryIcon category={key} size={16} />
                </span>
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mt-4 mb-5">
          <p className="text-sm text-slate-500">
            <span className="font-semibold text-slate-800">{filteredTools.length}</span> tool{filteredTools.length !== 1 ? "s" : ""}
            {search && <span className="text-slate-400"> matching &ldquo;{search}&rdquo;</span>}
          </p>
          <div className="flex rounded-lg bg-slate-100 p-0.5">
            {(["popular", "new", "az"] as SortMode[]).map((s) => (
              <button key={s} onClick={() => setSortMode(s)} className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${sortMode === s ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>
                {s === "az" ? "A\u2013Z" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filteredTools.length === 0 ? (
          <div className="text-center py-20">
            <svg className="mx-auto h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
            <p className="mt-3 text-slate-600 font-medium">No tools found</p>
            <button onClick={() => { setSearch(""); setActiveCategory("all"); }} className="mt-2 text-sm text-blue-600 font-medium">Clear filters</button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTools.map((tool) => {
              const colors = categoryColors[tool.category];
              return (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.slug}`}
                  className="group flex items-start gap-4 rounded-2xl bg-white border border-slate-200 p-5 transition-all duration-200 hover:shadow-lg hover:shadow-slate-100/80 hover:border-slate-300 hover:-translate-y-0.5"
                >
                  {/* Icon */}
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${colors.light} ${colors.text} flex-shrink-0`}>
                    <CategoryIcon category={tool.category} size={22} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900 text-[13px] group-hover:text-blue-600 transition-colors leading-snug">
                        {tool.name}
                      </h3>
                      {tool.isNew ? (
                        <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 uppercase tracking-wide">New</span>
                      ) : tool.isPopular ? (
                        <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-700 uppercase tracking-wide">Popular</span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500 leading-relaxed line-clamp-2">{tool.shortDescription}</p>
                  </div>

                  <svg className="h-4 w-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Why section */}
      <section className="border-t border-slate-100 bg-slate-50/50">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="text-center text-lg font-bold text-slate-900 mb-8">Why people choose {siteConfig.name}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: "M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z", title: "Complete Privacy", desc: "Your files never leave your device. Zero server uploads.", color: "text-emerald-600 bg-emerald-100" },
              { icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z", title: "Instant Processing", desc: "No waiting for uploads. Results appear in milliseconds.", color: "text-amber-600 bg-amber-100" },
              { icon: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z", title: "Zero Friction", desc: "No accounts, no emails, no forms. Just open and use.", color: "text-blue-600 bg-blue-100" },
              { icon: "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99", title: "No Limits", desc: "Unlimited usage. No daily caps, no watermarks.", color: "text-violet-600 bg-violet-100" },
            ].map((f) => (
              <div key={f.title} className="rounded-xl bg-white border border-slate-200/80 p-5">
                <div className={`inline-flex rounded-lg p-2 ${f.color} mb-3`}>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900 text-sm">{f.title}</h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="text-center text-lg font-bold text-slate-900 mb-8">Frequently Asked Questions</h2>
        <div className="space-y-2">
          {[
            { q: "Is " + siteConfig.name + " really free?", a: "Yes. No signup, no subscription, no hidden fees. Every tool is completely free to use." },
            { q: "Are my files safe and private?", a: "All processing happens directly in your browser using JavaScript. Your files are never uploaded to any server. We literally cannot see your data." },
            { q: "Do I need to create an account?", a: "No. Every tool works instantly with no registration, no email, no account required." },
            { q: "Is there a file size limit?", a: "Since processing happens locally on your device, limits depend on your device memory. Most files under 100MB process instantly." },
            { q: "Does it work on mobile?", a: "Yes. All tools are fully responsive and work on smartphones, tablets, and desktop computers across all modern browsers." },
          ].map((faq, i) => (
            <details key={i} className="group rounded-xl border border-slate-200 bg-white overflow-hidden">
              <summary className="flex cursor-pointer items-center justify-between p-4 text-sm font-medium text-slate-900 hover:bg-slate-50 transition-colors">
                {faq.q}
                <svg className="h-4 w-4 text-slate-400 transition-transform group-open:rotate-180 flex-shrink-0 ml-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </summary>
              <p className="px-4 pb-4 text-xs text-slate-500 leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
