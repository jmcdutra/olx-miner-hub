import { User, Mail, Lock, Bell, CreditCard, Globe, Trash2, Shield } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SettingsCard = ({ icon: Icon, title, description, children }: any) => (
  <div className="rounded-3xl border border-border bg-card p-7">
    <div className="mb-6 flex items-start gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" strokeWidth={2.6} />
      </div>
      <div>
        <h3 className="font-display text-[18px] font-extrabold text-foreground">{title}</h3>
        <p className="mt-1 text-[13px] text-muted-foreground">{description}</p>
      </div>
    </div>
    {children}
  </div>
);

const Configuracoes = () => {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Sua conta"
        title="Configurações"
        description="Gerencie sua conta, preferências e segurança."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        {/* Profile */}
        <div className="rounded-3xl border border-border bg-card p-7">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-bold font-display text-[28px] font-extrabold text-white">
              MC
            </div>
            <h3 className="font-display text-[20px] font-extrabold text-foreground">Marina Costa</h3>
            <p className="text-[13px] text-muted-foreground">marina@garimpreco.app</p>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 font-display text-[11px] font-extrabold text-primary">
              <Shield className="h-3 w-3" strokeWidth={2.8} />
              Plano Pro
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-2 border-t border-border/60 pt-6 text-center">
            <div>
              <div className="font-display text-[18px] font-extrabold text-foreground">12</div>
              <div className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">Minerações</div>
            </div>
            <div>
              <div className="font-display text-[18px] font-extrabold text-foreground">847</div>
              <div className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">Anúncios</div>
            </div>
            <div>
              <div className="font-display text-[18px] font-extrabold text-foreground">R$8k</div>
              <div className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">Lucro</div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <SettingsCard icon={User} title="Informações pessoais" description="Atualize seus dados de contato.">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="mb-2 font-display text-[12px] font-extrabold text-foreground">Nome completo</Label>
                <Input defaultValue="Marina Costa" className="h-11 rounded-xl border-border bg-secondary/40" />
              </div>
              <div>
                <Label className="mb-2 font-display text-[12px] font-extrabold text-foreground">E-mail</Label>
                <Input defaultValue="marina@garimpreco.app" className="h-11 rounded-xl border-border bg-secondary/40" />
              </div>
              <div>
                <Label className="mb-2 font-display text-[12px] font-extrabold text-foreground">Telefone</Label>
                <Input defaultValue="(11) 99999-0000" className="h-11 rounded-xl border-border bg-secondary/40" />
              </div>
              <div>
                <Label className="mb-2 font-display text-[12px] font-extrabold text-foreground">Cidade</Label>
                <Input defaultValue="São Paulo, SP" className="h-11 rounded-xl border-border bg-secondary/40" />
              </div>
            </div>
            <Button className="mt-5 h-10 rounded-xl bg-primary px-5 font-display text-[13px] font-extrabold text-primary-foreground">Salvar alterações</Button>
          </SettingsCard>

          <SettingsCard icon={Lock} title="Segurança" description="Mantenha sua conta protegida.">
            <div className="space-y-3">
              {[
                { label: "Alterar senha", desc: "Última alteração há 3 meses", action: "Alterar" },
                { label: "Autenticação em 2 fatores", desc: "Camada extra de segurança", action: "Ativar" },
                { label: "Sessões ativas", desc: "Você está conectada em 2 dispositivos", action: "Ver" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between rounded-2xl bg-secondary/40 p-4">
                  <div>
                    <div className="font-display text-[13.5px] font-extrabold text-foreground">{item.label}</div>
                    <div className="text-[12px] text-muted-foreground">{item.desc}</div>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-lg border-border font-display text-[12px] font-extrabold">{item.action}</Button>
                </div>
              ))}
            </div>
          </SettingsCard>

          <SettingsCard icon={Globe} title="Preferências" description="Personalize sua experiência.">
            <div className="space-y-4">
              {[
                { label: "Idioma", value: "Português (Brasil)" },
                { label: "Moeda", value: "Real (R$)" },
                { label: "Fuso horário", value: "GMT-3 São Paulo" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between border-b border-border/60 pb-3 last:border-b-0 last:pb-0">
                  <span className="font-display text-[13.5px] font-bold text-foreground">{item.label}</span>
                  <span className="font-display text-[13px] font-extrabold text-primary">{item.value}</span>
                </div>
              ))}
            </div>
          </SettingsCard>

          <div className="rounded-3xl border border-destructive/20 bg-destructive/5 p-7">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                <Trash2 className="h-5 w-5" strokeWidth={2.6} />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-[18px] font-extrabold text-foreground">Zona de perigo</h3>
                <p className="mt-1 text-[13px] text-muted-foreground">Excluir permanentemente sua conta e todos os dados associados.</p>
                <Button variant="outline" className="mt-4 h-10 rounded-xl border-destructive/40 bg-card font-display text-[13px] font-extrabold text-destructive hover:bg-destructive hover:text-destructive-foreground">
                  Excluir minha conta
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default Configuracoes;
