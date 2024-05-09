import PageHeader from "@/components/ui/page-header";
import type { Metadata } from "next";
import { useUser } from "@/stores/useUser";
import { useClients } from "@/stores/useClients";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Congratulations!",
  description: "Congratulations on signing up!",
};

const ClientSignUpCongratulationsPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex justify-start items-center shadow-lg w-full mb-12">
        <nav className="flex  w-full items-center justify-between py-4">
          <Link
            href="/"
            className="uppercase font-black text-3xl text-gray-200"
          >
            PT<span className="font-thin">CRM</span>
          </Link>
        </nav>
      </div>

      <div className="min-h-[30rem] w-full flex items-center justify-center">
        <h1 className="text-4xl font-semibold text-gray-100">
          Congratulations on signing up!
        </h1>
      </div>
    </div>
  );
};

export default ClientSignUpCongratulationsPage;
