"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { DataTableRowActions } from "@/components/ui/data-table/data-table-row-actions";
import { Badge } from "@/components/ui/badge";

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
  active: boolean;
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
    id: "address",
    accessorFn: (row) =>
      `${row?.street ?? "-"} ${row?.housenumber ?? "-"}${
        row?.housenumberExtra ? row?.housenumberExtra : ""
      }, ${row?.zipCode ?? "-"} ${row?.city ?? "-"} ${row?.country ?? "-"}`,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
  },
  {
    accessorKey: "active",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Active" />
    ),
    cell: ({ row }) => (
      <div>
        <Badge variant={row?.original?.active ? "green" : "red"}>
          {row?.original?.active ? "Yes" : "No"}
        </Badge>
      </div>
    ),
    enableSorting: false,
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => <DataTableRowActions row={row} />,
  // },
];
