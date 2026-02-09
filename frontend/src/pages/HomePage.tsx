import { PageHeader } from "../components/PageHeader";
import { Panel } from "../components/Panel";
import { StatCard } from "../components/StatCard";

export function HomePage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Overview"
        title="Acompanhe seus traceroutes"
        description="Inicie testes de rota, acompanhe cada hop e visualize a performance de rede em tempo real."
        action={
          <button className="rounded-full bg-emerald-400 px-5 py-2 text-sm font-semibold text-night-900 shadow-lg shadow-emerald-400/30">
            Novo traceroute
          </button>
        }
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Traceroutes ativos" value="2" helper="Atualizado há 5s" />
        <StatCard label="Total hoje" value="18" helper="Últimas 24h" />
        <StatCard label="Tempo médio" value="120ms" helper="Baseado nos últimos 7 dias" />
      </section>

      <Panel
        title="Mapa em tempo real"
        description="Área reservada para o mapa 3D. Aqui entrará o Mapbox + Three.js com a rota em destaque."
      >
        <div className="flex min-h-[260px] items-center justify-center rounded-xl border border-dashed border-slate-700 bg-night-900/60">
          <p className="text-sm text-slate-400">Prévia do mapa</p>
        </div>
      </Panel>

      <Panel
        title="Iniciar traceroute"
        description="Cole um IP ou hostname para começar a coleta de hops."
      >
        <div className="flex flex-col gap-4 md:flex-row">
          <input
            type="text"
            placeholder="ex: google.com"
            className="w-full flex-1 rounded-xl border border-slate-700 bg-night-900/70 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
          />
          <button className="rounded-xl bg-emerald-400 px-6 py-3 text-sm font-semibold text-night-900">
            Executar
          </button>
        </div>
      </Panel>
    </div>
  );
}
