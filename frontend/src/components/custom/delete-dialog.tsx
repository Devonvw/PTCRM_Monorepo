import { DialogClose } from "@radix-ui/react-dialog";
import { Trash, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface IProps {
  objectId?: number;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  open: boolean;
  title: string;
  message: string;
}

export default function DeleteDialog(props: IProps) {
  if (!props.objectId) return null;

  const handleDelete = async () => {
    if (!props.objectId) {
      toast.error("Something went wrong, please try again.");
    } else {
      await props.onConfirm();
    }
    props.onClose();
  };

  return (
    <Dialog open={props.open} onOpenChange={props.onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>{props.title}</DialogTitle>
          <DialogDescription>{props.message}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              onClick={() => props.onClose()}
              type='button'
              variant='secondary'
              size='sm'
            >
              Cancel
              <XCircle className='h-5 w-5' />
            </Button>
          </DialogClose>
          <Button
            onClick={() => handleDelete()}
            size='sm'
            variant={"destructive"}
          >
            Delete
            <Trash className='h-5 w-5' />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
