import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { MapPin, ChevronLeft, TrendingDown, Filter, Camera, Star, Heart, GitCompare, Pause, Play, Settings, X, ChevronDown } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { mineracoes, anuncios } from "@/data/mock";
import { useApp } from "@/context/AppContext";
import { ConfirmDialog } from "@/components/modals/ConfirmDialog";

const fmt = (v: number) => v.toLocaleString("pt-BR");

const Mineracao = () => {
  const { id } = useParams();
  const m = mineracoes.find((x) => x.id === id) ?? mineracoes[0];
  const [ativa, setAtiva] = useState(m.status === "ativo");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [periodo, setPeriodo] = useState<"7d" | "30d" | "90d">("7d");
  const [orderBy, setOrderBy] = useState<"preco" | "margem" | "recente">("preco");
  const [filtros, setFiltros] = useState({
    plataformas: ["OLX", "Mercado Livre"],
    minPreco: m.precoMin,
    maxPreco: m.precoMax,
    apenasFotos: false,
    apenasVerificados: false,
  });

  const { isFavorito, toggleFavorito, isComparando, toggleComparar } = useApp();

  const allAds = anuncios.filter((a) => a.mineracaoId === m.id);
  const ads = allAds
    .filter((a) => filtros.plataformas.includes(a.plataforma))
    .filter((a) => a.preco >= filtros.minPreco && a.preco <= filtros.maxPreco)
    .sort((a, b) => {
      if (orderBy === "margem") return b.margemPercentual - a.margemPercentual;
      if (orderBy === "recente") return a.publicadoHa.localeCompare(b.publicadoHa);
      return a.preco - b.preco;
    });

  const togglePlataforma = (p: string) => {
    setFiltros((prev) => ({
      ...prev,
      plataformas: prev.plataformas.includes(p) ? prev.plataformas.filter((x) => x !== p) : [...prev.plataformas, p],
    }));
  };

  return (
    <AppShell>
      <Link to="/" className="mb-4 inline-flex items-center gap-1 text-[12.5px] font-extrabold text-muted-foreground hover:text-primary">
        <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2.6} />
        Minerações
      </Link>

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-start md:justify-between">
        <div className="flex gap-4">
          <img src={m.capa} alt={m.titulo} className="h-20 w-20 shrink-0 rounded-md object-cover" />
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{m.categoria}</div>
            <h1 className="mt-0.5 font-display text-[26px] font-extrabold leading-tight text-foreground">{m.titulo}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12.5px] font-medium text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" strokeWidth={2.4} />{m.cidade}</span>
              <span>R$ {fmt(m.precoMin)} – R$ {fmt(m.precoMax)}</span>
              <span className={ativa ? "text-success" : "text-warning"}>
                {ativa ? `Atualizado ${m.atualizadoHa}` : "Pausada"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast("Editor de filtros em breve")} className="h-9 gap-1.5 rounded-md border-border font-display text-[12.5px] font-extrabold">
            <Settings className="h-3.5 w-3.5" strokeWidth={2.4} /> Editar
          </Button>
          <Button
            variant="outline"
            onClick={() => { setAtiva(!ativa); toast.success(ativa ? "Mineração pausada" : "Mineração retomada"); }}
            className="h-9 gap-1.5 rounded-md border-border font-display text-[12.5px] font-extrabold"
          >
            {ativa ? <><Pause className="h-3.5 w-3.5" strokeWidth={2.4} />Pausar</> : <><Play className="h-3.5 w-3.5" strokeWidth={2.4} />Retomar</>}
          </Button>
          <Button
            variant="outline"
            onClick={() => setConfirmDelete(true)}
            className="h-9 rounded-md border-destructive/40 text-destructive font-display text-[12.5px] font-extrabold hover:bg-destructive hover:text-destructive-foreground"
          >
            Excluir
          </Button>
        </div>
      </div>

      {/* Stats strip */}
      <div className="mb-6 grid gap-3 md:grid-cols-4">
        {[
          { label: "Anúncios encontrados", value: String(allAds.length), hint: `+${m.novosHoje} hoje` },
          { label: "Menor preço", value: `R$ ${fmt(m.menorPreco)}`, hint: "Vila Mariana, SP", accent: true },
          { label: "Preço alvo", value: `R$ ${fmt(m.precoAlvo)}`, hint: "Definido por você" },
          { label: "Margem estimada", value: `+${m.margem}%`, hint: `Lucro ~R$ ${fmt(m.precoAlvo - m.menorPreco)}`, success: true },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-card p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{s.label}</div>
            <div className={`mt-1.5 font-display text-[24px] font-extrabold leading-none price ${
              s.accent ? "text-accent" : s.success ? "text-success" : "text-foreground"
            }`}>{s.value}</div>
            {s.hint && <div className="mt-1.5 text-[11.5px] font-medium text-muted-foreground">{s.hint}</div>}
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="mb-6 rounded-lg border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-display text-[15px] font-extrabold text-foreground">Histórico de preço</h2>
            <p className="text-[12px] text-muted-foreground">Menor preço diário</p>
          </div>
          <div className="flex gap-1 rounded-md border border-border p-0.5">
            {(["7d", "30d", "90d"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriodo(p)}
                className={`rounded px-2.5 py-1 font-display text-[11.5px] font-extrabold ${
                  periodo === p ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={m.historico} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="cp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="dia" stroke="hsl(var(--muted-foreground))" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12, fontWeight: 700 }}
                formatter={(v: number) => [`R$ ${fmt(v)}`, "Menor preço"]}
              />
              <Area type="monotone" dataKey="preco" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#cp)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Resultados com filtros laterais */}
      <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
        {/* Filtros */}
        <aside className="lg:sticky lg:top-20 lg:h-fit">
          <div className="rounded-lg border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-1.5 font-display text-[13px] font-extrabold text-foreground">
                <Filter className="h-3.5 w-3.5" strokeWidth={2.4} /> Filtros
              </div>
              <button
                onClick={() => setFiltros({ plataformas: ["OLX", "Mercado Livre"], minPreco: m.precoMin, maxPreco: m.precoMax, apenasFotos: false, apenasVerificados: false })}
                className="text-[11px] font-extrabold text-primary hover:underline"
              >
                Limpar
              </button>
            </div>
            <div className="space-y-4 p-4">
              <div>
                <div className="mb-2 text-[10.5px] font-extrabold uppercase tracking-wider text-muted-foreground">Plataforma</div>
                <div className="space-y-1.5">
                  {["OLX", "Mercado Livre"].map((p) => (
                    <label key={p} className="flex cursor-pointer items-center gap-2 text-[12.5px] font-semibold text-foreground">
                      <input
                        type="checkbox"
                        checked={filtros.plataformas.includes(p)}
                        onChange={() => togglePlataforma(p)}
                        className="h-3.5 w-3.5 accent-primary"
                      />
                      {p}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 text-[10.5px] font-extrabold uppercase tracking-wider text-muted-foreground">Faixa de preço</div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={filtros.minPreco}
                    onChange={(e) => setFiltros({ ...filtros, minPreco: Number(e.target.value) })}
                    className="h-8 w-full rounded-md border border-border bg-card px-2 text-[12px] font-semibold focus:border-primary focus:outline-none"
                  />
                  <span className="text-[12px] text-muted-foreground">–</span>
                  <input
                    type="number"
                    value={filtros.maxPreco}
                    onChange={(e) => setFiltros({ ...filtros, maxPreco: Number(e.target.value) })}
                    className="h-8 w-full rounded-md border border-border bg-card px-2 text-[12px] font-semibold focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 text-[10.5px] font-extrabold uppercase tracking-wider text-muted-foreground">Outros</div>
                <div className="space-y-1.5">
                  <label className="flex cursor-pointer items-center gap-2 text-[12.5px] font-semibold text-foreground">
                    <input
                      type="checkbox"
                      checked={filtros.apenasFotos}
                      onChange={(e) => setFiltros({ ...filtros, apenasFotos: e.target.checked })}
                      className="h-3.5 w-3.5 accent-primary"
                    />
                    5+ fotos
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 text-[12.5px] font-semibold text-foreground">
                    <input
                      type="checkbox"
                      checked={filtros.apenasVerificados}
                      onChange={(e) => setFiltros({ ...filtros, apenasVerificados: e.target.checked })}
                      className="h-3.5 w-3.5 accent-primary"
                    />
                    Vendedor verificado
                  </label>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Cards */}
        <div>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-[16px] font-extrabold text-foreground">{ads.length} resultados</h2>
              <p className="text-[12px] text-muted-foreground">{ads.length !== allAds.length && `${allAds.length - ads.length} ocultos pelos filtros`}</p>
            </div>
            <div className="relative">
              <select
                value={orderBy}
                onChange={(e) => setOrderBy(e.target.value as any)}
                className="h-8 cursor-pointer appearance-none rounded-md border border-border bg-card pl-3 pr-8 text-[12px] font-extrabold text-foreground focus:border-primary focus:outline-none"
              >
                <option value="preco">Menor preço</option>
                <option value="margem">Maior margem</option>
                <option value="recente">Mais recente</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" strokeWidth={2.4} />
            </div>
          </div>

          {ads.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-secondary/30 py-16 text-center">
              <Filter className="h-6 w-6 text-muted-foreground" strokeWidth={2.2} />
              <h3 className="mt-3 font-display text-[14px] font-extrabold text-foreground">Sem resultados</h3>
              <p className="mt-1 text-[12px] text-muted-foreground">Ajuste os filtros para ver mais anúncios.</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {ads.map((a) => {
                const fav = isFavorito(a.id);
                const cmp = isComparando(a.id);
                return (
                  <div key={a.id} className="group relative overflow-hidden rounded-lg border border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-md">
                    <Link to={`/anuncio/${a.id}`} className="block">
                      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                        <img src={a.capa} alt={a.titulo} className="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
                        <span className={`absolute left-2 top-2 rounded px-1.5 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wider text-white ${
                          a.plataforma === "OLX" ? "bg-accent" : "bg-[#fff159] !text-[#2d3277]"
                        }`}>
                          {a.plataforma}
                        </span>
                        {a.destaque === "menor-preco" && (
                          <span className="absolute right-2 top-2 rounded bg-success px-1.5 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wider text-success-foreground">Menor preço</span>
                        )}
                        {a.destaque === "queda-preco" && (
                          <span className="absolute right-2 top-2 inline-flex items-center gap-0.5 rounded bg-primary px-1.5 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wider text-primary-foreground">
                            <TrendingDown className="h-2.5 w-2.5" strokeWidth={3} />Caiu
                          </span>
                        )}
                        <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded bg-foreground/75 px-1.5 py-0.5 text-[10px] font-extrabold text-white">
                          <Camera className="h-2.5 w-2.5" strokeWidth={3} />{a.fotos}
                        </span>
                      </div>
                      <div className="p-3">
                        {a.precoAntigo && (
                          <div className="text-[11px] font-semibold text-muted-foreground line-through price">R$ {fmt(a.precoAntigo)}</div>
                        )}
                        <div className="font-display text-[20px] font-extrabold leading-none text-foreground price">R$ {fmt(a.preco)}</div>
                        <div className="mt-1 inline-flex items-center gap-0.5 rounded bg-success-soft px-1.5 py-0.5 text-[10.5px] font-extrabold text-success">
                          +R$ {fmt(a.margemEstimada)} · +{a.margemPercentual}%
                        </div>
                        <h3 className="mt-2 line-clamp-2 text-[12.5px] font-semibold leading-snug text-foreground/85">{a.titulo}</h3>
                        <div className="mt-2 flex items-center justify-between text-[10.5px] font-medium text-muted-foreground">
                          <span className="flex items-center gap-0.5"><MapPin className="h-2.5 w-2.5" strokeWidth={2.6} />{a.bairro}</span>
                          <span className="flex items-center gap-0.5"><Star className="h-2.5 w-2.5 fill-warning text-warning" strokeWidth={2.6} />{a.score}</span>
                        </div>
                      </div>
                    </Link>
                    {/* Action chips */}
                    <div className="absolute right-2 top-2 flex translate-y-1 flex-col gap-1 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                      <button
                        onClick={(e) => { e.preventDefault(); toggleFavorito(a.id, a.titulo); }}
                        className={`flex h-7 w-7 items-center justify-center rounded-md border backdrop-blur transition-colors ${
                          fav ? "border-accent bg-accent text-accent-foreground" : "border-border bg-card/90 text-foreground hover:bg-card"
                        }`}
                        aria-label="Favoritar"
                      >
                        <Heart className="h-3.5 w-3.5" strokeWidth={2.4} fill={fav ? "currentColor" : "none"} />
                      </button>
                      <button
                        onClick={(e) => { e.preventDefault(); toggleComparar(a.id, a.titulo); }}
                        className={`flex h-7 w-7 items-center justify-center rounded-md border backdrop-blur transition-colors ${
                          cmp ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card/90 text-foreground hover:bg-card"
                        }`}
                        aria-label="Comparar"
                      >
                        {cmp ? <X className="h-3.5 w-3.5" strokeWidth={2.6} /> : <GitCompare className="h-3.5 w-3.5" strokeWidth={2.4} />}
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
        confirmLabel="Excluir mineração"
        destructive
        onConfirm={() => toast.success("Mineração excluída (demo)")}
      />
    </AppShell>
  );
};

export default Mineracao;
