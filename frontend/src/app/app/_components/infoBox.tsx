interface IProps {
  message?: string;
  isError?: boolean;
  extraClasses?: string;
  children?: React.ReactNode;
}

export default function InfoBox(props: IProps) {
  if (!props?.message && !props?.children) return null;
  return (
    <div
      className={`${props.extraClasses} m-auto text-center ${
        props.isError
          ? "bg-red-300 border-red-600"
          : "bg-blue-300 border-blue-600"
      } text-black p-3 border  rounded-md my-3 max-w-screen-md w-60 overflow-x`}
    >
      {props?.children || <p>{props?.message}</p>}
    </div>
  );
}
