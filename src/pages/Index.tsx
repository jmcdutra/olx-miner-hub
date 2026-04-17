import { Link } from "react-router-dom";
import { Plus, MapPin, Activity, Pause, TrendingUp, Sparkles, ArrowUpRight, Pickaxe, Coins, Target } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { mineracoes } from "@/data/mock";

const StatCard = ({ icon: Icon, label, value, sub, accent }: any) => (
  <div className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 transition-smooth hover:-translate-y-1 hover:shadow-elegant">
    <div className={`mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl ${accent}`}>
      <Icon className="h-[18px] w-[18px]" strokeWidth={2.6} />
    </div>
    <div className="font-display text-[42px] font-extrabold leading-none tracking-tight text-foreground">{value}</div>
    <div className="mt-2 text-[13px] font-semibold text-muted-foreground">{label}</div>
    {sub && <div className="mt-3 text-[12px] text-muted-foreground/80">{sub}</div>}
  </div>
);

const MineracaoCard = ({ m }: { m: typeof mineracoes[0] }) => {
  const ativa = m.status === "minerando";
  return (
    <Link
      to={`/mineracao/${m.id}`}
      className="group relative block overflow-hidden rounded-3xl border border-border bg-card p-7 transition-smooth hover:-translate-y-1 hover:border-primary/40 hover:shadow-elegant"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-display text-[22px] font-extrabold leading-tight tracking-tight text-foreground">
            {m.titulo}
          </h3>
          <div className="mt-2 flex items-center gap-1.5 text-[13px] font-semibold text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" strokeWidth={2.6} />
            {m.cidade}
          </div>
        </div>
        <div
          className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 font-display text-[11px] font-extrabold uppercase tracking-wider ${
            ativa ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
          }`}
        >
          {ativa ? <Activity className="h-3 w-3 animate-pulse" strokeWidth={3} /> : <Pause className="h-3 w-3" strokeWidth={3} />}
          {ativa ? "Minerando" : "Pausado"}
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        <div className="rounded-xl bg-secondary px-3 py-2 font-display text-[12px] font-bold text-foreground">
          R$ {m.precoMin.toLocaleString('pt-BR')} – R$ {m.precoMax.toLocaleString('pt-BR')}
        </div>
        <div className="rounded-xl bg-accent-soft px-3 py-2 font-display text-[12px] font-bold text-accent">
          margem +{m.margem}%
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border/60 pt-5">
        <div className="flex items-center gap-4">
          <div>
            <div className="font-display text-[20px] font-extrabold text-foreground">{m.anuncios}</div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">anúncios</div>
          </div>
          {m.novosHoje > 0 && (
            <div className="flex items-center gap-1 rounded-lg bg-success/10 px-2.5 py-1.5 font-display text-[12px] font-extrabold text-success">
              +{m.novosHoje} hoje
            </div>
          )}
        </div>
        <div className="text-right">
          <div className="text-[11px] font-semibold text-muted-foreground">atualizado há</div>
          <div className="font-display text-[13px] font-bold text-foreground">{m.atualizadoHa}</div>
        </div>
      </div>

      <div className="absolute right-6 top-6 opacity-0 transition-smooth group-hover:opacity-100">
        <ArrowUpRight className="h-5 w-5 text-primary" strokeWidth={2.6} />
      </div>
    </Link>
  );
};

const Index = () => {
  const ativas = mineracoes.filter((m) => m.status === "minerando").length;
  const totalAnuncios = mineracoes.reduce((acc, m) => acc + m.anuncios, 0);
  const novos = mineracoes.reduce((acc, m) => acc + m.novosHoje, 0);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Suas operações"
        title="Minhas Minerações"
        description={`Você tem ${ativas} de 50 vagas sendo usadas no plano atual. Continue garimpando oportunidades.`}
        actions={
          <Link to="/mineracao/nova">
            <Button className="h-12 gap-2 rounded-2xl bg-primary px-6 font-display text-[14px] font-extrabold text-primary-foreground shadow-md hover:bg-primary-glow">
              <Plus className="h-4 w-4" strokeWidth={3} />
              Nova Mineração
            </Button>
          </Link>
        }
      />

      <div className="mb-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Pickaxe} label="Minerações ativas" value={ativas} sub="2 de 50 vagas usadas" accent="bg-primary/10 text-primary" />
        <StatCard icon={Target} label="Anúncios monitorados" value={totalAnuncios} sub={`+${novos} encontrados hoje`} accent="bg-accent/10 text-accent" />
        <StatCard icon={TrendingUp} label="Margem média" value="28%" sub="Acima da meta de 20%" accent="bg-success/10 text-success" />
        <StatCard icon={Coins} label="Créditos disponíveis" value="34" sub="Renovação em 12 dias" accent="bg-primary/10 text-primary" />
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-display text-[24px] font-extrabold tracking-tight text-foreground">Atividades recentes</h2>
          <p className="mt-1 text-[13px] text-muted-foreground">Acompanhe o status de cada operação em tempo real.</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-primary/5 px-3 py-1.5 font-display text-[12px] font-bold text-primary">
          <Sparkles className="h-3.5 w-3.5" strokeWidth={2.6} />
          Atualizado agora
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {mineracoes.map((m) => (
          <MineracaoCard key={m.id} m={m} />
        ))}

        <Link
          to="/mineracao/nova"
          className="group flex min-h-[260px] items-center justify-center rounded-3xl border-2 border-dashed border-border bg-secondary/40 p-7 transition-smooth hover:border-primary hover:bg-primary/5"
        >
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 transition-smooth group-hover:bg-primary group-hover:text-primary-foreground">
              <Plus className="h-6 w-6 text-primary group-hover:text-primary-foreground" strokeWidth={2.8} />
            </div>
            <div className="font-display text-[16px] font-extrabold text-foreground">Criar nova mineração</div>
            <div className="mt-1 text-[12.5px] text-muted-foreground">1 crédito para começar a garimpar</div>
          </div>
        </Link>
      </div>
    </AppShell>
  );
};

export default Index;
