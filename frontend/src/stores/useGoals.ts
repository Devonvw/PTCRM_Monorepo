import { IReload } from "@/interfaces/reload";
import toastError from "@/utils/toast-error";
import axios from "axios";
import { create } from "zustand";

export const useGoals = create((set: any, get: any) => ({
  goal: {} as any,
  goals: [],
  loading: undefined,

  getGoals: async (modules: {
    pagination: [pageIndex: number, pageSize: number];
    filters?: any;
  }): Promise<number> => {
    try {
      const { data } = await axios.get("/backend/goals", {
        params: {
          ...modules.filters,
          pageIndex: modules.pagination[0],
          pageSize: modules.pagination[1],
        },
      });
      set((state: any) => ({
        goals: data?.data,
      }));
      return data?.totalRows;
    } catch (e: any) {
      return 0;
    }
  },
  getGoal: async (id: string, initialLoad?: boolean) => {
    if (initialLoad) set({ loading: true });
    try {
      const { data } = await axios.get(`/backend/goals/${id}`);
      set((state: any) => ({
        selectedGoal: data,
      }));
    } catch (e: any) {
      toastError(e?.response?.data?.message);
    } finally {
      set({ loading: false });
    }
  },
  createGoal: async (goal: any, reload?: IReload) => {
    try {
      await axios.post("/backend/goals", goal);

      if (reload) reload();
    } catch (e: any) {
      toastError(e?.response?.data?.message);
    }
  },
  updateGoal: async (goal: any, reload?: IReload) => {
    try {
      await axios.put(`/backend/goals/${goal.id}`, goal);

      if (reload) reload();
    } catch (e: any) {
      toastError(e?.response?.data?.message);
    }
  },
  deleteGoal: async (id: string, reload?: IReload) => {
    try {
      await axios.delete(`/backend/goals/${id}`);

      if (reload) reload();
    } catch (e: any) {
      toastError(e?.response?.data?.message);
    }
  },
  filterOptions: [
    { label: "All", value: "all" },
    { label: "Private", value: "private" },
    { label: "Global", value: "global" },
  ],
  addModalOpen: false,
  setAddModalOpen: (open: boolean) => set({ addModalOpen: open }),
}));
