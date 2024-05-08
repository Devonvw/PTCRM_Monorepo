import { IReload } from "@/interfaces/reload";
import toastError from "@/utils/toast-error";
import axios from "axios";
import { Router } from "next/router";
import toast from "react-hot-toast";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const usePayments = create((set: any, get: any) => ({
  subscriptions: [] as any[],
  loading: undefined,
  getMySubscriptions: async (initialLoad?: boolean) => {
    if (initialLoad) set({ loading: true });
    try {
      const { data } = await axios.get(`/backend/payment/my-subscriptions`);
      set((state: any) => ({
        subscriptions: data,
      }));
    } catch (e: any) {
      toastError(e?.response?.data?.message);
    } finally {
      set({ loading: false });
    }
  },
}));
