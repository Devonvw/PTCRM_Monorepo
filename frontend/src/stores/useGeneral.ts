import toastError from "@/utils/toast-error";
import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useGeneral = create((set: any, get: any) => ({
  dashboardData: {} as any,
  getUserDashboard: async () => {
    try {
      const { data } = await axios.get("/backend/general/dashboard");

      set({ dashboardData: data });
    } catch (error: any) {}
  },
}));
