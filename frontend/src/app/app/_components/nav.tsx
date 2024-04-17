"use client";

import Link from "next/link";
import { FaCircleUser } from "react-icons/fa6";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  {
    title: "Overview",
    href: "/app",
  },
  {
    title: "Clients",
    href: "/app/clients",
  },
  {
    title: "Payments",
    href: "/app/payments",
  },
  {
    title: "Documents",
    href: "/app/documents",
  },
];

const Nav = () => {
  const pathname = usePathname();
  return (
    <div className="flex justify-center items-center shadow-lg w-full border-b-[0.5px] border-gray-600">
      <nav className="flex container px-4 w-full items-center justify-between py-4">
        <Link
          href="/app"
          className="uppercase font-black text-3xl text-gray-200"
        >
          PT<span className="font-thin">CRM</span>
        </Link>
        <ul className="flex gap-x-8 font-medium items-center">
          {navItems.map((navItem) => (
            <li key={navItem.title}>
              <Link
                className={cn("text-gray-300 hover:text-gray-100", {
                  "text-gray-50": pathname === navItem.href,
                })}
                href={navItem.href}
              >
                {navItem.title}
              </Link>
            </li>
          ))}
          <li className="">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <FaCircleUser className="h-7 w-7 text-white" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Devon van Wichen</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Account</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Nav;
