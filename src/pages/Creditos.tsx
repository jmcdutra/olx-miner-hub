import { ArrowRight, Plus, Minus } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { movimentacoes } from "@/data/mock";

const Creditos = () => {
  return (
    <AppShell>
      <PageHeader
        title="Créditos"
        description="Cada crédito vale por uma nova mineração ativa."
        actions={
          <Button className="h-9 gap-1.5 rounded-md bg-primary px-3.5 font-display text-[13px] font-extrabold text-primary-foreground hover:bg-primary/90">
            Comprar créditos <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.6} />
          </Button>
        }
      />

      {/* Balance */}
      <div className="mb-6 grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Saldo atual</div>
          <div className="mt-1 font-display text-[44px] font-extrabold leading-none text-foreground price">34</div>
          <div className="mt-2 text-[12px] font-medium text-muted-foreground">créditos disponíveis</div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-primary" style={{ width: "68%" }} />
          </div>
          <div className="mt-1.5 text-[11px] font-medium text-muted-foreground">Renova em 12 dias</div>
        </div>

        <div className="rounded-lg border border-border bg-card p-5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Da assinatura</div>
          <div className="mt-1 font-display text-[44px] font-extrabold leading-none text-foreground price">50</div>
          <div className="mt-2 text-[12px] font-medium text-muted-foreground">incluídos no plano Pro</div>
          <div className="mt-3 text-[11.5px] font-semibold text-muted-foreground">R$ 89,00/mês — próx. 29 abr</div>
        </div>

        <div className="rounded-lg border border-border bg-card p-5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Comprados avulsos</div>
          <div className="mt-1 font-display text-[44px] font-extrabold leading-none text-foreground price">30</div>
          <div className="mt-2 text-[12px] font-medium text-muted-foreground">não expiram</div>
          <Button variant="outline" className="mt-3 h-8 rounded-md border-border font-display text-[12px] font-extrabold">
            Comprar mais
          </Button>
        </div>
      </div>

      {/* Pacotes avulsos */}
      <div className="mb-6">
        <h2 className="mb-3 font-display text-[16px] font-extrabold text-foreground">Pacotes avulsos</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { qtd: 10, preco: 19.9, bonus: 0 },
            { qtd: 25, preco: 49.9, bonus: 5, popular: true },
            { qtd: 60, preco: 99.9, bonus: 15 },
          ].map((p) => (
            <div key={p.qtd} className={`rounded-lg border bg-card p-4 ${p.popular ? "border-primary ring-1 ring-primary" : "border-border"}`}>
              <div className="flex items-baseline gap-1">
                <span className="font-display text-[28px] font-extrabold text-foreground price">{p.qtd}</span>
                <span className="text-[12px] font-semibold text-muted-foreground">créditos</span>
                {p.bonus > 0 && (
                  <span className="ml-auto rounded bg-accent-soft px-1.5 py-0.5 text-[10.5px] font-extrabold text-accent">+{p.bonus} bônus</span>
                )}
              </div>
              <div className="mt-2 font-display text-[15px] font-extrabold text-foreground price">R$ {p.preco.toFixed(2).replace(".", ",")}</div>
              <Button className={`mt-3 h-9 w-full rounded-md font-display text-[12.5px] font-extrabold ${
                p.popular ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-foreground text-background hover:bg-foreground/90"
              }`}>
                Comprar
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Movimentações */}
      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="font-display text-[15px] font-extrabold text-foreground">Movimentações</h2>
            <p className="text-[12px] text-muted-foreground">Últimos 30 dias</p>
          </div>
          <button className="text-[12px] font-extrabold text-primary hover:underline">Exportar CSV</button>
        </div>
        <div className="divide-y divide-border">
          {movimentacoes.map((mv) => (
            <div key={mv.id} className="flex items-center gap-3 px-5 py-3">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
                mv.tipo === "credito" ? "bg-success-soft text-success" : "bg-secondary text-muted-foreground"
              }`}>
                {mv.tipo === "credito" ? <Plus className="h-4 w-4" strokeWidth={2.8} /> : <Minus className="h-4 w-4" strokeWidth={2.8} />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-display text-[13.5px] font-extrabold text-foreground">{mv.descricao}</div>
                <div className="text-[11.5px] text-muted-foreground">{mv.detalhe}</div>
              </div>
              <div className="text-right">
                <div className={`font-display text-[14px] font-extrabold price ${mv.valor > 0 ? "text-success" : "text-foreground"}`}>
                  {mv.valor > 0 ? "+" : ""}{mv.valor}
                </div>
                <div className="text-[10.5px] font-semibold text-muted-foreground">{mv.data}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
};

export default Creditos;
