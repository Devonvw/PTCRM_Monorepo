import ITableRequest from "@/interfaces/table-request";
import toastError from "@/utils/toast-error";
import axios from "axios";
import { create } from "zustand";

interface ISubscription {
  [key: string]: any;
}

interface IPayment {
  [key: string]: any;
}

interface IUsePaymentsStore {
  subscriptions: ISubscription[];
  payments: IPayment[];
  loading: boolean | undefined;
  getSubscriptions: (initialLoad?: boolean) => Promise<void>;
  getPaymentsByMe: (modules: ITableRequest) => Promise<number>;
}

export const usePayments = create<IUsePaymentsStore>((set) => ({
  subscriptions: [],
  payments: [],
  loading: undefined,
  getSubscriptions: async (initialLoad?: boolean) => {
    if (initialLoad) set({ loading: true });
    try {
      const { data } = await axios.get(`/backend/payment/subscriptions`);
      set({
        subscriptions: data,
      });
    } catch (e: any) {
      toastError(e?.response?.data?.message);
    } finally {
      set({ loading: false });
    }
  },
  getPaymentsByMe: async (modules: ITableRequest): Promise<number> => {
    try {
      const { data } = await axios.get(`/backend/payment/my-payments`, {
        params: {
          ...modules.pagination,
          ...modules.search,
          ...modules.sort,
          ...modules.filters,
        },
      });
      set({
        payments: data?.data,
      });
      return data?.totalRows;
    } catch (e: any) {
      return 0;
    }
  },
}));
