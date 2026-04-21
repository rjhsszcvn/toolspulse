import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("word-counter");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
