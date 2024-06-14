"use client";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import PageHeader from "@/components/ui/page-header";
import useTable from "@/hooks/useTable";
import { useClients } from "@/stores/useClients";
import { PlusCircle } from "lucide-react";
import { columns } from "./columns";
import CreateClientModal from "./modals/create-modal";

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
