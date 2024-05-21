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
import useTable from "@/hooks/useTable";
import Link from "next/link";
import { usePayments } from "@/stores/usePayments";
import { useInvoices } from "@/stores/useInvoices";

const AccountBillingPage = () => {
  const { getInvoicesByMe, invoices } = useInvoices();

  const { state, reload } = useTable({
    onChange: getInvoicesByMe,
    filterOptions: [],
    sortingDefault: [{ id: "date", desc: true }],
  });

  return (
    <div>
      <DataTable columns={columns} data={invoices} noSearch {...state} />
    </div>
  );
};

export default AccountBillingPage;
