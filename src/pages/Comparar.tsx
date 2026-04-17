import { Link } from "react-router-dom";
import { GitCompare, X, MapPin, Star, ExternalLink, Trash2, Check, Minus } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { anuncios } from "@/data/mock";
import { useApp } from "@/context/AppContext";

const fmt = (v: number) => v.toLocaleString("pt-BR");

const Comparar = () => {
  const { comparar, toggleComparar, limparComparar } = useApp();
  const items = anuncios.filter((a) => comparar.includes(a.id));

  if (items.length === 0) {
    return (
      <AppShell>
        <PageHeader title="Comparar anúncios" description="Adicione até 3 anúncios para comparar lado a lado." />
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-secondary/30 py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
            <GitCompare className="h-6 w-6 text-muted-foreground" strokeWidth={2.2} />
          </div>
          <h3 className="mt-4 font-display text-[16px] font-extrabold text-foreground">Comparador vazio</h3>
          <p className="mt-1 max-w-sm text-[12.5px] text-muted-foreground">
            Em qualquer anúncio, clique em <span className="font-extrabold text-foreground">Comparar</span> para adicionar aqui.
          </p>
          <Link to="/">
            <Button className="mt-5 h-9 rounded-md bg-primary px-3.5 font-display text-[12.5px] font-extrabold text-primary-foreground hover:bg-primary/90">
              Voltar para minerações
            </Button>
          </Link>
        </div>
      </AppShell>
    );
  }

  const menorPreco = Math.min(...items.map((i) => i.preco));
  const maiorMargem = Math.max(...items.map((i) => i.margemPercentual));
  const maiorScore = Math.max(...items.map((i) => i.score));

  const rows: { label: string; render: (a: typeof items[0]) => React.ReactNode }[] = [
    {
      label: "Preço",
      render: (a) => (
        <div>
          <div className={`font-display text-[22px] font-extrabold price ${a.preco === menorPreco ? "text-success" : "text-foreground"}`}>
            R$ {fmt(a.preco)}
          </div>
          {a.preco === menorPreco && (
            <span className="inline-flex items-center gap-0.5 rounded bg-success-soft px-1.5 py-0.5 font-display text-[10px] font-extrabold uppercase text-success">
              <Check className="h-2.5 w-2.5" strokeWidth={3} /> Menor
            </span>
          )}
        </div>
      ),
    },
    {
      label: "Margem estimada",
      render: (a) => (
        <div className={`font-display text-[15px] font-extrabold price ${a.margemPercentual === maiorMargem ? "text-success" : "text-foreground"}`}>
          +{a.margemPercentual}%
          <div className="mt-0.5 text-[11px] font-semibold text-muted-foreground">+R$ {fmt(a.margemEstimada)}</div>
        </div>
      ),
    },
    {
      label: "Plataforma",
      render: (a) => (
        <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white ${
          a.plataforma === "OLX" ? "bg-accent" : "bg-[#fff159] !text-[#2d3277]"
        }`}>{a.plataforma}</span>
      ),
    },
    {
      label: "Localização",
      render: (a) => (
        <div className="flex items-center gap-1 text-[12.5px] font-semibold text-foreground">
          <MapPin className="h-3 w-3 text-muted-foreground" strokeWidth={2.4} />
          {a.bairro}, {a.cidade}
        </div>
      ),
    },
    {
      label: "Score",
      render: (a) => (
        <div className={`flex items-center gap-1 font-display text-[14px] font-extrabold ${a.score === maiorScore ? "text-success" : "text-foreground"}`}>
          <Star className="h-3.5 w-3.5 fill-warning text-warning" strokeWidth={2.4} />
          {a.score}/100
        </div>
      ),
    },
    {
      label: "Vendedor",
      render: (a) => <div className="text-[12.5px] font-extrabold text-foreground">{a.vendedor}</div>,
    },
    {
      label: "Fotos",
      render: (a) => <div className="text-[12.5px] font-extrabold text-foreground">{a.fotos}</div>,
    },
    {
      label: "Tempo médio venda",
      render: (a) => <div className="text-[12.5px] font-extrabold text-foreground">{a.vendaRapida}</div>,
    },
    {
      label: "Publicado",
      render: (a) => <div className="text-[12.5px] font-medium text-muted-foreground">há {a.publicadoHa}</div>,
    },
  ];

  return (
    <AppShell>
      <PageHeader
        title={`Comparar ${items.length} anúncio${items.length > 1 ? "s" : ""}`}
        description="O melhor de cada métrica está marcado em verde."
        actions={
          <Button variant="outline" onClick={limparComparar} className="h-9 gap-1.5 rounded-md border-border font-display text-[12.5px] font-extrabold">
            <Trash2 className="h-3.5 w-3.5" strokeWidth={2.4} /> Limpar tudo
          </Button>
        }
      />

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="sticky left-0 z-10 w-44 bg-card px-4 py-3 text-left text-[10.5px] font-extrabold uppercase tracking-wider text-muted-foreground">
                Anúncio
              </th>
              {items.map((a) => (
                <th key={a.id} className="min-w-[220px] border-l border-border p-3 text-left align-top">
                  <div className="relative">
                    <button
                      onClick={() => toggleComparar(a.id)}
                      className="absolute right-0 top-0 flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-secondary hover:text-destructive"
                    >
                      <X className="h-3.5 w-3.5" strokeWidth={2.4} />
                    </button>
                    <Link to={`/anuncio/${a.id}`} className="block">
                      <img src={a.capa} alt={a.titulo} className="aspect-[4/3] w-full rounded-md object-cover" />
                      <h3 className="mt-2 line-clamp-2 pr-6 text-[12.5px] font-extrabold leading-snug text-foreground hover:text-primary">{a.titulo}</h3>
                    </Link>
                  </div>
                </th>
              ))}
              {items.length < 3 && (
                <th className="min-w-[220px] border-l border-dashed border-border p-3 text-center align-middle">
                  <Link to="/" className="block rounded-md border border-dashed border-border p-6 text-[12px] font-semibold text-muted-foreground hover:border-primary hover:bg-primary-soft hover:text-primary">
                    + Adicionar mais um
                  </Link>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-border last:border-b-0 even:bg-secondary/30">
                <td className="sticky left-0 z-10 bg-inherit px-4 py-3 text-[11.5px] font-extrabold uppercase tracking-wider text-muted-foreground">
                  {row.label}
                </td>
                {items.map((a) => (
                  <td key={a.id} className="border-l border-border p-3 align-middle">
                    {row.render(a)}
                  </td>
                ))}
                {items.length < 3 && <td className="border-l border-dashed border-border p-3 text-center text-muted-foreground"><Minus className="mx-auto h-3 w-3" strokeWidth={2.4} /></td>}
              </tr>
            ))}
            <tr>
              <td className="sticky left-0 z-10 bg-card px-4 py-3" />
              {items.map((a) => (
                <td key={a.id} className="border-l border-border p-3">
                  <Link to={`/anuncio/${a.id}`}>
                    <Button className="h-9 w-full gap-1.5 rounded-md bg-primary font-display text-[12.5px] font-extrabold text-primary-foreground hover:bg-primary/90">
                      <ExternalLink className="h-3.5 w-3.5" strokeWidth={2.6} />
                      Ver detalhes
                    </Button>
                  </Link>
                </td>
              ))}
              {items.length < 3 && <td className="border-l border-dashed border-border p-3" />}
            </tr>
          </tbody>
        </table>
      </div>
    </AppShell>
  );
};

export default Comparar;
