import { Outlet } from "react-router-dom";
import { Navigation } from "../../components/Navigation";

export function AppShell() {
  return (
    <div className="min-h-screen bg-night-900 text-slate-100">
      <Navigation />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 pb-16 pt-10">
        <Outlet />
      </main>
    </div>
  );
}
