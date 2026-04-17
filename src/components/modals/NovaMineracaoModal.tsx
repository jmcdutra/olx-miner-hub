import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface NovaMineracaoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const inputCls = "h-10 rounded-md border-border bg-card font-medium focus-visible:ring-1 focus-visible:ring-primary";
const fieldLabel = "mb-1.5 block font-display text-[11.5px] font-extrabold uppercase tracking-wider text-muted-foreground";

export const NovaMineracaoModal = ({ open, onOpenChange }: NovaMineracaoModalProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [titulo, setTitulo] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) {
      toast.error("Informe o produto que quer minerar");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onOpenChange(false);
      toast.success("Mineração criada", {
        description: `Já estamos garimpando "${titulo}" para você.`,
      });
      setTitulo("");
      navigate("/");
    }, 700);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-[18px] font-extrabold">Nova mineração</DialogTitle>
          <DialogDescription className="text-[12.5px] text-muted-foreground">
            Custo: 1 crédito mensal enquanto a mineração estiver ativa.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className={fieldLabel}>O que minerar?</Label>
            <Input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: iPhone 13 Pro Max 256GB"
              className={inputCls}
              autoFocus
            />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <Label className={fieldLabel}>Estado</Label>
              <select className={`${inputCls} w-full px-3 text-[13.5px]`}>
                <option>São Paulo</option>
                <option>Rio de Janeiro</option>
                <option>Minas Gerais</option>
                <option>Paraná</option>
              </select>
            </div>
            <div>
              <Label className={fieldLabel}>Cidade (opcional)</Label>
              <Input placeholder="Ex: São Paulo" className={inputCls} />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <Label className={fieldLabel}>Preço mín. (R$)</Label>
              <Input type="number" placeholder="2000" className={inputCls} />
            </div>
            <div>
              <Label className={fieldLabel}>Preço máx. (R$)</Label>
              <Input type="number" placeholder="3500" className={inputCls} />
            </div>
            <div>
              <Label className={fieldLabel}>Alvo revenda</Label>
              <Input type="number" placeholder="4200" className={inputCls} />
            </div>
          </div>

          <div className="rounded-md bg-secondary/60 p-3 text-[12px] text-muted-foreground">
            <span className="font-extrabold text-foreground">Plataformas:</span> OLX e Mercado Livre (incluídas).
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-9 rounded-md border-border font-display text-[12.5px] font-extrabold"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="h-9 rounded-md bg-primary px-4 font-display text-[12.5px] font-extrabold text-primary-foreground hover:bg-primary/90"
            >
              {loading ? "Criando…" : "Criar mineração (1 crédito)"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
