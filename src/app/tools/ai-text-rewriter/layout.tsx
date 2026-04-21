import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("ai-text-rewriter");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
