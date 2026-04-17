import { Check, Star, Sparkles, ArrowRight, Calendar, CreditCard } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { planos } from "@/data/mock";

const Planos = () => {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Assinaturas"
        title="Planos"
        description="Escolha o plano ideal para você. Monitore mais produtos, receba alertas mais rápido e não perca nenhuma oportunidade."
      />

      <div className="mb-12 grid gap-6 md:grid-cols-3">
        {planos.map((p) => {
          const popular = p.popular;
          return (
            <div
              key={p.id}
              className={`relative overflow-hidden rounded-3xl p-8 transition-smooth ${
                popular
                  ? "border-2 border-primary bg-gradient-to-br from-primary/5 via-card to-accent/5 shadow-elevated md:-translate-y-3"
                  : "border border-border bg-card hover:-translate-y-1 hover:shadow-elegant"
              }`}
            >
              {popular && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 rounded-b-2xl bg-primary px-5 py-1.5 font-display text-[11px] font-extrabold uppercase tracking-wider text-primary-foreground">
                  <Star className="mr-1 inline h-3 w-3 fill-current" strokeWidth={2.8} />
                  Mais Popular
                </div>
              )}

              <div className="mt-4 mb-6 flex items-start justify-between">
                <div>
                  <h3 className="font-display text-[28px] font-extrabold text-foreground">{p.nome}</h3>
                </div>
                {p.atual && (
                  <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-display text-[11px] font-extrabold text-primary">Seu Plano</span>
                )}
              </div>

              <p className="mb-6 text-[13.5px] leading-relaxed text-muted-foreground">{p.descricao}</p>

              <div className="mb-6 flex items-baseline gap-1">
                <span className="font-display text-[14px] font-bold text-muted-foreground">R$</span>
                <span className="heading-display text-[56px] font-extrabold text-foreground">{p.preco},00</span>
                <span className="font-display text-[14px] font-bold text-muted-foreground">/mês</span>
              </div>

              <ul className="mb-8 space-y-3">
                {p.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-[14px] font-semibold text-foreground">
                    <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${popular ? "bg-primary text-primary-foreground" : "bg-success/10 text-success"}`}>
                      <Check className="h-3 w-3" strokeWidth={3.5} />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                disabled={p.atual}
                className={`h-12 w-full rounded-2xl font-display text-[14px] font-extrabold ${
                  p.atual
                    ? "bg-secondary text-muted-foreground hover:bg-secondary"
                    : popular
                    ? "bg-accent text-accent-foreground shadow-orange hover:bg-accent/90"
                    : "bg-foreground text-background hover:bg-foreground/90"
                }`}
              >
                {p.atual ? "Plano Atual" : `Assinar ${p.nome}`}
                {!p.atual && <ArrowRight className="ml-1 h-4 w-4" strokeWidth={2.8} />}
              </Button>
            </div>
          );
        })}
      </div>

      {/* Sua Assinatura */}
      <div className="rounded-3xl border border-border bg-card p-7">
        <h2 className="mb-5 font-display text-[22px] font-extrabold text-foreground">Sua Assinatura</h2>

        <div className="grid gap-4 rounded-2xl bg-secondary/40 p-6 md:grid-cols-4">
          <div>
            <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Plano Ativo</div>
            <div className="font-display text-[20px] font-extrabold text-primary">Pro</div>
          </div>
          <div>
            <div className="mb-1 flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <Calendar className="h-3 w-3" strokeWidth={2.8} />
              Próxima renovação
            </div>
            <div className="font-display text-[20px] font-extrabold text-foreground">29 abr 2026</div>
          </div>
          <div>
            <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Valor</div>
            <div className="font-display text-[20px] font-extrabold text-foreground">R$ 89,00</div>
          </div>
          <div>
            <div className="mb-1 flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <CreditCard className="h-3 w-3" strokeWidth={2.8} />
              Pagamento
            </div>
            <div className="font-display text-[15px] font-extrabold text-foreground">•••• 4242</div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Button variant="outline" className="rounded-xl border-border font-display text-[13px] font-extrabold">Atualizar pagamento</Button>
          <Button variant="ghost" className="rounded-xl text-destructive font-display text-[13px] font-extrabold hover:bg-destructive/10 hover:text-destructive">Cancelar assinatura</Button>
        </div>
      </div>
    </AppShell>
  );
};

export default Planos;
