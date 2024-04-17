"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="flex justify-center items-center shadow-lg w-full fixed top-0">
        <nav className="flex container px-4 w-full items-center justify-between py-4">
          <Link href="/" className="uppercase font-black text-3xl text-primary">
            PT<span className="font-light">CRM</span>
          </Link>
          <div className="flex gap-x-2">
            <button className="bg-primary text-white py-1 px-5 rounded font-semibold text-lg hover:bg-primary/80">
              Login
            </button>
            <button className="bg-secondary text-white py-1 px-5 rounded font-semibold text-lg hover:bg-secondary/80">
              Signup
            </button>
          </div>
        </nav>
      </div>
      <div className="container px-4 flex flex-col items-center justify-center min-h-screen relative">
        <h1 className="text-6xl font-bold text-slate-900">
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
      </div>
    </main>
  );
}
