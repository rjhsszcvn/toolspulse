import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("youtube-thumbnail-downloader");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
