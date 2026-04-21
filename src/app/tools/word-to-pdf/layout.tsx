import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("word-to-pdf");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
