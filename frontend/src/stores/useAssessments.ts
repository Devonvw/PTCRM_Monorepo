import toastError from "@/utils/toast-error";
import axios from "axios";
import { create } from "zustand";

export const useAssessments = create((set: any, get: any) => ({
  assessment: {} as any,
  assessments: [],
  loading: undefined,
  reload: false,
  initiateAssessment: async (clientId: number) => {
    set({ loading: true });
    try {
      await axios.get("/backend/assessments/initiate", {
        params: { clientId },
      });
    } catch (e: any) {
      toastError(e?.response?.data?.message);
    } finally {
      set({ loading: false });
    }
  },
  completeAssessment: async (
    clientId: number,
    measurements: [clientGoalId: number, value: number][],
    notes?: string
  ) => {
    set({ loading: true });
    try {
      await axios.post("/backend/assessments/complete", {
        clientId,
        measurements,
        notes,
      });
    } catch (e: any) {
      toastError(e?.response?.data?.message);
    } finally {
      set({ loading: false });
    }
  },
  getAssessments: async (modules: {
    pagination: [pageIndex: number, pageSize: number];
    filters?: any;
    clientId: number;
  }): Promise<number> => {
    set({ loading: true });
    try {
      const { data } = await axios.get("/backend/assessments", {
        params: {
          clientId: modules.clientId,
          pageIndex: modules.pagination[0],
          pageSize: modules.pagination[1],
        },
      });
      set((state: any) => ({
        assessments: data?.data,
      }));
      return data?.totalRows;
    } catch (e: any) {
      return 0;
    } finally {
      set({ loading: false });
    }
  },
}));
