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

const AccountBillingPage = () => {
  const { getPaymentsByMe, payments } = usePayments();

  const { state, reload } = useTable({
    onChange: getPaymentsByMe,
    filterOptions: [],
    sortingDefault: [{ id: "date", desc: true }],
  });

  return (
    <div>
      <DataTable
        columns={columns}
        data={payments}
        onChange={getPaymentsByMe}
        {...state}
      />
    </div>
  );
};

export default AccountBillingPage;
