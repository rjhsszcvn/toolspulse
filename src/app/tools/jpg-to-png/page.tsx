"use client";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import ImageConverter from "@/components/tools/ImageConverter";
const tool = getToolBySlug("jpg-to-png")!;
export default function Page() {
  return <ToolPageLayout tool={tool}><ImageConverter fromFormat="JPG/JPEG" toFormat="PNG" outputMime="image/png" outputExt="png" acceptTypes="image/jpeg,.jpg,.jpeg" /></ToolPageLayout>;
}
