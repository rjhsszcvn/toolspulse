import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("audio-joiner");
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
