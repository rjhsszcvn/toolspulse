import { siteConfig } from "@/config/site";

export const metadata = {
  title: "Contact",
  description: `Contact ${siteConfig.name}. Get in touch with questions, feedback, or suggestions about our free online tools.`,
  alternates: {
    canonical: `${siteConfig.url}/contact`,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
