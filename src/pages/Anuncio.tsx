import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ChevronLeft,
  MapPin,
  Clock,
  Star,
  TrendingUp,
  ShieldCheck,
  MessageCircle,
  Heart,
  GitCompare,
  Share2,
  Flag,
  ShoppingCart,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { PageErrorState, PageLoadingState } from "@/components/QueryStates";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useApp } from "@/context/AppContext";
import { useAnuncioQuery } from "@/hooks/api";
import { getErrorMessage } from "@/lib/api/get-error-message";

const fmt = (value: number) => value.toLocaleString("pt-BR");

const Anuncio = () => {
  const { id } = useParams();
  const { data, isLoading, isError, error, refetch } = useAnuncioQuery(id);
  const { isFavorito, toggleFavorito, isComparando, toggleComparar } = useApp();
  const [imgIdx, setImgIdx] = useState(0);
  const [openContact, setOpenContact] = useState(false);
  const [openReport, setOpenReport] = useState(false);

  if (isLoading) {
    return (
      <AppShell>
        <PageLoadingState title="Carregando anuncio" description="Buscando fotos, detalhes e sinais de oportunidade." />
      </AppShell>
    );
  }

  if (isError || !data) {
    return (
      <AppShell>
        <PageErrorState
          title="Nao foi possivel carregar este anuncio"
          description="Os detalhes do anuncio nao puderam ser exibidos agora."
          details={getErrorMessage(error, "Tente novamente em alguns instantes.")}
          onRetry={() => {
            void refetch();
          }}
        />
      </AppShell>
    );
  }

  const anuncio = data.anuncio;
  const mineracao = data.mineracao;
  const gallery = Array.from({ length: Math.max(anuncio.fotos, 1) }).map(() => anuncio.capa);
  const selectedImage = gallery[imgIdx] ?? anuncio.capa;
  const fav = isFavorito(anuncio.id);
  const cmp = isComparando(anuncio.id);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: anuncio.titulo, url });
        return;
      } catch {
        return;
      }
    }

    await navigator.clipboard.writeText(url);
    toast.success("Link copiado para a área de transferência!");
  };

  return (
    <AppShell>
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-[13px] font-semibold text-muted-foreground/70">
        <Link to="/" className="transition-colors hover:text-primary">Minerações</Link>
        <ChevronLeft className="h-3.5 w-3.5 rotate-180 opacity-50" strokeWidth={2} />
        <Link to={`/mineracao/${mineracao.id}`} className="max-w-[150px] truncate transition-colors hover:text-primary sm:max-w-[300px]">{mineracao.titulo}</Link>
        <ChevronLeft className="h-3.5 w-3.5 rotate-180 opacity-50" strokeWidth={2} />
        <span className="max-w-[150px] truncate text-foreground sm:max-w-[300px]">Detalhes do Anúncio</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <div>
            <div className="group relative mb-3 overflow-hidden rounded-2xl border border-border/50 bg-secondary/20 shadow-sm">
              <img src={selectedImage} alt={anuncio.titulo} className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
              <div className="absolute left-4 top-4 flex gap-2">
                <span className={`rounded-lg px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-md backdrop-blur-md ${
                  anuncio.plataforma === "OLX" ? "bg-purple-600/90" : "bg-[#fff159]/90 !text-[#2d3277]"
                }`}>
                  {anuncio.plataforma}
                </span>
              </div>
            </div>

            <div className="custom-scrollbar flex gap-3 overflow-x-auto pb-2">
              {gallery.slice(0, 5).map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setImgIdx(index)}
                  className={`relative aspect-square w-20 shrink-0 overflow-hidden rounded-xl transition-all ${
                    imgIdx === index ? "border-2 border-primary shadow-sm ring-2 ring-primary/20" : "border border-border/50 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={image} alt="" className="h-full w-full object-cover" />
                  {imgIdx !== index && <div className="absolute inset-0 bg-background/10 mix-blend-overlay" />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 text-[12px] font-semibold text-muted-foreground">Código de Ref: #{anuncio.id}</div>
            <h1 className="text-2xl font-bold leading-snug tracking-tight text-foreground md:text-3xl">{anuncio.titulo}</h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13.5px] font-medium text-muted-foreground">
              <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{anuncio.bairro}, {anuncio.cidade}</span>
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />Publicado há {anuncio.publicadoHa}</span>
              <span className="flex items-center gap-1.5 text-warning"><Star className="h-4 w-4 fill-warning" />Score Anúncio: {anuncio.score}/100</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => toggleFavorito(anuncio.id, anuncio.titulo)}
              className={`h-10 gap-2 rounded-full text-[13px] font-semibold transition-all ${
                fav ? "border-accent bg-accent/10 text-accent hover:bg-accent/20" : "border-border/60 hover:bg-secondary"
              }`}
            >
              <Heart className="h-4 w-4" fill={fav ? "currentColor" : "none"} />
              {fav ? "Salvo" : "Favoritar"}
            </Button>
            <Button
              variant="outline"
              onClick={() => toggleComparar(anuncio.id, anuncio.titulo)}
              className={`h-10 gap-2 rounded-full text-[13px] font-semibold transition-all ${
                cmp ? "border-primary bg-primary/10 text-primary hover:bg-primary/20" : "border-border/60 hover:bg-secondary"
              }`}
            >
              <GitCompare className="h-4 w-4" />
              {cmp ? "Adicionado" : "Comparar"}
            </Button>
            <Button variant="outline" onClick={handleShare} className="h-10 gap-2 rounded-full border-border/60 text-[13px] font-semibold hover:bg-secondary">
              <Share2 className="h-4 w-4" /> Compartilhar
            </Button>
            <Button variant="ghost" onClick={() => setOpenReport(true)} className="h-10 gap-2 rounded-full text-[13px] font-semibold text-muted-foreground hover:bg-destructive/10 hover:text-destructive sm:ml-auto">
              <Flag className="h-4 w-4" /> Denunciar
            </Button>
          </div>

          <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
            <h2 className="mb-3 text-[16px] font-bold text-foreground">Descrição do Vendedor</h2>
            <p className="whitespace-pre-line text-[14px] leading-relaxed text-muted-foreground">{anuncio.descricao}</p>

            <h3 className="mb-4 mt-8 text-[13px] font-bold uppercase tracking-wider text-muted-foreground/80">Ficha Técnica</h3>
            <div className="grid gap-x-8 gap-y-0 divide-y divide-border/40 text-[13.5px] sm:grid-cols-2 sm:divide-y-0">
              {[
                ["Marca", "Apple"],
                ["Modelo", mineracao.titulo],
                ["Capacidade", "256GB"],
                ["Cor", "Grafite"],
                ["Condição", "Usado — Excelente"],
                ["Saúde Bateria", "95%"],
              ].map(([key, value], index) => (
                <div key={key} className={`flex justify-between py-3 ${index % 2 === 0 ? "sm:border-b sm:border-border/40" : "sm:border-b sm:border-border/40"}`}>
                  <span className="font-medium text-muted-foreground">{key}</span>
                  <span className="font-bold text-foreground">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-primary/20 bg-primary/[0.02] p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">
                <Sparkles className="h-3 w-3" /> Análise Garimpreço
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { label: "Status Vendedor", value: "Verificado", hint: "3 anos no site, 42 vendas", icon: ShieldCheck, color: "text-success", bg: "bg-success/10", border: "border-success/20" },
                { label: "Tendência de Preço", value: "Abaixo da Média", hint: "15% mais barato que a média", icon: TrendingUp, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
                { label: "Velocidade de Venda", value: anuncio.vendaRapida, hint: "Alta liquidez na região", icon: Clock, color: "text-accent", bg: "bg-accent/10", border: "border-accent/20" },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-border/50 bg-card p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                    <div className={`flex h-6 w-6 items-center justify-center rounded-full border ${item.bg} ${item.border}`}>
                      <item.icon className={`h-3 w-3 ${item.color}`} strokeWidth={2.5} />
                    </div>
                    {item.label}
                  </div>
                  <div className="mt-2 text-[15px] font-bold text-foreground">{item.value}</div>
                  <div className="mt-1 text-[12px] text-muted-foreground">{item.hint}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside>
          <div className="sticky top-20 space-y-5">
            <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 shadow-md">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-primary/5 blur-3xl" />

              {anuncio.precoAntigo && (
                <div className="pb-1 text-[13px] font-semibold text-muted-foreground line-through">R$ {fmt(anuncio.precoAntigo)}</div>
              )}
              <div className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">R$ {fmt(anuncio.preco)}</div>

              <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-success/20 bg-success/10 px-3 py-1.5 text-[13px] font-bold text-success">
                <TrendingUp className="h-4 w-4" strokeWidth={2.5} />
                +R$ {fmt(anuncio.margemEstimada)} de lucro estimado
              </div>

              <div className="mt-6 space-y-3 border-t border-border/40 pt-5 text-[13px]">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-muted-foreground">Preço Atual</span>
                  <span className="font-bold text-foreground">R$ {fmt(anuncio.preco)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-muted-foreground">Sua Meta (Revenda)</span>
                  <span className="font-bold text-foreground">R$ {fmt(mineracao.precoAlvo)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-border/40 pt-3">
                  <span className="font-bold text-foreground">Margem Total Bruta</span>
                  <span className="text-[15px] font-bold text-success">+{anuncio.margemPercentual}%</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Button
                  onClick={() => toast.success(`Redirecionando para ${anuncio.plataforma}...`)}
                  className="h-12 w-full gap-2 rounded-xl bg-accent text-[14px] font-bold text-white shadow-sm hover:bg-accent/90"
                >
                  <ShoppingCart className="h-4.5 w-4.5" />
                  Abrir Anúncio Original
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setOpenContact(true)}
                  className="h-12 w-full gap-2 rounded-xl border-border/60 bg-background text-[14px] font-bold text-foreground hover:bg-secondary"
                >
                  <MessageCircle className="h-4.5 w-4.5" />
                  Iniciar Negociação
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
              <div className="mb-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">Informações do Vendedor</div>

              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-background bg-gradient-to-br from-primary to-primary/80 text-[16px] font-bold text-primary-foreground shadow-sm">
                  {anuncio.vendedor.split(" ").map((name) => name[0]).join("")}
                </div>
                <div>
                  <div className="text-[15px] font-bold text-foreground">{anuncio.vendedor}</div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-[12px] font-bold text-success">
                    <ShieldCheck className="h-3.5 w-3.5" /> Conta Verificada
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2 border-t border-border/40 pt-4 text-center">
                <div>
                  <div className="flex items-center justify-center gap-1 text-[15px] font-bold text-foreground">
                    4.8 <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                  </div>
                  <div className="mt-0.5 text-[11px] font-medium text-muted-foreground">Avaliação</div>
                </div>
                <div>
                  <div className="text-[15px] font-bold text-foreground">42</div>
                  <div className="mt-0.5 text-[11px] font-medium text-muted-foreground">Vendas</div>
                </div>
                <div>
                  <div className="text-[15px] font-bold text-foreground">3 anos</div>
                  <div className="mt-0.5 text-[11px] font-medium text-muted-foreground">Na Plataforma</div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <Dialog open={openContact} onOpenChange={setOpenContact}>
        <DialogContent className="rounded-2xl border-border/50 sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Negociar com {anuncio.vendedor}</DialogTitle>
            <DialogDescription className="text-[13px] text-muted-foreground">
              Esta mensagem será copiada e redirecionada para o chat da {anuncio.plataforma}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <textarea
              placeholder="Olá! Tenho interesse no anúncio. O preço é negociável?"
              defaultValue={`Olá! Tenho muito interesse no seu anúncio do ${anuncio.titulo}. Ainda está disponível? Aceita proposta no valor à vista?`}
              rows={5}
              className="w-full resize-none rounded-xl border border-border/50 bg-secondary/20 p-4 text-[14px] font-medium text-foreground transition-colors focus:border-primary/50 focus:bg-background focus:outline-none focus:ring-4 focus:ring-primary/10"
            />
          </div>
          <DialogFooter className="mt-2 gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setOpenContact(false)} className="rounded-xl font-semibold">Cancelar</Button>
            <Button
              onClick={() => {
                setOpenContact(false);
                toast.success("Mensagem pronta para envio. Redirecionando...");
              }}
              className="rounded-xl bg-primary px-6 font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
            >
              Copiar & Enviar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openReport} onOpenChange={setOpenReport}>
        <DialogContent className="rounded-2xl border-border/50 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-destructive">Denunciar Anúncio</DialogTitle>
            <DialogDescription className="text-[13px] text-muted-foreground">
              Ajude-nos a manter a plataforma limpa. Esse anúncio será ocultado do seu painel.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-3">
            {["Anúncio enganoso ou falso", "Preço irreal (golpe)", "Produto danificado/diferente", "Produto duplicado", "Outro motivo"].map((option, index) => (
              <label key={option} className="flex cursor-pointer items-center gap-3 rounded-xl border border-border/50 bg-card p-3.5 text-[13.5px] font-semibold text-foreground transition-colors hover:border-primary/30 hover:bg-secondary/50">
                <input type="radio" name="report" defaultChecked={index === 0} className="h-4 w-4 accent-primary" />
                {option}
              </label>
            ))}
            <Input placeholder="Detalhes adicionais (opcional)" className="mt-3 h-11 rounded-xl border-border/50 bg-secondary/20 text-[13.5px] focus:bg-background" />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setOpenReport(false)} className="rounded-xl font-semibold">Cancelar</Button>
            <Button
              onClick={() => {
                setOpenReport(false);
                toast.success("Denúncia registrada. O anúncio foi ocultado.");
              }}
              className="rounded-xl bg-destructive px-6 font-semibold text-destructive-foreground shadow-sm hover:bg-destructive/90"
            >
              Confirmar Denúncia
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
};

export default Anuncio;
