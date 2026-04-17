import { Link } from "react-router-dom";
import { ChevronLeft, Search, MapPin, DollarSign, Target, Sparkles, Info } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const NovaMineracao = () => {
  return (
    <AppShell>
      <Link to="/" className="mb-6 inline-flex items-center gap-1.5 font-display text-[13px] font-bold text-muted-foreground transition-smooth hover:text-primary">
        <ChevronLeft className="h-4 w-4" strokeWidth={2.8} />
        Voltar
      </Link>

      <div className="mb-10 max-w-3xl">
        <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 font-display text-[11px] font-extrabold uppercase tracking-[0.18em] text-accent">
          <Sparkles className="h-3 w-3" strokeWidth={3} />
          Nova operação
        </span>
        <h1 className="heading-display text-[52px] font-extrabold text-foreground">Nova Mineração</h1>
        <p className="mt-3 text-[15px] text-muted-foreground">Configure sua busca para encontrar as melhores oportunidades de compra.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <form className="rounded-3xl border border-border bg-card p-8">
          <div className="mb-6">
            <Label className="mb-2 flex items-center gap-2 font-display text-[14px] font-extrabold text-foreground">
              <Search className="h-4 w-4 text-primary" strokeWidth={2.8} />
              O que você quer minerar?
            </Label>
            <Input placeholder="Ex: iPhone 13 Pro Max" className="h-13 rounded-2xl border-border bg-secondary/50 px-4 font-semibold focus-visible:bg-card" />
            <p className="mt-2 text-[12px] text-muted-foreground">Seja específico para resultados melhores.</p>
          </div>

          <div className="mb-6 grid gap-5 md:grid-cols-2">
            <div>
              <Label className="mb-2 flex items-center gap-2 font-display text-[14px] font-extrabold text-foreground">
                <MapPin className="h-4 w-4 text-primary" strokeWidth={2.8} />
                Estado
              </Label>
              <select className="h-12 w-full rounded-2xl border border-border bg-secondary/50 px-4 font-semibold text-foreground focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option>Selecione…</option>
                <option>São Paulo</option>
                <option>Rio de Janeiro</option>
                <option>Minas Gerais</option>
              </select>
            </div>
            <div>
              <Label className="mb-2 flex items-center gap-2 font-display text-[14px] font-extrabold text-foreground">
                <MapPin className="h-4 w-4 text-muted-foreground" strokeWidth={2.8} />
                Cidade <span className="text-[11px] font-semibold text-muted-foreground">(Opcional)</span>
              </Label>
              <Input placeholder="Ex: São Paulo" className="h-12 rounded-2xl border-border bg-secondary/50 px-4 font-semibold focus-visible:bg-card" />
            </div>
          </div>

          <div className="mb-6 grid gap-5 md:grid-cols-2">
            <div>
              <Label className="mb-2 flex items-center gap-2 font-display text-[14px] font-extrabold text-foreground">
                <DollarSign className="h-4 w-4 text-primary" strokeWidth={2.8} />
                Preço Mínimo (R$)
              </Label>
              <Input type="number" placeholder="Ex: 2000" className="h-12 rounded-2xl border-border bg-secondary/50 px-4 font-semibold focus-visible:bg-card" />
            </div>
            <div>
              <Label className="mb-2 flex items-center gap-2 font-display text-[14px] font-extrabold text-foreground">
                <DollarSign className="h-4 w-4 text-primary" strokeWidth={2.8} />
                Preço Máximo (R$)
              </Label>
              <Input type="number" placeholder="Ex: 3500" className="h-12 rounded-2xl border-border bg-secondary/50 px-4 font-semibold focus-visible:bg-card" />
            </div>
          </div>

          <div className="mb-8 border-t border-border/60 pt-6">
            <Label className="mb-2 flex items-center gap-2 font-display text-[14px] font-extrabold text-foreground">
              <Target className="h-4 w-4 text-success" strokeWidth={2.8} />
              Preço de Revenda Alvo (R$) <span className="text-[11px] font-semibold text-muted-foreground">— Opcional</span>
            </Label>
            <Input type="number" placeholder="Ex: 4200" className="h-12 rounded-2xl border-border bg-secondary/50 px-4 font-semibold focus-visible:bg-card" />
            <p className="mt-2 text-[12px] text-muted-foreground">Usado para calcular automaticamente sua margem de lucro estimada.</p>
          </div>

          <Button className="h-14 w-full gap-2 rounded-2xl bg-primary font-display text-[15px] font-extrabold text-primary-foreground shadow-md hover:bg-primary-glow">
            <Sparkles className="h-4 w-4" strokeWidth={2.8} />
            Iniciar Mineração
          </Button>
        </form>

        <aside className="space-y-5">
          <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 p-6">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Info className="h-4 w-4" strokeWidth={2.8} />
              </div>
              <h3 className="font-display text-[15px] font-extrabold text-foreground">Limites do seu Plano</h3>
            </div>
            <div className="mb-3 flex items-center justify-between">
              <span className="font-display text-[13px] font-bold text-muted-foreground">Minerações Ativas</span>
              <span className="font-display text-[15px] font-extrabold text-foreground">2 / 50</span>
            </div>
            <div className="mb-4 h-2 overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-gradient-bold" style={{ width: '4%' }} />
            </div>
            <p className="text-[12.5px] leading-relaxed text-muted-foreground">
              Você ainda tem <span className="font-bold text-foreground">48 vagas</span> de mineração simultânea disponíveis.
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6">
            <h3 className="mb-3 font-display text-[15px] font-extrabold text-foreground">Como funciona?</h3>
            <ul className="space-y-3 text-[13px] text-muted-foreground">
              {[
                "Cada nova mineração custa 1 crédito",
                "Atualizações em tempo real sobre novos anúncios",
                "Notificações inteligentes por queda de preço",
                "Análise automática de margem e ROI",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </AppShell>
  );
};

export default NovaMineracao;
