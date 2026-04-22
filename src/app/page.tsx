"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { tools, categories, type ToolCategory } from "@/config/tools";
import { siteConfig } from "@/config/site";

function ToolIcon({ name, className = "h-5 w-5" }: { name: string; className?: string }) {
  const icons: Record<string, React.ReactNode> = {
    FileText: <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />,
    FileOutput: <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />,
    ImageDown: <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />,
    Maximize: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />,
    FileDown: <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />,
    FilePlus: <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />,
    Eraser: <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />,
    QrCode: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />,
    ScanText: <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6A2.25 2.25 0 0 0 3.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0 1 20.25 6v1.5m0 9V18A2.25 2.25 0 0 1 18 20.25h-1.5m-9 0H6A2.25 2.25 0 0 1 3.75 18v-1.5M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />,
    Receipt: <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185Z" />,
    UserCheck: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />,
    FileSearch: <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />,
    Braces: <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />,
    Palette: <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402M6.75 21A3.75 3.75 0 0 1 3 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 0 0 3.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008Z" />,
    Lock: <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />,
    Youtube: <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />,
    Sparkles: <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />,
    Wand: <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672Zm-7.518-.267A8.25 8.25 0 1 1 20.25 10.5M8.288 14.212A5.25 5.25 0 1 1 17.25 10.5" />,
    SpellCheck: <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />,
    Globe: <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />,
    Music: <path strokeLinecap="round" strokeLinejoin="round" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V4.5l-10.5 3v7.553m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 14.553Z" />,
  };
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      {icons[name] || icons["Globe"]}
    </svg>
  );
}

