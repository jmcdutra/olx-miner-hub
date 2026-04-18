import { useMemo, useState } from "react";
import { TrendingDown, CheckCircle2, Sparkles, Filter, Check, Settings2, Bell } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { PageErrorState, PageLoadingState } from "@/components/QueryStates";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
  useNotificationPreferencesQuery,
  useNotificationsQuery,
  useUpdateNotificationPreferencesMutation,
} from "@/hooks/api";
import { getErrorMessage } from "@/lib/api/get-error-message";
import type { Notificacao, NotificationType } from "@/types/entities";

const iconMap: Record<NotificationType, { icon: typeof Sparkles; color: string; bg: string; border: string }> = {
  novo: { icon: Sparkles, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  alerta: { icon: TrendingDown, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
  sistema: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10", border: "border-success/20" },
};

type TabKey = "todas" | "naolidas" | "oportunidades" | "sistema";
const emptyNotifications: Notificacao[] = [];

const Notificacoes = () => {
  const [tab, setTab] = useState<TabKey>("todas");
  const notificationsQuery = useNotificationsQuery();
  const preferencesQuery = useNotificationPreferencesQuery();
  const { data: notificationsData } = notificationsQuery;
  const { data: preferencesData } = preferencesQuery;
  const markReadMutation = useMarkNotificationReadMutation();
  const markAllMutation = useMarkAllNotificationsReadMutation();
  const updatePreferencesMutation = useUpdateNotificationPreferencesMutation();

  const items = notificationsData?.items ?? emptyNotifications;
  const prefs = preferencesData?.preferences;
  const filtered = useMemo(() => {
    if (tab === "naolidas") return items.filter((item) => !item.lida);
    if (tab === "oportunidades") return items.filter((item) => item.tipo === "novo" || item.tipo === "alerta");
    if (tab === "sistema") return items.filter((item) => item.tipo === "sistema");
    return items;
  }, [items, tab]);

  if (notificationsQuery.isLoading || preferencesQuery.isLoading) {
    return (
      <AppShell>
        <PageLoadingState title="Carregando notificacoes" description="Sincronizando alertas e preferencias da sua central." />
      </AppShell>
    );
  }

  if (notificationsQuery.isError || preferencesQuery.isError || !notificationsData || !preferencesData) {
    return (
      <AppShell>
        <PageErrorState
          title="Nao foi possivel carregar a central de notificacoes"
          description="Seus alertas nao puderam ser exibidos agora."
          details={getErrorMessage(notificationsQuery.error ?? preferencesQuery.error)}
          onRetry={() => {
            void Promise.all([notificationsQuery.refetch(), preferencesQuery.refetch()]);
          }}
        />
      </AppShell>
    );
  }

  const naoLidas = items.filter((item) => !item.lida).length;

  const marcarLida = async (id: number) => {
    await markReadMutation.mutateAsync(id);
  };

  const marcarTodas = async () => {
    await markAllMutation.mutateAsync();
    toast.success("Todas as notificações marcadas como lidas.");
  };

  const togglePref = async (
    key: keyof NonNullable<typeof prefs>,
    label: string,
  ) => {
    if (!prefs) return;
    const nextValue = !prefs[key];
    await updatePreferencesMutation.mutateAsync({ [key]: nextValue });
    toast.success(`${label} ${nextValue ? "ativado" : "desativado"} com sucesso.`);
  };

  return (
    <AppShell>
      <PageHeader
        title="Central de Notificações"
        description={`Você tem ${naoLidas} alertas não lidos aguardando sua atenção.`}
        actions={(
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => toast("Filtros avançados em breve")} className="h-10 gap-2 rounded-full border-border/60 text-[13px] font-semibold hover:bg-secondary">
              <Filter className="h-4 w-4" /> Filtrar
            </Button>
            <Button variant="outline" onClick={marcarTodas} className="h-10 gap-2 rounded-full border-border/60 text-[13px] font-semibold hover:bg-secondary" disabled={markAllMutation.isPending || naoLidas === 0}>
              <Check className="h-4 w-4" /> Marcar todas como lidas
            </Button>
          </div>
        )}
      />

      <div className="mt-2 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <div className="mb-6 flex w-fit flex-wrap items-center gap-2 rounded-xl border border-border/30 bg-secondary/40 p-1">
            {([
              ["todas", "Todas", items.length],
              ["naolidas", "Não Lidas", naoLidas],
              ["oportunidades", "Oportunidades", items.filter((item) => item.tipo !== "sistema").length],
              ["sistema", "Sistema", items.filter((item) => item.tipo === "sistema").length],
            ] as const).map(([key, label, count]) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-[13px] font-semibold transition-all ${
                  tab === key
                    ? "border border-border/50 bg-background text-foreground shadow-sm"
                    : "border border-transparent text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                }`}
              >
                {label}
                <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-bold tabular-nums ${tab === key ? "bg-primary/10 text-primary" : "bg-background/50"}`}>
                  {count}
                </span>
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/60 bg-secondary/10 py-20 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-success/20 bg-success/10 text-success shadow-sm">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-[18px] font-bold text-foreground">Tudo em dia por aqui!</h3>
              <p className="mt-1.5 max-w-sm text-[14px] text-muted-foreground">Você não tem notificações nesta categoria no momento.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((item) => {
                const cfg = iconMap[item.tipo];
                const Icon = cfg.icon;

                return (
                  <div
                    key={item.id}
                    className={`group relative flex items-start gap-4 rounded-2xl border p-5 transition-all duration-300 ${
                      !item.lida
                        ? "border-primary/30 bg-primary/[0.02] shadow-sm hover:border-primary/50"
                        : "border-border/50 bg-card hover:border-border hover:shadow-sm"
                    }`}
                  >
                    {!item.lida && <div className="absolute -left-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-background bg-primary shadow-sm" />}

                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border shadow-sm ${cfg.bg} ${cfg.border}`}>
                      <Icon className={`h-5 w-5 ${cfg.color}`} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="leading-snug text-[15px] font-bold text-foreground transition-colors group-hover:text-primary">{item.titulo}</h3>
                        <span className="mt-0.5 shrink-0 text-[12px] font-semibold text-muted-foreground">{item.tempo}</span>
                      </div>
                      <p className="mt-1 text-[13.5px] leading-relaxed text-muted-foreground/90">{item.descricao}</p>

                      <div className="mt-3 flex items-center gap-4">
                        <button type="button" onClick={() => toast("Abrindo oportunidade…")} className="text-[12px] font-bold text-primary transition-colors hover:text-primary/80">
                          Ver Detalhes →
                        </button>
                        {!item.lida && (
                          <button type="button" onClick={() => marcarLida(item.id)} className="text-[12px] font-semibold text-muted-foreground transition-colors hover:text-foreground" disabled={markReadMutation.isPending}>
                            Marcar como lida
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <aside>
          <div className="sticky top-20 overflow-hidden rounded-3xl border border-border/50 bg-card shadow-sm">
            <div className="flex items-center gap-2.5 border-b border-border/40 bg-secondary/10 px-6 py-5">
              <Settings2 className="h-5 w-5 text-muted-foreground" />
              <div>
                <h3 className="text-[15px] font-bold text-foreground">Preferências de Alerta</h3>
                <p className="mt-0.5 text-[12px] text-muted-foreground">Controle como você é avisado.</p>
              </div>
            </div>

            <div className="divide-y divide-border/40 px-6 py-2">
              {([
                ["novos", "Novos Anúncios", "Seja avisado assim que algo novo for publicado no seu radar."],
                ["queda", "Quedas de Preço", "Alertas quando um preço cai mais de 10% de repente."],
                ["resumo", "Resumo Diário", "Receba um email matinal com o Top 5 das melhores oportunidades."],
                ["push", "Notificações no Navegador", "Receba alertas mesmo com o app fechado (Push)."],
              ] as const).map(([key, label, desc]) => (
                <div key={key} className="flex items-center justify-between py-4">
                  <div className="pr-4">
                    <div className="text-[14px] font-bold text-foreground">{label}</div>
                    <div className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{desc}</div>
                  </div>
                  <Switch
                    checked={prefs?.[key] ?? false}
                    onCheckedChange={() => togglePref(key, label)}
                    disabled={!prefs || updatePreferencesMutation.isPending}
                    aria-label={label}
                  />
                </div>
              ))}
            </div>

            <div className="border-t border-border/40 bg-secondary/5 px-6 py-4 text-[12px] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Bell className="h-3.5 w-3.5" />
                Preferências sincronizadas com a API mockada do ambiente local.
              </span>
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
};

export default Notificacoes;
