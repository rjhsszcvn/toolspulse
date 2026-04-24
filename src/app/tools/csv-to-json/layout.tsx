import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("csv-to-json");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}