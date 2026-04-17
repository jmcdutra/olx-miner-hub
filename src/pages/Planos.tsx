import { Check, ArrowRight, Calendar, CreditCard } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { planos } from "@/data/mock";

const Planos = () => {
  return (
    <AppShell>
      <PageHeader
        title="Planos"
        description="Escolha o plano que combina com seu volume de garimpo."
      />

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        {planos.map((p) => (
          <div
            key={p.id}
            className={`relative rounded-lg border bg-card p-6 ${
              p.popular ? "border-primary ring-1 ring-primary" : "border-border"
            }`}
          >
            {p.popular && (
              <span className="absolute -top-2.5 left-6 rounded bg-primary px-2 py-0.5 font-display text-[10px] font-extrabold uppercase tracking-wider text-primary-foreground">
                Mais popular
              </span>
            )}
            {p.atual && (
              <span className="absolute right-4 top-4 rounded bg-success-soft px-2 py-0.5 font-display text-[10px] font-extrabold uppercase tracking-wider text-success">
                Seu plano
              </span>
            )}

            <h3 className="font-display text-[20px] font-extrabold text-foreground">{p.nome}</h3>
            <p className="mt-1 text-[12.5px] text-muted-foreground">{p.descricao}</p>

            <div className="mt-5 flex items-baseline gap-1">
              <span className="text-[12px] font-bold text-muted-foreground">R$</span>
              <span className="font-display text-[40px] font-extrabold leading-none text-foreground price">{p.preco}</span>
              <span className="text-[12px] font-semibold text-muted-foreground">/mês</span>
            </div>

            <ul className="mt-5 space-y-2.5">
              {p.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-[13px] text-foreground/85">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" strokeWidth={3} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <Button
              disabled={p.atual}
              className={`mt-6 h-10 w-full rounded-md font-display text-[13px] font-extrabold ${
                p.atual
                  ? "bg-secondary text-muted-foreground hover:bg-secondary"
                  : p.popular
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-foreground text-background hover:bg-foreground/90"
              }`}
            >
              {p.atual ? "Plano atual" : `Assinar ${p.nome}`}
              {!p.atual && <ArrowRight className="ml-1 h-3.5 w-3.5" strokeWidth={2.6} />}
            </Button>
          </div>
        ))}
      </div>

      {/* Sua assinatura */}
      <div className="rounded-lg border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-display text-[15px] font-extrabold text-foreground">Sua assinatura</h2>
          <p className="text-[12px] text-muted-foreground">Próximas cobranças e dados de pagamento.</p>
        </div>
        <div className="grid gap-4 p-5 md:grid-cols-4">
          <div>
            <div className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">Plano ativo</div>
            <div className="mt-1 font-display text-[18px] font-extrabold text-primary">Pro</div>
          </div>
          <div>
            <div className="flex items-center gap-1 text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
              <Calendar className="h-3 w-3" strokeWidth={2.6} /> Próx. renovação
            </div>
            <div className="mt-1 font-display text-[18px] font-extrabold text-foreground">29 abr 2026</div>
          </div>
          <div>
            <div className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">Valor</div>
            <div className="mt-1 font-display text-[18px] font-extrabold text-foreground price">R$ 89,00</div>
          </div>
          <div>
            <div className="flex items-center gap-1 text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
              <CreditCard className="h-3 w-3" strokeWidth={2.6} /> Pagamento
            </div>
            <div className="mt-1 font-display text-[15px] font-extrabold text-foreground price">•••• 4242</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 border-t border-border px-5 py-4">
          <Button variant="outline" className="h-9 rounded-md border-border font-display text-[12.5px] font-extrabold">Atualizar pagamento</Button>
          <Button variant="outline" className="h-9 rounded-md border-border font-display text-[12.5px] font-extrabold">Histórico de faturas</Button>
          <Button variant="ghost" className="ml-auto h-9 rounded-md text-destructive font-display text-[12.5px] font-extrabold hover:bg-destructive/10">
            Cancelar assinatura
          </Button>
        </div>
      </div>
    </AppShell>
  );
};

export default Planos;
