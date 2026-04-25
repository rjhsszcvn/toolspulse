import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("essay-writer");
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
