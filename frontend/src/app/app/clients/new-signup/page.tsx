import PageHeader from "@/components/ui/page-header";
import { Metadata } from "next";
import NewClientSignUpForm from "./components/new-signup-form";
import { IPage } from "@/interfaces/page";

export const metadata: Metadata = {
  title: "New client sign up",
  description: "Create a new client to sign up",
};

const NewClientSignUpPage = ({ searchParams: { token } }: IPage) => {
  return (
    <div>
      <PageHeader
        title="New client sign up"
        breadcrumbs={[
          { title: "Clients", href: "/app/clients" },
          { title: "New client sign up" },
        ]}
      />
      <NewClientSignUpForm />
    </div>
  );
};

export default NewClientSignUpPage;
