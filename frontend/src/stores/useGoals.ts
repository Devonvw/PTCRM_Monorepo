import { IReload } from "@/interfaces/reload";
import toastError from "@/utils/toast-error";
import axios from "axios";
import { create } from "zustand";

export interface IGoal {
  [key: string]: any;
}

interface IUseGoalsStore {
  goal: IGoal;
  goals: IGoal[];
  loading: boolean | undefined;
  getAllGoals: () => Promise<number>;
  getGoal: (id: string, initialLoad?: boolean) => Promise<void>;
  createGoal: (goal: IGoal, reload?: IReload) => Promise<void>;
  updateGoal: (goal: IGoal, reload?: IReload) => Promise<void>;
  deleteGoal: (id: string, reload?: IReload) => Promise<void>;
  filterOptions: {
    label: string;
    value: string;
  }[];
  addModalOpen: boolean;
  setAddModalOpen: (open: boolean) => void;
}

export const useGoals = create<IUseGoalsStore>((set: any, get: any) => ({
  goal: {} as any,
  goals: [],
  loading: undefined,
  getAllGoals: async () => {
    try {
      const { data } = await axios.get("/backend/goals/all");
      set({
        goals: data?.data,
      });
      return data?.totalRows;
    } catch (e: any) {
      toastError(e?.response?.data?.message);
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
