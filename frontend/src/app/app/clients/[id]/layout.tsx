import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client",
  description: "Manage client details.",
};

interface ClientDetailLayoutProps {
  children: React.ReactNode;
}

export default async function ClientDetailLayout({
  children,
}: ClientDetailLayoutProps) {
  return children;
}
