import { Link } from "react-router-dom";
import { Plus, MapPin, TrendingUp, Pause, Play, MoreVertical, Trash2, Edit, Activity, Sparkles, ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { mineracoes as mineracoesMock } from "@/data/mock";
import { NovaMineracaoModal } from "@/components/modals/NovaMineracaoModal";
import { ConfirmDialog } from "@/components/modals/ConfirmDialog";

const fmt = (v: number) => v.toLocaleString("pt-BR");

const Stat = ({ label, value, hint, accent }: { label: string; value: string; hint?: string; accent?: boolean }) => (
  <div className="rounded-lg border border-border bg-card p-4">
    <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</div>
    <div className={`mt-1.5 font-display text-[26px] font-extrabold leading-none price ${accent ? "text-primary" : "text-foreground"}`}>{value}</div>
    {hint && <div className="mt-1.5 text-[12px] font-medium text-muted-foreground">{hint}</div>}
  </div>
);

const MineracaoCard = ({
  m,
  onPause,
  onDelete,
}: {
  m: typeof mineracoesMock[0];
  onPause: (id: string, ativo: boolean) => void;
  onDelete: (id: string) => void;
}) => {
  const ativa = m.status === "ativo";
  return (
    <div className="group relative flex gap-4 rounded-lg border border-border bg-card p-3 transition-all hover:border-primary/40 hover:shadow-sm">
      <Link to={`/mineracao/${m.id}`} className="relative h-28 w-28 shrink-0 overflow-hidden rounded-md bg-secondary">
        <img src={m.capa} alt={m.titulo} className="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
        {!ativa && (
          <div className="absolute inset-0 flex items-center justify-center bg-foreground/40">
            <Pause className="h-5 w-5 text-white" strokeWidth={3} fill="white" />
          </div>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <Link to={`/mineracao/${m.id}`} className="min-w-0">
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{m.categoria}</div>
            <h3 className="mt-0.5 truncate font-display text-[15px] font-extrabold text-foreground hover:text-primary">{m.titulo}</h3>
          </Link>
          <div className="flex shrink-0 items-center gap-1">
            <span className={`rounded px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
              ativa ? "bg-success-soft text-success" : "bg-secondary text-muted-foreground"
            }`}>
              {ativa ? "Ativo" : "Pausado"}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-secondary hover:text-foreground">
                  <MoreVertical className="h-3.5 w-3.5" strokeWidth={2.4} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onClick={() => onPause(m.id, ativa)} className="text-[12.5px] font-semibold">
                  {ativa ? <><Pause className="mr-2 h-3.5 w-3.5" />Pausar</> : <><Play className="mr-2 h-3.5 w-3.5" />Retomar</>}
                </DropdownMenuItem>
                <DropdownMenuItem className="text-[12.5px] font-semibold">
                  <Edit className="mr-2 h-3.5 w-3.5" />Editar filtros
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onDelete(m.id)} className="text-[12.5px] font-semibold text-destructive focus:text-destructive">
                  <Trash2 className="mr-2 h-3.5 w-3.5" />Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="mt-1 flex items-center gap-1 text-[12px] font-medium text-muted-foreground">
          <MapPin className="h-3 w-3" strokeWidth={2.4} />
          {m.cidade}
        </div>

        <Link to={`/mineracao/${m.id}`} className="mt-auto flex items-end justify-between pt-2">
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
        </Link>
      </div>
    </div>
  );
};

const Index = () => {
  const [items, setItems] = useState(mineracoesMock);
  const [filtro, setFiltro] = useState<"todas" | "ativas" | "pausadas" | "novidades">("todas");
  const [openNova, setOpenNova] = useState(false);
  const [toDelete, setToDelete] = useState<string | null>(null);

  const ativas = items.filter((m) => m.status === "ativo").length;
  const totalAnuncios = items.reduce((acc, m) => acc + m.anuncios, 0);
  const novos = items.reduce((acc, m) => acc + m.novosHoje, 0);

  const filtered = items.filter((m) => {
    if (filtro === "ativas") return m.status === "ativo";
    if (filtro === "pausadas") return m.status === "pausado";
    if (filtro === "novidades") return m.novosHoje > 0;
    return true;
  });

  const handlePause = (id: string, ativo: boolean) => {
    setItems((prev) => prev.map((m) => m.id === id ? { ...m, status: ativo ? "pausado" : "ativo" } as any : m));
    toast.success(ativo ? "Mineração pausada" : "Mineração retomada");
  };

  const handleDelete = () => {
    if (!toDelete) return;
    const item = items.find((m) => m.id === toDelete);
    setItems((prev) => prev.filter((m) => m.id !== toDelete));
    toast.success("Mineração excluída", { description: item?.titulo });
    setToDelete(null);
  };

  return (
    <AppShell>
      <PageHeader
        title="Minhas minerações"
        description="Monitore preços de produtos na OLX e Mercado Livre em tempo real."
        actions={
          <Button onClick={() => setOpenNova(true)} className="h-9 gap-1.5 rounded-md bg-primary px-3.5 font-display text-[13px] font-extrabold text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" strokeWidth={2.6} />
            Nova mineração
          </Button>
        }
      />

      <div className="mb-6 grid gap-3 md:grid-cols-4">
        <Stat label="Ativas" value={String(ativas)} hint={`${ativas} de 50 vagas`} accent />
        <Stat label="Anúncios monitorados" value={fmt(totalAnuncios)} hint={`+${novos} novos hoje`} />
        <Stat label="Margem média" value="28%" hint="Acima da meta de 20%" />
        <Stat label="Lucro estimado" value="R$ 8.2k" hint="Últimos 30 dias" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div>
          {/* Filter bar */}
          <div className="mb-3 flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-1">
              {([
                ["todas", "Todas", items.length],
                ["ativas", "Ativas", ativas],
                ["pausadas", "Pausadas", items.length - ativas],
                ["novidades", "Com novidades", items.filter((i) => i.novosHoje > 0).length],
              ] as const).map(([key, label, count]) => (
                <button
                  key={key}
                  onClick={() => setFiltro(key as any)}
                  className={`rounded-md px-3 py-1.5 text-[12.5px] font-extrabold transition-colors ${
                    filtro === key ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                  }`}
                >
                  {label} <span className="ml-0.5 font-display tabular text-muted-foreground">{count}</span>
                </button>
              ))}
            </div>
            <div className="text-[12px] font-semibold text-muted-foreground">
              Ordenar: <span className="font-extrabold text-foreground">Mais recente</span>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-secondary/30 py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                <Sparkles className="h-5 w-5 text-muted-foreground" strokeWidth={2.2} />
              </div>
              <h3 className="mt-3 font-display text-[15px] font-extrabold text-foreground">Nada por aqui</h3>
              <p className="mt-1 text-[12.5px] text-muted-foreground">Mude o filtro ou crie uma nova mineração.</p>
              <Button onClick={() => setOpenNova(true)} className="mt-4 h-9 rounded-md bg-primary px-3.5 font-display text-[12.5px] font-extrabold text-primary-foreground">
                <Plus className="mr-1 h-3.5 w-3.5" strokeWidth={2.6} /> Nova mineração
              </Button>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {filtered.map((m) => (
                <MineracaoCard key={m.id} m={m} onPause={handlePause} onDelete={(id) => setToDelete(id)} />
              ))}
              <button
                onClick={() => setOpenNova(true)}
                className="flex min-h-[136px] items-center justify-center rounded-lg border border-dashed border-border bg-secondary/30 p-4 text-center transition-colors hover:border-primary hover:bg-primary-soft"
              >
                <div>
                  <Plus className="mx-auto mb-1.5 h-5 w-5 text-primary" strokeWidth={2.6} />
                  <div className="font-display text-[13.5px] font-extrabold text-foreground">Nova mineração</div>
                  <div className="mt-0.5 text-[11.5px] text-muted-foreground">1 crédito mensal</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Atividade recente */}
        <aside>
          <div className="rounded-lg border border-border bg-card">
            <div className="border-b border-border px-4 py-3">
              <h3 className="font-display text-[13.5px] font-extrabold text-foreground">Atividade recente</h3>
              <p className="text-[11.5px] text-muted-foreground">Últimas movimentações</p>
            </div>
            <div className="divide-y divide-border">
              {[
                { color: "bg-accent", title: "Novo iPhone abaixo de R$ 3.300", time: "2 min", link: "/anuncio/anuncio-1" },
                { color: "bg-primary", title: "MacBook M1 caiu R$ 200", time: "1 h", link: "/mineracao/macbook-pro-m1" },
                { color: "bg-success", title: "+50 créditos renovados", time: "ontem", link: "/creditos" },
                { color: "bg-accent", title: "PlayStation 5 raro encontrado", time: "2d", link: "/mineracao/playstation-5" },
                { color: "bg-muted-foreground", title: "Plano Pro renovou", time: "3d", link: "/planos" },
              ].map((it, i) => (
                <Link key={i} to={it.link} className="flex items-start gap-2.5 px-4 py-2.5 hover:bg-secondary/50">
                  <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${it.color}`} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[12.5px] font-semibold text-foreground">{it.title}</div>
                    <div className="text-[11px] text-muted-foreground">{it.time}</div>
                  </div>
                </Link>
              ))}
            </div>
            <Link to="/notificacoes" className="flex items-center justify-between border-t border-border px-4 py-2.5 text-[12px] font-extrabold text-primary hover:bg-secondary/40">
              Ver tudo
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.6} />
            </Link>
          </div>
        </aside>
      </div>

      <NovaMineracaoModal open={openNova} onOpenChange={setOpenNova} />
      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="Excluir mineração?"
        description="Você perderá o histórico de preços e alertas dessa mineração. Essa ação não pode ser desfeita."
        confirmLabel="Excluir"
        destructive
        onConfirm={handleDelete}
      />
    </AppShell>
  );
};

export default Index;
