import { useParams, Link } from "react-router-dom";
import { MapPin, Clock, Activity, DollarSign, TrendingUp, Settings, Target, Filter, Eye, ArrowUpRight, ChevronLeft } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Area, AreaChart } from "recharts";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { mineracoes, anuncios } from "@/data/mock";

const Mineracao = () => {
  const { id } = useParams();
  const m = mineracoes.find((x) => x.id === id) ?? mineracoes[0];
  const ads = anuncios.filter((a) => a.mineracaoId === m.id);

  return (
    <AppShell>
      <Link to="/" className="mb-6 inline-flex items-center gap-1.5 font-display text-[13px] font-bold text-muted-foreground transition-smooth hover:text-primary">
        <ChevronLeft className="h-4 w-4" strokeWidth={2.8} />
        Voltar para minerações
      </Link>

      {/* Hero */}
      <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-hero p-10 text-white shadow-elevated grain">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-10 h-72 w-72 rounded-full bg-primary-glow/40 blur-3xl" />

        <div className="relative">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 font-display text-[11px] font-extrabold uppercase tracking-[0.18em] backdrop-blur">
              <Activity className="h-3 w-3 animate-pulse" strokeWidth={3} />
              Minerando agora
            </div>
            <div className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-white/70">
              <Clock className="h-3.5 w-3.5" strokeWidth={2.6} />
              Atualizado há {m.atualizadoHa}
            </div>
          </div>

          <h1 className="heading-display mb-6 text-[64px] font-extrabold leading-[0.95]">{m.titulo}</h1>

          <div className="flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 backdrop-blur">
              <MapPin className="h-4 w-4" strokeWidth={2.6} />
              <span className="font-display text-[14px] font-bold">{m.cidade}</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 backdrop-blur">
              <DollarSign className="h-4 w-4" strokeWidth={2.6} />
              <span className="font-display text-[14px] font-bold">R$ {m.precoMin.toLocaleString('pt-BR')} até R$ {m.precoMax.toLocaleString('pt-BR')}</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-2xl border border-accent/40 bg-accent/20 px-4 py-2.5 backdrop-blur">
              <Target className="h-4 w-4 text-accent" strokeWidth={2.6} />
              <span className="font-display text-[14px] font-bold">Alvo R$ {m.precoAlvo.toLocaleString('pt-BR')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-5 md:grid-cols-3">
        <div className="rounded-3xl border border-border bg-card p-7">
          <div className="mb-4 flex items-center gap-2 text-muted-foreground">
            <Eye className="h-[18px] w-[18px]" strokeWidth={2.6} />
            <span className="font-display text-[13px] font-bold">Volume Encontrado</span>
          </div>
          <div className="font-display text-[48px] font-extrabold leading-none text-foreground">{m.anuncios}</div>
          <div className="mt-2 text-[13px] font-semibold text-muted-foreground">anúncios ativos</div>
          <div className="mt-3 text-[12.5px] text-muted-foreground/80">Baseado nos filtros de busca selecionados.</div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-7">
          <div className="mb-4 flex items-center gap-2 text-success">
            <DollarSign className="h-[18px] w-[18px]" strokeWidth={2.6} />
            <span className="font-display text-[13px] font-bold">Menor Preço</span>
          </div>
          <div className="font-display text-[48px] font-extrabold leading-none text-foreground">
            R$ {(m.menorPreco / 1000).toFixed(1).replace('.', ',')}<span className="text-[24px] text-muted-foreground">k</span>
          </div>
          <div className="mt-2 text-[13px] font-semibold text-muted-foreground">oportunidade mais barata</div>
          <div className="mt-3 text-[12.5px] text-muted-foreground/80">Encontrada há poucas horas.</div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-accent/5 p-7">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary">
              <TrendingUp className="h-[18px] w-[18px]" strokeWidth={2.6} />
              <span className="font-display text-[13px] font-bold">Margem Estimada</span>
            </div>
            <button className="flex items-center gap-1 text-[12px] font-bold text-primary hover:underline">
              <Settings className="h-3 w-3" strokeWidth={2.8} />
              Configurar
            </button>
          </div>
          <div className="font-display text-[48px] font-extrabold leading-none text-primary">+{m.margem}%</div>
          <div className="mt-2 text-[13px] font-semibold text-muted-foreground">lucro projetado por unidade</div>
          <Button className="mt-4 h-10 w-full rounded-xl bg-primary font-display text-[13px] font-extrabold">
            Definir Preço Alvo
          </Button>
        </div>
      </div>

      {/* Chart */}
      <div className="mb-8 rounded-3xl border border-border bg-card p-7">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-display text-[20px] font-extrabold text-foreground">Histórico de preço</h2>
            <p className="mt-1 text-[13px] text-muted-foreground">Menor preço diário nos últimos 7 dias.</p>
          </div>
          <div className="flex gap-2">
            {["7d", "30d", "90d"].map((p, i) => (
              <button key={p} className={`rounded-lg px-3 py-1.5 font-display text-[12px] font-bold transition-smooth ${i === 0 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={m.historico}>
              <defs>
                <linearGradient id="colorPreco" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="dia" stroke="hsl(var(--muted-foreground))" fontSize={12} fontWeight={600} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} fontWeight={600} tickFormatter={(v) => `R$${(v / 1000).toFixed(1)}k`} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--border))', fontFamily: 'Sora', fontWeight: 700 }}
                formatter={(v: number) => [`R$ ${v.toLocaleString('pt-BR')}`, 'Menor preço']}
              />
              <Area type="monotone" dataKey="preco" stroke="hsl(var(--primary))" strokeWidth={3} fill="url(#colorPreco)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Results */}
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-display text-[24px] font-extrabold tracking-tight text-foreground">Resultados encontrados</h2>
            <p className="mt-1 text-[13px] text-muted-foreground">Selecione um anúncio para ver detalhes completos e análise de lucro.</p>
          </div>
          <div className="flex gap-2">
            <button className="rounded-xl bg-primary/10 px-4 py-2 font-display text-[12.5px] font-extrabold text-primary">Menor Preço</button>
            <button className="rounded-xl bg-secondary px-4 py-2 font-display text-[12.5px] font-bold text-muted-foreground">Mais Recentes</button>
            <button className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 font-display text-[12.5px] font-bold text-foreground">
              <Filter className="h-3.5 w-3.5" strokeWidth={2.6} />
              Filtros
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {ads.map((a) => (
            <Link
              key={a.id}
              to={`/anuncio/${a.id}`}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card transition-smooth hover:-translate-y-1 hover:border-primary/40 hover:shadow-elegant"
            >
              <div className="relative h-48 bg-gradient-to-br from-secondary to-muted overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center font-display text-[60px] font-extrabold text-foreground/10">
                  {a.plataforma === "OLX" ? "OLX" : "ML"}
                </div>
                <div className={`absolute left-4 top-4 rounded-full px-3 py-1 font-display text-[10px] font-extrabold uppercase tracking-wider text-white ${a.plataforma === "OLX" ? "bg-accent" : "bg-warning"}`}>
                  {a.plataforma}
                </div>
                <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 font-display text-[11px] font-extrabold text-white backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  Score {a.score}
                </div>
              </div>
              <div className="p-5">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h3 className="font-display text-[15px] font-extrabold leading-tight text-foreground line-clamp-2">{a.titulo}</h3>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-smooth group-hover:text-primary" strokeWidth={2.6} />
                </div>
                <div className="mb-3 flex items-center gap-1 text-[12px] font-semibold text-muted-foreground">
                  <MapPin className="h-3 w-3" strokeWidth={2.6} />
                  {a.bairro}, {a.cidade}
                </div>
                <div className="flex items-end justify-between border-t border-border/60 pt-3">
                  <div>
                    <div className="font-display text-[24px] font-extrabold text-foreground">R$ {a.preco.toLocaleString('pt-BR')}</div>
                    <div className="text-[11px] font-semibold text-muted-foreground">publicado há {a.publicadoHa}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-[16px] font-extrabold text-success">+R$ {a.margemEstimada}</div>
                    <div className="text-[11px] font-semibold text-success/80">margem +{a.margemPercentual}%</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
};

export default Mineracao;
