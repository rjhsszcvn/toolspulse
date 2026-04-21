"use client";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import ImageConverter from "@/components/tools/ImageConverter";
const tool = getToolBySlug("svg-to-png")!;
export default function Page() {
  return <ToolPageLayout tool={tool}><ImageConverter fromFormat="SVG" toFormat="PNG" outputMime="image/png" outputExt="png" acceptTypes="image/svg+xml,.svg" /></ToolPageLayout>;
}
