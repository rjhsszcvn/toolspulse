import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("qr-code-generator");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
