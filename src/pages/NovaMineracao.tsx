import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Field = ({ label, hint, children }: any) => (
  <div>
    <Label className="mb-1.5 block font-display text-[11.5px] font-extrabold uppercase tracking-wider text-muted-foreground">{label}</Label>
    {children}
    {hint && <p className="mt-1 text-[11.5px] text-muted-foreground">{hint}</p>}
  </div>
);

const inputCls = "h-10 rounded-md border-border bg-card font-medium focus-visible:ring-1 focus-visible:ring-primary";

const NovaMineracao = () => {
  return (
    <AppShell>
      <Link to="/" className="mb-4 inline-flex items-center gap-1 text-[12.5px] font-extrabold text-muted-foreground hover:text-primary">
        <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2.6} />
        Minerações
      </Link>

      <div className="mb-6">
        <h1 className="font-display text-[26px] font-extrabold text-foreground">Nova mineração</h1>
        <p className="mt-1 text-[13.5px] text-muted-foreground">Configure os filtros do produto que você quer monitorar.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <form className="rounded-lg border border-border bg-card divide-y divide-border">
          <div className="p-5">
            <h2 className="mb-4 font-display text-[14px] font-extrabold text-foreground">Produto</h2>
            <div className="space-y-4">
              <Field label="O que você quer minerar?" hint="Seja específico para resultados melhores.">
                <Input placeholder="Ex: iPhone 13 Pro Max 256GB" className={inputCls} />
              </Field>
              <Field label="Categoria">
                <select className={`${inputCls} w-full px-3 text-[13.5px]`}>
                  <option>Celulares</option>
                  <option>Notebooks</option>
                  <option>Games</option>
                  <option>Carros</option>
                </select>
              </Field>
            </div>
          </div>

          <div className="p-5">
            <h2 className="mb-4 font-display text-[14px] font-extrabold text-foreground">Localização</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Estado">
                <select className={`${inputCls} w-full px-3 text-[13.5px]`}>
                  <option>São Paulo</option>
                  <option>Rio de Janeiro</option>
                  <option>Minas Gerais</option>
                </select>
              </Field>
              <Field label="Cidade (opcional)">
                <Input placeholder="Ex: São Paulo" className={inputCls} />
              </Field>
            </div>
          </div>

          <div className="p-5">
            <h2 className="mb-4 font-display text-[14px] font-extrabold text-foreground">Faixa de preço</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Mínimo (R$)">
                <Input type="number" placeholder="2000" className={inputCls} />
              </Field>
              <Field label="Máximo (R$)">
                <Input type="number" placeholder="3500" className={inputCls} />
              </Field>
            </div>
            <div className="mt-4">
              <Field label="Preço alvo de revenda (opcional)" hint="Usado para calcular sua margem estimada automaticamente.">
                <Input type="number" placeholder="4200" className={inputCls} />
              </Field>
            </div>
          </div>

          <div className="p-5">
            <h2 className="mb-4 font-display text-[14px] font-extrabold text-foreground">Plataformas</h2>
            <div className="flex flex-wrap gap-2">
              {["OLX", "Mercado Livre", "Facebook Marketplace"].map((p, i) => (
                <label key={p} className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-[12.5px] font-extrabold ${
                  i < 2 ? "border-primary bg-primary-soft text-primary" : "border-border bg-card text-muted-foreground"
                }`}>
                  <input type="checkbox" defaultChecked={i < 2} className="h-3.5 w-3.5 accent-primary" />
                  {p}
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-5">
            <div className="text-[12px] text-muted-foreground">Custo: <span className="font-extrabold text-foreground">1 crédito</span></div>
            <div className="flex gap-2">
              <Button variant="outline" className="h-10 rounded-md border-border font-display text-[12.5px] font-extrabold">Cancelar</Button>
              <Button className="h-10 rounded-md bg-primary px-5 font-display text-[12.5px] font-extrabold text-primary-foreground hover:bg-primary/90">
                Iniciar mineração
              </Button>
            </div>
          </div>
        </form>

        <aside className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="font-display text-[13px] font-extrabold text-foreground">Limites do plano Pro</h3>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-[12px] font-medium text-muted-foreground">Minerações ativas</span>
              <span className="font-display text-[14px] font-extrabold text-foreground price">2 / 50</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-primary" style={{ width: "4%" }} />
            </div>
            <p className="mt-2 text-[11.5px] text-muted-foreground">48 vagas disponíveis.</p>
          </div>

          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="font-display text-[13px] font-extrabold text-foreground">Como funciona</h3>
            <ol className="mt-3 space-y-2 text-[12.5px] text-foreground/80">
              {[
                "Configure os filtros do produto",
                "Garimpamos OLX e Mercado Livre 24/7",
                "Você recebe alertas de oportunidades",
                "Compre, revenda e lucre",
              ].map((s, i) => (
                <li key={i} className="flex gap-2">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary font-display text-[10px] font-extrabold text-primary-foreground">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
    </AppShell>
  );
};

export default NovaMineracao;
