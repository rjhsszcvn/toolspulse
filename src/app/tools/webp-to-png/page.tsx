"use client";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import ImageConverter from "@/components/tools/ImageConverter";
const tool = getToolBySlug("webp-to-png")!;
export default function Page() {
  return <ToolPageLayout tool={tool}><ImageConverter fromFormat="WebP" toFormat="PNG" outputMime="image/png" outputExt="png" acceptTypes="image/webp,.webp" /></ToolPageLayout>;
}
