import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { GitCompare, X, MapPin, Star, ExternalLink, Trash2, Check, Minus, Plus } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { InlineErrorState, SectionLoadingState } from "@/components/QueryStates";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { useAnunciosQuery } from "@/hooks/api";
import { getErrorMessage } from "@/lib/api/get-error-message";

const fmt = (value: number) => value.toLocaleString("pt-BR");

const Comparar = () => {
  const { comparar, toggleComparar, limparComparar } = useApp();
  const { data: anuncios, isLoading, isError, error, refetch } = useAnunciosQuery();
  const items = (anuncios ?? []).filter((item) => comparar.includes(item.id));

  if (isLoading) {
    return (
      <AppShell>
        <PageHeader title="Comparar Anúncios" description="Adicione até 3 anúncios para comparar métricas lado a lado." />
        <SectionLoadingState lines={5} />
      </AppShell>
    );
  }

  if (isError) {
    return (
      <AppShell>
        <PageHeader title="Comparar Anúncios" description="Adicione até 3 anúncios para comparar métricas lado a lado." />
        <InlineErrorState
          title="Nao foi possivel montar o comparador"
          description={getErrorMessage(error)}
          onRetry={() => {
            void refetch();
          }}
        />
      </AppShell>
    );
  }

  if (items.length === 0) {
    return (
      <AppShell>
        <PageHeader title="Comparar Anúncios" description="Adicione até 3 anúncios para comparar métricas lado a lado." />
        <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-secondary/20 py-24 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary shadow-sm">
            <GitCompare className="h-7 w-7 text-muted-foreground" strokeWidth={2} />
          </div>
          <h3 className="text-lg font-bold text-foreground">O comparador está vazio</h3>
          <p className="mt-2 max-w-md text-[14px] text-muted-foreground">
            Navegue pelos anúncios e clique no botão <span className="font-semibold text-foreground">Comparar</span> para adicioná-los a esta visão detalhada.
          </p>
          <Link to="/">
            <Button className="mt-6 h-10 rounded-full bg-primary px-6 text-[13.5px] font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90">
              Explorar Anúncios
            </Button>
          </Link>
        </div>
      </AppShell>
    );
  }

  const menorPreco = Math.min(...items.map((item) => item.preco));
  const maiorMargem = Math.max(...items.map((item) => item.margemPercentual));
  const maiorScore = Math.max(...items.map((item) => item.score));

  const rows: { label: string; render: (item: (typeof items)[number]) => ReactNode }[] = [
    {
      label: "Preço",
      render: (item) => (
        <div>
          <div className={`text-2xl font-bold tracking-tight ${item.preco === menorPreco ? "text-success" : "text-foreground"}`}>
            R$ {fmt(item.preco)}
          </div>
          {item.preco === menorPreco && (
            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-success">
              <Check className="h-3 w-3" strokeWidth={2.5} /> Menor Preço
            </span>
          )}
        </div>
      ),
    },
    {
      label: "Margem Estimada",
      render: (item) => (
        <div>
          <div className={`text-lg font-bold ${item.margemPercentual === maiorMargem ? "text-success" : "text-foreground"}`}>
            +{item.margemPercentual}%
          </div>
          <div className="mt-0.5 text-[12px] font-medium text-muted-foreground">+ R$ {fmt(item.margemEstimada)} lucro</div>
        </div>
      ),
    },
    {
      label: "Plataforma",
      render: (item) => (
        <span className={`inline-block rounded-md px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm ${
          item.plataforma === "OLX" ? "bg-purple-600" : "bg-[#fff159] !text-[#2d3277]"
        }`}>{item.plataforma}</span>
      ),
    },
    {
      label: "Localização",
      render: (item) => (
        <div className="flex items-center gap-1.5 text-[13px] font-medium text-foreground">
          <MapPin className="h-4 w-4 text-muted-foreground" strokeWidth={2} />
          <span className="line-clamp-1">{item.bairro}, {item.cidade}</span>
        </div>
      ),
    },
    {
      label: "Score do Anúncio",
      render: (item) => (
        <div className={`flex items-center gap-1.5 text-[15px] font-bold ${item.score === maiorScore ? "text-success" : "text-foreground"}`}>
          <Star className="h-4 w-4 fill-warning text-warning" strokeWidth={2} />
          {item.score}/100
        </div>
      ),
    },
    {
      label: "Vendedor",
      render: (item) => <div className="text-[13px] font-semibold text-foreground">{item.vendedor}</div>,
    },
    {
      label: "Fotos",
      render: (item) => <div className="text-[13px] font-medium text-foreground">{item.fotos} imagens</div>,
    },
    {
      label: "Tempo de Venda",
      render: (item) => <div className="text-[13px] font-medium text-foreground">{item.vendaRapida}</div>,
    },
    {
      label: "Publicação",
      render: (item) => <div className="text-[13px] font-medium text-muted-foreground">há {item.publicadoHa}</div>,
    },
  ];

  return (
    <AppShell>
      <PageHeader
        title="Comparação Direta"
        description="O melhor de cada métrica está destacado em verde."
        actions={(
          <Button variant="outline" onClick={limparComparar} className="h-10 gap-2 rounded-full border-border/60 text-[13px] font-semibold transition-colors hover:border-destructive/30 hover:bg-destructive/5 hover:text-destructive">
            <Trash2 className="h-4 w-4" strokeWidth={2} /> Limpar Comparador
          </Button>
        )}
      />

      <div className="mt-2 overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm">
        <div className="custom-scrollbar overflow-x-auto pb-2">
          <table className="w-full min-w-[800px] border-collapse">
            <thead>
              <tr className="border-b border-border/40">
                <th className="sticky left-0 z-20 w-48 border-r border-border/20 bg-card px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                  Métricas
                </th>
                {items.map((item) => (
                  <th key={item.id} className="min-w-[260px] p-5 text-left align-top">
                    <div className="group relative">
                      <button
                        type="button"
                        onClick={() => toggleComparar(item.id)}
                        className="absolute -right-2 -top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-border/50 bg-background text-muted-foreground opacity-0 shadow-sm transition-all group-hover:opacity-100 hover:border-destructive hover:bg-destructive hover:text-destructive-foreground"
                        title="Remover"
                      >
                        <X className="h-3.5 w-3.5" strokeWidth={2.5} />
                      </button>
                      <Link to={`/anuncio/${item.id}`} className="block overflow-hidden rounded-xl border border-border/40 bg-secondary/10 transition-all hover:border-primary/40 hover:shadow-md">
                        <img src={item.capa} alt={item.titulo} className="aspect-[4/3] w-full object-cover" />
                        <div className="p-3">
                          <h3 className="line-clamp-2 text-[13.5px] font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">{item.titulo}</h3>
                        </div>
                      </Link>
                    </div>
                  </th>
                ))}
                {items.length < 3 && (
                  <th className="min-w-[260px] p-5 text-center align-middle">
                    <Link to="/" className="flex h-full min-h-[180px] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border/60 bg-secondary/10 p-6 text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border/50 bg-background shadow-sm">
                        <Plus className="h-5 w-5" />
                      </div>
                      <span className="text-[13px] font-semibold">Adicionar Anúncio</span>
                    </Link>
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {rows.map((row) => (
                <tr key={row.label} className="transition-colors hover:bg-secondary/10">
                  <td className="sticky left-0 z-10 border-r border-border/20 bg-card px-5 py-4 text-[12px] font-semibold text-muted-foreground shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                    {row.label}
                  </td>
                  {items.map((item) => (
                    <td key={item.id} className="p-5 align-middle">
                      {row.render(item)}
                    </td>
                  ))}
                  {items.length < 3 && <td className="p-5 text-center text-muted-foreground/30"><Minus className="mx-auto h-4 w-4" /></td>}
                </tr>
              ))}
              <tr>
                <td className="sticky left-0 z-10 border-r border-border/20 bg-card px-5 py-4 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]" />
                {items.map((item) => (
                  <td key={item.id} className="p-5">
                    <Link to={`/anuncio/${item.id}`}>
                      <Button className="h-11 w-full gap-2 rounded-xl bg-primary text-[14px] font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90">
                        Ver detalhes <ExternalLink className="h-4 w-4" />
                      </Button>
                    </Link>
                  </td>
                ))}
                {items.length < 3 && <td className="p-5" />}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
};

export default Comparar;
