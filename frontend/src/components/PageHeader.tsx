import type { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}

export function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{eyebrow}</p>
        <h2 className="mt-2 text-2xl font-semibold text-white">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-300">{description}</p>
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
