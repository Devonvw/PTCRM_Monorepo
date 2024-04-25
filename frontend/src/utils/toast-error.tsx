import toast from 'react-hot-toast'

export default function toastError(message: any) {
  if (Array.isArray(message)) message?.forEach((msg: string) => toast.error(msg))
  else toast.error(message)
}
