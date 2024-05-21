"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { DataTableRowActions } from "@/components/ui/data-table/data-table-row-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import dayjs from "dayjs";
import { DownloadIcon } from "lucide-react";

interface IPayment {
  id: number;
  totalPrice: number;
  vatPrice: number;
  date: string;
}

export const columns: ColumnDef<IPayment>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="No." />
    ),
    cell: ({ row }) => <div className="w-[0px]">{row.getValue("id")}</div>,
    enableSorting: false,
  },
  {
    id: "totalPrice",
    accessorFn: (row) => `${row.totalPrice}`,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total" />
    ),
    enableSorting: false,
  },
  {
    id: "vatPrice",
    accessorFn: (row) => `${row.vatPrice}`,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Vat" />
    ),
    enableSorting: false,
  },
  {
    id: "date",
    accessorFn: (row) => `${dayjs(row.date).format("YYYY-MM-DD")}`,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
  },
  {
    accessorKey: "actions",
    header: ({ column }) => <DataTableColumnHeader column={column} title="" />,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Link
          href={`/backend/invoice/${row.getValue("id")}/download`}
          className="hover:text-secondary"
        >
          <DownloadIcon className="h-5 w-5" />
        </Link>
      </div>
    ),
    enableSorting: false,
  },
  // },
  // {
  //   id: "actions",
  //   cell: ({ row }) => <DataTableRowActions row={row} />,
  // },
];
