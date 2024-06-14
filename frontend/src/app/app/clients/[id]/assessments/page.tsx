"use client";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { IOnChangeProps } from "@/components/ui/data-table/interfaces";
import useTable from "@/hooks/useTable";
import { IPage } from "@/interfaces/page";
import { useAssessments } from "@/stores/useAssessments";
import { useClients } from "@/stores/useClients";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ClientDetailLayout from "../components/layout";
import { columns } from "./columns";
import PerformAssessmentModal from "./components/PerformAssessmentModal";
import ViewAssessmentModal from "./components/ViewAssessmentModal";

const ClientAssessmentsPage = ({ params: { id } }: IPage) => {
  const router = useRouter();
  const {
    getClient,
    loading: clientLoading,
    client,
    addModalOpen,
    setAddModalOpen,
    updateClient,
  } = useClients();

  useEffect(() => {
    if (client?.id != +id) getClient(id, true, router.push);
  }, [id]);

  const {
    assessment,
    assessments,
    getAssessments,
    filterOptions,
    addOrUpdateModalOpen,
    setAddOrUpdateModalOpen,
    deleteModalOpen,
    setDeleteModalOpen,
    setViewModalOpen,
  } = useAssessments();

  const { state, reload } = useTable({
    onChange: getAssessments.bind(null, Number(id)),
    filterOptions,
    sortingDefault: [{ id: "performedAt", desc: true }],
  });

  const handleTableChange = (changeProps: IOnChangeProps) => {
    // reload();
    return getAssessments(Number(id), changeProps);
  };
  const handleAssessmentCreated = () => {
    // reload();
    setAddOrUpdateModalOpen(false);
  };

  return (
    <ClientDetailLayout client={client} loading={clientLoading}>
      <div>
        <PerformAssessmentModal
          open={addOrUpdateModalOpen}
          clientId={Number(id)}
          onClose={() => handleAssessmentCreated()}
        />
        <ViewAssessmentModal onDataChange={() => reload()} />
        <div className="flex justify-end -mb-8">
          <Button
            onClick={() => setAddOrUpdateModalOpen(true)}
            size="sm"
            variant="light"
            className=" z-10"
          >
            New assessment <PlusCircle className="h-5 w-5" />
          </Button>
        </div>
        <DataTable columns={columns} data={assessments} noSearch {...state} />
      </div>
    </ClientDetailLayout>
  );
};

export default ClientAssessmentsPage;
