import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("wav-converter");
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
