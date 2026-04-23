import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("pdf-page-rotator");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}