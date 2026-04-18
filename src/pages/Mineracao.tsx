import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  MapPin,
  ChevronLeft,
  TrendingDown,
  Filter,
  Camera,
  Star,
  Heart,
  GitCompare,
  Pause,
  Play,
  Settings,
  X,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { EmptySearchState, PageErrorState, PageLoadingState } from "@/components/QueryStates";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/modals/ConfirmDialog";
import { useApp } from "@/context/AppContext";
import { getCategoryIcon } from "@/lib/category-icons";
import { useDeleteMineracaoMutation, useMineracaoQuery, useToggleMineracaoStatusMutation } from "@/hooks/api";
import { getErrorMessage } from "@/lib/api/get-error-message";
import type { Anuncio } from "@/types/entities";

const fmt = (value: number) => value.toLocaleString("pt-BR");
const emptyAds: Anuncio[] = [];

const Mineracao = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error, refetch } = useMineracaoQuery(id);
  const toggleStatusMutation = useToggleMineracaoStatusMutation();
  const deleteMutation = useDeleteMineracaoMutation();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [periodo, setPeriodo] = useState<"7d" | "30d" | "90d">("7d");
  const [orderBy, setOrderBy] = useState<"preco" | "margem" | "recente">("preco");
  const [filtros, setFiltros] = useState({
    plataformas: ["OLX", "Mercado Livre"],
    minPreco: 0,
    maxPreco: 0,
    apenasFotos: false,
    apenasVerificados: false,
  });
  const { isFavorito, toggleFavorito, isComparando, toggleComparar } = useApp();

  const mineracao = data?.mineracao;
  const allAds = data?.anuncios ?? emptyAds;

  useEffect(() => {
    if (!mineracao) return;
    setFiltros({
      plataformas: ["OLX", "Mercado Livre"],
      minPreco: mineracao.precoMin,
      maxPreco: mineracao.precoMax,
      apenasFotos: false,
      apenasVerificados: false,
    });
  }, [mineracao]);

  const ads = useMemo(() => {
    return allAds
      .filter((item) => filtros.plataformas.includes(item.plataforma))
      .filter((item) => item.preco >= filtros.minPreco && item.preco <= filtros.maxPreco)
      .filter((item) => !filtros.apenasFotos || item.fotos >= 5)
      .filter((item) => !filtros.apenasVerificados || item.score >= 85)
      .sort((a, b) => {
        if (orderBy === "margem") return b.margemPercentual - a.margemPercentual;
        if (orderBy === "recente") return a.publicadoHa.localeCompare(b.publicadoHa);
        return a.preco - b.preco;
      });
  }, [allAds, filtros, orderBy]);

  const togglePlataforma = (platform: string) => {
    setFiltros((prev) => ({
      ...prev,
      plataformas: prev.plataformas.includes(platform)
        ? prev.plataformas.filter((item) => item !== platform)
        : [...prev.plataformas, platform],
    }));
  };

  const toggleRequirement = (key: "apenasFotos" | "apenasVerificados") => {
    setFiltros((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (isLoading) {
    return (
      <AppShell>
        <PageLoadingState title="Carregando mineracao" description="Buscando filtros, historico e anuncios relacionados." />
      </AppShell>
    );
  }

  if (isError || !mineracao) {
    return (
      <AppShell>
        <PageErrorState
          title="Nao foi possivel carregar esta mineracao"
          description="Os dados desta operacao nao puderam ser montados."
          details={getErrorMessage(error)}
          onRetry={() => {
            void refetch();
          }}
        />
      </AppShell>
    );
  }

  const ativa = mineracao.status === "ativo";
  const categoryIcon = getCategoryIcon(mineracao.categoria);

  const handleToggleStatus = async () => {
    const item = await toggleStatusMutation.mutateAsync(mineracao.id);
    toast.success(item.status === "ativo" ? "Mineração retomada" : "Mineração pausada", {
      description: item.titulo,
    });
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(mineracao.id);
    toast.success("Mineração excluída com sucesso.");
    navigate("/");
  };

  return (
    <AppShell>
      <Link to="/" className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-secondary/50 px-3 py-1 text-[12px] font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
        <ChevronLeft className="h-3.5 w-3.5" />
        Voltar para Minerações
      </Link>

      <div className="mb-8 flex flex-col gap-5 border-b border-border/40 pb-6 md:flex-row md:items-start md:justify-between">
        <div className="flex items-center gap-5">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-border/50 bg-gradient-to-br from-background to-secondary/30 p-4 shadow-sm">
            <img src={categoryIcon} alt={mineracao.categoria} className="h-full w-full object-contain drop-shadow-sm" loading="lazy" />
          </div>
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">{mineracao.categoria}</span>
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${ativa ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
                {ativa ? "Monitorando" : "Pausada"}
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">{mineracao.titulo}</h1>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] font-medium text-muted-foreground">
              <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{mineracao.cidade}</span>
              <span className="flex items-center gap-1.5 before:mr-1 before:content-['•'] before:opacity-50">R$ {fmt(mineracao.precoMin)} a R$ {fmt(mineracao.precoMax)}</span>
              <span className="flex items-center gap-1.5 before:mr-1 before:content-['•'] before:opacity-50">Sincronizado há {mineracao.atualizadoHa}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2 md:pt-0">
          <Button variant="outline" onClick={() => toast("Editor de filtros em breve")} className="h-10 gap-2 rounded-full border-border/60 text-[13px] font-semibold hover:bg-secondary">
            <Settings className="h-4 w-4" /> Configurar
          </Button>
          <Button
            variant="outline"
            onClick={handleToggleStatus}
            className={`h-10 gap-2 rounded-full border-border/60 text-[13px] font-semibold ${ativa ? "hover:border-warning/30 hover:bg-warning/10 hover:text-warning" : "hover:border-success/30 hover:bg-success/10 hover:text-success"}`}
            disabled={toggleStatusMutation.isPending}
          >
            {ativa ? <><Pause className="h-4 w-4" />Pausar</> : <><Play className="h-4 w-4" />Retomar</>}
          </Button>
          <Button
            variant="ghost"
            onClick={() => setConfirmDelete(true)}
            className="h-10 w-10 rounded-full p-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            title="Excluir"
            disabled={deleteMutation.isPending}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Anúncios Capturados", value: String(allAds.length), hint: `+${mineracao.novosHoje} hoje` },
          { label: "Menor Preço Atual", value: `R$ ${fmt(mineracao.menorPreco)}`, hint: "Vila Mariana, SP", highlight: "text-foreground" },
          { label: "Preço Alvo Desejado", value: `R$ ${fmt(mineracao.precoAlvo)}`, hint: "Meta de revenda", highlight: "text-muted-foreground" },
          { label: "Margem de Lucro", value: `+${mineracao.margem}%`, hint: `~ R$ ${fmt(mineracao.precoAlvo - mineracao.menorPreco)} liquido`, highlight: "text-success" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">{stat.label}</div>
            <div className={`mt-2 text-2xl font-bold tracking-tight ${stat.highlight ?? "text-foreground"}`}>{stat.value}</div>
            {stat.hint && <div className="mt-1 text-[12px] font-medium text-muted-foreground">{stat.hint}</div>}
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-6">
          <div className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-[14px] font-bold text-foreground">Histórico</h2>
                <p className="text-[11px] text-muted-foreground">Evolução do menor preço</p>
              </div>
              <div className="flex gap-1 rounded-lg border border-border/40 bg-secondary/30 p-1">
                {(["7d", "30d", "90d"] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setPeriodo(item)}
                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                      periodo === item ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[140px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mineracao.historico} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.5} />
                  <XAxis dataKey="dia" stroke="hsl(var(--muted-foreground))" fontSize={10} fontWeight={600} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} fontWeight={600} tickLine={false} axisLine={false} tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ borderRadius: "12px", border: "1px solid hsl(var(--border)/0.5)", fontSize: "12px", fontWeight: "bold", backgroundColor: "hsl(var(--card))", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                    formatter={(value: number) => [`R$ ${fmt(value)}`, "Menor preço"]}
                    labelStyle={{ color: "hsl(var(--muted-foreground))", marginBottom: "4px" }}
                  />
                  <Area type="monotone" dataKey="preco" stroke="hsl(var(--primary))" strokeWidth={3} fill="url(#colorPrice)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="sticky top-20 rounded-2xl border border-border/50 bg-card shadow-sm">
            <div className="flex items-center justify-between border-b border-border/40 bg-secondary/10 px-5 py-4">
              <div className="flex items-center gap-2 text-[14px] font-bold text-foreground">
                <Filter className="h-4 w-4" /> Filtros Rápidos
              </div>
              <button
                type="button"
                onClick={() => setFiltros({ plataformas: ["OLX", "Mercado Livre"], minPreco: mineracao.precoMin, maxPreco: mineracao.precoMax, apenasFotos: false, apenasVerificados: false })}
                className="text-[12px] font-semibold text-primary transition-colors hover:text-primary/80"
              >
                Limpar
              </button>
            </div>

            <div className="space-y-6 p-5">
              <div>
                <div className="mb-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">Plataformas</div>
                <div className="space-y-2.5">
                  {["OLX", "Mercado Livre"].map((platform) => (
                    <button
                      key={platform}
                      type="button"
                      onClick={() => togglePlataforma(platform)}
                      className="group flex w-full items-center gap-3 text-left text-[13.5px] font-medium text-foreground"
                    >
                      <div className={`flex h-4.5 w-4.5 items-center justify-center rounded border transition-colors ${filtros.plataformas.includes(platform) ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card group-hover:border-primary/50"}`}>
                        {filtros.plataformas.includes(platform) && <CheckCircle2 className="h-3 w-3" strokeWidth={3} />}
                      </div>
                      {platform}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">Faixa de Preço</div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={filtros.minPreco}
                    onChange={(e) => setFiltros((prev) => ({ ...prev, minPreco: Number(e.target.value) }))}
                    className="h-10 w-full rounded-xl border border-border/50 bg-secondary/20 px-3 text-[13px] font-semibold transition-colors focus:border-primary/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/10"
                  />
                  <span className="text-[12px] text-muted-foreground">até</span>
                  <input
                    type="number"
                    value={filtros.maxPreco}
                    onChange={(e) => setFiltros((prev) => ({ ...prev, maxPreco: Number(e.target.value) }))}
                    className="h-10 w-full rounded-xl border border-border/50 bg-secondary/20 px-3 text-[13px] font-semibold transition-colors focus:border-primary/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/10"
                  />
                </div>
              </div>

              <div>
                <div className="mb-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">Exigências</div>
                <div className="space-y-2.5">
                  <button type="button" onClick={() => toggleRequirement("apenasFotos")} className="group flex w-full items-center gap-3 text-left text-[13.5px] font-medium text-foreground">
                    <div className={`flex h-4.5 w-4.5 items-center justify-center rounded border transition-colors ${filtros.apenasFotos ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card group-hover:border-primary/50"}`}>
                      {filtros.apenasFotos && <CheckCircle2 className="h-3 w-3" strokeWidth={3} />}
                    </div>
                    Com 5+ fotos
                  </button>
                  <button type="button" onClick={() => toggleRequirement("apenasVerificados")} className="group flex w-full items-center gap-3 text-left text-[13.5px] font-medium text-foreground">
                    <div className={`flex h-4.5 w-4.5 items-center justify-center rounded border transition-colors ${filtros.apenasVerificados ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card group-hover:border-primary/50"}`}>
                      {filtros.apenasVerificados && <CheckCircle2 className="h-3 w-3" strokeWidth={3} />}
                    </div>
                    Vendedor Verificado
                  </button>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-[18px] font-bold text-foreground">{ads.length} Oportunidades</h2>
              <p className="text-[13px] text-muted-foreground">{ads.length !== allAds.length && `${allAds.length - ads.length} anúncios ocultos pelos filtros atuais`}</p>
            </div>
            <div className="relative">
              <select
                value={orderBy}
                onChange={(e) => setOrderBy(e.target.value as "preco" | "margem" | "recente")}
                className="h-10 cursor-pointer appearance-none rounded-full border border-border/60 bg-card pl-4 pr-10 text-[13px] font-bold text-foreground shadow-sm transition-colors hover:border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
              >
                <option value="preco">Ordernar: Menor Preço</option>
                <option value="margem">Ordenar: Maior Margem</option>
                <option value="recente">Ordenar: Mais Recentes</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          {ads.length === 0 ? (
            <EmptySearchState title="Nenhum anuncio corresponde" description="Tente remover alguns filtros ou expandir a faixa de preco." />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {ads.map((item) => {
                const fav = isFavorito(item.id);
                const cmp = isComparando(item.id);

                return (
                  <div key={item.id} className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
                    <Link to={`/anuncio/${item.id}`} className="block flex-1">
                      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                        <img src={item.capa} alt={item.titulo} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
                          <span className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur-md ${
                            item.plataforma === "OLX" ? "bg-purple-600/90" : "bg-[#fff159]/90 !text-[#2d3277]"
                          }`}>
                            {item.plataforma}
                          </span>
                          {item.destaque === "menor-preco" && (
                            <span className="rounded-md bg-success/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-success-foreground shadow-sm backdrop-blur-md">
                              Melhor Preço
                            </span>
                          )}
                          {item.destaque === "queda-preco" && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-primary/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-sm backdrop-blur-md">
                              <TrendingDown className="h-3 w-3" strokeWidth={3} />
                              Preço Caiu
                            </span>
                          )}
                        </div>

                        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-background/80 px-2.5 py-1 text-[11px] font-bold text-foreground shadow-sm backdrop-blur-md">
                          <Camera className="h-3.5 w-3.5 text-muted-foreground" /> {item.fotos}
                        </span>
                      </div>

                      <div className="flex h-full flex-col p-4">
                        <div className="mb-1 flex items-end gap-2">
                          <div className="text-2xl font-bold tracking-tight text-foreground">R$ {fmt(item.preco)}</div>
                          {item.precoAntigo && (
                            <div className="pb-1 text-[12px] font-medium text-muted-foreground line-through">R$ {fmt(item.precoAntigo)}</div>
                          )}
                        </div>

                        <div className="mb-3 inline-flex items-center gap-1.5 self-start rounded-full border border-success/20 bg-success/10 px-2.5 py-1 text-[11px] font-bold text-success">
                          Lucro Estimado: +R$ {fmt(item.margemEstimada)}
                        </div>

                        <h3 className="line-clamp-2 text-[14px] font-semibold leading-snug text-foreground/90 transition-colors group-hover:text-primary">{item.titulo}</h3>

                        <div className="mt-auto flex items-center justify-between border-t border-border/40 pt-4 text-[12px] font-medium text-muted-foreground">
                          <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> <span className="max-w-[100px] truncate">{item.bairro}</span></span>
                          <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-warning text-warning" /> {item.score} Score</span>
                        </div>
                      </div>
                    </Link>

                    <div className="absolute right-3 top-3 flex translate-x-4 flex-col gap-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          toggleFavorito(item.id, item.titulo);
                        }}
                        className={`flex h-9 w-9 items-center justify-center rounded-full shadow-md backdrop-blur-md transition-all hover:scale-110 ${
                          fav ? "bg-accent text-white" : "bg-background/90 text-foreground hover:bg-background"
                        }`}
                        title="Salvar Favorito"
                      >
                        <Heart className="h-4.5 w-4.5" strokeWidth={2} fill={fav ? "currentColor" : "none"} />
                      </button>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          toggleComparar(item.id, item.titulo);
                        }}
                        className={`flex h-9 w-9 items-center justify-center rounded-full shadow-md backdrop-blur-md transition-all hover:scale-110 ${
                          cmp ? "bg-primary text-white" : "bg-background/90 text-foreground hover:bg-background"
                        }`}
                        title="Adicionar ao Comparador"
                      >
                        {cmp ? <X className="h-4.5 w-4.5" /> : <GitCompare className="h-4 w-4" strokeWidth={2} />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Excluir essa mineração?"
        description="Você perderá o histórico de preços e todos os alertas relacionados. Essa ação não pode ser desfeita."
        confirmLabel="Excluir Permanentemente"
        destructive
        onConfirm={handleDelete}
      />
    </AppShell>
  );
};

export default Mineracao;
