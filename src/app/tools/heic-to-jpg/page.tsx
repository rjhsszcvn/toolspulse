"use client";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import ImageConverter from "@/components/tools/ImageConverter";
const tool = getToolBySlug("heic-to-jpg")!;
export default function Page() {
  return <ToolPageLayout tool={tool}><ImageConverter fromFormat="HEIC" toFormat="JPG" outputMime="image/jpeg" outputExt="jpg" acceptTypes="image/heic,image/heif,.heic,.heif" quality={0.92} /></ToolPageLayout>;
}
