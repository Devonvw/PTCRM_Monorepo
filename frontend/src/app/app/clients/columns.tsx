"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { DataTableRowActions } from "@/components/ui/data-table/data-table-row-actions";

interface IClient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  housenumber: string;
  housenumberExtra: string;
  zipCode: string;
  city: string;
  country: string;
}

export const columns: ColumnDef<IClient>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="No." />
    ),
    cell: ({ row }) => <div className="w-[0px]">{row.getValue("id")}</div>,
    enableSorting: false,
  },
  {
    id: "fullName",
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Full name" />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
  },
  {
    id: "address",
    accessorFn: (row) =>
      `${row?.street ?? "-"} ${row?.housenumber ?? "-"}${
        row?.housenumberExtra ? row?.housenumberExtra : ""
      }, ${row?.zipCode ?? "-"} ${row?.city ?? "-"} ${row?.country ?? "-"}`,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => <DataTableRowActions row={row} />,
  // },
];
