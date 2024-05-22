"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/ui/data-table/data-table-view-options";
import type { IFilterOption, IFilterProps } from "./interfaces";

import { DataTableFilter } from "./data-table-filter";
import { XCircleIcon } from "lucide-react";
import DebouncedInput from "../debounce-input";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filters: IFilterProps[];
  setFilters: (filters: IFilterProps[]) => void;
  search: string;
  setSearch: (search: string) => void;
  noSearch?: boolean;
}

export function DataTableToolbar<TData>({
  table,
  filters,
  setFilters,
  search,
  setSearch,
  noSearch,
}: DataTableToolbarProps<TData>) {
  const onChangeFilter = (filter: IFilterProps, selected: IFilterOption[]) => {
    const newFilters = filters.map((f) => {
      if (f.id === filter.id) {
        return {
          ...f,
          selected,
        };
      }

      return f;
    });

    setFilters(newFilters);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          {!noSearch && (
            <DebouncedInput
              placeholder="Search..."
              value={search}
              onChange={(value) => setSearch(value)}
              debounce={500}
              className="h-8 w-[150px] lg:w-[250px]"
            />
          )}
          {filters.map((filter) => (
            <DataTableFilter
              key={filter.id}
              filter={filter}
              onChange={onChangeFilter}
            />
          ))}
        </div>
      </div>
      <ul className="flex items-center flex-wrap gap-2">
        <li className="font-bold uppercase text-secondary text-sm">Filters</li>
        {filters?.map((filter: any) =>
          !filter?.type ? (
            filter?.selected?.map((option: any, index: number) => (
              <li
                key={index}
                className="bg-accent/20 text-gray-300 text-sm font-semibold pl-2 rounded flex gap-x-1 items-center justify-center"
              >
                {option?.title}
                <Button
                  variant="ghost"
                  className="h-fit p-0"
                  onClick={() => onChangeFilter(filter, [])}
                >
                  <XCircleIcon className="h-3 w-3 text-gray-300 hover:text-accent hover:text-secondary" />
                </Button>
              </li>
            ))
          ) : filter?.value ? (
            <li
              key={`V${filter?.id}`}
              className="bg-accent/20 text-primary text-sm font-semibold px-2 rounded flex gap-x-1"
            >
              {filter?.name}: {filter?.value}
            </li>
          ) : null
        )}
      </ul>
    </>
  );
}
