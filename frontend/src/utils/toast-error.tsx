import toast from "react-hot-toast";

export default function toastError(message: string | string[]) {
  if (Array.isArray(message))
    message?.forEach((msg: string) => toast.error(msg));
  else toast.error(message);
}
