import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("color-picker");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
