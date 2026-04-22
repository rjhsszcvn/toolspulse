"use client";

import React, { useState } from "react";
import Link from "next/link";
import { tools, categories, type ToolCategory } from "@/config/tools";
import { siteConfig } from "@/config/site";

const categoryStyle: Record<ToolCategory, { gradient: string; icon: React.ReactNode; tagline: string }> = {
  pdf: {
    gradient: "from-red-500 to-rose-600",
    tagline: "Solve Your PDF Problems",
    icon: <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zm-5 9h8m-8 4h5" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/>,
  },
  image: {
    gradient: "from-emerald-500 to-teal-600",
    tagline: "Edit & Optimize Images",
    icon: <><rect x="3" y="3" width="18" height="18" rx="3" stroke="white" strokeWidth="1.5" fill="none"/><circle cx="8.5" cy="8.5" r="1.5" fill="white"/><path d="M21 15l-5-5L5 21" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/></>,
  },
  converter: {
    gradient: "from-cyan-500 to-blue-600",
    tagline: "Convert Any File Format",
    icon: <><path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></>,
  },
  audio: {
    gradient: "from-orange-500 to-red-500",
    tagline: "Convert & Edit Audio",
    icon: <path d="M9 18V5l12-2v13M9 18a3 3 0 11-6 0 3 3 0 016 0zm12-2a3 3 0 11-6 0 3 3 0 016 0z" stroke="white" strokeWidth="1.5" fill="none"/>,
  },
  text: {
    gradient: "from-amber-500 to-orange-600",
    tagline: "Extract & Process Text",
    icon: <><rect x="4" y="3" width="16" height="18" rx="2" stroke="white" strokeWidth="1.5" fill="none"/><path d="M8 7h8M8 11h8M8 15h5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></>,
  },
  generator: {
    gradient: "from-blue-600 to-indigo-600",
    tagline: "Generate What You Need",
    icon: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="white" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>,
  },
  developer: {
    gradient: "from-violet-600 to-purple-700",
    tagline: "Tools Built For Devs",
    icon: <path d="M8 10l-3 2 3 2m8-4l3 2-3 2m-5-8l-2 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>,
  },
  ai: {
    gradient: "from-pink-500 to-rose-600",
    tagline: "AI-Powered Intelligence",
    icon: <path d="M9.5 15L9 18.75l-.5-3.75a4.5 4.5 0 00-3-3L2.25 12l3.25-.5a4.5 4.5 0 003-3L9 5.25l.5 3.25a4.5 4.5 0 003 3l3.25.5-3.25.5a4.5 4.5 0 00-3 3zM18 8.5l-.25 1-.25-1a3 3 0 00-2-2l-1-.25 1-.25a3 3 0 002-2L18 3l.25 1a3 3 0 002 2l1 .25-1 .25a3 3 0 00-2 2z" stroke="white" strokeWidth="1.2" fill="none"/>,
  },
};

