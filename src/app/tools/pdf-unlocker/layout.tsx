import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("pdf-unlocker");
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
