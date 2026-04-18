import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Minus, Pickaxe, Calendar, Pause, ArrowRight, Zap } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { PageErrorState, PageLoadingState } from "@/components/QueryStates";
import { Button } from "@/components/ui/button";
import { CheckoutModal } from "@/components/modals/CheckoutModal";
import { APP_ICONS } from "@/lib/category-icons";
import { useBuyCreditsMutation, useCreditosQuery } from "@/hooks/api";
import { getErrorMessage } from "@/lib/api/get-error-message";
import type { CreditPackage } from "@/types/entities";

const Creditos = () => {
  const { data, isLoading, isError, error, refetch } = useCreditosQuery();
  const buyCreditsMutation = useBuyCreditsMutation();
  const [checkout, setCheckout] = useState<{ open: boolean; pacote?: CreditPackage }>({ open: false });

  if (isLoading) {
    return (
      <AppShell>
        <PageLoadingState title="Carregando creditos" description="Sincronizando saldo, pacotes e historico de movimentacoes." />
      </AppShell>
    );
  }

  if (isError || !data) {
    return (
      <AppShell>
        <PageErrorState
          title="Nao foi possivel carregar seus creditos"
          description="O painel de saldo nao respondeu como esperado."
          details={getErrorMessage(error)}
          onRetry={() => {
            void refetch();
          }}
        />
      </AppShell>
    );
  }

  const handleBuyCredits = async (pacote: CreditPackage) => {
    await buyCreditsMutation.mutateAsync(pacote);
    toast.success("Créditos adicionados com sucesso.", {
      description: `${pacote.qtd + pacote.bonus} créditos disponíveis no saldo.`,
    });
  };

  return (
    <AppShell>
      <PageHeader
        title="Créditos e Faturamento"
        description="Gerencie seus créditos. Cada mineração ativa consome 1 crédito por mês."
      />

      <div className="mb-8 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-card to-secondary/20 p-6 shadow-sm">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />

          <div className="relative flex items-start justify-between">
            <div className="flex items-center gap-5">
              <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-border/50 bg-background shadow-sm sm:flex">
                <img src={APP_ICONS.creditos} alt="Créditos" className="h-8 w-8 object-contain drop-shadow-sm" loading="lazy" />
              </div>
              <div>
                <div className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground/80">Saldo Disponível</div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-5xl font-bold tracking-tight text-foreground">{data.totalDisponivel}</span>
                  <span className="text-lg font-medium text-muted-foreground">/ {data.planoCreditos + data.avulsos} totais</span>
                </div>
                <div className="mt-1 text-[13px] font-medium text-muted-foreground">
                  <span className="text-foreground">{data.ativas} em uso</span> · prontos para novas minerações
                </div>
              </div>
            </div>
            <Button
              onClick={() => setCheckout({ open: true, pacote: data.pacotes[1] })}
              className="h-10 gap-2 rounded-full bg-primary px-5 text-[13px] font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
            >
              <Plus className="h-4 w-4" />
              Adicionar Saldo
            </Button>
          </div>

          <div className="mt-8">
            <div className="mb-2 flex items-center justify-between text-[13px] font-medium text-foreground">
              <span className="flex items-center gap-1.5"><Zap className="h-4 w-4 fill-warning/20 text-warning" /> Uso do Plano</span>
              <span className="font-semibold">{data.ativas} / {data.planoCreditos} utilizados</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
              <div className="relative h-full rounded-full bg-primary transition-all duration-500 ease-in-out" style={{ width: `${data.usagePct}%` }}>
                <div className="absolute inset-0 w-full animate-pulse bg-white/20" />
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4 border-t border-border/40 pt-6">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">Plano Mensal</div>
              <div className="mt-1 text-xl font-bold text-foreground">{data.planoCreditos}</div>
              <div className="text-[12px] text-muted-foreground">renovam no ciclo ativo</div>
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">Avulsos (Extras)</div>
              <div className="mt-1 text-xl font-bold text-foreground">{data.avulsos}</div>
              <div className="text-[12px] text-muted-foreground">não expiram</div>
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">Em Uso Agora</div>
              <div className="mt-1 text-xl font-bold text-primary">{data.ativas}</div>
              <div className="text-[12px] text-muted-foreground">gerando métricas</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
              <img src={APP_ICONS.creditos} alt="" className="h-5 w-5 object-contain opacity-80" loading="lazy" />
            </div>
            <h3 className="text-base font-bold text-foreground">Como funciona</h3>
          </div>
          <ul className="space-y-4 text-[13px] text-muted-foreground">
            <li className="flex gap-3">
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Pickaxe className="h-3 w-3" strokeWidth={2.5} />
              </div>
              <span><span className="font-semibold text-foreground">1 crédito = 1 mineração ativa</span> por mês.</span>
            </li>
            <li className="flex gap-3">
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-warning/10 text-warning">
                <Pause className="h-3 w-3" strokeWidth={2.5} />
              </div>
              <span>Pausar uma mineração <span className="font-semibold text-foreground">libera o crédito</span> na hora.</span>
            </li>
            <li className="flex gap-3">
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
                <Calendar className="h-3 w-3" strokeWidth={2.5} />
              </div>
              <span>Créditos do plano <span className="font-semibold text-foreground">renovam a cada ciclo</span> da assinatura.</span>
            </li>
            <li className="flex gap-3">
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                <Plus className="h-3 w-3" strokeWidth={2.5} />
              </div>
              <span>Pacotes avulsos <span className="font-semibold text-foreground">não expiram</span> e somam ao saldo.</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Comprar Pacotes Avulsos</h2>
          <span className="text-[13px] text-muted-foreground">Os pacotes extras nunca expiram.</span>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {data.pacotes.map((pacote) => (
            <div
              key={pacote.qtd}
              className={`relative flex flex-col justify-between rounded-2xl border p-6 transition-all hover:shadow-md ${
                pacote.popular ? "border-primary/50 bg-primary/[0.02] shadow-sm ring-1 ring-primary/20" : "border-border/50 bg-card hover:border-border"
              }`}
            >
              {pacote.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-primary/80 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground shadow-sm">
                  Mais Popular
                </div>
              )}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-bold tracking-tight text-foreground">{pacote.qtd}</span>
                    <span className="text-[13px] font-medium text-muted-foreground">créditos</span>
                  </div>
                  {pacote.bonus > 0 && (
                    <span className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-0.5 text-[11px] font-bold text-white shadow-sm">
                      +{pacote.bonus} bônus
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-end gap-2">
                  <div className="text-2xl font-bold text-foreground">R$ {pacote.preco.toFixed(2).replace(".", ",")}</div>
                  <div className="mb-1 text-[12px] font-medium text-muted-foreground">taxa única</div>
                </div>
                <div className="mt-1 text-[12px] text-muted-foreground/80">
                  Apenas R$ {(pacote.preco / (pacote.qtd + pacote.bonus)).toFixed(2).replace(".", ",")} por crédito
                </div>
              </div>

              <Button
                onClick={() => setCheckout({ open: true, pacote })}
                className={`mt-6 h-11 w-full rounded-xl text-[14px] font-semibold transition-all ${
                  pacote.popular
                    ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                    : "border border-border/50 bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                Comprar Agora
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border/40 bg-secondary/20 px-6 py-4">
          <div>
            <h2 className="text-base font-bold text-foreground">Histórico de Movimentações</h2>
            <p className="text-[13px] text-muted-foreground">Transações e uso dos últimos 30 dias</p>
          </div>
          <Link to="#" className="flex items-center gap-1 text-[13px] font-semibold text-primary transition-colors hover:text-primary/80">
            Baixar CSV <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-border/40">
          {data.movimentacoes.map((movimentacao) => (
            <div key={movimentacao.id} className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-secondary/30">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${
                movimentacao.tipo === "credito" ? "border-success/20 bg-success/10 text-success" : "border-border/50 bg-secondary text-muted-foreground"
              }`}>
                {movimentacao.tipo === "credito" ? <Plus className="h-4.5 w-4.5" strokeWidth={2.5} /> : <Minus className="h-4.5 w-4.5" strokeWidth={2.5} />}
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-semibold text-foreground">{movimentacao.descricao}</div>
                <div className="mt-0.5 text-[12px] text-muted-foreground">{movimentacao.detalhe}</div>
              </div>

              <div className="text-right">
                <div className={`text-[15px] font-bold tracking-tight ${movimentacao.valor > 0 ? "text-success" : "text-foreground"}`}>
                  {movimentacao.valor > 0 ? "+" : ""}{movimentacao.valor}
                </div>
                <div className="mt-0.5 text-[12px] font-medium text-muted-foreground">{movimentacao.data}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {checkout.pacote && (
        <CheckoutModal
          open={checkout.open}
          onOpenChange={(open) => setCheckout({ ...checkout, open })}
          title={`Comprar ${checkout.pacote.qtd} créditos`}
          description={`${checkout.pacote.qtd} créditos avulsos. Eles não possuem prazo de validade.`}
          itemLabel={`Pacote de ${checkout.pacote.qtd} créditos`}
          amount={`R$ ${checkout.pacote.preco.toFixed(2).replace(".", ",")}`}
          onSuccess={() => handleBuyCredits(checkout.pacote!)}
        />
      )}
    </AppShell>
  );
};

export default Creditos;
