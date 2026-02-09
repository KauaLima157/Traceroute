import type { ReactNode } from "react";

interface PanelProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function Panel({ title, description, children }: PanelProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-night-800/70 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {description ? (
          <p className="mt-2 text-sm text-slate-400">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
