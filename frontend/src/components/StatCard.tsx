interface StatCardProps {
  label: string;
  value: string;
  helper?: string;
}

export function StatCard({ label, value, helper }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-night-800/80 p-5 shadow-lg shadow-black/20">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
      {helper ? <p className="mt-2 text-xs text-slate-400">{helper}</p> : null}
    </div>
  );
}
