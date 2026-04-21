import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("ai-image-upscaler");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