export default function HomePage() {
  const [search, setSearch] = useState("");

  const searchResults = search.trim()
    ? tools.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()) || t.shortDescription.toLowerCase().includes(search.toLowerCase()) || t.keywords.some((k) => k.toLowerCase().includes(search.toLowerCase())))
    : [];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        <div className="mx-auto max-w-5xl px-4 pt-10 pb-8 sm:pt-16 sm:pb-12">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl leading-tight">
              Free Tools to Make<br />
              <span className="relative inline-block">
                <span className="relative z-10">Everything</span>
                <span className="absolute bottom-1 left-0 right-0 h-3 bg-blue-200/50 -z-0 rounded" />
              </span>{" "}
              Simple
            </h1>
            <p className="mx-auto mt-4 max-w-md text-base text-slate-500">
              PDF, image, audio & more — {tools.length}+ tools that run entirely in your browser. Private. Fast. Free.
            </p>

            {/* Search */}
            <div className="mx-auto mt-8 max-w-lg">
              <div className="flex items-center rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 focus-within:border-blue-500 transition-colors shadow-sm">
                <svg className="h-5 w-5 text-slate-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search tools..."
                  className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-none"
                />
                {search ? (
                  <button onClick={() => setSearch("")} className="text-slate-400 hover:text-slate-600 ml-2">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                  </button>
                ) : (
                  <span className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white flex-shrink-0 ml-2">Search</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Results */}
      {search.trim() && (
        <section className="mx-auto max-w-5xl px-4 pb-8 sm:px-6">
          <p className="text-sm text-slate-500 mb-4"><span className="font-semibold text-slate-800">{searchResults.length}</span> result{searchResults.length !== 1 ? "s" : ""} for &ldquo;{search}&rdquo;</p>
          {searchResults.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500">No tools found. Try a different search.</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {searchResults.map((tool) => {
                const style = categoryStyle[tool.category];
                return (
                  <Link key={tool.id} href={`/tools/${tool.slug}`} className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 hover:shadow-md hover:border-slate-300 transition-all">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${style.gradient} flex-shrink-0`}>
                      <svg width="20" height="20" viewBox="0 0 24 24">{style.icon}</svg>
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
        </section>
      )}

      {/* Category Cards — the main showcase */}
      {!search.trim() && (
        <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(categories).map(([key, cat]) => {
              const style = categoryStyle[key as ToolCategory];
              const catTools = tools.filter((t) => t.category === key);
              const featured = catTools.find((t) => t.isPopular) || catTools[0];
              if (catTools.length === 0) return null;

              return (
                <Link
                  key={key}
                  href={`/category/${key}`}
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = `/tools/${featured.slug}`;
                  }}
                  className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  style={{ minHeight: "220px" }}
                >
                  {/* Gradient background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-90`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                  {/* Content */}
                  <div className="relative z-10 flex flex-col h-full">
                    {/* Icon + count */}
                    <div className="flex items-start justify-between mb-auto">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                        <svg width="24" height="24" viewBox="0 0 24 24">{style.icon}</svg>
                      </div>
                      <span className="rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-white">
                        {catTools.length}+ tools
                      </span>
                    </div>

                    {/* Title + tagline */}
                    <div className="mt-8">
                      <h2 className="text-xl font-bold text-white">{cat.label}</h2>
                      <p className="mt-1 text-sm text-white/80">{style.tagline}</p>
                    </div>

                    {/* Featured tool */}
                    <div className="mt-4 flex items-center gap-2">
                      <span className="text-xs text-white/60">Featured:</span>
                      <span className="text-xs font-semibold text-white bg-white/15 rounded-full px-3 py-1 backdrop-blur-sm">
                        {featured.name}
                      </span>
                    </div>

                    {/* Arrow */}
                    <div className="absolute bottom-6 right-6 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* All tools link */}
          <div className="mt-8 text-center">
            <Link href="#all-tools" className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700">
              View all {tools.length} tools
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" /></svg>
            </Link>
          </div>
        </section>
      )}

      {/* Stats bar */}
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
                  <p className="text-2xl font-bold text-white sm:text-3xl">{stat.value}</p>
                  <p className="mt-1 text-xs text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All tools — compact list */}
      {!search.trim() && (
        <section id="all-tools" className="bg-slate-50">
          <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
            <h2 className="text-xl font-bold text-slate-900 mb-8 text-center">All Tools</h2>
            <div className="grid gap-px bg-slate-200 rounded-2xl overflow-hidden sm:grid-cols-2 lg:grid-cols-3">
              {tools.sort((a, b) => a.name.localeCompare(b.name)).map((tool) => {
                const style = categoryStyle[tool.category];
                return (
                  <Link
                    key={tool.id}
                    href={`/tools/${tool.slug}`}
                    className="flex items-center gap-3 bg-white p-4 hover:bg-blue-50 transition-colors group"
                  >
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${style.gradient} flex-shrink-0`}>
                      <svg width="16" height="16" viewBox="0 0 24 24">{style.icon}</svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">{tool.name}</h3>
                    </div>
                    {tool.isNew && <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[8px] font-bold text-emerald-700 uppercase">New</span>}
                    {tool.isPopular && !tool.isNew && <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[8px] font-bold text-amber-700 uppercase">Hot</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Why section */}
      {!search.trim() && (
        <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
          <h2 className="text-lg font-bold text-slate-900 mb-8 text-center">Why {siteConfig.name}?</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: "🔒", title: "Total Privacy", desc: "Files never leave your device." },
              { icon: "⚡", title: "Instant Results", desc: "No uploads. No waiting." },
              { icon: "🎯", title: "No Signup", desc: "Just open and use." },
              { icon: "♾️", title: "Unlimited", desc: "No caps. No watermarks." },
            ].map((f) => (
              <div key={f.title} className="text-center">
                <span className="text-3xl">{f.icon}</span>
                <h3 className="mt-2 font-semibold text-slate-900 text-sm">{f.title}</h3>
                <p className="mt-1 text-xs text-slate-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      {!search.trim() && (
        <section className="border-t border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
            <h2 className="text-lg font-bold text-slate-900 mb-6 text-center">FAQ</h2>
            <div className="space-y-2">
              {[
                { q: "Is it free?", a: "Yes, completely free. No hidden fees." },
                { q: "Are my files private?", a: "All processing happens in your browser. Files never leave your device." },
                { q: "Do I need an account?", a: "No. All tools work instantly without registration." },
                { q: "Works on mobile?", a: "Yes. Fully responsive across all devices." },
              ].map((faq, i) => (
                <details key={i} className="group rounded-xl border border-slate-200 bg-white">
                  <summary className="flex cursor-pointer items-center justify-between p-4 text-sm font-medium text-slate-900">
                    {faq.q}
                    <svg className="h-4 w-4 text-slate-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                  </summary>
                  <p className="px-4 pb-4 text-xs text-slate-500">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
