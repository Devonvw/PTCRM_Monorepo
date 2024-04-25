import Link from "next/link";


export default function Login() {

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
              <Link href="/login" className="bg-primary text-white py-1 px-5 rounded font-semibold text-lg hover:bg-primary/80">
                Login
              </Link>
              <Link href="/signup" className="bg-secondary text-white py-1 px-5 rounded font-semibold text-lg hover:bg-primary/80">
                Signup
              </Link>
            </div>
          </nav>
        </div>
        <div className="">
          
        </div>
      </div>
    </main>
  );
}