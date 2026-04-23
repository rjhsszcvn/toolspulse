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

  const title = `${tool.name} FAQ — Common Questions Answered | ${siteConfig.name}`;
  const description = `Frequently asked questions about ${tool.name}. Learn about features, privacy, file limits, and more.`;

  return {
    title,
    description,
    keywords: [...tool.keywords, `${tool.name.toLowerCase()} faq`, `${tool.name.toLowerCase()} questions`],
    openGraph: { title, description, url: `${siteConfig.url}/tools/${slug}/faq`, siteName: siteConfig.name, type: "website" },
    twitter: { card: "summary_large_image", title, description },
    alternates: { canonical: `${siteConfig.url}/tools/${slug}/faq` },
  };
}

export default async function FaqPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  const content = getToolContent(slug);
  if (!tool || !content) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
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
            <span className="text-slate-900 font-medium">FAQ</span>
          </nav>
        </div>
      </div>

      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl tracking-tight">{tool.name} — Frequently Asked Questions</h1>
        <p className="mt-3 text-slate-500">Everything you need to know about using {tool.name}.</p>

        <div className="mt-8 space-y-3">
          {content.faq.map((item, i) => (
            <details key={i} className="group rounded-xl border border-slate-200 bg-white">
              <summary className="flex cursor-pointer items-center justify-between p-5 text-sm font-semibold text-slate-900">
                {item.question}
                <svg className="h-4 w-4 text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
              </summary>
              <p className="px-5 pb-5 text-sm text-slate-600 leading-relaxed">{item.answer}</p>
            </details>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-blue-200 bg-blue-50 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-slate-900">Try {tool.name} now</h2>
          <p className="mt-1 text-sm text-slate-600">{tool.shortDescription}. Free, no signup, 100% private.</p>
          <Link href={`/tools/${slug}`} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
            Open {tool.name}
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
          </Link>
        </div>

        <div className="mt-8 flex gap-3 text-sm">
          <Link href={`/tools/${slug}/how-to`} className="text-blue-600 hover:text-blue-800 font-medium">How-To Guide &rarr;</Link>
          <Link href={`/tools/${slug}/alternatives`} className="text-blue-600 hover:text-blue-800 font-medium">Alternatives &rarr;</Link>
        </div>
      </article>
    </div>
  );
}
