import { Link } from "react-router-dom";
import { Heart, MapPin, Star, GitCompare, Trash2, ShoppingBag } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { anuncios } from "@/data/mock";
import { useApp } from "@/context/AppContext";
import { APP_ICONS } from "@/lib/category-icons";

const fmt = (v: number) => v.toLocaleString("pt-BR");

const Favoritos = () => {
  const { favoritos, toggleFavorito, toggleComparar, isComparando } = useApp();
  const items = anuncios.filter((a) => favoritos.includes(a.id));

  return (
    <AppShell>
      <PageHeader
        title="Favoritos"
        description={`${items.length} ${items.length === 1 ? "anúncio salvo" : "anúncios salvos"} para acompanhar.`}
      />

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-secondary/30 py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card p-3 shadow-sm">
            <img src={APP_ICONS.favoritos} alt="Favoritos" className="h-full w-full object-contain" loading="lazy" />
          </div>
          <h3 className="mt-4 font-display text-[16px] font-extrabold text-foreground">Nenhum favorito ainda</h3>
          <p className="mt-1 max-w-sm text-[12.5px] text-muted-foreground">
            Toque no coração ♥ em qualquer anúncio para salvá-lo aqui e receber alertas de mudança de preço.
          </p>
          <Link to="/">
            <Button className="mt-5 h-9 gap-1.5 rounded-md bg-primary px-3.5 font-display text-[12.5px] font-extrabold text-primary-foreground hover:bg-primary/90">
              <ShoppingBag className="h-3.5 w-3.5" strokeWidth={2.6} />
              Ver minhas minerações
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((a) => {
            const cmp = isComparando(a.id);
            return (
              <div key={a.id} className="group overflow-hidden rounded-lg border border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-md">
                <Link to={`/anuncio/${a.id}`} className="block">
                  <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                    <img src={a.capa} alt={a.titulo} className="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
                    <span className={`absolute left-2 top-2 rounded px-1.5 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wider text-white ${
                      a.plataforma === "OLX" ? "bg-accent" : "bg-[#fff159] !text-[#2d3277]"
                    }`}>{a.plataforma}</span>
                  </div>
                  <div className="p-3">
                    <div className="font-display text-[20px] font-extrabold leading-none text-foreground price">R$ {fmt(a.preco)}</div>
                    <div className="mt-1 inline-flex items-center gap-0.5 rounded bg-success-soft px-1.5 py-0.5 text-[10.5px] font-extrabold text-success">
                      +{a.margemPercentual}%
                    </div>
                    <h3 className="mt-2 line-clamp-2 text-[12.5px] font-semibold leading-snug text-foreground/85">{a.titulo}</h3>
                    <div className="mt-2 flex items-center justify-between text-[10.5px] font-medium text-muted-foreground">
                      <span className="flex items-center gap-0.5"><MapPin className="h-2.5 w-2.5" strokeWidth={2.6} />{a.bairro}</span>
                      <span className="flex items-center gap-0.5"><Star className="h-2.5 w-2.5 fill-warning text-warning" strokeWidth={2.6} />{a.score}</span>
                    </div>
                  </div>
                </Link>
                <div className="flex border-t border-border">
                  <button
                    onClick={() => toggleComparar(a.id, a.titulo)}
                    className={`flex flex-1 items-center justify-center gap-1.5 py-2 text-[11.5px] font-extrabold transition-colors ${
                      cmp ? "bg-primary-soft text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <GitCompare className="h-3 w-3" strokeWidth={2.4} />
                    {cmp ? "No comparador" : "Comparar"}
                  </button>
                  <div className="w-px bg-border" />
                  <button
                    onClick={() => toggleFavorito(a.id, a.titulo)}
                    className="flex w-10 items-center justify-center text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    aria-label="Remover dos favoritos"
                  >
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={2.4} />
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
