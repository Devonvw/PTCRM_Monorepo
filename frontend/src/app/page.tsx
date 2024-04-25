"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import LoginModal from "./app/clients/modals/login-modal";
import RegisterModal from "./app/clients/modals/register-modal";

export default function Home() {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="container px-4 flex flex-col items-center justify-center min-h-screen relative">
        <div className="flex justify-center items-center shadow-lg shadow-slate-800 w-full fixed top-0">
          <nav className="flex container px-4 w-full items-center justify-between py-4 z-50">
            <Link
              href="/"
              className="uppercase font-black text-3xl text-gray-100"
            >
              PT<span className="font-thin">CRM</span>
            </Link>
            <div className="flex gap-x-2">
              <button onClick={() => setLoginModalOpen(true)} className="bg-primary text-white py-1 px-5 rounded font-semibold text-lg hover:bg-primary/80">
                Login
              </button>
              <button onClick={() => setSignupModalOpen(true)} className="bg-secondary text-white py-1 px-5 rounded font-semibold text-lg hover:bg-primary/80">
                Signup
              </button>
            </div>
          </nav>
        </div>
        <h1 className="text-6xl font-bold text-gray-100">
          The <span className="font-light">CRM</span> for Personal Trainers
        </h1>
        <p className="max-w-3xl text-center mt-4 text-lg">
          Empower your personal training business with PTCRM, a tailored
          solution designed exclusively for fitness professionals like you.{" "}
        </p>
        <Image
          src={require("@/assets/personal-trainer.svg")}
          alt="Personal trainer"
          className="absolute bottom-0 right-0 w-1/3"
        />
        <Image
          src={require("@/assets/personal-training.svg")}
          alt="Personal training"
          className="absolute bottom-0 left-0 w-1/3"
        />
        <LoginModal
          open={loginModalOpen}
          onOpenChange={setLoginModalOpen}
        />
        <RegisterModal 
          open={signupModalOpen}
          onOpenChange={setSignupModalOpen}
        />
      </div>
    </main>
  );
}
