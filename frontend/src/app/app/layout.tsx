import "../globals.css";
import Nav from "./_components/nav";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Nav />
      <main className="flex flex-col">
        <div className="container w-full px-4 pt-8">{children}</div>
      </main>
    </>
  );
}
