import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Início", to: "/" },
  { label: "Histórico", to: "/history" }
];

export function Navigation() {
  return (
    <header className="border-b border-slate-800/80 bg-night-800/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Traceroute</p>
          <h1 className="text-lg font-semibold">Visualizador de rotas</h1>
        </div>
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-300">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive
                  ? "text-white"
                  : "transition-colors hover:text-white"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
