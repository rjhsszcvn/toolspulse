import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("mp3-converter");
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
