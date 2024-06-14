import ITableRequest from "@/interfaces/table-request";
import axios from "axios";
import { create } from "zustand";

interface IInvoice {
  [key: string]: any;
}

interface IUseInvoicesStore {
  invoices: IInvoice[];
  loading: boolean | undefined;
  getInvoicesByMe: (modules: ITableRequest) => Promise<number>;
}

export const useInvoices = create<IUseInvoicesStore>((set) => ({
  invoices: [],
  loading: undefined,
  getInvoicesByMe: async (modules: ITableRequest): Promise<number> => {
    try {
      const { data } = await axios.get(`/backend/invoice/my-invoices`, {
        params: {
          ...modules.pagination,
          ...modules.search,
          ...modules.sort,
          ...modules.filters,
        },
      });
      set({
        invoices: data?.data,
      });
      return data?.totalRows;
    } catch (e: any) {
      return 0;
    }
  },
}));
