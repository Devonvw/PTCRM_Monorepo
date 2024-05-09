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
import { Skeleton } from "./skeleton";

interface IPageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: { title: string; href?: string }[];
  children?: React.ReactNode;
  withLoading?: boolean;
  loading?: boolean;
  noBreadcrumb?: boolean;
}

const PageHeader = ({
  title,
  description,
  breadcrumbs,
  children,
  withLoading,
  loading,
  noBreadcrumb,
}: IPageHeaderProps) => {
  const { right } = getChildren(children);
  return !loading && loading !== undefined && !withLoading ? (
    <div className="flex justify-between mb-6">
      <div>
        {!noBreadcrumb && (
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
        )}
        <h1 className="text-4xl font-semibold text-gray-100">{title}</h1>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
      {right}
    </div>
  ) : (
    <div className="flex justify-between mb-6">
      <Skeleton className="h-16 w-60" />
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
