import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/modals/ConfirmDialog";
import { AlterarSenhaModal } from "@/components/modals/AlterarSenhaModal";

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
const fieldLabel = "mb-1.5 block font-display text-[11.5px] font-extrabold uppercase tracking-wider text-muted-foreground";

const Configuracoes = () => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirm2FA, setConfirm2FA] = useState(false);
  const [openSenha, setOpenSenha] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [prefs, setPrefs] = useState({
    idioma: "Português (Brasil)",
    moeda: "Real (R$)",
    fuso: "GMT-3 São Paulo",
  });

  const handleSavePerfil = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Perfil atualizado");
  };

  return (
    <AppShell>
      <PageHeader title="Configurações" description="Sua conta, preferências e segurança." />

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
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
          <Button
            variant="outline"
            onClick={() => setConfirmLogout(true)}
            className="h-9 w-full rounded-md border-border font-display text-[12.5px] font-extrabold"
          >
            Sair da conta
          </Button>
        </aside>

        <div className="space-y-4">
          <Section title="Perfil" description="Atualize seus dados de contato.">
            <form onSubmit={handleSavePerfil}>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className={fieldLabel}>Nome</Label>
                  <Input defaultValue="Marina Costa" className={inputCls} />
                </div>
                <div>
                  <Label className={fieldLabel}>E-mail</Label>
                  <Input defaultValue="marina@garimpreco.app" className={inputCls} />
                </div>
                <div>
                  <Label className={fieldLabel}>Telefone</Label>
                  <Input defaultValue="(11) 99999-0000" className={inputCls} />
                </div>
                <div>
                  <Label className={fieldLabel}>Cidade</Label>
                  <Input defaultValue="São Paulo, SP" className={inputCls} />
                </div>
              </div>
              <div className="mt-5 flex justify-end">
                <Button type="submit" className="h-9 rounded-md bg-primary px-4 font-display text-[12.5px] font-extrabold text-primary-foreground hover:bg-primary/90">Salvar</Button>
              </div>
            </form>
          </Section>

          <Section title="Segurança" description="Mantenha sua conta protegida.">
            <div className="divide-y divide-border">
              {[
                { label: "Senha", desc: "Última alteração há 3 meses", action: "Alterar", onClick: () => setOpenSenha(true) },
                { label: "Autenticação em 2 fatores", desc: "Camada extra de segurança", action: "Ativar", onClick: () => setConfirm2FA(true) },
                { label: "Sessões ativas", desc: "Conectada em 2 dispositivos", action: "Ver", onClick: () => toast("2 sessões: Chrome (SP) · iOS App") },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div>
                    <div className="font-display text-[13px] font-extrabold text-foreground">{item.label}</div>
                    <div className="text-[11.5px] text-muted-foreground">{item.desc}</div>
                  </div>
                  <Button variant="outline" onClick={item.onClick} className="h-8 rounded-md border-border font-display text-[12px] font-extrabold">{item.action}</Button>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Preferências">
            <div className="grid gap-3 md:grid-cols-3">
              <div>
                <Label className={fieldLabel}>Idioma</Label>
                <select value={prefs.idioma} onChange={(e) => { setPrefs({ ...prefs, idioma: e.target.value }); toast.success("Idioma atualizado"); }} className={`${inputCls} w-full px-3 text-[13px]`}>
                  <option>Português (Brasil)</option>
                  <option>English (US)</option>
                  <option>Español</option>
                </select>
              </div>
              <div>
                <Label className={fieldLabel}>Moeda</Label>
                <select value={prefs.moeda} onChange={(e) => { setPrefs({ ...prefs, moeda: e.target.value }); toast.success("Moeda atualizada"); }} className={`${inputCls} w-full px-3 text-[13px]`}>
                  <option>Real (R$)</option>
                  <option>Dólar (US$)</option>
                  <option>Euro (€)</option>
                </select>
              </div>
              <div>
                <Label className={fieldLabel}>Fuso horário</Label>
                <select value={prefs.fuso} onChange={(e) => { setPrefs({ ...prefs, fuso: e.target.value }); toast.success("Fuso atualizado"); }} className={`${inputCls} w-full px-3 text-[13px]`}>
                  <option>GMT-3 São Paulo</option>
                  <option>GMT-2 Fernando de Noronha</option>
                  <option>GMT-4 Manaus</option>
                </select>
              </div>
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
              <Button variant="outline" onClick={() => setConfirmDelete(true)} className="h-9 rounded-md border-destructive/40 font-display text-[12.5px] font-extrabold text-destructive hover:bg-destructive hover:text-destructive-foreground">
                Excluir conta
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AlterarSenhaModal open={openSenha} onOpenChange={setOpenSenha} />
      <ConfirmDialog
        open={confirm2FA}
        onOpenChange={setConfirm2FA}
        title="Ativar autenticação em 2 fatores?"
        description="Você precisará escanear um QR code com um app autenticador (Google Authenticator, 1Password, etc)."
        confirmLabel="Ativar 2FA"
        onConfirm={() => { toast.success("2FA ativado (demo)"); }}
      />
      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Excluir sua conta permanentemente?"
        description="Todos os seus dados, minerações, favoritos e histórico serão removidos. Não dá pra desfazer."
        confirmLabel="Sim, excluir minha conta"
        destructive
        onConfirm={() => { toast.success("Conta marcada para exclusão (demo)"); }}
      />
      <ConfirmDialog
        open={confirmLogout}
        onOpenChange={setConfirmLogout}
        title="Sair da conta?"
        description="Você precisará entrar novamente para acessar suas minerações."
        confirmLabel="Sair"
        onConfirm={() => { toast.success("Você saiu da conta (demo)"); }}
      />
    </AppShell>
  );
};

export default Configuracoes;
