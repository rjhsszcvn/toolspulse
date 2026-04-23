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
  const content = getToolContent(slug);
  if (!tool || !content) return {};

  const title = `${content.howTo.title} — Free Guide | ${siteConfig.name}`;
  const description = `Step-by-step guide to using ${tool.name}. ${tool.shortDescription}. Free, no signup, 100% private.`;

  return {
    title,
    description,
    keywords: [...tool.keywords, `how to use ${tool.name.toLowerCase()}`, `${tool.name.toLowerCase()} guide`],
    openGraph: { title, description, url: `${siteConfig.url}/tools/${slug}/how-to`, siteName: siteConfig.name, type: "article" },
    twitter: { card: "summary_large_image", title, description },
    alternates: { canonical: `${siteConfig.url}/tools/${slug}/how-to` },
  };
}

export default async function HowToPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  const content = getToolContent(slug);
  if (!tool || !content) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: content.howTo.title,
    description: `Step-by-step guide to ${tool.shortDescription.toLowerCase()}.`,
    step: content.howTo.steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.title,
      text: step.description,
    })),
    tool: { "@type": "WebApplication", name: tool.name, url: `${siteConfig.url}/tools/${slug}` },
  };

  return (
    <div className="min-h-[80vh]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-3 sm:px-6">
          <nav className="flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="hover:text-slate-900">Home</Link>
            <span>/</span>
            <Link href={`/tools/${slug}`} className="hover:text-slate-900">{tool.name}</Link>
            <span>/</span>
            <span className="text-slate-900 font-medium">How-To Guide</span>
          </nav>
        </div>
      </div>

      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl tracking-tight">{content.howTo.title}</h1>
        <p className="mt-3 text-slate-500">Free, step-by-step guide. No signup needed — everything runs in your browser.</p>

        <div className="mt-10 space-y-6">
          {content.howTo.steps.map((step, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-sm font-bold flex-shrink-0">{i + 1}</div>
              <div>
                <h2 className="text-base font-bold text-slate-900">{step.title}</h2>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {content.howTo.tips.length > 0 && (
          <div className="mt-10 rounded-xl border border-amber-200 bg-amber-50 p-6">
            <h2 className="text-sm font-bold text-amber-800 uppercase tracking-wider mb-3">Tips for best results</h2>
            <ul className="space-y-2">
              {content.howTo.tips.map((tip, i) => (
                <li key={i} className="flex gap-2 text-sm text-amber-900">
                  <svg className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" /></svg>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-10 rounded-2xl border border-blue-200 bg-blue-50 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-slate-900">Try {tool.name} now</h2>
          <p className="mt-1 text-sm text-slate-600">{tool.shortDescription}. Free, no signup, 100% private.</p>
          <Link href={`/tools/${slug}`} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
            Open {tool.name}
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
          </Link>
        </div>

        <div className="mt-8 flex gap-3 text-sm">
          <Link href={`/tools/${slug}/faq`} className="text-blue-600 hover:text-blue-800 font-medium">FAQ &rarr;</Link>
          <Link href={`/tools/${slug}/alternatives`} className="text-blue-600 hover:text-blue-800 font-medium">Alternatives &rarr;</Link>
        </div>
      </article>
    </div>
  );
}
