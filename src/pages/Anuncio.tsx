import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { ChevronLeft, MapPin, Clock, ExternalLink, Star, TrendingUp, Shield, MessageCircle, Heart, GitCompare, Share2, Flag } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { anuncios, mineracoes } from "@/data/mock";
import { useApp } from "@/context/AppContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const fmt = (v: number) => v.toLocaleString("pt-BR");

const Anuncio = () => {
  const { id } = useParams();
  const a = anuncios.find((x) => x.id === id) ?? anuncios[0];
  const m = mineracoes.find((x) => x.id === a.mineracaoId)!;
  const { isFavorito, toggleFavorito, isComparando, toggleComparar } = useApp();
  const [imgIdx, setImgIdx] = useState(0);
  const [openContact, setOpenContact] = useState(false);
  const [openReport, setOpenReport] = useState(false);

  const fav = isFavorito(a.id);
  const cmp = isComparando(a.id);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: a.titulo, url }); } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copiado");
    }
  };

  return (
    <AppShell>
      <div className="mb-4 flex items-center gap-1.5 text-[12.5px] font-extrabold text-muted-foreground">
        <Link to="/" className="hover:text-primary">Minerações</Link>
        <ChevronLeft className="h-3 w-3 rotate-180" strokeWidth={2.6} />
        <Link to={`/mineracao/${m.id}`} className="hover:text-primary">{m.titulo}</Link>
        <ChevronLeft className="h-3 w-3 rotate-180" strokeWidth={2.6} />
        <span className="text-foreground">Anúncio</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Main */}
        <div>
          <div className="mb-3 overflow-hidden rounded-lg border border-border bg-secondary">
            <img src={a.capa} alt={a.titulo} className="aspect-[4/3] w-full object-cover" />
          </div>
          <div className="mb-6 grid grid-cols-5 gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setImgIdx(i)}
                className={`aspect-square overflow-hidden rounded-md border bg-secondary transition-all ${
                  imgIdx === i ? "border-primary ring-1 ring-primary" : "border-border opacity-70 hover:opacity-100"
                }`}
              >
                <img src={a.capa} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>

          <div className="mb-2 flex items-center gap-2">
            <span className={`rounded px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white ${
              a.plataforma === "OLX" ? "bg-accent" : "bg-[#fff159] !text-[#2d3277]"
            }`}>{a.plataforma}</span>
            <span className="text-[11.5px] font-semibold text-muted-foreground">Cód. {a.id}</span>
          </div>
          <h1 className="font-display text-[24px] font-extrabold leading-tight text-foreground md:text-[28px]">{a.titulo}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12.5px] font-medium text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" strokeWidth={2.4} />{a.bairro}, {a.cidade}</span>
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" strokeWidth={2.4} />Há {a.publicadoHa}</span>
            <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-warning text-warning" strokeWidth={2.4} />Score {a.score}/100</span>
          </div>

          {/* Actions inline */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              onClick={() => toggleFavorito(a.id, a.titulo)}
              className={`h-9 gap-1.5 rounded-md font-display text-[12.5px] font-extrabold ${
                fav ? "border-accent bg-accent-soft text-accent" : "border-border"
              }`}
            >
              <Heart className="h-3.5 w-3.5" strokeWidth={2.4} fill={fav ? "currentColor" : "none"} />
              {fav ? "Salvo" : "Favoritar"}
            </Button>
            <Button
              variant="outline"
              onClick={() => toggleComparar(a.id, a.titulo)}
              className={`h-9 gap-1.5 rounded-md font-display text-[12.5px] font-extrabold ${
                cmp ? "border-primary bg-primary-soft text-primary" : "border-border"
              }`}
            >
              <GitCompare className="h-3.5 w-3.5" strokeWidth={2.4} />
              {cmp ? "Comparando" : "Comparar"}
            </Button>
            <Button variant="outline" onClick={handleShare} className="h-9 gap-1.5 rounded-md border-border font-display text-[12.5px] font-extrabold">
              <Share2 className="h-3.5 w-3.5" strokeWidth={2.4} />
              Compartilhar
            </Button>
            <Button variant="ghost" onClick={() => setOpenReport(true)} className="ml-auto h-9 gap-1.5 rounded-md font-display text-[12.5px] font-extrabold text-muted-foreground hover:text-destructive">
              <Flag className="h-3.5 w-3.5" strokeWidth={2.4} />
              Denunciar
            </Button>
          </div>

          <div className="mt-6 rounded-lg border border-border bg-card p-5">
            <h2 className="mb-2 font-display text-[14px] font-extrabold text-foreground">Descrição</h2>
            <p className="text-[13.5px] leading-relaxed text-foreground/80">{a.descricao}</p>

            <h3 className="mt-5 mb-2 font-display text-[13px] font-extrabold uppercase tracking-wider text-muted-foreground">Detalhes</h3>
            <dl className="grid gap-x-6 gap-y-2 text-[12.5px] sm:grid-cols-2">
              {[
                ["Marca", "Apple"], ["Modelo", "iPhone 13 Pro Max"],
                ["Capacidade", "256GB"], ["Cor", "Grafite"],
                ["Estado", "Usado — Excelente"], ["Bateria", "95%"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-border py-1.5">
                  <dt className="font-medium text-muted-foreground">{k}</dt>
                  <dd className="font-extrabold text-foreground">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-6 rounded-lg border border-border bg-card p-5">
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded bg-primary px-1.5 py-0.5 font-display text-[10px] font-extrabold uppercase tracking-wider text-primary-foreground">
                Análise garimpreço
              </span>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {[
                { label: "Vendedor", value: "Verificado", hint: "3 anos no site, 42 vendas", icon: Shield, color: "text-success" },
                { label: "Tendência", value: "Estável", hint: "Preço consistente em 30d", icon: TrendingUp, color: "text-primary" },
                { label: "Tempo de venda", value: a.vendaRapida, hint: "Média da categoria", icon: Clock, color: "text-accent" },
              ].map((it) => (
                <div key={it.label} className="rounded-md border border-border bg-secondary/40 p-3">
                  <div className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                    <it.icon className={`h-3 w-3 ${it.color}`} strokeWidth={2.6} />
                    {it.label}
                  </div>
                  <div className="mt-1 font-display text-[15px] font-extrabold text-foreground">{it.value}</div>
                  <div className="text-[11px] text-muted-foreground">{it.hint}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside>
          <div className="sticky top-20 space-y-4">
            <div className="rounded-lg border border-border bg-card p-5">
              {a.precoAntigo && (
                <div className="text-[12px] font-semibold text-muted-foreground line-through price">R$ {fmt(a.precoAntigo)}</div>
              )}
              <div className="font-display text-[36px] font-extrabold leading-none text-foreground price">R$ {fmt(a.preco)}</div>
              <div className="mt-2 inline-flex items-center gap-1 rounded bg-success-soft px-2 py-1 font-display text-[12px] font-extrabold text-success">
                <TrendingUp className="h-3 w-3" strokeWidth={3} />
                +R$ {fmt(a.margemEstimada)} de margem · +{a.margemPercentual}%
              </div>

              <dl className="mt-5 space-y-2 border-t border-border pt-4 text-[12.5px]">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Preço anunciado</dt>
                  <dd className="font-extrabold text-foreground price">R$ {fmt(a.preco)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Preço alvo (revenda)</dt>
                  <dd className="font-extrabold text-foreground price">R$ {fmt(m.precoAlvo)}</dd>
                </div>
                <div className="flex justify-between border-t border-border pt-2">
                  <dt className="font-extrabold text-foreground">Lucro projetado</dt>
                  <dd className="font-display font-extrabold text-success price">+R$ {fmt(a.margemEstimada)}</dd>
                </div>
              </dl>

              <Button
                onClick={() => toast.success("Abrindo no " + a.plataforma + "…")}
                className="mt-4 h-10 w-full gap-1.5 rounded-md bg-accent font-display text-[13px] font-extrabold text-accent-foreground hover:bg-accent/90"
              >
                <ExternalLink className="h-4 w-4" strokeWidth={2.6} />
                Abrir no {a.plataforma}
              </Button>
              <Button
                variant="outline"
                onClick={() => setOpenContact(true)}
                className="mt-2 h-10 w-full gap-1.5 rounded-md border-border font-display text-[13px] font-extrabold"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={2.6} />
                Contatar vendedor
              </Button>
            </div>

            <div className="rounded-lg border border-border bg-card p-4">
              <div className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">Vendedor</div>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary font-display text-[12px] font-extrabold text-primary-foreground">
                  {a.vendedor.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <div className="font-display text-[13.5px] font-extrabold text-foreground">{a.vendedor}</div>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-success">
                    <Shield className="h-3 w-3" strokeWidth={2.6} /> Verificado
                  </div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 border-t border-border pt-3 text-center">
                <div><div className="font-display text-[14px] font-extrabold text-foreground">4,8</div><div className="text-[10px] font-semibold text-muted-foreground">Avaliação</div></div>
                <div><div className="font-display text-[14px] font-extrabold text-foreground">42</div><div className="text-[10px] font-semibold text-muted-foreground">Vendas</div></div>
                <div><div className="font-display text-[14px] font-extrabold text-foreground">3a</div><div className="text-[10px] font-semibold text-muted-foreground">No site</div></div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Contact modal */}
      <Dialog open={openContact} onOpenChange={setOpenContact}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-[18px] font-extrabold">Mensagem para {a.vendedor}</DialogTitle>
            <DialogDescription className="text-[12.5px] text-muted-foreground">
              A mensagem será enviada via {a.plataforma}.
            </DialogDescription>
          </DialogHeader>
          <textarea
            placeholder="Olá! Tenho interesse no anúncio. O preço é negociável?"
            defaultValue="Olá! Tenho interesse no anúncio. O preço é negociável?"
            rows={4}
            className="w-full rounded-md border border-border bg-card p-3 text-[13px] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setOpenContact(false)} className="h-9 rounded-md border-border font-display text-[12.5px] font-extrabold">Cancelar</Button>
            <Button
              onClick={() => { setOpenContact(false); toast.success("Mensagem enviada (demo)"); }}
              className="h-9 rounded-md bg-primary px-4 font-display text-[12.5px] font-extrabold text-primary-foreground hover:bg-primary/90"
            >
              Enviar mensagem
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Report modal */}
      <Dialog open={openReport} onOpenChange={setOpenReport}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-[18px] font-extrabold">Denunciar anúncio</DialogTitle>
            <DialogDescription className="text-[12.5px] text-muted-foreground">
              Conte o que está errado. Vamos analisar e ocultar dos seus resultados.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {["Anúncio enganoso", "Preço falso", "Suspeita de golpe", "Produto duplicado", "Outro"].map((opt, i) => (
              <label key={opt} className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-card p-2.5 text-[12.5px] font-semibold text-foreground hover:bg-secondary">
                <input type="radio" name="report" defaultChecked={i === 0} className="h-3.5 w-3.5 accent-primary" />
                {opt}
              </label>
            ))}
          </div>
          <Input placeholder="Detalhes (opcional)" className="h-10 rounded-md border-border bg-card font-medium" />
          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setOpenReport(false)} className="h-9 rounded-md border-border font-display text-[12.5px] font-extrabold">Cancelar</Button>
            <Button
              onClick={() => { setOpenReport(false); toast.success("Denúncia enviada"); }}
              className="h-9 rounded-md bg-destructive px-4 font-display text-[12.5px] font-extrabold text-destructive-foreground hover:bg-destructive/90"
            >
              Enviar denúncia
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
};

export default Anuncio;
