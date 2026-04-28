import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("screen-recorder");
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
