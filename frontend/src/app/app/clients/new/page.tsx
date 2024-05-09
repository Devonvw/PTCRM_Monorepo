import PageHeader from "@/components/ui/page-header";
import { Metadata } from "next";
import NewClientForm from "./components/new-client-form";

export const metadata: Metadata = {
  title: "New client",
  description: "Create a new client.",
};

const NewClientPage = () => {
  return (
    <div>
      <PageHeader
        title="New client"
        breadcrumbs={[
          { title: "Clients", href: "/app/clients" },
          { title: "New client" },
        ]}
      />
      <NewClientForm />
    </div>
  );
};

export default NewClientPage;
