import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("resume-builder");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
