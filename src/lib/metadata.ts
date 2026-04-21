import { Metadata } from "next";
import { getToolBySlug } from "@/config/tools";
import { siteConfig } from "@/config/site";

export function generateToolMetadata(slug: string): Metadata {
  const tool = getToolBySlug(slug);
  if (!tool) return {};

  const title = `${tool.name} — Free Online ${tool.name} | ${siteConfig.name}`;
  const description = tool.description;

  return {
    title,
    description,
    keywords: tool.keywords,
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/tools/${tool.slug}`,
      siteName: siteConfig.name,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `${siteConfig.url}/tools/${tool.slug}`,
    },
  };
}
