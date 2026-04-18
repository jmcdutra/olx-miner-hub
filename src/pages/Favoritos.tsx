import { Link } from "react-router-dom";
import { Heart, MapPin, Star, GitCompare, ShoppingBag, Camera, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { InlineErrorState, SectionLoadingState } from "@/components/QueryStates";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { useAnunciosQuery } from "@/hooks/api";
import { getErrorMessage } from "@/lib/api/get-error-message";

const fmt = (value: number) => value.toLocaleString("pt-BR");

const Favoritos = () => {
  const { favoritos, toggleFavorito, toggleComparar, isComparando } = useApp();
  const { data: anuncios, isLoading, isError, error, refetch } = useAnunciosQuery();
  const items = (anuncios ?? []).filter((item) => favoritos.includes(item.id));

  return (
    <AppShell>
      <PageHeader
        title="Anúncios Salvos"
        description={`Você possui ${items.length} ${items.length === 1 ? "oportunidade monitorada" : "oportunidades monitoradas"}.`}
      />

      {isLoading ? (
        <SectionLoadingState lines={4} />
      ) : isError ? (
        <InlineErrorState
          title="Nao foi possivel carregar os favoritos"
          description={getErrorMessage(error)}
          onRetry={() => {
            void refetch();
          }}
        />
      ) : items.length === 0 ? (
        <div className="mt-4 flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/60 bg-secondary/10 py-24 text-center">
          <div className="relative mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-border/50 bg-background shadow-sm">
            <Heart className="h-8 w-8 text-muted-foreground/50" />
            <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-primary shadow-sm">
              <span className="text-[16px]">⭐</span>
            </div>
          </div>
          <h3 className="text-[18px] font-bold text-foreground">Nenhum favorito salvo</h3>
          <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-muted-foreground">
            Ao explorar anúncios, clique no ícone de <strong className="text-foreground">Coração</strong> para salvá-los aqui e acompanhar quedas de preço facilmente.
          </p>
          <Link to="/">
            <Button className="mt-6 h-11 gap-2 rounded-full bg-primary px-6 text-[14px] font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90">
              <ShoppingBag className="h-4 w-4" />
              Explorar Minerações
            </Button>
          </Link>
        </div>
      ) : (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => {
            const cmp = isComparando(item.id);

            return (
              <div key={item.id} className="group flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
                <Link to={`/anuncio/${item.id}`} className="relative block flex-1">
                  <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                    <img src={item.capa} alt={item.titulo} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                    <span className={`absolute left-3 top-3 rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur-md ${
                      item.plataforma === "OLX" ? "bg-purple-600/90" : "bg-[#fff159]/90 !text-[#2d3277]"
                    }`}>
                      {item.plataforma}
                    </span>

                    <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-background/80 px-2.5 py-1 text-[11px] font-bold text-foreground shadow-sm backdrop-blur-md">
                      <Camera className="h-3.5 w-3.5 text-muted-foreground" /> {item.fotos}
                    </span>
                  </div>

                  <div className="flex h-full flex-col p-4">
                    <div className="mb-2 flex items-end justify-between">
                      <div className="text-2xl font-bold tracking-tight text-foreground">R$ {fmt(item.preco)}</div>
                    </div>

                    <div className="mb-3 inline-flex items-center gap-1.5 self-start rounded-full border border-success/20 bg-success/10 px-2.5 py-1 text-[11px] font-bold text-success">
                      <TrendingUp className="h-3.5 w-3.5" /> +{item.margemPercentual}% de Margem
                    </div>

                    <h3 className="line-clamp-2 text-[14px] font-semibold leading-snug text-foreground/90 transition-colors group-hover:text-primary">{item.titulo}</h3>

                    <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3 text-[12px] font-medium text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> <span className="max-w-[100px] truncate">{item.bairro}</span></span>
                      <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-warning text-warning" /> {item.score}</span>
                    </div>
                  </div>
                </Link>

                <div className="grid grid-cols-[1fr_auto] border-t border-border/40 bg-secondary/10">
                  <button
                    type="button"
                    onClick={() => toggleComparar(item.id, item.titulo)}
                    className={`flex items-center justify-center gap-2 py-3 text-[12px] font-bold transition-colors ${
                      cmp ? "bg-primary/10 text-primary hover:bg-primary/20" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <GitCompare className="h-4 w-4" />
                    {cmp ? "No Comparador" : "Comparar"}
                  </button>
                  <div className="w-px bg-border/40" />
                  <button
                    type="button"
                    onClick={() => toggleFavorito(item.id, item.titulo)}
                    className="flex w-14 items-center justify-center text-destructive/70 transition-colors hover:bg-destructive/10 hover:text-destructive"
                    title="Remover dos Favoritos"
                  >
                    <Heart className="h-4 w-4" fill="currentColor" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
};

export default Favoritos;
