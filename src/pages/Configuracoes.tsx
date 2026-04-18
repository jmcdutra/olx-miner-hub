import { useEffect, useState, type ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, Lock, ShieldAlert, SlidersHorizontal, Trash2, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { InlineErrorState, PageErrorState, PageLoadingState } from "@/components/QueryStates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/modals/ConfirmDialog";
import { AlterarSenhaModal } from "@/components/modals/AlterarSenhaModal";
import { getErrorMessage } from "@/lib/api/get-error-message";
import { profileSchema, settingsPreferencesSchema, type ProfileFormData, type SettingsPreferencesFormData } from "@/lib/schemas";
import { usePlanosQuery, useProfileQuery, useSettingsQuery, useUpdateProfileMutation, useUpdateSettingsMutation } from "@/hooks/api";

const Section = ({ title, description, children }: { title: string; description?: string; children: ReactNode }) => (
  <div className="mb-6 overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm">
    <div className="border-b border-border/40 bg-secondary/10 px-6 py-5">
      <h3 className="text-[16px] font-bold text-foreground">{title}</h3>
      {description && <p className="mt-1 text-[13px] text-muted-foreground">{description}</p>}
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const inputCls = "h-11 rounded-xl border border-border/50 bg-secondary/20 px-3.5 text-[14px] font-medium text-foreground transition-colors hover:bg-secondary/40 focus:bg-background focus:border-primary/50 focus:ring-4 focus:ring-primary/10";
const fieldLabel = "mb-2 block text-[12px] font-semibold uppercase tracking-wider text-muted-foreground/80";

const Configuracoes = () => {
  const profileQuery = useProfileQuery();
  const settingsQuery = useSettingsQuery();
  const planosQuery = usePlanosQuery();
  const { data: profileData, isLoading: loadingProfile } = profileQuery;
  const { data: settingsData, isLoading: loadingSettings } = settingsQuery;
  const { data: planosData } = planosQuery;
  const updateProfileMutation = useUpdateProfileMutation();
  const updateSettingsMutation = useUpdateSettingsMutation();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirm2FA, setConfirm2FA] = useState(false);
  const [openSenha, setOpenSenha] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [activeTab, setActiveTab] = useState("Perfil");

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      location: "",
    },
  });

  const settingsForm = useForm<SettingsPreferencesFormData>({
    resolver: zodResolver(settingsPreferencesSchema),
    defaultValues: {
      idioma: "Português (Brasil)",
      moeda: "Real (R$)",
      fuso: "GMT-3 São Paulo",
    },
  });

  useEffect(() => {
    if (profileData?.profile) {
      profileForm.reset(profileData.profile);
    }
  }, [profileData, profileForm]);

  useEffect(() => {
    if (settingsData?.preferences) {
      settingsForm.reset(settingsData.preferences);
    }
  }, [settingsData, settingsForm]);

  const handleSavePerfil = profileForm.handleSubmit(async (values) => {
    await updateProfileMutation.mutateAsync(values);
    toast.success("Perfil atualizado com sucesso!");
  });

  const handleSaveSettings = settingsForm.handleSubmit(async (values) => {
    await updateSettingsMutation.mutateAsync(values);
    toast.success("Preferências atualizadas com sucesso!");
  });

  const navItems = [
    { name: "Perfil", icon: User },
    { name: "Segurança", icon: Lock },
    { name: "Preferências", icon: SlidersHorizontal },
    { name: "Faturamento", icon: CreditCard },
    { name: "Zona de Perigo", icon: ShieldAlert, danger: true },
  ];

  if (loadingProfile || loadingSettings) {
    return (
      <AppShell>
        <PageLoadingState title="Carregando configuracoes" description="Sincronizando perfil, preferencias e assinatura." />
      </AppShell>
    );
  }

  if (profileQuery.isError || settingsQuery.isError || !profileData || !settingsData) {
    return (
      <AppShell>
        <PageErrorState
          title="Nao foi possivel carregar as configuracoes"
          description="Perfil e preferencias nao puderam ser carregados."
          details={getErrorMessage(profileQuery.error ?? settingsQuery.error)}
          onRetry={() => {
            void Promise.all([profileQuery.refetch(), settingsQuery.refetch(), planosQuery.refetch()]);
          }}
        />
      </AppShell>
    );
  }

  const profile = profileData.profile;
  const currentPlan = planosData?.subscription;

  return (
    <AppShell>
      <PageHeader title="Configurações da Conta" description="Gerencie suas informações, preferências e segurança." />

      <div className="mt-2 grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-6">
          <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 text-center shadow-sm">
            <div className="absolute left-0 right-0 top-0 h-16 bg-gradient-to-r from-primary/10 to-primary/5" />
            <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-background bg-gradient-to-br from-primary to-primary/80 text-2xl font-bold text-primary-foreground shadow-md">
              {profile.name.split(" ").map((name) => name[0]).join("").slice(0, 2)}
            </div>
            <h3 className="mt-4 text-[16px] font-bold text-foreground">{profile.name}</h3>
            <p className="text-[13px] text-muted-foreground">{profile.email}</p>
            <div className="mt-3">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">
                Plano {currentPlan?.planName ?? "Pro"}
              </span>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => setActiveTab(item.name)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-[13.5px] font-semibold transition-all ${
                  activeTab === item.name
                    ? (item.danger ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary")
                    : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                }`}
              >
                <item.icon className="h-4.5 w-4.5" strokeWidth={2} />
                {item.name}
              </button>
            ))}
          </nav>

          <div className="border-t border-border/40 pt-4">
            <Button
              variant="ghost"
              onClick={() => setConfirmLogout(true)}
              className="h-10 w-full justify-start gap-2 rounded-xl text-[13.5px] font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              Sair da conta
            </Button>
          </div>
        </aside>

        <div className="space-y-6 pb-12">
          {activeTab === "Perfil" && (
            <Section title="Informações do Perfil" description="Estes dados serão usados para sua comunicação e faturamento.">
              <form onSubmit={handleSavePerfil}>
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <Label className={fieldLabel}>Nome Completo</Label>
                    <Input {...profileForm.register("name")} className={inputCls} />
                    {profileForm.formState.errors.name && <p className="mt-2 text-[12px] text-destructive">{profileForm.formState.errors.name.message}</p>}
                  </div>
                  <div>
                    <Label className={fieldLabel}>E-mail de Contato</Label>
                    <Input {...profileForm.register("email")} type="email" className={inputCls} />
                    {profileForm.formState.errors.email && <p className="mt-2 text-[12px] text-destructive">{profileForm.formState.errors.email.message}</p>}
                  </div>
                  <div>
                    <Label className={fieldLabel}>Telefone (WhatsApp)</Label>
                    <Input {...profileForm.register("phone")} className={inputCls} />
                    {profileForm.formState.errors.phone && <p className="mt-2 text-[12px] text-destructive">{profileForm.formState.errors.phone.message}</p>}
                  </div>
                  <div>
                    <Label className={fieldLabel}>Cidade / Estado</Label>
                    <Input {...profileForm.register("location")} className={inputCls} />
                    {profileForm.formState.errors.location && <p className="mt-2 text-[12px] text-destructive">{profileForm.formState.errors.location.message}</p>}
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <Button type="submit" className="h-11 rounded-xl bg-primary px-6 text-[14px] font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90" disabled={updateProfileMutation.isPending}>
                    Salvar Alterações
                  </Button>
                </div>
              </form>
            </Section>
          )}

          {activeTab === "Segurança" && (
            <Section title="Segurança & Acesso" description="Mantenha sua conta e minerações protegidas.">
              <div className="divide-y divide-border/40">
                {[
                  { label: "Senha de Acesso", desc: "Última alteração há 3 meses", action: "Alterar Senha", onClick: () => setOpenSenha(true) },
                  { label: "Autenticação em 2 Fatores (2FA)", desc: "Adicione uma camada extra de segurança", action: "Ativar 2FA", onClick: () => setConfirm2FA(true) },
                  { label: "Sessões Ativas", desc: "Você está conectado em 2 dispositivos", action: "Gerenciar", onClick: () => toast("2 sessões ativas no momento.") },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                    <div>
                      <div className="text-[14.5px] font-semibold text-foreground">{item.label}</div>
                      <div className="mt-0.5 text-[13px] text-muted-foreground">{item.desc}</div>
                    </div>
                    <Button variant="outline" onClick={item.onClick} className="h-9 rounded-lg border-border/60 text-[12.5px] font-semibold hover:bg-secondary">
                      {item.action}
                    </Button>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {activeTab === "Preferências" && (
            <Section title="Preferências Globais" description="Ajuste como a plataforma é exibida para você.">
              <form onSubmit={handleSaveSettings}>
                <div className="grid gap-5 md:grid-cols-3">
                  <div>
                    <Label className={fieldLabel}>Idioma da Interface</Label>
                    <select {...settingsForm.register("idioma")} className={`${inputCls} w-full appearance-none pr-10`}>
                      <option>Português (Brasil)</option>
                      <option>English (US)</option>
                      <option>Español</option>
                    </select>
                  </div>
                  <div>
                    <Label className={fieldLabel}>Moeda Padrão</Label>
                    <select {...settingsForm.register("moeda")} className={`${inputCls} w-full appearance-none`}>
                      <option>Real (R$)</option>
                      <option>Dólar (US$)</option>
                      <option>Euro (€)</option>
                    </select>
                  </div>
                  <div>
                    <Label className={fieldLabel}>Fuso Horário</Label>
                    <select {...settingsForm.register("fuso")} className={`${inputCls} w-full appearance-none`}>
                      <option>GMT-3 São Paulo</option>
                      <option>GMT-2 Fernando de Noronha</option>
                      <option>GMT-4 Manaus</option>
                    </select>
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <Button type="submit" className="h-11 rounded-xl bg-primary px-6 text-[14px] font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90" disabled={updateSettingsMutation.isPending}>
                    Salvar Preferências
                  </Button>
                </div>
              </form>
            </Section>
          )}

          {activeTab === "Faturamento" && (
            <Section title="Resumo de Faturamento" description="Dados sincronizados com a assinatura mockada do ambiente local.">
              {planosQuery.isError ? (
                <InlineErrorState
                  title="Nao foi possivel sincronizar a assinatura"
                  description={getErrorMessage(planosQuery.error)}
                  onRetry={() => {
                    void planosQuery.refetch();
                  }}
                />
              ) : null}
              <div className="grid gap-5 md:grid-cols-3">
                <div className="rounded-xl border border-border/50 bg-secondary/10 p-4">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">Plano atual</div>
                  <div className="mt-2 text-[18px] font-bold text-foreground">{currentPlan?.planName ?? "Pro"}</div>
                </div>
                <div className="rounded-xl border border-border/50 bg-secondary/10 p-4">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">Próxima cobrança</div>
                  <div className="mt-2 text-[18px] font-bold text-foreground">{currentPlan?.nextBillingDate ?? "29 Abr 2026"}</div>
                </div>
                <div className="rounded-xl border border-border/50 bg-secondary/10 p-4">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">Método</div>
                  <div className="mt-2 text-[18px] font-bold text-foreground">
                    {currentPlan?.paymentMethod.brand ?? "VISA"} •••• {currentPlan?.paymentMethod.last4 ?? "4242"}
                  </div>
                </div>
              </div>
            </Section>
          )}

          {activeTab === "Zona de Perigo" && (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 shadow-sm">
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                    <Trash2 className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-destructive">Excluir Conta Permanentemente</h3>
                    <p className="mt-1 max-w-md text-[13px] text-destructive/80">Ao fazer isso, todos os seus dados, minerações e histórico de faturamento serão removidos. Esta ação não pode ser desfeita.</p>
                  </div>
                </div>
                <Button onClick={() => setConfirmDelete(true)} className="mt-4 h-10 w-full rounded-xl bg-destructive text-[13px] font-semibold text-destructive-foreground hover:bg-destructive/90 sm:mt-0 sm:w-auto">
                  Excluir Minha Conta
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <AlterarSenhaModal open={openSenha} onOpenChange={setOpenSenha} />

      <ConfirmDialog
        open={confirm2FA}
        onOpenChange={setConfirm2FA}
        title="Ativar Autenticação em 2 Fatores?"
        description="Você precisará escanear um QR code com um app autenticador como Google Authenticator ou Authy."
        confirmLabel="Continuar para Ativação"
        onConfirm={() => {
          toast.success("2FA ativado com sucesso!");
        }}
      />

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Excluir sua conta permanentemente?"
        description="Todos os seus dados, minerações, favoritos e histórico serão removidos. Você perderá acesso imediatamente. Deseja continuar?"
        confirmLabel="Sim, excluir conta"
        destructive
        onConfirm={() => {
          toast.error("Conta excluída (modo demonstração)");
        }}
      />

      <ConfirmDialog
        open={confirmLogout}
        onOpenChange={setConfirmLogout}
        title="Encerrar sessão?"
        description="Você precisará fazer login novamente para acessar seus dados."
        confirmLabel="Sair da Conta"
        onConfirm={() => {
          toast.success("Você saiu da conta.");
        }}
      />
    </AppShell>
  );
};

export default Configuracoes;
