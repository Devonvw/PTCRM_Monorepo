import { Button } from "@/components/ui/button";
import { DialogHeader } from "@/components/ui/dialog";
import { useAssessments } from "@/stores/useAssessments";
import { Dialog } from "@headlessui/react";
import DeleteAssessmentModal from "./DeleteAssessmentModal";

const ViewAssessmentModal = () => {
  const { assessment, viewModalOpen, setViewModalOpen, setDeleteModalOpen } =
    useAssessments();

  return (
    <>
      <DeleteAssessmentModal
        assessmentId={assessment?.id}
        onClose={() => {
          setDeleteModalOpen(false);
          setViewModalOpen(true);
        }}
        onDeleted={() => {
          setDeleteModalOpen(false);
          setViewModalOpen(false);
        }}
      />
      <Dialog open={viewModalOpen} onClose={() => setViewModalOpen(false)}>
        <div className='w-full h-full flex justify-center z-50 absolute  top-0'>
          <div className='modal min-w-112 max-w-screen-lg max-h-screen bg-slate-600 border rounded-2xl dark:border-slate-800 dark:bg-slate-950 h-fit m-auto relative'>
            <Dialog.Panel className='mx-8 my-10 bg-inherit'>
              <DialogHeader className='mb-4'>
                <h2 className='text-2xl font-bold text-gray-100'>
                  Viewing assessment
                </h2>
              </DialogHeader>
              <span className='text-sm'>
                Performed at:{" "}
                {new Date(assessment?.performedAt).toLocaleString("en-GB")}
                <br />
                Contained {assessment?.measurements?.length} measurements
              </span>
              {assessment.notes && (
                <div>
                  <br />
                  <span>
                    Notes: <br /> {assessment?.notes}
                  </span>
                </div>
              )}

              <div className='max-h-112 overflow-y-scroll my-4'>
                {assessment.measurements?.map((measurement: any) => (
                  <div key={measurement?.id}>
                    <br />
                    <h4 className='font-semibold'>
                      {measurement?.clientGoal?.goal?.name}
                    </h4>
                    <div className='grid grid-cols-3 text-center'>
                      <span>Started at</span>
                      <span>Measured</span>
                      <span>Goal</span>

                      <span>{measurement?.clientGoal?.startValue}</span>
                      <span>{measurement?.value}</span>
                      <span>{measurement?.clientGoal?.completedValue}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className='flex justify-end'>
                <Button
                  onClick={() => {
                    setViewModalOpen(false);
                    setDeleteModalOpen(true);
                  }}
                  className='mt-2'
                  variant={"destructive"}
                  type='button'
                  size='sm'
                >
                  Delete
                </Button>
                <Button
                  className='mt-2 ms-2'
                  onClick={() => setViewModalOpen(false)}
                  variant={"light"}
                  size='sm'
                  type='button'
                >
                  Close
                </Button>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default ViewAssessmentModal;
