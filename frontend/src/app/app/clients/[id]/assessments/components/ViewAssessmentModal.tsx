import DeleteDialog from "@/components/custom/delete-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAssessments } from "@/stores/useAssessments";
import dayjs from "dayjs";
import { Trash, XCircle } from "lucide-react";

interface IProps {
  onDataChange: () => void;
}

const ViewAssessmentModal = (props: IProps) => {
  const {
    assessment,
    viewModalOpen,
    setViewModalOpen,
    deleteModalOpen,
    setDeleteModalOpen,
    deleteAssessment,
  } = useAssessments();

  const onDelete = async () => {
    await deleteAssessment(assessment?.id as number);

    //. Refresh the grid
    props.onDataChange();
    setViewModalOpen(false);
    setDeleteModalOpen(false);
  };

  return (
    <>
      {/* <DeleteAssessmentModal
        assessmentId={assessment?.id}
        onClose={() => {
          setDeleteModalOpen(false);
          setViewModalOpen(true);
        }}
        onDeleted={() => {
          onDeleted();
        }}
      /> */}
      <DeleteDialog
        objectId={assessment?.id}
        onClose={() => {
          setDeleteModalOpen(false);
          setViewModalOpen(true);
        }}
        onConfirm={async () => {
          onDelete();
        }}
        open={deleteModalOpen}
        title="Delete assessment"
        message="Are you sure you want to delete this assessment?"
      />
      <Dialog open={viewModalOpen} onOpenChange={() => setViewModalOpen(false)}>
        {/* <div className='w-full h-full flex justify-center z-50 absolute  top-0'>
          <div className='modal min-w-112 max-w-screen-lg max-h-screen bg-slate-600 border rounded-2xl dark:border-slate-800 dark:bg-slate-950 h-fit m-auto relative'> */}
        <DialogContent className="sm:max-w-xl flex flex-col">
          <DialogHeader className="">
            <DialogTitle>Viewing assessment</DialogTitle>
            <DialogDescription>
              Performed at:{" "}
              {dayjs(assessment?.performedAt).format("DD/MM/YYYY HH:mm")}
              <br />
              Contained {assessment?.measurements?.length} measurements
            </DialogDescription>
          </DialogHeader>
          {assessment?.notes && (
            <div>
              <br />
              <span>
                Notes: <br /> {assessment?.notes}
              </span>
            </div>
          )}

          <div className="max-h-112 overflow-y-scroll">
            {assessment?.measurements?.map((measurement: any) => (
              <div key={measurement?.id}>
                <br />
                <h4 className="font-semibold">
                  {measurement?.clientGoal?.goal?.name}
                </h4>
                <div className="grid grid-cols-3 text-center">
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
          <DialogFooter className="pt-6 justify-end md:col-span-2">
            <Button
              onClick={() => {
                setViewModalOpen(false);
                setDeleteModalOpen(true);
              }}
              variant="destructive"
              type="button"
              size="sm"
            >
              Delete
              <Trash className="h-5 w-5" />
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="secondary" size="sm">
                Cancel
                <XCircle className="h-5 w-5" />
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ViewAssessmentModal;
