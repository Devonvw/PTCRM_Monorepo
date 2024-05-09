import PageHeader from "@/components/ui/page-header";
import type { Metadata } from "next";
import ClientSignUp from "./components/client-sign-up";
import { IPage } from "@/interfaces/page";

export const metadata: Metadata = {
  title: "...",
  description: "...",
};

const ClientSignUpPage = ({ searchParams: { token } }: IPage) => {
  return <ClientSignUp token={token as string} />;
};

export default ClientSignUpPage;
