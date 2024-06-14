"use client";
import { DataTable } from "@/components/ui/data-table";
import useTable from "@/hooks/useTable";
import { useInvoices } from "@/stores/useInvoices";
import { columns } from "./columns";

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
