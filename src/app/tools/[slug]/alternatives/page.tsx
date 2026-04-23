import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getToolBySlug, tools } from "@/config/tools";
import { getToolContent } from "@/config/tool-content";
import { siteConfig } from "@/config/site";

export async function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};

  const title = `Best Free ${tool.name} Alternatives (2026) | ${siteConfig.name}`;
  const description = `Compare the best free ${tool.name.toLowerCase()} options. Find the right tool for your needs — privacy, speed, and features compared.`;

  return {
    title,
    description,
    keywords: [...tool.keywords, `${tool.name.toLowerCase()} alternative`, `free ${tool.name.toLowerCase()}`, `best ${tool.name.toLowerCase()}`],
    openGraph: { title, description, url: `${siteConfig.url}/tools/${slug}/alternatives`, siteName: siteConfig.name, type: "article" },
    twitter: { card: "summary_large_image", title, description },
    alternates: { canonical: `${siteConfig.url}/tools/${slug}/alternatives` },
  };
}

export default async function AlternativesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  const content = getToolContent(slug);
  if (!tool || !content) notFound();

  return (
    <div className="min-h-[80vh]">
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-3 sm:px-6">
          <nav className="flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="hover:text-slate-900">Home</Link>
            <span>/</span>
            <Link href={`/tools/${slug}`} className="hover:text-slate-900">{tool.name}</Link>
            <span>/</span>
            <span className="text-slate-900 font-medium">Alternatives</span>
          </nav>
        </div>
      </div>

      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl tracking-tight">
          Best Free {tool.name} Alternatives in 2026
        </h1>
        <p className="mt-3 text-slate-500 leading-relaxed">{content.alternatives.intro}</p>

        {content.alternatives.tools.length > 0 && (
          <div className="mt-8 space-y-4">
            {content.alternatives.tools.map((alt, i) => (
              <div key={i} className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">{alt.name}</h2>
                    <p className="mt-1 text-sm text-slate-600">{alt.description}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-500 bg-slate-50 rounded-lg p-3 border border-slate-100">
                  <span className="font-medium text-slate-700">Key difference:</span> {alt.differentiator}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="rounded-full bg-blue-600 px-3 py-0.5 text-[10px] font-bold text-white uppercase">Our pick</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">{tool.name} on {siteConfig.name}</h2>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">{content.alternatives.whyUs}</p>

          {content.useCases.length > 0 && (
            <div className="mt-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Use cases</h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {content.useCases.map((uc, i) => (
                  <div key={i} className="bg-white/80 rounded-lg p-3 border border-blue-100">
                    <h4 className="text-xs font-semibold text-slate-900">{uc.title}</h4>
                    <p className="mt-0.5 text-[11px] text-slate-500">{uc.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Link href={`/tools/${slug}`} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
            Try {tool.name} free
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
          </Link>
        </div>

        <div className="mt-8 flex gap-3 text-sm">
          <Link href={`/tools/${slug}/how-to`} className="text-blue-600 hover:text-blue-800 font-medium">How-To Guide &rarr;</Link>
          <Link href={`/tools/${slug}/faq`} className="text-blue-600 hover:text-blue-800 font-medium">FAQ &rarr;</Link>
        </div>
      </article>
    </div>
  );
}
