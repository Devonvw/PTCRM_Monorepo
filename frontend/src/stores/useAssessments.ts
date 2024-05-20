import { IReload } from "@/interfaces/reload";
import toastError from "@/utils/toast-error";
import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useAssessments = create((set: any, get: any) => ({
  assessment: {} as any,
  assessments: [],
  clientGoalsToMeasure: [],
  loading: undefined,
  reload: false,
  getClientGoalsToMeasure: async (modules: {
    pagination: [pageIndex: number, pageSize: number];
    clientId: number;
  }): Promise<number> => {
    set({ loading: true });
    try {
      const { data } = await axios.get("/backend/client-goals", {
        params: {
          // ...modules.pagination,
          clientId: modules.clientId,
          pageIndex: modules.pagination[0],
          pageSize: modules.pagination[1],
        },
      });
      set(() => ({
        clientGoalsToMeasure: data?.data,
      }));
      return data?.totalRows;
    } catch (e: any) {
      return 0;
    } finally {
      set({ loading: false });
    }
  },
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
    measurements: { clientGoalId: number; value: string }[],
    notes?: string
  ) => {
    set({ loading: true });
    try {
      await axios.post("/backend/assessments/complete", {
        clientId,
        measurements,
        notes,
      });

      toast.success("Assessment saved");
    } catch (e: any) {
      toastError(e?.response?.data?.message);
    } finally {
      set({ loading: false });
    }
  },
  getAssessments: async (modules: {
    pagination?: any;
    search?: any;
    sort?: any;
    filters?: any;
    clientId: number;
  }): Promise<number> => {
    set({ loading: true });
    try {
      const { data } = await axios.get("/backend/assessments", {
        params: {
          clientId: modules.clientId,
          ...modules.pagination,
          ...modules.search,
          ...modules.sort,
          ...modules.filters,
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
  getAssessment: async (assessmentId: number) => {
    set({ loading: true });
    try {
      const { data } = await axios.get(`/backend/assessments/${assessmentId}`);
      set({ assessment: data });
    } catch (e: any) {
      toastError(e?.response?.data?.message);
    } finally {
      set({ loading: false });
    }
  },
  deleteAssessment: async (assessmentId: number, reload?: IReload) => {
    set({ loading: true });
    try {
      await axios.delete(`/backend/assessments/${assessmentId}`);

      if (reload) reload();
      toast.success("Assessment deleted.");
    } catch (e: any) {
      toastError(e?.response?.data?.message);
    } finally {
      set({ loading: false });
    }
  },
  filterOptions: [
    {
      id: 1,
      title: "Notes",
      key: "notes",
      selected: [],
      options: [
        {
          id: 1,
          title: "Has notes",
          meta: { key: "true" },
        },
        {
          id: 2,
          title: "Does not have notes",
          meta: { key: "false" },
        },
      ],
    },
    {
      id: 2,
      title: "From date",
      key: "fromDate",
      selected: [],
      options: [],
    },
    {
      id: 3,
      title: "Till date",
      key: "tillDate",
      selected: [],
      options: [],
    },
  ],
  addOrUpdateModalOpen: false,
  setAddOrUpdateModalOpen: (open: boolean) =>
    set({ addOrUpdateModalOpen: open }),
  deleteModalOpen: false,
  setDeleteModalOpen: (open: boolean) => set({ deleteModalOpen: open }),
  viewModalOpen: false,
  setViewModalOpen: (open: boolean) => set({ viewModalOpen: open }),
}));
