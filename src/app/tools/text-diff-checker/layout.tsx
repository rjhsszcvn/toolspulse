import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("text-diff-checker");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
