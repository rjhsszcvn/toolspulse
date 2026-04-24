import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("json-to-csv");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
