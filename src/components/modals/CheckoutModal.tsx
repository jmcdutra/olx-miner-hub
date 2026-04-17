import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock, CreditCard } from "lucide-react";

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  itemLabel: string;
  amount: string;
  ctaLabel?: string;
  onSuccess?: () => void;
}

const inputCls = "h-10 rounded-md border-border bg-card font-medium focus-visible:ring-1 focus-visible:ring-primary";
const fieldLabel = "mb-1.5 block font-display text-[11.5px] font-extrabold uppercase tracking-wider text-muted-foreground";

export const CheckoutModal = ({
  open,
  onOpenChange,
  title,
  description,
  itemLabel,
  amount,
  ctaLabel = "Pagar agora",
  onSuccess,
}: CheckoutModalProps) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onOpenChange(false);
      toast.success("Pagamento simulado com sucesso", {
        description: `${itemLabel} adicionado à sua conta (modo demo).`,
      });
      onSuccess?.();
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-[18px] font-extrabold">{title}</DialogTitle>
          <DialogDescription className="text-[12.5px] text-muted-foreground">{description}</DialogDescription>
        </DialogHeader>

        {/* Resumo */}
        <div className="rounded-md border border-border bg-secondary/40 p-3">
          <div className="flex items-center justify-between text-[13px]">
            <span className="font-semibold text-foreground">{itemLabel}</span>
            <span className="font-display text-[16px] font-extrabold text-foreground price">{amount}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label className={fieldLabel}>Número do cartão</Label>
            <div className="relative">
              <Input
                placeholder="4242 4242 4242 4242"
                defaultValue="4242 4242 4242 4242"
                className={`${inputCls} pl-9`}
              />
              <CreditCard className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={2.2} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className={fieldLabel}>Validade</Label>
              <Input placeholder="MM/AA" defaultValue="12/28" className={inputCls} />
            </div>
            <div>
              <Label className={fieldLabel}>CVC</Label>
              <Input placeholder="123" defaultValue="123" className={inputCls} />
            </div>
          </div>
          <div>
            <Label className={fieldLabel}>Nome no cartão</Label>
            <Input placeholder="Marina Costa" defaultValue="Marina Costa" className={inputCls} />
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Lock className="h-3 w-3" strokeWidth={2.4} />
            Modo demo — nenhum pagamento real é processado.
          </div>

          <DialogFooter className="gap-2 pt-2 sm:gap-2">
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
              {loading ? "Processando…" : `${ctaLabel} · ${amount}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
