import { useParams, Link } from "react-router-dom";
import { MapPin, ChevronLeft, TrendingDown, Filter, ArrowUpDown, Camera, Star } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { mineracoes, anuncios } from "@/data/mock";

const fmt = (v: number) => v.toLocaleString("pt-BR");

const Mineracao = () => {
  const { id } = useParams();
  const m = mineracoes.find((x) => x.id === id) ?? mineracoes[0];
  const ads = anuncios.filter((a) => a.mineracaoId === m.id);

  return (
    <AppShell>
      {/* Breadcrumb */}
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
              <span className="text-success">Atualizado {m.atualizadoHa}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-9 rounded-md border-border font-display text-[12.5px] font-extrabold">
            Editar filtros
          </Button>
          <Button variant="outline" className="h-9 rounded-md border-border font-display text-[12.5px] font-extrabold">
            Pausar
          </Button>
        </div>
      </div>

      {/* Stats strip */}
      <div className="mb-6 grid gap-3 md:grid-cols-4">
        {[
          { label: "Anúncios encontrados", value: String(m.anuncios), hint: `+${m.novosHoje} hoje` },
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
            {["7d", "30d", "90d"].map((p, i) => (
              <button
                key={p}
                className={`rounded px-2.5 py-1 font-display text-[11.5px] font-extrabold ${
                  i === 0 ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
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

      {/* Results */}
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="font-display text-[18px] font-extrabold text-foreground">{ads.length} resultados encontrados</h2>
          <p className="text-[12.5px] text-muted-foreground">Ordenados por menor preço</p>
        </div>
        <div className="flex gap-2">
          <button className="flex h-8 items-center gap-1.5 rounded-md border border-border bg-card px-2.5 text-[12px] font-extrabold text-foreground hover:bg-secondary">
            <Filter className="h-3.5 w-3.5" strokeWidth={2.4} /> Filtros
          </button>
          <button className="flex h-8 items-center gap-1.5 rounded-md border border-border bg-card px-2.5 text-[12px] font-extrabold text-foreground hover:bg-secondary">
            <ArrowUpDown className="h-3.5 w-3.5" strokeWidth={2.4} /> Menor preço
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {ads.map((a) => (
          <Link
            key={a.id}
            to={`/anuncio/${a.id}`}
            className="group overflow-hidden rounded-lg border border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
              <img src={a.capa} alt={a.titulo} className="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
              <span className={`absolute left-2 top-2 rounded px-1.5 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wider text-white ${
                a.plataforma === "OLX" ? "bg-accent" : "bg-[#fff159] !text-[#2d3277]"
              }`}>
                {a.plataforma}
              </span>
              {a.destaque === "menor-preco" && (
                <span className="absolute right-2 top-2 rounded bg-success px-1.5 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wider text-success-foreground">
                  Menor preço
                </span>
              )}
              {a.destaque === "queda-preco" && (
                <span className="absolute right-2 top-2 inline-flex items-center gap-0.5 rounded bg-primary px-1.5 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wider text-primary-foreground">
                  <TrendingDown className="h-2.5 w-2.5" strokeWidth={3} />
                  Caiu
                </span>
              )}
              <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded bg-foreground/75 px-1.5 py-0.5 text-[10px] font-extrabold text-white">
                <Camera className="h-2.5 w-2.5" strokeWidth={3} />
                {a.fotos}
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
        ))}
      </div>
    </AppShell>
  );
};

export default Mineracao;
