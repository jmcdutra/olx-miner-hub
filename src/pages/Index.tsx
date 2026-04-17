import { Link } from "react-router-dom";
import { Plus, MapPin, TrendingUp, Pause, Play } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { mineracoes } from "@/data/mock";

const fmt = (v: number) => v.toLocaleString("pt-BR");

const Stat = ({ label, value, hint, accent }: { label: string; value: string; hint?: string; accent?: boolean }) => (
  <div className="rounded-lg border border-border bg-card p-4">
    <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</div>
    <div className={`mt-1.5 font-display text-[26px] font-extrabold leading-none price ${accent ? "text-primary" : "text-foreground"}`}>{value}</div>
    {hint && <div className="mt-1.5 text-[12px] font-medium text-muted-foreground">{hint}</div>}
  </div>
);

const MineracaoCard = ({ m }: { m: typeof mineracoes[0] }) => {
  const ativa = m.status === "ativo";
  return (
    <Link
      to={`/mineracao/${m.id}`}
      className="group flex gap-4 rounded-lg border border-border bg-card p-3 transition-all hover:border-primary/40 hover:shadow-sm"
    >
      <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-md bg-secondary">
        <img src={m.capa} alt={m.titulo} className="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
        {!ativa && (
          <div className="absolute inset-0 flex items-center justify-center bg-foreground/40">
            <Pause className="h-5 w-5 text-white" strokeWidth={3} fill="white" />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{m.categoria}</div>
            <h3 className="mt-0.5 truncate font-display text-[15px] font-extrabold text-foreground">{m.titulo}</h3>
          </div>
          <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
            ativa ? "bg-success-soft text-success" : "bg-secondary text-muted-foreground"
          }`}>
            {ativa ? "Ativo" : "Pausado"}
          </span>
        </div>

        <div className="mt-1 flex items-center gap-1 text-[12px] font-medium text-muted-foreground">
          <MapPin className="h-3 w-3" strokeWidth={2.4} />
          {m.cidade}
        </div>

        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            <div className="text-[11px] font-semibold text-muted-foreground">Menor preço</div>
            <div className="font-display text-[18px] font-extrabold text-foreground price">R$ {fmt(m.menorPreco)}</div>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center gap-1 rounded bg-success-soft px-1.5 py-0.5 font-display text-[11.5px] font-extrabold text-success">
              <TrendingUp className="h-3 w-3" strokeWidth={3} />
              +{m.margem}%
            </div>
            <div className="mt-1 text-[11px] font-semibold text-muted-foreground">
              {m.anuncios} anúncios{m.novosHoje > 0 && <span className="text-accent"> · +{m.novosHoje} hoje</span>}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const Index = () => {
  const ativas = mineracoes.filter((m) => m.status === "ativo").length;
  const totalAnuncios = mineracoes.reduce((acc, m) => acc + m.anuncios, 0);
  const novos = mineracoes.reduce((acc, m) => acc + m.novosHoje, 0);

  return (
    <AppShell>
      <PageHeader
        title="Minhas minerações"
        description="Monitore preços de produtos na OLX e Mercado Livre em tempo real."
        actions={
          <Link to="/mineracao/nova">
            <Button className="h-9 gap-1.5 rounded-md bg-primary px-3.5 font-display text-[13px] font-extrabold text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4" strokeWidth={2.6} />
              Nova mineração
            </Button>
          </Link>
        }
      />

      <div className="mb-6 grid gap-3 md:grid-cols-4">
        <Stat label="Ativas" value={String(ativas)} hint={`${ativas} de 50 vagas`} accent />
        <Stat label="Anúncios monitorados" value={fmt(totalAnuncios)} hint={`+${novos} novos hoje`} />
        <Stat label="Margem média" value="28%" hint="Acima da meta de 20%" />
        <Stat label="Créditos disponíveis" value="34" hint="Renova em 12 dias" />
      </div>

      {/* Filter bar */}
      <div className="mb-3 flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-1">
          {["Todas", "Ativas", "Pausadas", "Com novidades"].map((tab, i) => (
            <button
              key={tab}
              className={`rounded-md px-3 py-1.5 text-[12.5px] font-extrabold transition-colors ${
                i === 0 ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="text-[12px] font-semibold text-muted-foreground">
          Ordenar: <span className="font-extrabold text-foreground">Mais recente</span>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {mineracoes.map((m) => (
          <MineracaoCard key={m.id} m={m} />
        ))}

        <Link
          to="/mineracao/nova"
          className="flex min-h-[136px] items-center justify-center rounded-lg border border-dashed border-border bg-secondary/30 p-4 text-center transition-colors hover:border-primary hover:bg-primary-soft"
        >
          <div>
            <Plus className="mx-auto mb-1.5 h-5 w-5 text-primary" strokeWidth={2.6} />
            <div className="font-display text-[13.5px] font-extrabold text-foreground">Criar nova mineração</div>
            <div className="mt-0.5 text-[11.5px] text-muted-foreground">1 crédito</div>
          </div>
        </Link>
      </div>
    </AppShell>
  );
};

export default Index;
