import { IReload } from "@/interfaces/reload";
import toastError from "@/utils/toast-error";
import axios from "axios";
import { Router } from "next/router";
import toast from "react-hot-toast";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const usePayments = create((set: any, get: any) => ({
  subscriptions: [] as any[],
  payments: [] as any[],
  loading: undefined,
  getSubscriptions: async (initialLoad?: boolean) => {
    if (initialLoad) set({ loading: true });
    try {
      const { data } = await axios.get(`/backend/payment/subscriptions`);
      set((state: any) => ({
        subscriptions: data,
      }));
    } catch (e: any) {
      toastError(e?.response?.data?.message);
    } finally {
      set({ loading: false });
    }
  },
  getPaymentsByMe: async (modules: {
    pagination?: any;
    search?: any;
    sort?: any;
    filters?: any;
  }): Promise<number> => {
    try {
      const { data } = await axios.get(`/backend/payment/my-payments`, {
        params: {
          ...modules.pagination,
          ...modules.search,
          ...modules.sort,
          ...modules.filters,
        },
      });
      set((state: any) => ({
        payments: data?.data,
      }));
      return data?.totalRows;
    } catch (e: any) {
      return 0;
    }
  },
}));
