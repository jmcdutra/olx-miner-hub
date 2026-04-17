import { TrendingDown, CheckCircle2, Sparkles, Filter, Check } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { notificacoes } from "@/data/mock";

const iconMap: any = {
  novo: { icon: Sparkles, color: "text-accent", bg: "bg-accent-soft" },
  alerta: { icon: TrendingDown, color: "text-primary", bg: "bg-primary-soft" },
  sistema: { icon: CheckCircle2, color: "text-success", bg: "bg-success-soft" },
};

const Notificacoes = () => {
  const naoLidas = notificacoes.filter((n) => !n.lida).length;
  return (
    <AppShell>
      <PageHeader
        title="Notificações"
        description={`${naoLidas} novas — alertas de oportunidades e atualizações da conta.`}
        actions={
          <>
            <Button variant="outline" className="h-9 gap-1.5 rounded-md border-border font-display text-[12.5px] font-extrabold">
              <Filter className="h-3.5 w-3.5" strokeWidth={2.6} /> Filtrar
            </Button>
            <Button variant="outline" className="h-9 gap-1.5 rounded-md border-border font-display text-[12.5px] font-extrabold">
              <Check className="h-3.5 w-3.5" strokeWidth={2.6} /> Marcar todas
            </Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        {/* Tabs + lista */}
        <div>
          <div className="mb-3 flex items-center gap-1 border-b border-border">
            {["Todas", "Não lidas", "Oportunidades", "Sistema"].map((t, i) => (
              <button
                key={t}
                className={`relative px-3 py-2 text-[12.5px] font-extrabold transition-colors ${
                  i === 0 ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
                {i === 0 && <span className="absolute inset-x-3 -bottom-px h-0.5 bg-primary" />}
              </button>
            ))}
          </div>

          <div className="rounded-lg border border-border bg-card divide-y divide-border">
            {notificacoes.map((n) => {
              const cfg = iconMap[n.tipo];
              const Icon = cfg.icon;
              return (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 px-4 py-3 transition-colors hover:bg-secondary/40 ${
                    !n.lida ? "bg-primary-soft/40" : ""
                  }`}
                >
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${cfg.bg}`}>
                    <Icon className={`h-4 w-4 ${cfg.color}`} strokeWidth={2.4} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-[13.5px] font-extrabold leading-tight text-foreground">{n.titulo}</h3>
                      <span className="shrink-0 text-[11px] font-semibold text-muted-foreground">{n.tempo}</span>
                    </div>
                    <p className="mt-0.5 text-[12.5px] text-muted-foreground">{n.descricao}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <button className="text-[11.5px] font-extrabold text-primary hover:underline">Ver oportunidade</button>
                      {!n.lida && (
                        <button className="text-[11.5px] font-semibold text-muted-foreground hover:text-foreground">Marcar lida</button>
                      )}
                    </div>
                  </div>
                  {!n.lida && <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />}
                </div>
              );
            })}
          </div>
        </div>

        <aside>
          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="font-display text-[14px] font-extrabold text-foreground">Preferências de alerta</h3>
            <p className="mt-0.5 text-[11.5px] text-muted-foreground">Escolha o que receber e onde.</p>
            <div className="mt-4 space-y-3">
              {[
                { label: "Novos anúncios", desc: "Quando algo novo aparece", on: true },
                { label: "Queda de preço", desc: "Quando preço cai 10%+", on: true },
                { label: "Resumo diário", desc: "E-mail com top oportunidades", on: true },
                { label: "Push no navegador", desc: "Notificação instantânea", on: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between border-b border-border py-2 last:border-0">
                  <div>
                    <div className="font-display text-[12.5px] font-extrabold text-foreground">{item.label}</div>
                    <div className="text-[11px] text-muted-foreground">{item.desc}</div>
                  </div>
                  <button className={`relative h-5 w-9 rounded-full transition-colors ${item.on ? "bg-primary" : "bg-secondary"}`}>
                    <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${item.on ? "left-[18px]" : "left-0.5"}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
};

export default Notificacoes;
