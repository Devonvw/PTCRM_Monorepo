"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { ViewButton } from "./components/ViewButton";

interface IAssessment {
  id: number;
  performedAt: Date;
  notes: string;
  measurements: any;
}

const getFormattedDate = (date: Date) => {
  return new Date(date).toLocaleString("en-GB");
};

export const columns: ColumnDef<IAssessment>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='No.' />
    ),
    cell: ({ row }) => <div className='w-[0px]'>{row.getValue("id")}</div>,
    enableSorting: false,
  },
  {
    id: "performedAt",
    accessorFn: (row) => `${getFormattedDate(row.performedAt)}`,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Performed at' />
    ),
  },
  {
    id: "notes",
    accessorFn: (row) => `${row.notes !== null ? "Yes" : "No"}`,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Notes' />
    ),
    enableSorting: false,
  },
  {
    id: "measurements",
    accessorFn: (row) => `${row.measurements.length}`,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nr of measurements' />
    ),
    enableSorting: false,
  },
  {
    id: "viewButton",
    header: ({ column }) => <DataTableColumnHeader column={column} title='' />,
    cell: ({ row }) => (
      <div className='flex justify-end'>
        <ViewButton assessmentId={row.original.id} />
      </div>
    ),
    enableSorting: false,
  },
];
