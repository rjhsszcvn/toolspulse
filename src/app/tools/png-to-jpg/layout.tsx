import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("png-to-jpg");
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
