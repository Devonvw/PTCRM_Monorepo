export interface IFilterOption {
  id: number;
  title: string;
  meta: {
    key: string;
  };
  icon?: React.ElementType<{ className: string }>;
}

export interface IFilterProps {
  id: number;
  title: string;
  key: string;
  selected: IFilterOption[];
  options: IFilterOption[];
  type?: string;
  value?: string;
}

export interface IPaginationProps {
  pageIndex: number;
  pageSize: number;
}

export interface IOnChangeProps {
  pagination: IPaginationProps;
  filters: IFilterProps[];
  search: { search: string };
  sort: { orderByColumn: string; orderDirection: string };
}
