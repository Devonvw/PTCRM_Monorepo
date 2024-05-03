import { ReactNode } from "react";

interface IPageBodyProps {
  children: ReactNode;
  loading?: boolean;
}

const PageBody = ({ children, loading }: IPageBodyProps) => {
  return !loading && loading !== undefined ? (
    children
  ) : (
    <div className="fixed top-1/2 translate-y-1/2 left-1/2 -translate-x-1/2">
      {/* <Spinner spinnerClassName='h-10 w-10' /> */}
    </div>
  );
};

export default PageBody;
