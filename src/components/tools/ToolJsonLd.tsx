import { Tool } from "@/config/tools";
import { siteConfig } from "@/config/site";

export default function ToolJsonLd({ tool }: { tool: Tool }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": tool.name,
    "description": tool.description,
    "url": `${siteConfig.url}/tools/${tool.slug}`,
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "publisher": {
      "@type": "Organization",
      "name": siteConfig.name,
      "url": siteConfig.url
    },
    "browserRequirements": "Requires a modern web browser with JavaScript enabled",
    "softwareVersion": "1.0",
    "featureList": [
      "Free to use",
      "No signup required",
      "No file uploads to server",
      "Works in browser",
      "Mobile friendly"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
