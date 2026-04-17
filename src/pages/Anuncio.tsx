import { useParams, Link } from "react-router-dom";
import { ChevronLeft, MapPin, Clock, ExternalLink, Phone, Star, TrendingUp, Camera, Shield, Zap, Target } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { anuncios, mineracoes } from "@/data/mock";

const Anuncio = () => {
  const { id } = useParams();
  const a = anuncios.find((x) => x.id === id) ?? anuncios[0];
  const m = mineracoes.find((x) => x.id === a.mineracaoId)!;

  return (
    <AppShell>
      <Link to={`/mineracao/${m.id}`} className="mb-6 inline-flex items-center gap-1.5 font-display text-[13px] font-bold text-muted-foreground transition-smooth hover:text-primary">
        <ChevronLeft className="h-4 w-4" strokeWidth={2.8} />
        Voltar para {m.titulo}
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        {/* Main */}
        <div>
          {/* Gallery */}
          <div className="relative mb-5 overflow-hidden rounded-3xl bg-gradient-to-br from-secondary to-muted aspect-[4/3]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="font-display text-[140px] font-extrabold text-foreground/10">{a.plataforma === "OLX" ? "OLX" : "ML"}</div>
            </div>
            <div className={`absolute left-5 top-5 rounded-full px-4 py-2 font-display text-[12px] font-extrabold uppercase tracking-wider text-white ${a.plataforma === "OLX" ? "bg-accent" : "bg-warning"}`}>
              {a.plataforma}
            </div>
            <div className="absolute bottom-5 right-5 flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 font-display text-[12px] font-extrabold text-white backdrop-blur">
              <Camera className="h-3.5 w-3.5" strokeWidth={2.6} />
              {a.fotos} fotos
            </div>
          </div>
          <div className="mb-8 grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-gradient-to-br from-secondary to-muted" />
            ))}
          </div>

          {/* Title */}
          <h1 className="heading-display mb-4 text-[42px] font-extrabold leading-tight text-foreground">{a.titulo}</h1>

          <div className="mb-8 flex flex-wrap items-center gap-4 text-[13px] font-semibold text-muted-foreground">
            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" strokeWidth={2.6} />{a.bairro}, {a.cidade}</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" strokeWidth={2.6} />Publicado há {a.publicadoHa}</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span className="flex items-center gap-1.5"><Star className="h-4 w-4 text-warning" fill="currentColor" strokeWidth={2.6} />Score {a.score}/100</span>
          </div>

          {/* Description */}
          <div className="mb-8 rounded-3xl border border-border bg-card p-7">
            <h2 className="mb-3 font-display text-[18px] font-extrabold text-foreground">Descrição do anúncio</h2>
            <p className="text-[14.5px] leading-relaxed text-muted-foreground">{a.descricao}</p>
          </div>

          {/* AI Analysis */}
          <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-accent/5 p-7">
            <div className="mb-5 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Zap className="h-4 w-4" strokeWidth={2.8} />
              </div>
              <div>
                <h2 className="font-display text-[18px] font-extrabold text-foreground">Análise inteligente</h2>
                <p className="text-[12px] font-semibold text-muted-foreground">Avaliação automática do garimpreço</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { icon: Shield, label: "Vendedor confiável", value: "Verificado", color: "text-success" },
                { icon: TrendingUp, label: "Tendência de preço", value: "Estável", color: "text-primary" },
                { icon: Target, label: "Tempo médio venda", value: a.vendaRapida, color: "text-accent" },
              ].map((item, i) => (
                <div key={i} className="rounded-2xl bg-card p-4">
                  <item.icon className={`mb-2 h-5 w-5 ${item.color}`} strokeWidth={2.6} />
                  <div className="font-display text-[15px] font-extrabold text-foreground">{item.value}</div>
                  <div className="text-[11.5px] font-semibold text-muted-foreground">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-5">
          {/* Price */}
          <div className="sticky top-28 space-y-5">
            <div className="rounded-3xl border border-border bg-card p-7">
              <div className="mb-1 text-[12px] font-bold uppercase tracking-wider text-muted-foreground">Preço anunciado</div>
              <div className="font-display text-[44px] font-extrabold leading-none text-foreground">
                R$ {a.preco.toLocaleString('pt-BR')}
              </div>
              <div className="mt-5 space-y-3 border-t border-border/60 pt-5">
                <div className="flex justify-between text-[13.5px]">
                  <span className="font-semibold text-muted-foreground">Preço alvo de revenda</span>
                  <span className="font-display font-extrabold text-foreground">R$ {m.precoAlvo.toLocaleString('pt-BR')}</span>
                </div>
                <div className="flex justify-between text-[13.5px]">
                  <span className="font-semibold text-muted-foreground">Margem estimada</span>
                  <span className="font-display font-extrabold text-success">+R$ {a.margemEstimada}</span>
                </div>
                <div className="flex justify-between text-[13.5px]">
                  <span className="font-semibold text-muted-foreground">ROI projetado</span>
                  <span className="font-display font-extrabold text-success">{a.margemPercentual}%</span>
                </div>
              </div>
              <Button className="mt-6 h-12 w-full gap-2 rounded-2xl bg-accent font-display text-[14px] font-extrabold text-accent-foreground shadow-orange hover:bg-accent/90">
                <ExternalLink className="h-4 w-4" strokeWidth={2.8} />
                Ver no {a.plataforma}
              </Button>
              <Button variant="outline" className="mt-3 h-12 w-full gap-2 rounded-2xl border-border font-display text-[14px] font-extrabold">
                <Phone className="h-4 w-4" strokeWidth={2.8} />
                Contatar vendedor
              </Button>
            </div>

            {/* Seller */}
            <div className="rounded-3xl border border-border bg-card p-6">
              <div className="mb-4 text-[12px] font-bold uppercase tracking-wider text-muted-foreground">Vendedor</div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-bold font-display text-[14px] font-extrabold text-white">
                  {a.vendedor.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-display text-[15px] font-extrabold text-foreground">{a.vendedor}</div>
                  <div className="flex items-center gap-1 text-[12px] font-semibold text-success">
                    <Shield className="h-3 w-3" strokeWidth={2.8} />
                    Conta verificada
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-secondary p-2.5">
                  <div className="font-display text-[16px] font-extrabold text-foreground">4.8</div>
                  <div className="text-[10px] font-semibold text-muted-foreground">Avaliação</div>
                </div>
                <div className="rounded-xl bg-secondary p-2.5">
                  <div className="font-display text-[16px] font-extrabold text-foreground">42</div>
                  <div className="text-[10px] font-semibold text-muted-foreground">Vendas</div>
                </div>
                <div className="rounded-xl bg-secondary p-2.5">
                  <div className="font-display text-[16px] font-extrabold text-foreground">3a</div>
                  <div className="text-[10px] font-semibold text-muted-foreground">No site</div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
};

export default Anuncio;
