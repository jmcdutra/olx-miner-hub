import { useState } from "react";
import { CheckCircle2, ArrowRight, Calendar, CreditCard, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { PageErrorState, PageLoadingState } from "@/components/QueryStates";
import { Button } from "@/components/ui/button";
import { CheckoutModal } from "@/components/modals/CheckoutModal";
import { ConfirmDialog } from "@/components/modals/ConfirmDialog";
import {
  useCancelSubscriptionMutation,
  usePlanosQuery,
  useSubscribePlanMutation,
  useUpdatePaymentMethodMutation,
} from "@/hooks/api";
import { getErrorMessage } from "@/lib/api/get-error-message";
import type { Plano } from "@/types/entities";

const Planos = () => {
  const { data, isLoading, isError, error, refetch } = usePlanosQuery();
  const subscribeMutation = useSubscribePlanMutation();
  const cancelMutation = useCancelSubscriptionMutation();
  const updatePaymentMutation = useUpdatePaymentMethodMutation();
  const [upgrade, setUpgrade] = useState<{ open: boolean; plano?: Plano }>({ open: false });
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [confirmPayment, setConfirmPayment] = useState(false);

  if (isLoading) {
    return (
      <AppShell>
        <PageLoadingState title="Carregando planos" description="Buscando precos, beneficios e dados da sua assinatura." />
      </AppShell>
    );
  }

  if (isError || !data) {
    return (
      <AppShell>
        <PageErrorState
          title="Nao foi possivel carregar os planos"
          description="A area de assinatura nao respondeu agora."
          details={getErrorMessage(error)}
          onRetry={() => {
            void refetch();
          }}
        />
      </AppShell>
    );
  }

  const { planos, subscription } = data;

  const handleSubscribe = async (plano: Plano) => {
    await subscribeMutation.mutateAsync({ planId: plano.id });
    toast.success(`Plano ${plano.nome} ativado com sucesso.`);
  };

  const handleCancelSubscription = async () => {
    await cancelMutation.mutateAsync();
    toast.success("Assinatura cancelada com sucesso.", {
      description: `Acesso mantido até ${subscription.nextBillingDate}.`,
    });
  };

  const handleUpdatePayment = async () => {
    await updatePaymentMutation.mutateAsync({ brand: "VISA", last4: "4242" });
    toast.success("Cartão atualizado com sucesso.");
  };

  return (
    <AppShell>
      <div className="mx-auto">
        <PageHeader
          title="Planos e Assinaturas"
          description="Escolha o plano ideal para escalar seu volume de garimpo e multiplicar seus lucros."
        />

        <div className="mb-12 mt-6 grid gap-6 md:grid-cols-3 md:items-center">
          {planos.map((plano) => (
            <div
              key={plano.id}
              className={`relative flex flex-col rounded-3xl border bg-card transition-all duration-300 ${
                plano.popular
                  ? "z-10 bg-gradient-to-b from-card to-primary/[0.02] shadow-2xl shadow-primary/10 md:-translate-y-4 border-primary/50"
                  : "border-border/50 shadow-sm hover:border-border hover:shadow-md"
              }`}
            >
              {plano.popular && (
                <div className="absolute left-0 right-0 top-[-1rem] flex justify-center">
                  <span className="flex items-center gap-1 rounded-full bg-gradient-to-r from-primary to-primary/80 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-primary-foreground shadow-sm">
                    <Sparkles className="h-3 w-3" /> Mais popular
                  </span>
                </div>
              )}
              {plano.atual && (
                <div className="absolute right-5 top-5">
                  <span className="rounded-full border border-success/20 bg-success/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-success">
                    Plano Atual
                  </span>
                </div>
              )}

              <div className="p-8 pb-0">
                <h3 className="text-xl font-bold text-foreground">{plano.nome}</h3>
                <p className="mt-2 h-10 text-[13px] text-muted-foreground">{plano.descricao}</p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-[14px] font-bold text-muted-foreground">R$</span>
                  <span className="text-5xl font-bold tracking-tight text-foreground">{plano.preco}</span>
                  <span className="text-[14px] font-medium text-muted-foreground">/mês</span>
                </div>
                <div className="mt-2 inline-flex rounded-md bg-secondary/50 px-2.5 py-1 text-[12px] font-semibold text-muted-foreground">
                  {plano.creditos} créditos inclusos
                </div>
              </div>

              <div className="flex flex-1 flex-col p-8 pt-6">
                <ul className="mb-8 flex-1 space-y-3">
                  {plano.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-[13.5px] font-medium text-foreground/80">
                      <CheckCircle2 className={`h-4.5 w-4.5 shrink-0 ${plano.popular ? "text-primary" : "text-muted-foreground/50"}`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  disabled={plano.atual || subscribeMutation.isPending}
                  onClick={() => setUpgrade({ open: true, plano })}
                  className={`h-11 w-full rounded-xl text-[14px] font-semibold transition-all ${
                    plano.atual
                      ? "cursor-default bg-secondary text-muted-foreground hover:bg-secondary"
                      : plano.popular
                        ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                        : "border-2 border-border bg-background text-foreground hover:border-primary/50 hover:bg-secondary/30"
                  }`}
                >
                  {plano.atual ? "Seu Plano Atual" : `Assinar ${plano.nome}`}
                  {!plano.atual && <ArrowRight className="ml-1.5 h-4 w-4" />}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-8 overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border/40 bg-secondary/10 px-6 py-5">
            <div>
              <h2 className="text-[16px] font-bold text-foreground">Gerenciar Assinatura</h2>
              <p className="mt-0.5 text-[13px] text-muted-foreground">Acompanhe seu faturamento e método de pagamento.</p>
            </div>
            <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary sm:flex">
              <CreditCard className="h-5 w-5" />
            </div>
          </div>

          <div className="grid gap-6 p-6 md:grid-cols-4">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">Plano Ativo</div>
              <div className="mt-1 text-xl font-bold text-primary">{subscription.planName}</div>
              <div className="mt-1 text-[12px] text-muted-foreground">
                {subscription.status === "canceled" ? "Cancelado no fim do ciclo" : "Assinatura ativa"}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                <Calendar className="h-3.5 w-3.5" /> Próx. Renovação
              </div>
              <div className="mt-1 text-xl font-bold text-foreground">{subscription.nextBillingDate}</div>
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">Valor da Fatura</div>
              <div className="mt-1 text-xl font-bold text-foreground">R$ {subscription.amount.toFixed(2).replace(".", ",")}</div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                <CreditCard className="h-3.5 w-3.5" /> Pagamento
              </div>
              <div className="mt-1 flex items-center gap-2">
                <div className="flex h-5 w-8 items-center justify-center rounded border border-border/50 bg-secondary">
                  <span className="text-[9px] font-bold text-foreground">{subscription.paymentMethod.brand}</span>
                </div>
                <span className="text-[15px] font-bold tracking-widest text-foreground">•••• {subscription.paymentMethod.last4}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-border/40 bg-secondary/5 px-6 py-4 sm:flex-row">
            <Button variant="outline" onClick={() => setConfirmPayment(true)} className="h-10 rounded-xl border-border/60 bg-background text-[13px] font-semibold">
              Atualizar Cartão
            </Button>
            <Button variant="outline" onClick={() => toast("Faturas em breve")} className="h-10 rounded-xl border-border/60 bg-background text-[13px] font-semibold">
              Histórico de Faturas
            </Button>
            <Button
              variant="ghost"
              onClick={() => setConfirmCancel(true)}
              className="h-10 rounded-xl text-[13px] font-semibold text-destructive hover:bg-destructive/10 sm:ml-auto"
              disabled={subscription.status === "canceled" || cancelMutation.isPending}
            >
              {subscription.status === "canceled" ? "Assinatura já cancelada" : "Cancelar Assinatura"}
            </Button>
          </div>
        </div>
      </div>

      {upgrade.plano && (
        <CheckoutModal
          open={upgrade.open}
          onOpenChange={(open) => setUpgrade({ ...upgrade, open })}
          title={`Assinar plano ${upgrade.plano.nome}`}
          description={`${upgrade.plano.creditos} créditos mensais. Cobrança recorrente.`}
          itemLabel={`Plano ${upgrade.plano.nome}`}
          amount={`R$ ${upgrade.plano.preco},00/mês`}
          ctaLabel="Confirmar Assinatura"
          onSuccess={() => handleSubscribe(upgrade.plano!)}
        />
      )}

      <ConfirmDialog
        open={confirmCancel}
        onOpenChange={setConfirmCancel}
        title="Cancelar assinatura atual?"
        description={`Você manterá o acesso até o fim do seu ciclo em ${subscription.nextBillingDate}. Após essa data, suas minerações ativas serão pausadas.`}
        confirmLabel="Sim, cancelar assinatura"
        destructive
        onConfirm={handleCancelSubscription}
      />

      <ConfirmDialog
        open={confirmPayment}
        onOpenChange={setConfirmPayment}
        title="Atualizar forma de pagamento?"
        description="O mock da API vai salvar o método atualizado e refletir isso no resumo da assinatura."
        confirmLabel="Atualizar cartão"
        onConfirm={handleUpdatePayment}
      />
    </AppShell>
  );
};

export default Planos;
