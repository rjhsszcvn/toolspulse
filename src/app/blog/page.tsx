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
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
          <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight">Blog</h1>
          <p className="mt-3 text-base text-slate-500 max-w-2xl">
            Step-by-step guides, tips, and best practices for getting the most out of free online tools.
          </p>
        </div>
      </div>

      {/* Posts grid */}
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2">
          {posts.map((post) => {
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
