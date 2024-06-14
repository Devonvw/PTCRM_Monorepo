import toastError from "@/utils/toast-error";
import axios from "axios";
import { create } from "zustand";

interface IDashboardData {
  [key: string]: any;
}

interface IUseGeneralStore {
  dashboardData: IDashboardData;
  getUserDashboard: () => Promise<void>;
}

export const useGeneral = create<IUseGeneralStore>((set) => ({
  dashboardData: {},
  getUserDashboard: async () => {
    try {
      const { data } = await axios.get("/backend/general/dashboard");

      set({ dashboardData: data });
    } catch (error: any) {
      toastError(error?.response?.data?.message);
    }
  },
}));
