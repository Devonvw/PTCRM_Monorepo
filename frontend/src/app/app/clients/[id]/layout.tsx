import { Metadata } from "next";
import Image from "next/image";

import PageHeader from "@/components/ui/page-header";
import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import { API_URL } from "@/constants";
import { IPage } from "@/interfaces/page";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Client",
  description: "Manage client details.",
};

const sidebarNavItems = (id: string) => [
  {
    title: "Overview",
    href: `/app/clients/${id}`,
  },
  {
    title: "Progress",
    href: `/app/clients/${id}/progress`,
  },
  {
    title: "Goals",
    href: `/app/clients/${id}/goals`,
  },
  {
    title: "Assessments",
    href: `/app/clients/${id}/assessments`,
  },
  {
    title: "Preferences",
    href: `/app/clients/${id}/preferences`,
  },
  {
    title: "Information",
    href: `/app/clients/${id}/information`,
  },
];

interface ClientDetailLayoutProps {
  children: React.ReactNode;
  params: { id: string };
}

export default async function ClientDetailLayout({
  children,
  params: { id },
}: ClientDetailLayoutProps) {
  return children;
}
