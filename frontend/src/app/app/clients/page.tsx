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

const Clients = () => {
  const { getClients, clients, filterOptions } = useClients();
  return (
    <div>
      <PageHeader title="Clients" breadcrumbs={[{ title: "Clients" }]} />
      <DataTable
        columns={columns}
        data={clients}
        onChange={getClients}
        filterOptions={filterOptions}
      />
    </div>
  );
};

export default Clients;
