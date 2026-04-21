import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("audio-trimmer");
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
