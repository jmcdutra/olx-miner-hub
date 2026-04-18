import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Check, Search, MapPin, Target, Sparkles, ArrowRight, ArrowLeft, Loader2, Play } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { InlineErrorState, SectionLoadingState } from "@/components/QueryStates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createMineracaoSchema, type CreateMineracaoFormData, type CreateMineracaoFormInput } from "@/lib/schemas";
import { useAnunciosQuery, useCreateMineracaoMutation } from "@/hooks/api";
import { getErrorMessage } from "@/lib/api/get-error-message";

interface NovaMineracaoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const inputCls = "h-12 rounded-xl border border-border/50 bg-secondary/20 px-4 text-[14.5px] font-medium transition-colors hover:bg-secondary/40 focus:bg-background focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/10";
const labelCls = "mb-2 block text-[13px] font-bold text-foreground";

const defaultValues: CreateMineracaoFormInput = {
  produto: "",
  categoria: "Smartphones",
  estado: "São Paulo (SP)",
  cidade: "",
  plataformas: ["OLX", "Mercado Livre"],
  precoMin: "",
  precoMax: "",
  precoAlvo: "",
};

export const NovaMineracaoModal = ({ open, onOpenChange }: NovaMineracaoModalProps) => {
  const [step, setStep] = useState(1);
  const [isSimulating, setIsSimulating] = useState(false);
  const form = useForm<CreateMineracaoFormInput, unknown, CreateMineracaoFormData>({
    resolver: zodResolver(createMineracaoSchema),
    defaultValues,
  });
  const anunciosQuery = useAnunciosQuery();
  const { data: anuncios } = anunciosQuery;
  const createMutation = useCreateMineracaoMutation();
  const values = form.watch();

  const resetState = () => {
    setStep(1);
    setIsSimulating(false);
    form.reset(defaultValues);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      setTimeout(resetState, 150);
    }
  };

  const togglePlataforma = (platform: string) => {
    const current = values.plataformas ?? [];
    const next = current.includes(platform)
      ? current.filter((item) => item !== platform)
      : [...current, platform];

    form.setValue("plataformas", next, { shouldValidate: true, shouldDirty: true });
  };

  const handleNext = async () => {
    if (step === 1) {
      const isValid = await form.trigger(["produto", "categoria"]);
      if (!isValid) {
        toast.error(form.formState.errors.produto?.message ?? "Digite o nome do produto.");
        return;
      }
    }

    if (step === 2) {
      const isValid = await form.trigger(["estado", "plataformas"]);
      if (!isValid) {
        toast.error(form.formState.errors.plataformas?.message ?? "Selecione ao menos uma plataforma.");
        return;
      }
    }

    if (step === 3) {
      const isValid = await form.trigger(["precoMax", "precoMin", "precoAlvo"]);
      if (!isValid) {
        toast.error(form.formState.errors.precoMax?.message ?? "Defina um preço máximo.");
        return;
      }

      setIsSimulating(true);
      setTimeout(() => {
        setIsSimulating(false);
        setStep(4);
      }, 1200);
      return;
    }

    setStep((current) => current + 1);
  };

  const previewAds = useMemo(() => {
    const query = values.produto.trim().toLowerCase();
    const items = anuncios ?? [];
    if (!query) return items.slice(0, 3);

    const filtered = items.filter((item) => item.titulo.toLowerCase().includes(query));
    return (filtered.length > 0 ? filtered : items).slice(0, 3);
  }, [anuncios, values.produto]);

  const handleCreate = form.handleSubmit(async (payload) => {
    const mineracao = await createMutation.mutateAsync(payload);
    toast.success("Mineração criada com sucesso!", {
      description: `${mineracao.titulo} já entrou no radar do robô.`,
    });
    handleOpenChange(false);
  });

  const steps = ["Produto", "Região", "Valores", "Preview"];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto border-border/60 bg-background p-0 shadow-2xl sm:max-w-4xl">
        <div className="p-6 md:p-8">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8">
              <h1 className="mb-6 text-2xl font-bold text-foreground">Criar nova Mineração</h1>
              <div className="relative flex items-center justify-between">
                <div className="absolute left-0 top-1/2 -z-10 h-1 w-full -translate-y-1/2 rounded-full bg-secondary" />
                <div
                  className="absolute left-0 top-1/2 -z-10 h-1 -translate-y-1/2 rounded-full bg-primary transition-all duration-500 ease-in-out"
                  style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
                />

                {steps.map((label, idx) => {
                  const num = idx + 1;
                  const isActive = step === num;
                  const isPassed = step > num;

                  return (
                    <div key={label} className="flex flex-col items-center gap-2">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors duration-300 ${
                          isPassed
                            ? "border-primary bg-primary text-primary-foreground"
                            : isActive
                              ? "border-primary bg-background text-primary shadow-[0_0_0_4px_hsl(var(--primary)/0.1)]"
                              : "border-border bg-background text-muted-foreground"
                        }`}
                      >
                        {isPassed ? <Check className="h-4 w-4" strokeWidth={3} /> : <span className="text-[13px] font-bold">{num}</span>}
                      </div>
                      <span className={`hidden text-[11px] font-bold uppercase tracking-wider sm:block ${isActive ? "text-primary" : isPassed ? "text-foreground" : "text-muted-foreground"}`}>
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex min-h-[400px] flex-col overflow-hidden rounded-3xl border border-border/50 bg-card shadow-sm">
              <div className="flex-1 p-6 md:p-8">
                {step === 1 && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="mb-6">
                      <h2 className="flex items-center gap-2 text-xl font-bold text-foreground"><Search className="h-5 w-5 text-primary" /> O que o robô deve buscar?</h2>
                      <p className="mt-1 text-[14px] text-muted-foreground">Seja específico no nome para evitar anúncios irrelevantes nos seus alertas.</p>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <Label className={labelCls}>Nome exato do produto <span className="text-destructive">*</span></Label>
                        <Input
                          placeholder="Ex: iPhone 13 Pro Max 256GB"
                          {...form.register("produto")}
                          className={inputCls}
                          autoFocus
                        />
                        {form.formState.errors.produto && <p className="mt-2 text-[12px] text-destructive">{form.formState.errors.produto.message}</p>}
                      </div>
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div>
                          <Label className={labelCls}>Categoria</Label>
                          <select {...form.register("categoria")} className={`${inputCls} w-full cursor-pointer`}>
                            <option>Smartphones</option>
                            <option>Eletrônicos</option>
                            <option>Notebooks</option>
                            <option>Veículos</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="mb-6">
                      <h2 className="flex items-center gap-2 text-xl font-bold text-foreground"><MapPin className="h-5 w-5 text-primary" /> Onde devemos procurar?</h2>
                      <p className="mt-1 text-[14px] text-muted-foreground">Selecione as plataformas e a região que você quer cobrir.</p>
                    </div>

                    <div className="space-y-8">
                      <div>
                        <Label className={labelCls}>Plataformas ativas</Label>
                        <div className="mt-3 flex flex-wrap gap-3">
                          {["OLX", "Mercado Livre", "Facebook", "Enjoei"].map((platform) => {
                            const ativo = (values.plataformas ?? []).includes(platform);
                            return (
                              <button
                                key={platform}
                                type="button"
                                onClick={() => togglePlataforma(platform)}
                                className={`flex items-center gap-2 rounded-xl border px-5 py-3 text-[14px] font-bold transition-all ${
                                  ativo ? "border-primary bg-primary/10 text-primary shadow-sm" : "border-border/60 bg-secondary/30 text-muted-foreground hover:border-border hover:bg-secondary/60"
                                }`}
                              >
                                <div className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${ativo ? "border-primary bg-primary" : "border-muted-foreground/50"}`}>
                                  {ativo && <div className="h-1.5 w-1.5 rounded-full bg-background" />}
                                </div>
                                {platform}
                              </button>
                            );
                          })}
                        </div>
                        {form.formState.errors.plataformas && <p className="mt-2 text-[12px] text-destructive">{form.formState.errors.plataformas.message}</p>}
                      </div>

                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div>
                          <Label className={labelCls}>Estado (UF)</Label>
                          <select {...form.register("estado")} className={`${inputCls} w-full cursor-pointer`}>
                            <option>São Paulo (SP)</option>
                            <option>Rio de Janeiro (RJ)</option>
                            <option>Minas Gerais (MG)</option>
                            <option>Brasil todo</option>
                          </select>
                        </div>
                        <div>
                          <Label className={labelCls}>Cidade (Opcional)</Label>
                          <Input placeholder="Ex: Campinas" {...form.register("cidade")} className={inputCls} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                    {isSimulating ? (
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary" />
                        <h2 className="text-xl font-bold text-foreground">Testando filtros...</h2>
                        <p className="mt-2 text-muted-foreground">Buscando exemplos reais nas plataformas selecionadas.</p>
                      </div>
                    ) : (
                      <>
                        <div className="mb-6">
                          <h2 className="flex items-center gap-2 text-xl font-bold text-foreground"><Target className="h-5 w-5 text-primary" /> Estratégia de Preço</h2>
                          <p className="mt-1 text-[14px] text-muted-foreground">Defina seu teto de compra. Você só será notificado de anúncios abaixo desse valor.</p>
                        </div>

                        <div className="space-y-6">
                          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div>
                              <Label className={labelCls}>Preço Máximo de Compra <span className="text-destructive">*</span></Label>
                              <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[15px] font-bold text-muted-foreground">R$</span>
                                <Input type="number" placeholder="3500" {...form.register("precoMax")} className={`${inputCls} pl-12 text-lg font-bold`} />
                              </div>
                              <p className="mt-2 text-[12px] text-muted-foreground">Acima desse valor, o robô ignora.</p>
                              {form.formState.errors.precoMax && <p className="mt-2 text-[12px] text-destructive">{form.formState.errors.precoMax.message}</p>}
                            </div>

                            <div>
                              <Label className={labelCls}>Sua Meta de Revenda</Label>
                              <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[15px] font-bold text-muted-foreground">R$</span>
                                <Input type="number" placeholder="4200" {...form.register("precoAlvo")} className={`${inputCls} pl-12 text-lg font-bold`} />
                              </div>
                              <p className="mt-2 text-[12px] text-muted-foreground">Para calcularmos seu lucro estimado.</p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {step === 4 && (
                  <div className="animate-in fade-in zoom-in-95 duration-500">
                    <div className="mb-6 flex flex-col items-center text-center">
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
                        <Sparkles className="h-8 w-8" />
                      </div>
                      <h2 className="text-2xl font-bold text-foreground">Filtros validados!</h2>
                      <p className="mt-2 max-w-lg text-[14.5px] text-muted-foreground">
                        Baseado nas suas configurações de <strong>{values.produto}</strong> em <strong>{values.estado}</strong>, aqui estão alguns exemplos de anúncios que nosso robô vai capturar para você:
                      </p>
                    </div>

                    {anunciosQuery.isLoading ? (
                      <SectionLoadingState lines={3} />
                    ) : anunciosQuery.isError ? (
                      <div className="mt-6">
                        <InlineErrorState title="Nao foi possivel gerar o preview" description={getErrorMessage(anunciosQuery.error)} onRetry={() => { void anunciosQuery.refetch(); }} />
                      </div>
                    ) : (
                    <div className="mt-8 grid gap-3 sm:grid-cols-3">
                      {previewAds.map((ad, index) => (
                        <div key={ad.id} className="pointer-events-none flex flex-col rounded-xl border border-border/50 bg-secondary/10 p-3">
                          <div className="relative mb-3 aspect-[4/3] w-full overflow-hidden rounded-lg bg-secondary">
                            <img src={ad.capa} alt="" className="h-full w-full object-cover" />
                            <span className={`absolute left-2 top-2 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white ${
                              ad.plataforma === "OLX" ? "bg-purple-600" : "bg-[#fff159] !text-[#2d3277]"
                            }`}>
                              {ad.plataforma}
                            </span>
                          </div>
                          <div className="text-[16px] font-bold text-foreground">
                            R$ {(Number(values.precoMax || 3000) * (1 - index * 0.1)).toLocaleString("pt-BR")}
                          </div>
                          <div className="mt-1 line-clamp-2 text-[12px] font-semibold leading-tight text-muted-foreground">
                            {values.produto} {ad.titulo.split(" ").slice(-2).join(" ")}
                          </div>
                        </div>
                      ))}
                    </div>
                    )}

                    <div className="mt-8 rounded-xl border border-primary/20 bg-primary/10 p-4 text-center">
                      <p className="text-[14px] font-bold text-primary">Ao criar a mineração, o robô trabalhará 24h por dia para encontrar anúncios como estes.</p>
                    </div>
                  </div>
                )}
              </div>

              {!isSimulating && (
                <div className="flex items-center justify-between border-t border-border/40 bg-secondary/10 px-6 py-4 md:px-8">
                  {step > 1 ? (
                    <Button variant="ghost" onClick={() => setStep((current) => current - 1)} className="rounded-xl font-bold text-muted-foreground hover:text-foreground">
                      <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                    </Button>
                  ) : (
                    <Button variant="ghost" onClick={() => handleOpenChange(false)} className="rounded-xl font-bold text-muted-foreground hover:text-foreground">
                      Cancelar
                    </Button>
                  )}

                  {step < 4 ? (
                    <Button onClick={handleNext} className="h-11 rounded-xl bg-foreground px-6 font-bold text-background shadow-sm hover:bg-foreground/90">
                      {step === 3 ? "Testar Filtros" : "Avançar"} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button onClick={handleCreate} className="h-11 rounded-xl bg-primary px-8 font-bold text-primary-foreground shadow-md hover:bg-primary/90" disabled={createMutation.isPending}>
                      <Play className="mr-2 h-4 w-4" fill="currentColor" /> Criar Mineração (1 Crédito)
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
