import type { Metadata } from "next";
import { categories, type ToolCategory, tools } from "@/config/tools";
import { siteConfig } from "@/config/site";

const categoryDescriptions: Record<string, string> = {
  pdf: "Free online PDF tools — convert, compress, merge, and split PDF files instantly in your browser. No signup, no file uploads, 100% private.",
  image: "Free online image tools — compress, resize, and remove backgrounds from images. No uploads needed, everything runs in your browser.",
  converter: "Free online file converters — convert between JPG, PNG, WebP, SVG, HEIC, PDF and more. Instant, private, no signup required.",
  audio: "Free online audio tools — convert MP3, WAV, OGG files, trim audio, and adjust quality. Browser-based, no software to install.",
  text: "Free online text tools — extract text from images with OCR, count words, and process text. Fast, private, and no registration needed.",
  generator: "Free online generators — create QR codes, invoices, resumes, passwords, and more. Download-ready output with no account needed.",
  developer: "Free developer tools — format JSON, pick colors, generate favicons. Lightweight browser utilities for web developers and designers.",
  ai: "Free AI-powered tools — rewrite text, upscale images, and check grammar with artificial intelligence. No signup, instant results.",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = categories[slug as ToolCategory];

  if (!category) return {};

  const categoryTools = tools.filter((t) => t.category === slug);
  const title = `${category.label} — Free Online ${category.label} | ${siteConfig.name}`;
  const description = categoryDescriptions[slug] || category.description;

  return {
    title,
    description,
    keywords: categoryTools.flatMap((t) => t.keywords).slice(0, 15),
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/category/${slug}`,
      siteName: siteConfig.name,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `${siteConfig.url}/category/${slug}`,
    },
  };
}

export default async function CategoryLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = categories[slug as ToolCategory];

  if (!category) return <>{children}</>;

  const categoryTools = tools.filter((t) => t.category === slug);
  const description = categoryDescriptions[slug] || category.description;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.label,
    description,
    url: `${siteConfig.url}/category/${slug}`,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: categoryTools.length,
      itemListElement: categoryTools.map((tool, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "WebApplication",
          name: tool.name,
          description: tool.shortDescription,
          url: `${siteConfig.url}/tools/${tool.slug}`,
          applicationCategory: "UtilitiesApplication",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
        },
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
