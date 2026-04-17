import { ReactNode, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void | Promise<void>;
}

export const ConfirmDialog = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  destructive = false,
  onConfirm,
}: ConfirmDialogProps) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className="flex items-start gap-3">
          {destructive && (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-destructive/10 text-destructive">
              <AlertTriangle className="h-5 w-5" strokeWidth={2.4} />
            </div>
          )}
          <DialogHeader className="flex-1 text-left">
            <DialogTitle className="font-display text-[17px] font-extrabold">{title}</DialogTitle>
            <DialogDescription className="text-[13px] text-muted-foreground">{description}</DialogDescription>
          </DialogHeader>
        </div>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-9 rounded-md border-border font-display text-[12.5px] font-extrabold"
          >
            {cancelLabel}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading}
            className={`h-9 rounded-md font-display text-[12.5px] font-extrabold ${
              destructive
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            {loading ? "Processando…" : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Hook helper para uso ergonômico
export const useConfirm = () => {
  const [state, setState] = useState<Omit<ConfirmDialogProps, "open" | "onOpenChange"> | null>(null);

  const confirm = (opts: Omit<ConfirmDialogProps, "open" | "onOpenChange">) => {
    setState(opts);
  };

  const node = state ? (
    <ConfirmDialog
      {...state}
      open={!!state}
      onOpenChange={(o) => !o && setState(null)}
    />
  ) : null;

  return { confirm, node } as const;
};
