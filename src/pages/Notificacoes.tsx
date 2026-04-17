import { Bell, TrendingDown, CheckCircle2, Sparkles, Filter, Check } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { notificacoes } from "@/data/mock";

const iconMap: any = {
  novo: { icon: Sparkles, bg: "bg-accent/10", color: "text-accent" },
  alerta: { icon: TrendingDown, bg: "bg-primary/10", color: "text-primary" },
  sistema: { icon: CheckCircle2, bg: "bg-success/10", color: "text-success" },
};

const Notificacoes = () => {
  const naoLidas = notificacoes.filter((n) => !n.lida).length;
  return (
    <AppShell>
      <PageHeader
        eyebrow="Central de alertas"
        title="Notificações"
        description={`Você tem ${naoLidas} novas notificações esperando atenção.`}
        actions={
          <>
            <Button variant="outline" className="h-11 gap-2 rounded-xl border-border font-display text-[13px] font-extrabold">
              <Filter className="h-4 w-4" strokeWidth={2.8} />
              Filtrar
            </Button>
            <Button className="h-11 gap-2 rounded-xl bg-foreground font-display text-[13px] font-extrabold text-background hover:bg-foreground/90">
              <Check className="h-4 w-4" strokeWidth={2.8} />
              Marcar todas
            </Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-3">
          {notificacoes.map((n) => {
            const cfg = iconMap[n.tipo];
            const Icon = cfg.icon;
            return (
              <div
                key={n.id}
                className={`group flex items-start gap-4 rounded-3xl border p-5 transition-smooth hover:-translate-y-0.5 hover:shadow-elegant ${
                  n.lida ? "border-border bg-card" : "border-primary/20 bg-card shadow-md"
                }`}
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${cfg.bg}`}>
                  <Icon className={`h-5 w-5 ${cfg.color}`} strokeWidth={2.6} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-[15px] font-extrabold leading-tight text-foreground">{n.titulo}</h3>
                    <span className="shrink-0 text-[11.5px] font-semibold text-muted-foreground">{n.tempo}</span>
                  </div>
                  <p className="mt-1.5 text-[13px] text-muted-foreground">{n.descricao}</p>
                  <div className="mt-3 flex gap-2">
                    <button className="rounded-lg bg-secondary px-3 py-1.5 font-display text-[11.5px] font-extrabold text-foreground transition-smooth hover:bg-primary hover:text-primary-foreground">
                      Ver detalhes
                    </button>
                    {!n.lida && (
                      <button className="rounded-lg px-3 py-1.5 font-display text-[11.5px] font-bold text-muted-foreground hover:text-foreground">
                        Marcar como lida
                      </button>
                    )}
                  </div>
                </div>
                {!n.lida && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent animate-pulse-glow" />}
              </div>
            );
          })}
        </div>

        <aside className="space-y-5">
          <div className="rounded-3xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" strokeWidth={2.6} />
              <h3 className="font-display text-[16px] font-extrabold text-foreground">Preferências</h3>
            </div>
            <div className="space-y-4">
              {[
                { label: "Novos anúncios", desc: "Quando algo novo aparece" },
                { label: "Queda de preço", desc: "Quando preço cai mais de 10%" },
                { label: "Resumo diário", desc: "Email com top oportunidades" },
                { label: "Alertas push", desc: "Notificação no navegador" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <div className="font-display text-[13.5px] font-extrabold text-foreground">{item.label}</div>
                    <div className="text-[11.5px] text-muted-foreground">{item.desc}</div>
                  </div>
                  <button className={`relative h-6 w-11 rounded-full transition-smooth ${i < 3 ? "bg-primary" : "bg-secondary"}`}>
                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-smooth ${i < 3 ? "left-[22px]" : "left-0.5"}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-gradient-bold p-6 text-white grain">
            <Sparkles className="mb-3 h-5 w-5 text-accent" strokeWidth={2.6} />
            <h3 className="font-display text-[16px] font-extrabold">Notificações instantâneas</h3>
            <p className="mt-2 text-[13px] opacity-90">Upgrade para Business e receba alertas em até 30 segundos após o anúncio ser publicado.</p>
            <Button className="mt-4 h-10 w-full rounded-xl bg-white font-display text-[13px] font-extrabold text-primary hover:bg-white/90">
              Conhecer Business
            </Button>
          </div>
        </aside>
      </div>
    </AppShell>
  );
};

export default Notificacoes;
