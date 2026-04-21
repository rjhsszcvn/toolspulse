import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("merge-pdf");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
