import { PageHeader } from "../components/PageHeader";
import { Panel } from "../components/Panel";

const hops = [
  { hop: 1, ip: "192.168.0.1", latency: "4ms", location: "São Paulo" },
  { hop: 2, ip: "10.10.0.1", latency: "12ms", location: "Campinas" },
  { hop: 3, ip: "200.160.2.3", latency: "36ms", location: "Rio de Janeiro" },
  { hop: 4, ip: "8.8.8.8", latency: "48ms", location: "Google" }
];

export function DetailsPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Detalhes"
        title="Traceroute: google.com"
        description="Acompanhe o caminho completo até o destino e analise latências por hop."
      />

      <Panel title="Resumo da execução">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Status</p>
            <p className="mt-2 text-lg font-semibold text-emerald-300">Completed</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Duração</p>
            <p className="mt-2 text-lg font-semibold text-white">2.4s</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Hops</p>
            <p className="mt-2 text-lg font-semibold text-white">18</p>
          </div>
        </div>
      </Panel>

      <Panel title="Linha do tempo" description="Hop a hop com latência e localização aproximada.">
        <div className="space-y-3">
          {hops.map((hop) => (
            <div
              key={hop.hop}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-800 bg-night-900/60 px-4 py-3"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold">
                  {hop.hop}
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{hop.ip}</p>
                  <p className="text-xs text-slate-400">{hop.location}</p>
                </div>
              </div>
              <span className="text-sm text-slate-300">{hop.latency}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
