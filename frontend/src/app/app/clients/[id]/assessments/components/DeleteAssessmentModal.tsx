import { DialogHeader } from "@/components/ui/dialog";
import { useAssessments } from "@/stores/useAssessments";
import { Button, Dialog } from "@headlessui/react";
import toast from "react-hot-toast";

interface IProps {
  assessmentId: number;
  onClose: () => void;
  onDeleted: () => void;
}

export default function DeleteAssessmentModal(props: IProps) {
  const { deleteAssessment, deleteModalOpen } = useAssessments();
  if (!props.assessmentId) return null;

  const handleDelete = async () => {
    if (!props.assessmentId) {
      toast.error("Something went wrong, please try again.");
      props.onDeleted();
    }
    await deleteAssessment(props.assessmentId as number, props.onDeleted);
  };

  return (
    <Dialog open={deleteModalOpen} onClose={props.onClose}>
      <div className='w-full h-full flex justify-center z-50 absolute  top-0'>
        <div className='modal  w-fit bg-slate-600 border rounded-2xl dark:border-slate-800 dark:bg-slate-950 h-fit m-auto relative'>
          <Dialog.Panel className='mx-8 my-10 bg-inherit'>
            <DialogHeader className='mb-4'>
              <h2 className='text-2xl font-bold text-gray-100'>Delete goal</h2>
            </DialogHeader>
            <span>Are you sure you want to delete this assessment?</span>
            <div className='flex justify-end mt-8'>
              <Button
                onClick={props.onClose}
                className='inline-flex gap-x-2 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 bg-slate-900 text-slate-50 hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 h-10 px-4 py-2 mr-2'
                type='button'
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                className='inline-flex gap-x-2 items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 bg-red-500 text-slate-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90 rounded-md h-10 px-4 py-2'
                type='button'
              >
                Delete
              </Button>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
