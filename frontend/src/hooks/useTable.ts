import {
  IFilterOption,
  IFilterProps,
  IOnChangeProps,
  IPaginationProps,
} from "@/components/ui/data-table/interfaces";
import { SortingState } from "@tanstack/react-table";
import { useCallback, useEffect, useState } from "react";

interface IUseTable {
  onChange: ({
    pagination,
    filters,
    search,
    sort,
  }: IOnChangeProps) => Promise<number>;
  filterOptions: IFilterProps[];
  sortingDefault?: SortingState;
}

const useTable = ({ onChange, filterOptions, sortingDefault }: IUseTable) => {
  const [filters, setFilters] = useState<IFilterProps[]>(filterOptions);
  const [sorting, setSorting] = useState<SortingState>(sortingDefault || []);
  const [pagination, setPagination] = useState<IPaginationProps>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [rowCount, setRowCount] = useState<number>(0);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    reload();
  }, [pagination, filters, search, sorting]);

  const reload = useCallback(() => {
    let parsedFilters: any = {};
    filters.forEach((filter) => {
      parsedFilters[filter.key] = filter.selected.map(
        (option) => option.meta.key
      );
    });

    onChange({
      pagination,
      filters: parsedFilters,
      search: { search },
      sort: {
        orderByColumn: sorting?.[0]?.id,
        orderDirection: sorting?.[0]?.desc ? "DESC" : "ASC",
      },
    }).then((totalRows: number) => setRowCount(totalRows));
  }, [pagination, filters, search, sorting]);

  return {
    state: {
      filters,
      setFilters,
      sorting,
      setSorting,
      pagination,
      setPagination,
      rowCount,
      search,
      setSearch,
    },
    reload,
  };
};

export default useTable;
