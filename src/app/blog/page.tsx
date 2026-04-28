import Link from "next/link";
import { getBlogPosts } from "@/config/blog";
import { categories, type ToolCategory } from "@/config/tools";
import { siteConfig } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Free Tool Guides & How-To Articles",
  description: `Learn how to use free online tools for PDF, image, audio, and text processing. Step-by-step guides, tips, and best practices from ${siteConfig.name}.`,
  alternates: {
    canonical: `${siteConfig.url}/blog`,
  },
};

const categoryColors: Record<string, { bg: string; text: string }> = {
  pdf: { bg: "bg-red-100", text: "text-red-700" },
  image: { bg: "bg-emerald-100", text: "text-emerald-700" },
  converter: { bg: "bg-blue-100", text: "text-blue-700" },
  audio: { bg: "bg-orange-100", text: "text-orange-700" },
  text: { bg: "bg-amber-100", text: "text-amber-700" },
  generator: { bg: "bg-indigo-100", text: "text-indigo-700" },
  developer: { bg: "bg-violet-100", text: "text-violet-700" },
  ai: { bg: "bg-pink-100", text: "text-pink-700" },
};

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <div className="min-h-[80vh]">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="absolute top-0 right-0 w-[400px] h-[200px] bg-blue-500/10 rounded-full blur-[80px]" />
        <div className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 mb-4">
            <svg className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>
            <span className="text-xs font-semibold text-slate-300">Guides & Tutorials</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl tracking-tight">Blog</h1>
          <p className="mt-3 text-base text-slate-400 max-w-2xl">
            Step-by-step guides, tips, and best practices for getting the most out of free online tools.
          </p>
        </div>
      </div>

      {/* Posts grid */}
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        {/* Featured post */}
        {posts.length > 0 && (() => {
          const post = posts[0];
          const cat = categories[post.category as ToolCategory];
          const color = categoryColors[post.category] || { bg: "bg-slate-100", text: "text-slate-700" };
          return (
            <Link
              href={`/blog/${post.slug}`}
              className="group block rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-8 hover:shadow-xl hover:border-slate-300 hover:-translate-y-0.5 transition-all mb-8"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="rounded-full bg-blue-600 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase">Featured</span>
                <span className={`rounded-full ${color.bg} ${color.text} px-2.5 py-0.5 text-[10px] font-bold uppercase`}>
                  {cat?.label || post.category}
                </span>
                <span className="text-[11px] text-slate-400">{post.readTime} read</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug sm:text-2xl">
                {post.title}
              </h2>
              <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                {post.description}
              </p>
              <div className="mt-5 flex items-center justify-between">
                <time className="text-[11px] text-slate-400" dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </time>
                <span className="text-sm font-semibold text-blue-600 group-hover:text-blue-700 flex items-center gap-1.5 transition-colors">
                  Read article
                  <svg className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </div>
            </Link>
          );
        })()}
        <h3 className="text-lg font-bold text-slate-900 mb-4">All Articles</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {posts.slice(1).map((post) => {
            const cat = categories[post.category as ToolCategory];
            const color = categoryColors[post.category] || { bg: "bg-slate-100", text: "text-slate-700" };

            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group rounded-2xl border border-slate-200 bg-white p-6 hover:shadow-lg hover:border-slate-300 hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className={`rounded-full ${color.bg} ${color.text} px-2.5 py-0.5 text-[10px] font-bold uppercase`}>
                    {cat?.label || post.category}
                  </span>
                  <span className="text-[11px] text-slate-400">{post.readTime} read</span>
                </div>
                <h2 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed line-clamp-2">
                  {post.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <time className="text-[11px] text-slate-400" dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </time>
                  <span className="text-xs font-medium text-blue-600 group-hover:text-blue-700 flex items-center gap-1 transition-colors">
                    Read more
                    <svg className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
