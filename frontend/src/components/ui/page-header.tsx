import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface IPageHeaderProps {
  title: string;
  breadcrumbs?: { title: string; href?: string }[];
}

const PageHeader = ({ title, breadcrumbs }: IPageHeaderProps) => {
  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          {breadcrumbs?.map((breadcrumb) => (
            <>
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
            </>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-4xl font-semibold mb-10">{title}</h1>
    </div>
  );
};

export default PageHeader;
