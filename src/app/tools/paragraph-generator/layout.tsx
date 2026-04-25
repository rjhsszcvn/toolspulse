import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("paragraph-generator");
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
