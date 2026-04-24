import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("base64-encoder");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
