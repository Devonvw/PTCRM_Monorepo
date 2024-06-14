import IFilterOption from "@/interfaces/filter-option";
import { IReload } from "@/interfaces/reload";
import ITableRequest from "@/interfaces/table-request";
import toastError from "@/utils/toast-error";
import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

export interface IAssessment {
  id: number;
  performedAt: Date;
  notes: string;
  measurements: any;
}

interface IClientGoal {
  [key: string]: any;
}

interface IUseAssessmentsStore {
  assessment?: IAssessment;
  assessments: IAssessment[];
  clientGoalsToMeasure: IClientGoal[];
  loading: boolean | undefined;
  reload: boolean;
  getClientGoalsToMeasure: (modules: {
    pagination: [pageIndex: number, pageSize: number];
    clientId: number;
  }) => Promise<number>;
  getAllUncompletedClientGoals: (clientId: number) => Promise<number | void>;
  initiateAssessment: (clientId: number) => Promise<void>;
  completeAssessment: (
    clientId: number,
    measurements: { clientGoalId: number; value: string }[],
    notes?: string
  ) => Promise<void>;
  getAssessments: (
    modules: ITableRequest & {
      clientId: number;
    }
  ) => Promise<number>;
  getAssessment: (assessmentId: number) => Promise<void>;
  deleteAssessment: (assessmentId: number, reload?: IReload) => Promise<void>;
  filterOptions: IFilterOption[];
  addOrUpdateModalOpen: boolean;
  setAddOrUpdateModalOpen: (open: boolean) => void;
  deleteModalOpen: boolean;
  setDeleteModalOpen: (open: boolean) => void;
  viewModalOpen: boolean;
  setViewModalOpen: (open: boolean) => void;
}

export const useAssessments = create<IUseAssessmentsStore>((set) => ({
  assessment: undefined,
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
  getAllUncompletedClientGoals: async (clientId: number) => {
    try {
      const { data } = await axios.get(`/backend/client-goals/uncompleted/`, {
        params: {
          clientId: clientId,
        },
      });
      set(() => ({
        clientGoalsToMeasure: data?.data,
      }));
      return data?.totalRows;
    } catch (e: any) {
      toastError(e?.response?.data?.message);
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
  getAssessments: async (
    modules: ITableRequest & {
      clientId: number;
    }
  ): Promise<number> => {
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
  filterOptions: [],
  addOrUpdateModalOpen: false,
  setAddOrUpdateModalOpen: (open: boolean) =>
    set({ addOrUpdateModalOpen: open }),
  deleteModalOpen: false,
  setDeleteModalOpen: (open: boolean) => set({ deleteModalOpen: open }),
  viewModalOpen: false,
  setViewModalOpen: (open: boolean) => set({ viewModalOpen: open }),
}));
