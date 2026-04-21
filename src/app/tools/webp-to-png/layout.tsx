import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("webp-to-png");
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
