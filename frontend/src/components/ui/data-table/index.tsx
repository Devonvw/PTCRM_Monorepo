"use client";

import React, { useState, useEffect } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import type {
  IFilterProps,
  IOnChangeProps,
  IPaginationProps,
} from "./interfaces";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onChange: ({
    pagination,
    filters,
    search,
  }: IOnChangeProps) => Promise<number>;
  filterOptions: IFilterProps[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onChange,
  filterOptions,
}: DataTableProps<TData, TValue>) {
  const [filters, setFilters] = useState<IFilterProps[]>(filterOptions);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<IPaginationProps>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [rowCount, setRowCount] = useState<number>();
  const [search, setSearch] = useState<string>("");

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination,
    },
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    // onSortingChange: setSorting,
    onPaginationChange: setPagination,
    manualFiltering: true,
    manualPagination: true,
    rowCount,
    getSortedRowModel: getSortedRowModel(),
  });

  useEffect(() => {
    let parsedFilters: any = {};
    filters.forEach((filter) => {
      parsedFilters[filter.key] = filter.selected.map(
        (option) => option.meta.key
      );
    });

    onChange({ pagination, filters: parsedFilters, search: { search } }).then(
      (totalRows: number) => setRowCount(totalRows)
    );
  }, [pagination, filters, search]);

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        filters={filters}
        setFilters={setFilters}
        search={search}
        setSearch={setSearch}
      />
      <div className="rounded-md border-[0.5px] border-gray-600 bg-slate-950">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b-[0.5px] border-gray-600"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-b-[0.5px] border-gray-600"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
