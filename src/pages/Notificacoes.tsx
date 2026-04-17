import { useState, useMemo } from "react";
import { TrendingDown, CheckCircle2, Sparkles, Filter, Check } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { notificacoes as notificacoesMock } from "@/data/mock";

const iconMap: any = {
  novo: { icon: Sparkles, color: "text-accent", bg: "bg-accent-soft" },
  alerta: { icon: TrendingDown, color: "text-primary", bg: "bg-primary-soft" },
  sistema: { icon: CheckCircle2, color: "text-success", bg: "bg-success-soft" },
};

type TabKey = "todas" | "naolidas" | "oportunidades" | "sistema";

const Notificacoes = () => {
  const [items, setItems] = useState(notificacoesMock);
  const [tab, setTab] = useState<TabKey>("todas");
  const [prefs, setPrefs] = useState({ novos: true, queda: true, resumo: true, push: false });

  const filtered = useMemo(() => {
    if (tab === "naolidas") return items.filter((n) => !n.lida);
    if (tab === "oportunidades") return items.filter((n) => n.tipo === "novo" || n.tipo === "alerta");
    if (tab === "sistema") return items.filter((n) => n.tipo === "sistema");
    return items;
  }, [items, tab]);

  const naoLidas = items.filter((n) => !n.lida).length;

  const marcarLida = (id: number) => {
    setItems((prev) => prev.map((n) => n.id === id ? { ...n, lida: true } : n));
  };
  const marcarTodas = () => {
    setItems((prev) => prev.map((n) => ({ ...n, lida: true })));
    toast.success("Todas marcadas como lidas");
  };

  const togglePref = (key: keyof typeof prefs, label: string) => {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
    toast(`${label} ${!prefs[key] ? "ativado" : "desativado"}`);
  };

  return (
    <AppShell>
      <PageHeader
        title="Notificações"
        description={`${naoLidas} não lidas — alertas de oportunidades e atualizações da conta.`}
        actions={
          <>
            <Button variant="outline" onClick={() => toast("Filtros avançados em breve")} className="h-9 gap-1.5 rounded-md border-border font-display text-[12.5px] font-extrabold">
              <Filter className="h-3.5 w-3.5" strokeWidth={2.6} /> Filtrar
            </Button>
            <Button variant="outline" onClick={marcarTodas} className="h-9 gap-1.5 rounded-md border-border font-display text-[12.5px] font-extrabold">
              <Check className="h-3.5 w-3.5" strokeWidth={2.6} /> Marcar todas
            </Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        <div>
          <div className="mb-3 flex items-center gap-1 border-b border-border">
            {([
              ["todas", "Todas", items.length],
              ["naolidas", "Não lidas", naoLidas],
              ["oportunidades", "Oportunidades", items.filter((n) => n.tipo !== "sistema").length],
              ["sistema", "Sistema", items.filter((n) => n.tipo === "sistema").length],
            ] as const).map(([key, label, count]) => (
              <button
                key={key}
                onClick={() => setTab(key as TabKey)}
                className={`relative px-3 py-2 text-[12.5px] font-extrabold transition-colors ${
                  tab === key ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {label} <span className="ml-0.5 font-display tabular text-muted-foreground">{count}</span>
                {tab === key && <span className="absolute inset-x-3 -bottom-px h-0.5 bg-primary" />}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-secondary/30 py-16 text-center">
              <CheckCircle2 className="h-6 w-6 text-success" strokeWidth={2.2} />
              <h3 className="mt-3 font-display text-[14px] font-extrabold text-foreground">Tudo em dia</h3>
              <p className="mt-1 text-[12px] text-muted-foreground">Sem notificações nessa visão.</p>
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-card divide-y divide-border">
              {filtered.map((n) => {
                const cfg = iconMap[n.tipo];
                const Icon = cfg.icon;
                return (
                  <div
                    key={n.id}
                    className={`flex items-start gap-3 px-4 py-3 transition-colors hover:bg-secondary/40 ${!n.lida ? "bg-primary-soft/40" : ""}`}
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
                        <button onClick={() => toast("Abrindo oportunidade…")} className="text-[11.5px] font-extrabold text-primary hover:underline">Ver oportunidade</button>
                        {!n.lida && (
                          <button onClick={() => marcarLida(n.id)} className="text-[11.5px] font-semibold text-muted-foreground hover:text-foreground">Marcar lida</button>
                        )}
                      </div>
                    </div>
                    {!n.lida && <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <aside>
          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="font-display text-[14px] font-extrabold text-foreground">Preferências de alerta</h3>
            <p className="mt-0.5 text-[11.5px] text-muted-foreground">Escolha o que receber e onde.</p>
            <div className="mt-4 space-y-3">
              {([
                ["novos", "Novos anúncios", "Quando algo novo aparece"],
                ["queda", "Queda de preço", "Quando preço cai 10%+"],
                ["resumo", "Resumo diário", "E-mail com top oportunidades"],
                ["push", "Push no navegador", "Notificação instantânea"],
              ] as const).map(([key, label, desc]) => (
                <div key={key} className="flex items-center justify-between border-b border-border py-2 last:border-0">
                  <div>
                    <div className="font-display text-[12.5px] font-extrabold text-foreground">{label}</div>
                    <div className="text-[11px] text-muted-foreground">{desc}</div>
                  </div>
                  <button
                    onClick={() => togglePref(key, label)}
                    className={`relative h-5 w-9 rounded-full transition-colors ${prefs[key] ? "bg-primary" : "bg-secondary"}`}
                  >
                    <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${prefs[key] ? "left-[18px]" : "left-0.5"}`} />
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
