import { tools, categories, type ToolCategory } from "@/config/tools";
import { getBlogPosts } from "@/config/blog";
import { siteConfig } from "@/config/site";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const toolPages = tools.flatMap((tool) => [
    {
      url: `${siteConfig.url}/tools/${tool.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: tool.tier === 1 ? 0.9 : tool.tier === 2 ? 0.8 : 0.7,
    },
    {
      url: `${siteConfig.url}/tools/${tool.slug}/how-to`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/tools/${tool.slug}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${siteConfig.url}/tools/${tool.slug}/alternatives`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
  ]);

  const categoryPages = (Object.keys(categories) as ToolCategory[]).map((key) => ({
    url: `${siteConfig.url}/category/${key}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const blogPages = getBlogPosts().map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const staticPages = ["about", "contact", "privacy", "terms", "blog"].map((page) => ({
    url: `${siteConfig.url}/${page}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: page === "blog" ? 0.7 : 0.4,
  }));

  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...categoryPages,
    ...toolPages,
    ...blogPages,
    ...staticPages,
  ];
}
