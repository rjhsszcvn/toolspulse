"use client";

import { use } from "react";
import Link from "next/link";
import { tools, categories, type ToolCategory } from "@/config/tools";

const categoryStyle: Record<string, { gradient: string; icon: React.ReactNode }> = {
  pdf: { gradient: "from-red-500 to-rose-600", icon: <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zm-5 9h8m-8 4h5" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/> },
  image: { gradient: "from-emerald-500 to-teal-600", icon: <><rect x="3" y="3" width="18" height="18" rx="3" stroke="white" strokeWidth="1.5" fill="none"/><circle cx="8.5" cy="8.5" r="1.5" fill="white"/><path d="M21 15l-5-5L5 21" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/></> },
  converter: { gradient: "from-cyan-500 to-blue-600", icon: <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/> },
  audio: { gradient: "from-orange-500 to-red-500", icon: <path d="M9 18V5l12-2v13M9 18a3 3 0 11-6 0 3 3 0 016 0zm12-2a3 3 0 11-6 0 3 3 0 016 0z" stroke="white" strokeWidth="1.5" fill="none"/> },
  text: { gradient: "from-amber-500 to-orange-600", icon: <><rect x="4" y="3" width="16" height="18" rx="2" stroke="white" strokeWidth="1.5" fill="none"/><path d="M8 7h8M8 11h8M8 15h5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></> },
  generator: { gradient: "from-blue-600 to-indigo-600", icon: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="white" strokeWidth="1.5" fill="none" strokeLinejoin="round"/> },
  developer: { gradient: "from-violet-600 to-purple-700", icon: <path d="M8 10l-3 2 3 2m8-4l3 2-3 2m-5-8l-2 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/> },
  ai: { gradient: "from-pink-500 to-rose-600", icon: <path d="M9.5 15L9 18.75l-.5-3.75a4.5 4.5 0 00-3-3L2.25 12l3.25-.5a4.5 4.5 0 003-3L9 5.25l.5 3.25a4.5 4.5 0 003 3l3.25.5-3.25.5a4.5 4.5 0 00-3 3zM18 8.5l-.25 1-.25-1a3 3 0 00-2-2l-1-.25 1-.25a3 3 0 002-2L18 3l.25 1a3 3 0 002 2l1 .25-1 .25a3 3 0 00-2 2z" stroke="white" strokeWidth="1.2" fill="none"/> },
};

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const category = categories[slug as ToolCategory];
  const style = categoryStyle[slug];
  const categoryTools = tools.filter((t) => t.category === slug);

  if (!category) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-600">Category not found</p>
        <Link href="/" className="mt-3 text-sm text-blue-600 font-medium">Go home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh]">
      {/* Category Header */}
      <div className={`bg-gradient-to-br ${style.gradient}`}>
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-white mb-4 transition-colors">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
            All Tools
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <svg width="28" height="28" viewBox="0 0 24 24">{style.icon}</svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white sm:text-3xl">{category.label}</h1>
              <p className="text-sm text-white/80">{category.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <p className="text-sm text-slate-500 mb-6">{categoryTools.length} tools available</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categoryTools.map((tool) => (
            <Link
              key={tool.id}
              href={`/tools/${tool.slug}`}
              className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 hover:shadow-lg hover:border-slate-300 hover:-translate-y-0.5 transition-all"
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${style.gradient} flex-shrink-0`}>
                <svg width="20" height="20" viewBox="0 0 24 24">{style.icon}</svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{tool.name}</h3>
                  {tool.isNew && <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 uppercase">New</span>}
                  {tool.isPopular && !tool.isNew && <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-700 uppercase">Popular</span>}
                </div>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">{tool.shortDescription}</p>
              </div>
              <svg className="h-4 w-4 text-slate-300 group-hover:text-blue-500 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
