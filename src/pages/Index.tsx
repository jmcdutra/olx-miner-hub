import { Link } from "react-router-dom";
import {
  Plus,
  MapPin,
  TrendingUp,
  Pause,
  Play,
  MoreVertical,
  Trash2,
  Edit,
  Sparkles,
  ArrowRight,
  Activity,
  BarChart3,
  Target,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { EmptySearchState, PageErrorState, PageLoadingState } from "@/components/QueryStates";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/modals/ConfirmDialog";
import { NovaMineracaoModal } from "@/components/modals/NovaMineracaoModal";
import { getErrorMessage } from "@/lib/api/get-error-message";
import { getCategoryIcon } from "@/lib/category-icons";
import { useDashboardQuery, useDeleteMineracaoMutation, useToggleMineracaoStatusMutation } from "@/hooks/api";
import type { DashboardStat, Mineracao } from "@/types/entities";

const fmt = (value: number) => value.toLocaleString("pt-BR");
const emptyMineracoes: Mineracao[] = [];
const emptyStats: DashboardStat[] = [];
const emptyActivity: { id: string; color: string; title: string; time: string; link: string }[] = [];

const filtros = [
  { key: "todas", label: "Todas" },
  { key: "ativas", label: "Ativas" },
  { key: "pausadas", label: "Pausadas" },
  { key: "novidades", label: "Novidades" },
] as const;

type Filtro = (typeof filtros)[number]["key"];

const statIcons: Record<string, LucideIcon> = {
  ativas: Activity,
  monitorados: BarChart3,
  margem: Target,
  lucro: TrendingUp,
};

const Stat = ({
  label,
  value,
  hint,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  accent?: boolean;
}) => (
  <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card p-5 shadow-sm transition-all hover:shadow-md">
    {accent && <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-primary to-primary/50" />}
    <div className="flex items-center justify-between">
      <div className="text-[12px] font-bold uppercase tracking-wider text-muted-foreground/80">{label}</div>
      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${accent ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
        <Icon className="h-4 w-4" strokeWidth={2.5} />
      </div>
    </div>
    <div className={`mt-2 text-3xl font-bold tracking-tight ${accent ? "text-primary" : "text-foreground"}`}>{value}</div>
    {hint && <div className="mt-1 text-[12px] font-medium text-muted-foreground">{hint}</div>}
  </div>
);

const MineracaoCard = ({
  item,
  onPause,
  onDelete,
  pending,
}: {
  item: Mineracao;
  onPause: (id: string) => void;
  onDelete: (id: string) => void;
  pending: boolean;
}) => {
  const ativa = item.status === "ativo";
  const categoryIcon = getCategoryIcon(item.categoria);

  return (
    <div className="group relative flex gap-4 rounded-2xl border border-border/50 bg-card p-4 transition-all hover:border-primary/40 hover:shadow-md">
      <Link to={`/mineracao/${item.id}`} className="relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/40 bg-gradient-to-br from-secondary/50 to-secondary/10 p-4 transition-colors group-hover:border-primary/20">
        <img src={categoryIcon} alt={item.categoria} className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-sm" loading="lazy" />
        {!ativa && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[2px]">
            <Pause className="h-6 w-6 text-foreground" strokeWidth={2.5} fill="currentColor" />
          </div>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <Link to={`/mineracao/${item.id}`} className="min-w-0 flex-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-primary/80">{item.categoria}</div>
            <h3 className="mt-0.5 truncate text-[16px] font-bold text-foreground transition-colors group-hover:text-primary">{item.titulo}</h3>
          </Link>
          <div className="flex shrink-0 items-center gap-1.5">
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
              ativa ? "border border-success/20 bg-success/10 text-success" : "border border-border/50 bg-secondary text-muted-foreground"
            }`}>
              {ativa ? "Ativa" : "Pausada"}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground" disabled={pending}>
                  <MoreVertical className="h-4 w-4" strokeWidth={2} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 rounded-xl border-border/50 shadow-lg">
                <DropdownMenuItem onClick={() => onPause(item.id)} className="cursor-pointer text-[13px] font-medium" disabled={pending}>
                  {ativa ? <><Pause className="mr-2 h-4 w-4" />Pausar</> : <><Play className="mr-2 h-4 w-4" />Retomar</>}
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-[13px] font-medium">
                  <Edit className="mr-2 h-4 w-4" />Editar filtros
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onDelete(item.id)} className="cursor-pointer text-[13px] font-medium text-destructive focus:bg-destructive/10 focus:text-destructive" disabled={pending}>
                  <Trash2 className="mr-2 h-4 w-4" />Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="mt-1.5 flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" /> {item.cidade}
        </div>

        <Link to={`/mineracao/${item.id}`} className="mt-auto flex items-end justify-between pt-3">
          <div>
            <div className="mb-0.5 text-[11px] font-semibold text-muted-foreground/80">Melhor Preço</div>
            <div className="text-[18px] font-bold tracking-tight text-foreground">R$ {fmt(item.menorPreco)}</div>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[12px] font-bold text-success">
              <TrendingUp className="h-3.5 w-3.5" strokeWidth={2.5} /> +{item.margem}%
            </div>
            <div className="mt-1 text-[11px] font-medium text-muted-foreground">
              {item.anuncios} anúncios {item.novosHoje > 0 && <span className="ml-1 font-bold text-accent">+{item.novosHoje} hoje</span>}
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

const Index = () => {
  const { data: dashboard, isLoading, isError, error, refetch } = useDashboardQuery();
  const toggleStatusMutation = useToggleMineracaoStatusMutation();
  const deleteMutation = useDeleteMineracaoMutation();
  const [filtro, setFiltro] = useState<Filtro>("todas");
  const [toDelete, setToDelete] = useState<string | null>(null);
  const [openNova, setOpenNova] = useState(false);

  const items = dashboard?.mineracoes ?? emptyMineracoes;
  const stats = dashboard?.stats ?? emptyStats;
  const recentActivity = dashboard?.recentActivity ?? emptyActivity;
  const ativas = items.filter((item) => item.status === "ativo").length;
  const filtered = useMemo(() => items.filter((item) => {
    if (filtro === "ativas") return item.status === "ativo";
    if (filtro === "pausadas") return item.status === "pausado";
    if (filtro === "novidades") return item.novosHoje > 0;
    return true;
  }), [filtro, items]);

  if (isLoading) {
    return (
      <AppShell>
        <PageLoadingState title="Carregando mineracoes" description="Montando seu dashboard e sincronizando atividades recentes." />
      </AppShell>
    );
  }

  if (isError || !dashboard) {
    return (
      <AppShell>
        <PageErrorState
          title="Nao foi possivel carregar suas mineracoes"
          description="O dashboard principal nao respondeu como esperado."
          details={getErrorMessage(error)}
          onRetry={() => {
            void refetch();
          }}
        />
      </AppShell>
    );
  }

  const handlePause = async (id: string) => {
    const item = await toggleStatusMutation.mutateAsync(id);
    toast.success(item.status === "ativo" ? "Mineração retomada" : "Mineração pausada", {
      description: item.titulo,
    });
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    const item = items.find((mineracao) => mineracao.id === toDelete);
    await deleteMutation.mutateAsync(toDelete);
    toast.success("Mineração excluída", { description: item?.titulo });
    setToDelete(null);
  };

  return (
    <AppShell>
      <PageHeader
        title="Minhas Minerações"
        description="Monitoramento em tempo real de oportunidades na OLX e Mercado Livre."
        actions={(
          <Button
            type="button"
            onClick={() => setOpenNova(true)}
            className="h-10 gap-2 rounded-full bg-primary px-5 text-[13.5px] font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            Nova Mineração
          </Button>
        )}
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat: DashboardStat) => (
          <Stat
            key={stat.id}
            label={stat.label}
            value={stat.value}
            hint={stat.hint}
            icon={statIcons[stat.id] ?? Activity}
            accent={stat.accent}
          />
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="mb-5 flex flex-col justify-between gap-4 border-b border-border/40 pb-4 sm:flex-row sm:items-center">
            <div className="inline-flex items-center gap-1 rounded-xl border border-border/30 bg-secondary/40 p-1">
              {filtros.map(({ key, label }) => {
                const count = key === "todas"
                  ? items.length
                  : key === "ativas"
                    ? ativas
                    : key === "pausadas"
                      ? items.length - ativas
                      : items.filter((item) => item.novosHoje > 0).length;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFiltro(key)}
                    className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-[13px] font-semibold transition-all ${
                      filtro === key
                        ? "border border-border/50 bg-background text-foreground shadow-sm"
                        : "border border-transparent text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                    }`}
                  >
                    {label}
                    <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-bold tabular-nums ${filtro === key ? "bg-primary/10 text-primary" : "bg-background/50"}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="px-1 text-[13px] font-medium text-muted-foreground">
              Ordenar por: <span className="cursor-pointer font-bold text-foreground hover:text-primary">Mais recente</span>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div>
              <EmptySearchState title="Nada por aqui" description="Tente mudar os filtros ou comece a monitorar um novo produto." />
              <Button
                type="button"
                onClick={() => setOpenNova(true)}
                className="mt-5 h-10 rounded-full bg-primary px-5 text-[13.5px] font-semibold text-primary-foreground shadow-sm"
              >
                <Plus className="mr-1.5 h-4 w-4" /> Criar Mineração
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {filtered.map((item) => (
                <MineracaoCard
                  key={item.id}
                  item={item}
                  onPause={handlePause}
                  onDelete={(id) => setToDelete(id)}
                  pending={toggleStatusMutation.isPending || deleteMutation.isPending}
                />
              ))}
              <button
                type="button"
                onClick={() => setOpenNova(true)}
                className="group flex min-h-[160px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/50 bg-secondary/10 p-6 text-center transition-all hover:border-primary/40 hover:bg-primary/5"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-border/50 bg-background shadow-sm transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Plus className="h-5 w-5" strokeWidth={2.5} />
                </div>
                <div className="text-[15px] font-bold text-foreground group-hover:text-primary">Adicionar Novo</div>
                <div className="mt-1 text-[12px] font-medium text-muted-foreground">Consome 1 crédito mensal</div>
              </button>
            </div>
          )}
        </div>

        <aside>
          <div className="sticky top-20 overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm">
            <div className="border-b border-border/40 bg-secondary/10 px-5 py-4">
              <h3 className="text-[14px] font-bold text-foreground">Timeline de Atividades</h3>
              <p className="mt-0.5 text-[12px] text-muted-foreground">Últimas notificações do sistema</p>
            </div>
            <div className="divide-y divide-border/40">
              {recentActivity.map((item) => (
                <Link key={item.id} to={item.link} className="group flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-secondary/40">
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${item.color} shadow-sm`} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-semibold text-foreground transition-colors group-hover:text-primary">{item.title}</div>
                    <div className="mt-0.5 text-[11.5px] font-medium text-muted-foreground">{item.time}</div>
                  </div>
                </Link>
              ))}
            </div>
            <Link to="/notificacoes" className="flex items-center justify-center gap-1.5 border-t border-border/40 bg-secondary/10 px-5 py-3 text-[12.5px] font-bold text-primary transition-colors hover:bg-secondary/30">
              Ver Histórico Completo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </aside>
      </div>

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(open) => !open && setToDelete(null)}
        title="Excluir mineração permanentemente?"
        description="Você perderá o histórico de preços, alertas e dados salvos. Esta ação não pode ser desfeita."
        confirmLabel="Sim, excluir"
        destructive
        onConfirm={handleDelete}
      />
      <NovaMineracaoModal open={openNova} onOpenChange={setOpenNova} />
    </AppShell>
  );
};

export default Index;
