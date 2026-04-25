import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("video-compressor");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
