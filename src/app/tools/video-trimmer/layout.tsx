import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("video-trimmer");
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
