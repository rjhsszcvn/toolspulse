import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPostBySlug, getBlogPosts } from "@/config/blog";
import { getToolBySlug, categories, type ToolCategory } from "@/config/tools";

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

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) notFound();

  const tool = getToolBySlug(post.toolSlug);
  const cat = categories[post.category as ToolCategory];
  const color = categoryColors[post.category] || { bg: "bg-slate-100", text: "text-slate-700" };

  const relatedPosts = getBlogPosts()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2);

  return (
    <div className="min-h-[80vh]">
      {/* Breadcrumb */}
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-3 sm:px-6">
          <nav className="flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
            <Link href="/blog" className="hover:text-slate-900 transition-colors">Blog</Link>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
            <span className="text-slate-900 font-medium truncate">{post.title}</span>
          </nav>
        </div>
      </div>

      {/* Article */}
      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        {/* Meta */}
        <div className="flex items-center gap-3 mb-4">
          <span className={`rounded-full ${color.bg} ${color.text} px-2.5 py-0.5 text-[10px] font-bold uppercase`}>
            {cat?.label || post.category}
          </span>
          <time className="text-sm text-slate-400" dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </time>
          <span className="text-sm text-slate-400">&middot; {post.readTime} read</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl lg:text-4xl tracking-tight leading-tight">
          {post.title}
        </h1>

        {/* Intro */}
        <p className="mt-6 text-base text-slate-600 leading-relaxed sm:text-lg">
          {post.content.intro}
        </p>

        {/* Sections */}
        {post.content.sections.map((section, i) => (
          <div key={i} className="mt-8">
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">{section.heading}</h2>
            <p className="mt-3 text-base text-slate-600 leading-relaxed">{section.body}</p>
          </div>
        ))}

        {/* Conclusion */}
        <div className="mt-8">
          <p className="text-base text-slate-600 leading-relaxed">{post.content.conclusion}</p>
        </div>

        {/* CTA to tool */}
        {tool && (
          <div className="mt-10 rounded-2xl border border-blue-200 bg-blue-50 p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600 mb-1">Try it free</p>
                <h3 className="text-lg font-bold text-slate-900">{tool.name}</h3>
                <p className="mt-1 text-sm text-slate-600">{tool.shortDescription}. No signup, no file uploads, 100% private.</p>
              </div>
            </div>
            <Link
              href={`/tools/${tool.slug}`}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              Open {tool.name}
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
            </Link>
          </div>
        )}
      </article>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <div className="border-t border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
            <h2 className="text-base font-bold text-slate-900 mb-5">More guides</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {relatedPosts.map((rp) => {
                const rpColor = categoryColors[rp.category] || { bg: "bg-slate-100", text: "text-slate-700" };
                const rpCat = categories[rp.category as ToolCategory];
                return (
                  <Link
                    key={rp.slug}
                    href={`/blog/${rp.slug}`}
                    className="group rounded-xl border border-slate-200 bg-white p-5 hover:shadow-md hover:border-slate-300 transition-all"
                  >
                    <span className={`rounded-full ${rpColor.bg} ${rpColor.text} px-2 py-0.5 text-[9px] font-bold uppercase`}>
                      {rpCat?.label || rp.category}
                    </span>
                    <h3 className="mt-2 text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                      {rp.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">{rp.readTime} read</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
