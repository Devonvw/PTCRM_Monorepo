import { Metadata } from "next";
import Image from "next/image";

import PageHeader from "@/components/ui/page-header";
import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import { API_URL } from "@/constants";
import { IPage } from "@/interfaces/page";
import { redirect } from "next/navigation";

const sidebarNavItems = (id: string) => [
  {
    title: "Overview",
    href: `/app/clients/${id}`,
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
    title: "Information",
    href: `/app/clients/${id}/information`,
  },
];

interface ClientDetailLayoutProps {
  children: React.ReactNode;
  client: any;
  loading?: boolean;
}

export default function ClientDetailLayout({
  children,
  client,
  loading,
}: ClientDetailLayoutProps) {
  return (
    <>
      <div className="hidden space-y-6 md:block">
        <PageHeader
          title={`${client?.firstName} ${client?.lastName}`}
          description="Manage client details."
          breadcrumbs={[
            { title: "Clients", href: "/app/clients" },
            { title: `${client?.firstName} ${client?.lastName}` },
          ]}
          loading={loading}
          withLoading
        ></PageHeader>
        <Separator />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems(client?.id)} />
          </aside>
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </>
  );
}
