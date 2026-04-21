import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("background-remover");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
