import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("video-to-gif");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
