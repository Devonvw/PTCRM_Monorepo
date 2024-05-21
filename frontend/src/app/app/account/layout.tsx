import { Metadata } from "next";
import PageHeader from "@/components/ui/page-header";
import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "@/components/ui/sidebar-nav";

export const metadata: Metadata = {
  title: "Account",
  description: "Manage your account details.",
};

const sidebarNavItems = [
  {
    title: "Account",
    href: `/app/account`,
  },
  {
    title: "Billing",
    href: `/app/account/billing`,
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
  return (
    <>
      <div className="hidden space-y-6 pb-16 md:block">
        <PageHeader
          title="Account"
          breadcrumbs={[
            {
              title: "Account",
            },
          ]}
        />
        <Separator />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </>
  );
}
