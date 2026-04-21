"use client";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import ImageConverter from "@/components/tools/ImageConverter";
const tool = getToolBySlug("png-to-jpg")!;
export default function Page() {
  return <ToolPageLayout tool={tool}><ImageConverter fromFormat="PNG" toFormat="JPG" outputMime="image/jpeg" outputExt="jpg" acceptTypes="image/png,.png" quality={0.92} /></ToolPageLayout>;
}