const categoryColors: Record<ToolCategory, { bg: string; text: string; icon: string; chip: string }> = {
  pdf: { bg: "bg-red-50", text: "text-red-700", icon: "bg-red-100 text-red-600", chip: "bg-red-100 text-red-700 border-red-200" },
  image: { bg: "bg-emerald-50", text: "text-emerald-700", icon: "bg-emerald-100 text-emerald-600", chip: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  converter: { bg: "bg-cyan-50", text: "text-cyan-700", icon: "bg-cyan-100 text-cyan-600", chip: "bg-cyan-100 text-cyan-700 border-cyan-200" },
  audio: { bg: "bg-orange-50", text: "text-orange-700", icon: "bg-orange-100 text-orange-600", chip: "bg-orange-100 text-orange-700 border-orange-200" },
  text: { bg: "bg-amber-50", text: "text-amber-700", icon: "bg-amber-100 text-amber-600", chip: "bg-amber-100 text-amber-700 border-amber-200" },
  generator: { bg: "bg-sky-50", text: "text-sky-700", icon: "bg-sky-100 text-sky-600", chip: "bg-sky-100 text-sky-700 border-sky-200" },
  developer: { bg: "bg-violet-50", text: "text-violet-700", icon: "bg-violet-100 text-violet-600", chip: "bg-violet-100 text-violet-700 border-violet-200" },
  ai: { bg: "bg-pink-50", text: "text-pink-700", icon: "bg-pink-100 text-pink-600", chip: "bg-pink-100 text-pink-700 border-pink-200" },
};

type SortMode = "popular" | "new" | "az";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<ToolCategory | "all">("all");
  const [sortMode, setSortMode] = useState<SortMode>("popular");

  const filteredTools = useMemo(() => {
    let result = [...tools];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.shortDescription.toLowerCase().includes(q) ||
          t.keywords.some((k) => k.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (activeCategory !== "all") {
      result = result.filter((t) => t.category === activeCategory);
    }

    // Sort
    switch (sortMode) {
      case "popular":
        result.sort((a, b) => {
          if (a.isPopular && !b.isPopular) return -1;
          if (!a.isPopular && b.isPopular) return 1;
          return a.name.localeCompare(b.name);
        });
        break;
      case "new":
        result.sort((a, b) => {
          if (a.isNew && !b.isNew) return -1;
          if (!a.isNew && b.isNew) return 1;
          return a.name.localeCompare(b.name);
        });
        break;
      case "az":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [search, activeCategory, sortMode]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: tools.length };
    tools.forEach((t) => {
      counts[t.category] = (counts[t.category] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDJ2LTJoMzR6bTAtMzB2Mkgydi0yaDM0em0wIDV2MkgyVjloMzR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Free Online Tools That Respect Your Privacy
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
              {tools.length}+ tools for PDF, images, audio, text, and more. Everything runs in your browser — your files never leave your device.
            </p>

            {/* Search Bar */}
            <div className="mx-auto mt-6 max-w-xl">
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search tools... (e.g. PDF, compress, QR code)"
                  className="w-full rounded-2xl border-2 border-white/20 bg-white/10 py-4 pl-12 pr-4 text-white placeholder-blue-200 outline-none backdrop-blur-sm transition-all focus:border-white/40 focus:bg-white/15 text-sm"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-200 hover:text-white"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-6 text-sm text-blue-200">
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                No file uploads
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                No signup
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                Unlimited usage
              </span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60h1440V20c-200 25-400 40-720 40S200 45 0 20v40z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
          <button
            onClick={() => setActiveCategory("all")}
            className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium border transition-all ${
              activeCategory === "all"
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            All ({categoryCounts.all})
          </button>
          {Object.entries(categories).map(([key, cat]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key as ToolCategory)}
              className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium border transition-all ${
                activeCategory === key
                  ? categoryColors[key as ToolCategory].chip
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              {cat.label} ({categoryCounts[key] || 0})
            </button>
          ))}
        </div>

        {/* Sort + Results Count */}
        <div className="flex items-center justify-between mt-6 mb-6">
          <p className="text-sm text-gray-500">
            {filteredTools.length} tool{filteredTools.length !== 1 ? "s" : ""}
            {search && ` matching "${search}"`}
            {activeCategory !== "all" && ` in ${categories[activeCategory].label}`}
          </p>
          <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white p-1">
            {([
              { id: "popular" as SortMode, label: "Popular" },
              { id: "new" as SortMode, label: "New" },
              { id: "az" as SortMode, label: "A–Z" },
            ]).map((sort) => (
              <button
                key={sort.id}
                onClick={() => setSortMode(sort.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  sortMode === sort.id
                    ? "bg-gray-900 text-white"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {sort.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tool Grid */}
        {filteredTools.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex rounded-full bg-gray-100 p-4 mb-4">
              <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">No tools found</p>
            <p className="text-sm text-gray-400 mt-1">Try a different search term or category</p>
            <button onClick={() => { setSearch(""); setActiveCategory("all"); }} className="mt-4 text-sm text-blue-600 font-medium hover:text-blue-700">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTools.map((tool) => {
              const colors = categoryColors[tool.category];
              return (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.slug}`}
                  className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:shadow-lg hover:border-blue-200 hover:-translate-y-0.5"
                >
                  <div className="flex items-start gap-4">
                    <div className={`rounded-xl p-2.5 ${colors.icon} flex-shrink-0`}>
                      <ToolIcon name={tool.icon} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-sm">
                          {tool.name}
                        </h3>
                        {tool.isNew ? (
                          <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-700 border border-green-200 uppercase">
                            New
                          </span>
                        ) : tool.isPopular ? (
                          <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-bold text-orange-700 border border-orange-200 uppercase">
                            Popular
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                        {tool.shortDescription}
                      </p>
                      <span className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${colors.bg} ${colors.text}`}>
                        {categories[tool.category].label}
                      </span>
                    </div>
                    <svg className="h-4 w-4 text-gray-300 group-hover:text-blue-500 transition-colors flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Features */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: "M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z", title: "100% Private", desc: "Files never leave your device", color: "bg-green-100 text-green-600" },
              { icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z", title: "Lightning Fast", desc: "No uploading, instant results", color: "bg-yellow-100 text-yellow-600" },
              { icon: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z", title: "No Signup", desc: "Use any tool immediately", color: "bg-blue-100 text-blue-600" },
              { icon: "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99", title: "Unlimited", desc: "No caps, no watermarks", color: "bg-purple-100 text-purple-600" },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-4 rounded-xl bg-white border border-gray-200 p-5">
                <div className={`rounded-lg p-2.5 ${f.color} flex-shrink-0`}>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{f.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {[
            { q: `Is ${siteConfig.name} really free?`, a: "Yes, 100% free. No signup, no subscription, no hidden fees." },
            { q: "Are my files safe?", a: "All processing happens in your browser. Files never leave your device." },
            { q: "Do I need an account?", a: "No. Every tool works immediately with no registration." },
            { q: "Is there a file size limit?", a: "Since processing is local, limits depend on your device. Most files under 100MB work instantly." },
            { q: "Can I use this on mobile?", a: "Yes. All tools are fully responsive on phones, tablets, and desktops." },
          ].map((faq, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="font-semibold text-gray-900 text-sm">{faq.q}</h3>
              <p className="mt-1.5 text-xs text-gray-500 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
