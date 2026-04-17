import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Minus, Info, Pickaxe, Calendar, Pause } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { movimentacoes, mineracoes } from "@/data/mock";
import { CheckoutModal } from "@/components/modals/CheckoutModal";

const Creditos = () => {
  const [checkout, setCheckout] = useState<{ open: boolean; pacote?: { qtd: number; preco: number } }>({ open: false });

  // Modelo: 1 crédito = 1 mineração ativa por mês
  const planoCreditos = 50;
  const ativas = mineracoes.filter((m) => m.status === "ativo").length;
  const avulsos = 0; // pacotes extras comprados
  const totalDisponivel = planoCreditos + avulsos - ativas;
  const usoPct = Math.round((ativas / planoCreditos) * 100);

  const pacotes = [
    { qtd: 10, preco: 19.9, bonus: 0, popular: false },
    { qtd: 25, preco: 49.9, bonus: 5, popular: true },
    { qtd: 60, preco: 99.9, bonus: 15, popular: false },
  ];

  return (
    <AppShell>
      <PageHeader
        title="Créditos"
        description="Cada mineração ativa consome 1 crédito por mês. Pausar libera o crédito imediatamente."
      />

      {/* Hero card — saldo unificado */}
      <div className="mb-6 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Disponível para uso</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-display text-[56px] font-extrabold leading-none text-foreground price">{totalDisponivel}</span>
                <span className="font-display text-[16px] font-extrabold text-muted-foreground">/ {planoCreditos + avulsos}</span>
              </div>
              <div className="mt-2 text-[12.5px] text-muted-foreground">
                {ativas} em uso · {totalDisponivel} prontos para novas minerações
              </div>
            </div>
            <Button
              onClick={() => setCheckout({ open: true, pacote: pacotes[1] })}
              className="h-9 gap-1.5 rounded-md bg-primary px-3.5 font-display text-[12.5px] font-extrabold text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2.6} />
              Comprar mais
            </Button>
          </div>

          <div className="mt-5">
            <div className="mb-1.5 flex items-center justify-between text-[11.5px] font-semibold text-muted-foreground">
              <span>Uso do plano Pro</span>
              <span className="font-extrabold tabular text-foreground">{ativas} / {planoCreditos}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${usoPct}%` }} />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3 border-t border-border pt-4">
            <div>
              <div className="text-[10.5px] font-extrabold uppercase tracking-wider text-muted-foreground">Inclusos no plano</div>
              <div className="mt-1 font-display text-[18px] font-extrabold text-foreground price">{planoCreditos}</div>
              <div className="text-[11px] text-muted-foreground">renovam todo mês</div>
            </div>
            <div>
              <div className="text-[10.5px] font-extrabold uppercase tracking-wider text-muted-foreground">Comprados (não expiram)</div>
              <div className="mt-1 font-display text-[18px] font-extrabold text-foreground price">{avulsos}</div>
              <div className="text-[11px] text-muted-foreground">pacotes avulsos</div>
            </div>
            <div>
              <div className="text-[10.5px] font-extrabold uppercase tracking-wider text-muted-foreground">Em uso agora</div>
              <div className="mt-1 font-display text-[18px] font-extrabold text-accent price">{ativas}</div>
              <div className="text-[11px] text-muted-foreground">minerações ativas</div>
            </div>
          </div>
        </div>

        {/* Como funciona */}
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary-soft text-primary">
              <Info className="h-4 w-4" strokeWidth={2.4} />
            </div>
            <h3 className="font-display text-[14px] font-extrabold text-foreground">Como funciona</h3>
          </div>
          <ul className="mt-3 space-y-2.5 text-[12.5px] text-foreground/80">
            <li className="flex gap-2">
              <Pickaxe className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={2.4} />
              <span><span className="font-extrabold text-foreground">1 crédito = 1 mineração ativa</span> por mês.</span>
            </li>
            <li className="flex gap-2">
              <Pause className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" strokeWidth={2.4} />
              <span>Pausar uma mineração <span className="font-extrabold text-foreground">libera o crédito</span> na hora.</span>
            </li>
            <li className="flex gap-2">
              <Calendar className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" strokeWidth={2.4} />
              <span>Créditos do plano <span className="font-extrabold text-foreground">renovam dia 29</span> de cada mês.</span>
            </li>
            <li className="flex gap-2">
              <Plus className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" strokeWidth={2.4} />
              <span>Pacotes avulsos <span className="font-extrabold text-foreground">não expiram</span> e somam ao saldo.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Pacotes */}
      <div className="mb-6">
        <h2 className="mb-3 font-display text-[15px] font-extrabold text-foreground">Pacotes avulsos</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {pacotes.map((p) => (
            <div key={p.qtd} className={`relative rounded-lg border bg-card p-5 ${p.popular ? "border-primary ring-1 ring-primary" : "border-border"}`}>
              {p.popular && (
                <span className="absolute -top-2 left-4 rounded bg-primary px-1.5 py-0.5 font-display text-[9.5px] font-extrabold uppercase tracking-wider text-primary-foreground">
                  Melhor valor
                </span>
              )}
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-[32px] font-extrabold text-foreground price">{p.qtd}</span>
                <span className="text-[12px] font-semibold text-muted-foreground">créditos</span>
                {p.bonus > 0 && (
                  <span className="ml-auto rounded bg-accent-soft px-1.5 py-0.5 text-[10.5px] font-extrabold text-accent">+{p.bonus} bônus</span>
                )}
              </div>
              <div className="mt-1 font-display text-[16px] font-extrabold text-foreground price">R$ {p.preco.toFixed(2).replace(".", ",")}</div>
              <div className="text-[11px] text-muted-foreground">R$ {(p.preco / (p.qtd + p.bonus)).toFixed(2).replace(".", ",")} por crédito</div>
              <Button
                onClick={() => setCheckout({ open: true, pacote: p })}
                className={`mt-4 h-9 w-full rounded-md font-display text-[12.5px] font-extrabold ${
                  p.popular ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-foreground text-background hover:bg-foreground/90"
                }`}
              >
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
            <h2 className="font-display text-[15px] font-extrabold text-foreground">Histórico</h2>
            <p className="text-[12px] text-muted-foreground">Movimentações dos últimos 30 dias</p>
          </div>
          <Link to="#" className="text-[12px] font-extrabold text-primary hover:underline">Exportar CSV</Link>
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

      {checkout.pacote && (
        <CheckoutModal
          open={checkout.open}
          onOpenChange={(o) => setCheckout({ ...checkout, open: o })}
          title={`Comprar ${checkout.pacote.qtd} créditos`}
          description={`${checkout.pacote.qtd}${checkout.pacote.bonus ? ` + ${checkout.pacote.bonus} bônus` : ""} créditos avulsos sem expiração.`}
          itemLabel={`${checkout.pacote.qtd}${checkout.pacote.bonus ? `+${checkout.pacote.bonus}` : ""} créditos`}
          amount={`R$ ${checkout.pacote.preco.toFixed(2).replace(".", ",")}`}
        />
      )}
    </AppShell>
  );
};

export default Creditos;
