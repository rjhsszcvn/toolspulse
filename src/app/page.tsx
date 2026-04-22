"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { tools, categories, type ToolCategory } from "@/config/tools";
import { siteConfig } from "@/config/site";

const categoryMeta: Record<ToolCategory, { gradient: string; emoji: string }> = {
  pdf: { gradient: "from-red-500 to-rose-600", emoji: "📄" },
  image: { gradient: "from-emerald-500 to-green-600", emoji: "🖼️" },
  converter: { gradient: "from-cyan-500 to-blue-600", emoji: "🔄" },
  audio: { gradient: "from-orange-500 to-amber-600", emoji: "🎵" },
  text: { gradient: "from-amber-500 to-yellow-600", emoji: "📝" },
  generator: { gradient: "from-blue-500 to-indigo-600", emoji: "⚡" },
  developer: { gradient: "from-violet-500 to-purple-600", emoji: "🛠️" },
  ai: { gradient: "from-pink-500 to-rose-600", emoji: "✨" },
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
      result = result.filter(
        (t) => t.name.toLowerCase().includes(q) || t.shortDescription.toLowerCase().includes(q) || t.keywords.some((k) => k.toLowerCase().includes(q))
      );
    }
    if (activeCategory !== "all") result = result.filter((t) => t.category === activeCategory);
    switch (sortMode) {
      case "popular": result.sort((a, b) => { if (a.isPopular && !b.isPopular) return -1; if (!a.isPopular && b.isPopular) return 1; return a.name.localeCompare(b.name); }); break;
      case "new": result.sort((a, b) => { if (a.isNew && !b.isNew) return -1; if (!a.isNew && b.isNew) return 1; return a.name.localeCompare(b.name); }); break;
      case "az": result.sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return result;
  }, [search, activeCategory, sortMode]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: tools.length };
    tools.forEach((t) => { counts[t.category] = (counts[t.category] || 0) + 1; });
    return counts;
  }, []);

  return (
    <>
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-5xl px-4 pt-8 pb-10 sm:pt-12 sm:pb-14">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Free Tools. No Uploads.{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Total Privacy.</span>
            </h1>
            <p className="mx-auto mt-3 max-w-lg text-sm text-slate-400 sm:text-base">
              {tools.length}+ browser-based tools for files, images, audio & more.
            </p>
            <div className="mx-auto mt-6 max-w-lg">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl opacity-0 group-focus-within:opacity-100 blur transition-opacity" />
                <div className="relative flex items-center bg-white/10 backdrop-blur-md rounded-xl border border-white/10 focus-within:border-white/20">
                  <svg className="ml-4 h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                  <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tools..." className="w-full bg-transparent py-3.5 px-3 text-white placeholder-slate-500 outline-none text-sm" />
                  {search && (
                    <button onClick={() => setSearch("")} className="mr-3 text-slate-400 hover:text-white">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500">
              {["No uploads", "No signup", "No watermarks", "100% free"].map((t) => (
                <span key={t} className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="tools" className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
          <button onClick={() => setActiveCategory("all")} className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${activeCategory === "all" ? "bg-slate-900 text-white shadow-md" : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"}`}>
            All tools
          </button>
          {Object.entries(categories).map(([key, cat]) => {
            const meta = categoryMeta[key as ToolCategory];
            return (
              <button key={key} onClick={() => setActiveCategory(key as ToolCategory)} className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all flex items-center gap-1.5 ${activeCategory === key ? `bg-gradient-to-r ${meta.gradient} text-white shadow-md` : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"}`}>
                <span className="text-base leading-none">{meta.emoji}</span>{cat.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between mt-5 mb-5">
          <p className="text-sm text-slate-500"><span className="font-semibold text-slate-800">{filteredTools.length}</span> tool{filteredTools.length !== 1 ? "s" : ""}{search && <span className="text-slate-400"> for &ldquo;{search}&rdquo;</span>}</p>
          <div className="flex items-center rounded-lg bg-slate-100 p-0.5">
            {(["popular", "new", "az"] as SortMode[]).map((s) => (
              <button key={s} onClick={() => setSortMode(s)} className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${sortMode === s ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                {s === "az" ? "A\u2013Z" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {filteredTools.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-slate-600 font-medium">No tools match your search</p>
            <button onClick={() => { setSearch(""); setActiveCategory("all"); }} className="mt-3 text-sm text-blue-600 font-medium hover:text-blue-700">Clear filters</button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTools.map((tool) => {
              const meta = categoryMeta[tool.category];
              return (
                <Link key={tool.id} href={`/tools/${tool.slug}`} className="group relative flex items-start gap-4 rounded-2xl bg-white border border-slate-200/80 p-5 transition-all duration-200 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-100 hover:-translate-y-0.5">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${meta.gradient} text-white text-xl flex-shrink-0 shadow-sm`}>
                    {meta.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900 text-sm group-hover:text-blue-600 transition-colors leading-tight">{tool.name}</h3>
                      {tool.isNew ? (
                        <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 uppercase leading-none">New</span>
                      ) : tool.isPopular ? (
                        <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 uppercase leading-none">Popular</span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-xs text-slate-500 leading-relaxed line-clamp-2">{tool.shortDescription}</p>
                  </div>
                  <svg className="h-4 w-4 text-slate-300 group-hover:text-blue-500 transition-colors flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="bg-slate-50 border-t border-slate-200/60">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="text-center text-xl font-bold text-slate-900 mb-8">Why {siteConfig.name}?</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { emoji: "🔒", title: "100% Private", desc: "Files stay on your device. We can't see your data." },
              { emoji: "⚡", title: "Instant", desc: "No server uploads. Processing starts immediately." },
              { emoji: "🆓", title: "Always Free", desc: "No hidden fees, no premium walls, no limits." },
              { emoji: "📱", title: "Works Everywhere", desc: "Desktop, tablet, phone. Any modern browser." },
            ].map((f) => (
              <div key={f.title} className="rounded-xl bg-white border border-slate-200/80 p-5 text-center">
                <span className="text-2xl">{f.emoji}</span>
                <h3 className="mt-2 font-semibold text-slate-900 text-sm">{f.title}</h3>
                <p className="mt-1 text-xs text-slate-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="text-center text-xl font-bold text-slate-900 mb-8">FAQ</h2>
        <div className="space-y-3">
          {[
            { q: "Is " + siteConfig.name + " really free?", a: "Yes. No signup, no subscription, no hidden fees." },
            { q: "Are my files safe?", a: "All processing happens in your browser. Files never leave your device." },
            { q: "Do I need an account?", a: "No. Every tool works instantly with no registration." },
            { q: "What is the file size limit?", a: "It depends on your device. Most files under 100MB process instantly." },
            { q: "Does it work on mobile?", a: "Yes. All tools are responsive across phones, tablets, and desktops." },
          ].map((faq, i) => (
            <details key={i} className="group rounded-xl border border-slate-200/80 bg-white">
              <summary className="flex cursor-pointer items-center justify-between p-5 text-sm font-semibold text-slate-900">
                {faq.q}
                <svg className="h-4 w-4 text-slate-400 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </summary>
              <p className="px-5 pb-5 text-xs text-slate-500 leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
