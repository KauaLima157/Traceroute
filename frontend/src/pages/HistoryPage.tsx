import { PageHeader } from "../components/PageHeader";
import { Panel } from "../components/Panel";

const historyRows = [
  {
    id: "1a2b",
    target: "google.com",
    status: "completed",
    startedAt: "Hoje, 14:32",
    hops: 18
  },
  {
    id: "3c4d",
    target: "cloudflare.com",
    status: "processing",
    startedAt: "Hoje, 14:20",
    hops: 9
  },
  {
    id: "5e6f",
    target: "openai.com",
    status: "failed",
    startedAt: "Ontem, 19:10",
    hops: 4
  }
];

const statusStyles: Record<string, string> = {
  completed: "bg-emerald-400/10 text-emerald-300",
  processing: "bg-blue-400/10 text-blue-300",
  failed: "bg-rose-400/10 text-rose-300"
};

export function HistoryPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Histórico"
        title="Traceroutes recentes"
        description="Visualize as últimas execuções e acompanhe o status de cada rota."
      />

      <Panel title="Últimos testes" description="Clique em um item para ver os detalhes completos.">
        <div className="space-y-3">
          {historyRows.map((row) => (
            <div
              key={row.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-800 bg-night-900/60 px-4 py-3"
            >
              <div>
                <p className="text-sm font-semibold text-white">{row.target}</p>
                <p className="text-xs text-slate-400">{row.startedAt}</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className={`rounded-full px-3 py-1 ${statusStyles[row.status]}`}>
                  {row.status}
                </span>
                <span className="text-slate-400">{row.hops} hops</span>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
