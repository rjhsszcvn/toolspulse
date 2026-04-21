import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("screenshot-to-text");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
