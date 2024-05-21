import { IReload } from "@/interfaces/reload";
import toastError from "@/utils/toast-error";
import axios from "axios";
import { Router } from "next/router";
import toast from "react-hot-toast";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useInvoices = create((set: any, get: any) => ({
  invoices: [] as any[],
  loading: undefined,
  getInvoicesByMe: async (modules: {
    pagination?: any;
    search?: any;
    sort?: any;
    filters?: any;
  }): Promise<number> => {
    try {
      const { data } = await axios.get(`/backend/invoice/my-invoices`, {
        params: {
          ...modules.pagination,
          ...modules.search,
          ...modules.sort,
          ...modules.filters,
        },
      });
      set((state: any) => ({
        invoices: data?.data,
      }));
      return data?.totalRows;
    } catch (e: any) {
      return 0;
    }
  },
}));
