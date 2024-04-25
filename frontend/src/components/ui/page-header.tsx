import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import getChildren from "@/utils/get-children";
import clsx from "clsx";
import { Fragment } from "react";

interface IPageHeaderProps {
  title: string;
  breadcrumbs?: { title: string; href?: string }[];
  children?: React.ReactNode;
}

const PageHeader = ({ title, breadcrumbs, children }: IPageHeaderProps) => {
  const { right } = getChildren(children);
  return (
    <div className="flex justify-between mb-10">
      <div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            {breadcrumbs?.map((breadcrumb, index) => (
              <Fragment key={index}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {breadcrumb?.href ? (
                    <BreadcrumbLink href={breadcrumb?.href}>
                      {breadcrumb?.title}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{breadcrumb?.title}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-4xl font-semibold">{title}</h1>
      </div>
      {right}
    </div>
  );
};

const Right = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={clsx("flex justify-end", className)}>{children}</div>;
};

Right.displayName = "Right";
PageHeader.Right = Right;

export default PageHeader;
