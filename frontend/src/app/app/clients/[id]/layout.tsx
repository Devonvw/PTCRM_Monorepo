import { Metadata } from "next";
import Image from "next/image";

import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import PageHeader from "@/components/ui/page-header";
import { useClients } from "@/stores/useClients";
import { useEffect } from "react";
import { IPage } from "@/interfaces/page";
import { API_URL } from "@/constants";

export async function generateMetadata({
  params,
  searchParams,
}: IPage): Promise<Metadata> {
  const { id } = params;

  const data = await fetch(`${API_URL}/clients/${id}`, {
    headers: {
      "X-API-KEY": `${process.env.API_KEY}`,
    },
  }).then((res) => res.json());

  return {
    title: `${data?.firstName} ${data?.lastName}`,
    description: `Manage ${data?.firstName} ${data?.lastName} details.`,
  };
}

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
    title: "Preferences",
    href: `/app/clients/${id}/preferences`,
  },
  {
    title: "Contact information",
    href: `/app/clients/${id}/contact-information`,
  },
];

interface ClientDetailLayoutProps {
  children: React.ReactNode;
  params: { id: string };
}

const getData = async (id: string) => {
  return await fetch(`${API_URL}/clients/${id}`, {
    headers: {
      "X-API-KEY": `${process.env.API_KEY}`,
    },
  }).then((res) => res.json());
};

export default async function ClientDetailLayout({
  children,
  params: { id },
}: ClientDetailLayoutProps) {
  const client = await getData(id);

  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/forms-light.png"
          width={1280}
          height={791}
          alt="Forms"
          className="block dark:hidden"
        />
        <Image
          src="/examples/forms-dark.png"
          width={1280}
          height={791}
          alt="Forms"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden space-y-6 pb-16 md:block">
        <PageHeader
          title={`${client?.firstName} ${client?.lastName}`}
          description="Manage client details."
          breadcrumbs={[
            { title: "Clients", href: "/app/clients" },
            { title: `${client?.firstName} ${client?.lastName}` },
          ]}
        ></PageHeader>
        <Separator className="!bg-light" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems(id)} />
          </aside>
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </>
  );
}
