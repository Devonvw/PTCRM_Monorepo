"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import PageHeader from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { useClients } from "@/stores/useClients";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import CreateClientModal from "./modals/create-modal";
import useTable from "@/hooks/useTable";
import Link from "next/link";

const Clients = () => {
  const { getClients, clients, filterOptions, addModalOpen, setAddModalOpen } =
    useClients();

  const { state, reload } = useTable({
    onChange: getClients,
    filterOptions,
  });
  return (
    <div>
      <PageHeader title="Clients" breadcrumbs={[{ title: "Clients" }]}>
        <PageHeader.Right className="flex items-end justify-end gap-x-2">
          <Button
            size="sm"
            variant="light"
            className=""
            onClick={() => setAddModalOpen(true)}
          >
            Add <PlusCircle className="h-5 w-5" />
          </Button>
          <Link href="/app/clients/new-signup">
            <Button size="sm" variant="primary" className="">
              Add by sign up <PlusCircle className="h-5 w-5" />
            </Button>
          </Link>
        </PageHeader.Right>
      </PageHeader>
      <DataTable columns={columns} data={clients} {...state} />
      <CreateClientModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        reload={reload}
      />
    </div>
  );
};

export default Clients;
