import { Trash2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Section = ({ title, description, children }: any) => (
  <div className="rounded-lg border border-border bg-card">
    <div className="border-b border-border px-5 py-4">
      <h3 className="font-display text-[14px] font-extrabold text-foreground">{title}</h3>
      {description && <p className="mt-0.5 text-[12px] text-muted-foreground">{description}</p>}
    </div>
    <div className="p-5">{children}</div>
  </div>
);

const inputCls = "h-10 rounded-md border-border bg-card font-medium focus-visible:ring-1 focus-visible:ring-primary";

const Configuracoes = () => {
  return (
    <AppShell>
      <PageHeader title="Configurações" description="Sua conta, preferências e segurança." />

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Sticky nav + profile */}
        <aside className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-5 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-md bg-primary font-display text-[20px] font-extrabold text-primary-foreground">MC</div>
            <h3 className="mt-3 font-display text-[15px] font-extrabold text-foreground">Marina Costa</h3>
            <p className="text-[11.5px] text-muted-foreground">marina@garimpreco.app</p>
            <span className="mt-2 inline-block rounded bg-primary-soft px-2 py-0.5 font-display text-[10.5px] font-extrabold text-primary">Plano Pro</span>
          </div>
          <nav className="rounded-lg border border-border bg-card p-2">
            {["Perfil", "Segurança", "Preferências", "Faturamento", "Zona de perigo"].map((it, i) => (
              <a key={it} href="#" className={`block rounded-md px-3 py-2 text-[12.5px] font-extrabold ${
                i === 0 ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              }`}>{it}</a>
            ))}
          </nav>
        </aside>

        <div className="space-y-4">
          <Section title="Perfil" description="Atualize seus dados de contato.">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="mb-1.5 block font-display text-[11.5px] font-extrabold uppercase tracking-wider text-muted-foreground">Nome</Label>
                <Input defaultValue="Marina Costa" className={inputCls} />
              </div>
              <div>
                <Label className="mb-1.5 block font-display text-[11.5px] font-extrabold uppercase tracking-wider text-muted-foreground">E-mail</Label>
                <Input defaultValue="marina@garimpreco.app" className={inputCls} />
              </div>
              <div>
                <Label className="mb-1.5 block font-display text-[11.5px] font-extrabold uppercase tracking-wider text-muted-foreground">Telefone</Label>
                <Input defaultValue="(11) 99999-0000" className={inputCls} />
              </div>
              <div>
                <Label className="mb-1.5 block font-display text-[11.5px] font-extrabold uppercase tracking-wider text-muted-foreground">Cidade</Label>
                <Input defaultValue="São Paulo, SP" className={inputCls} />
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <Button className="h-9 rounded-md bg-primary px-4 font-display text-[12.5px] font-extrabold text-primary-foreground hover:bg-primary/90">Salvar</Button>
            </div>
          </Section>

          <Section title="Segurança" description="Mantenha sua conta protegida.">
            <div className="divide-y divide-border">
              {[
                { label: "Senha", desc: "Última alteração há 3 meses", action: "Alterar" },
                { label: "Autenticação em 2 fatores", desc: "Camada extra de segurança", action: "Ativar" },
                { label: "Sessões ativas", desc: "Conectada em 2 dispositivos", action: "Ver" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div>
                    <div className="font-display text-[13px] font-extrabold text-foreground">{item.label}</div>
                    <div className="text-[11.5px] text-muted-foreground">{item.desc}</div>
                  </div>
                  <Button variant="outline" className="h-8 rounded-md border-border font-display text-[12px] font-extrabold">{item.action}</Button>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Preferências">
            <div className="divide-y divide-border">
              {[
                { label: "Idioma", value: "Português (Brasil)" },
                { label: "Moeda", value: "Real (R$)" },
                { label: "Fuso horário", value: "GMT-3 São Paulo" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <span className="font-display text-[13px] font-extrabold text-foreground">{item.label}</span>
                  <span className="font-display text-[12.5px] font-extrabold text-muted-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </Section>

          <div className="rounded-lg border border-destructive/30 bg-card p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-destructive/10 text-destructive">
                <Trash2 className="h-4 w-4" strokeWidth={2.4} />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-[14px] font-extrabold text-foreground">Excluir conta</h3>
                <p className="mt-0.5 text-[12px] text-muted-foreground">Remove permanentemente seus dados, minerações e histórico.</p>
              </div>
              <Button variant="outline" className="h-9 rounded-md border-destructive/40 font-display text-[12.5px] font-extrabold text-destructive hover:bg-destructive hover:text-destructive-foreground">
                Excluir conta
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default Configuracoes;
