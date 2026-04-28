import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("voice-recorder");
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
