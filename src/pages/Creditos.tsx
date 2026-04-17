import { ArrowRight, CheckCircle2, Coins, AlertCircle, Sparkles, Plus, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { movimentacoes } from "@/data/mock";

const Creditos = () => {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Saldo & uso"
        title="Meus Créditos"
        description="Acompanhe seu saldo e adicione mais para monitorar novos produtos."
        actions={
          <Button className="h-12 gap-2 rounded-2xl bg-primary px-6 font-display text-[14px] font-extrabold text-primary-foreground shadow-md hover:bg-primary-glow">
            Comprar mais créditos
            <ArrowRight className="h-4 w-4" strokeWidth={3} />
          </Button>
        }
      />

      {/* Balance cards */}
      <div className="mb-10 grid gap-5 md:grid-cols-3">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-bold p-7 text-white shadow-elevated grain">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="relative">
            <div className="mb-4 flex items-center gap-2">
              <Coins className="h-5 w-5" strokeWidth={2.6} />
              <span className="font-display text-[14px] font-bold uppercase tracking-wider">Saldo Atual</span>
            </div>
            <div className="font-display text-[72px] font-extrabold leading-none">34</div>
            <div className="mt-2 text-[13px] font-bold opacity-90">créditos disponíveis</div>
            <div className="mt-4 text-[12.5px] opacity-80">Disponível para novos alertas</div>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-7">
          <div className="mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-success" strokeWidth={2.6} />
            <span className="font-display text-[14px] font-bold uppercase tracking-wider text-muted-foreground">Da Assinatura</span>
          </div>
          <div className="font-display text-[72px] font-extrabold leading-none text-foreground">50</div>
          <div className="mt-2 text-[13px] font-bold text-muted-foreground">créditos / mês</div>
          <div className="mt-4 text-[12.5px] text-muted-foreground/80">Pro te dá 50 por mês</div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-7">
          <div className="mb-4 flex items-center gap-2">
            <Plus className="h-5 w-5 text-accent" strokeWidth={2.6} />
            <span className="font-display text-[14px] font-bold uppercase tracking-wider text-muted-foreground">Comprados</span>
          </div>
          <div className="font-display text-[72px] font-extrabold leading-none text-foreground">30</div>
          <div className="mt-2 text-[13px] font-bold text-muted-foreground">créditos avulsos</div>
          <div className="mt-4 text-[12.5px] text-muted-foreground/80">Pacotes avulsos que você comprou</div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Movimentações */}
        <div className="rounded-3xl border border-border bg-card p-7">
          <div className="mb-2">
            <h2 className="font-display text-[20px] font-extrabold text-foreground">Últimas movimentações</h2>
            <p className="mt-1 text-[13px] text-muted-foreground">Veja como seus créditos foram usados ou adicionados.</p>
          </div>

          <div className="mt-6 space-y-2">
            {movimentacoes.map((mv) => (
              <div key={mv.id} className="flex items-center gap-4 rounded-2xl border border-transparent p-4 transition-smooth hover:border-border hover:bg-secondary/40">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${mv.tipo === "credito" ? "bg-success/10 text-success" : "bg-accent/10 text-accent"}`}>
                  {mv.tipo === "credito" ? <Coins className="h-[18px] w-[18px]" strokeWidth={2.6} /> : <AlertCircle className="h-[18px] w-[18px]" strokeWidth={2.6} />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-display text-[14.5px] font-extrabold text-foreground">{mv.descricao}</div>
                  <div className="truncate text-[12.5px] text-muted-foreground">{mv.detalhe}</div>
                </div>
                <div className="text-right">
                  <div className={`font-display text-[16px] font-extrabold ${mv.valor > 0 ? "text-success" : "text-foreground"}`}>
                    {mv.valor > 0 ? "+" : ""}{mv.valor}
                  </div>
                  <div className="text-[11.5px] font-semibold text-muted-foreground">{mv.data}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 p-6">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Sparkles className="h-4 w-4" strokeWidth={2.8} />
              </div>
              <h3 className="font-display text-[16px] font-extrabold text-foreground">Como funciona?</h3>
            </div>
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              Cada <span className="font-bold text-foreground">1 crédito</span> permite que você adicione <span className="font-bold text-foreground">1 novo produto</span> para monitorar.
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
              Se acabar seu saldo, a plataforma pausará novos cadastros, mas você pode comprar um pacote avulso na hora.
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-[15px] font-extrabold text-foreground">Seu Plano Atual</h3>
              <span className="rounded-full bg-success/10 px-3 py-1 font-display text-[11px] font-extrabold text-success">Ativo</span>
            </div>
            <div className="font-display text-[32px] font-extrabold text-primary">Pro</div>
            <div className="mt-1 text-[13px] text-muted-foreground">R$ 89,00/mês — renova em 12 dias</div>
            <Button variant="outline" className="mt-4 h-10 w-full rounded-xl border-border font-display text-[13px] font-extrabold">
              Gerenciar plano
            </Button>
          </div>

          <div className="rounded-3xl bg-foreground p-6 text-background">
            <TrendingUp className="mb-3 h-5 w-5 text-accent" strokeWidth={2.6} />
            <h3 className="font-display text-[16px] font-extrabold">Pacote avulso</h3>
            <p className="mt-2 text-[13px] opacity-80">25 créditos + 5 bônus por R$ 49,90</p>
            <Button className="mt-4 h-10 w-full rounded-xl bg-accent font-display text-[13px] font-extrabold text-accent-foreground hover:bg-accent/90">
              Comprar agora
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default Creditos;
