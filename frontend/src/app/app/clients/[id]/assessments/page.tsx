"use client";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { IOnChangeProps } from "@/components/ui/data-table/interfaces";
import useTable from "@/hooks/useTable";
import { useAssessments } from "@/stores/useAssessments";
import { PlusCircle } from "lucide-react";
import { columns } from "./columns";
import PerformAssessmentModal from "./components/PerformAssessmentModal";
import ViewAssessmentModal from "./components/ViewAssessmentModal";

const ClientAssessmentsPage = ({ params: { id } }) => {
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
    onChange: ({ pagination, filters, search, sort }) =>
      getAssessments({ pagination, filters, search, sort, clientId: id }),
    filterOptions,
    sortingDefault: [{ id: "performedAt", desc: true }],
  });

  const handleTableChange = (changeProps: IOnChangeProps) => {
    return getAssessments({ ...changeProps, clientId: id });
  };
  const handleAssessmentCreated = () => {
    reload();
    setAddOrUpdateModalOpen(false);
  };

  return (
    <div>
      <PerformAssessmentModal
        open={addOrUpdateModalOpen}
        clientId={id}
        onClose={() => handleAssessmentCreated()}
      />
      <ViewAssessmentModal />
      <div className='flex justify-end -mb-8'>
        <Button
          onClick={() => setAddOrUpdateModalOpen(true)}
          size='sm'
          variant='light'
          className=' z-10'
        >
          New assessment <PlusCircle className='h-5 w-5' />
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={assessments}
        onChange={handleTableChange}
        {...state}
      />
    </div>
  );
};

export default ClientAssessmentsPage;
