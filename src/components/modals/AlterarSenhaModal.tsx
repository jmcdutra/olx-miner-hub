import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface AlterarSenhaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const inputCls = "h-10 rounded-md border-border bg-card font-medium focus-visible:ring-1 focus-visible:ring-primary";
const fieldLabel = "mb-1.5 block font-display text-[11.5px] font-extrabold uppercase tracking-wider text-muted-foreground";

export const AlterarSenhaModal = ({ open, onOpenChange }: AlterarSenhaModalProps) => {
  const [loading, setLoading] = useState(false);
  const [atual, setAtual] = useState("");
  const [nova, setNova] = useState("");
  const [conf, setConf] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!atual || !nova || !conf) return toast.error("Preencha todos os campos");
    if (nova.length < 8) return toast.error("Senha precisa ter ao menos 8 caracteres");
    if (nova !== conf) return toast.error("As senhas não conferem");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onOpenChange(false);
      setAtual(""); setNova(""); setConf("");
      toast.success("Senha alterada com sucesso");
    }, 700);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-[18px] font-extrabold">Alterar senha</DialogTitle>
          <DialogDescription className="text-[12.5px] text-muted-foreground">
            Use uma senha forte de no mínimo 8 caracteres.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label className={fieldLabel}>Senha atual</Label>
            <Input type="password" value={atual} onChange={(e) => setAtual(e.target.value)} className={inputCls} autoFocus />
          </div>
          <div>
            <Label className={fieldLabel}>Nova senha</Label>
            <Input type="password" value={nova} onChange={(e) => setNova(e.target.value)} className={inputCls} />
          </div>
          <div>
            <Label className={fieldLabel}>Confirmar nova senha</Label>
            <Input type="password" value={conf} onChange={(e) => setConf(e.target.value)} className={inputCls} />
          </div>

          <DialogFooter className="gap-2 pt-2 sm:gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="h-9 rounded-md border-border font-display text-[12.5px] font-extrabold">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="h-9 rounded-md bg-primary px-4 font-display text-[12.5px] font-extrabold text-primary-foreground hover:bg-primary/90">
              {loading ? "Salvando…" : "Salvar nova senha"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
