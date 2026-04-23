import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("mp4-to-mp3");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}