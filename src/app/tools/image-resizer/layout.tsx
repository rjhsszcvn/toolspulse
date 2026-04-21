import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("image-resizer");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
