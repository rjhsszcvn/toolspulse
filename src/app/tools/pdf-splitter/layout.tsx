import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("pdf-splitter");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}