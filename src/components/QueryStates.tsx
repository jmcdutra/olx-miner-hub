import { AlertTriangle, Loader2, RefreshCw, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

type Retryable = {
  onRetry?: () => void;
  retryLabel?: string;
};

export const PageLoadingState = ({
  title = "Carregando dados",
  description = "Buscando as informacoes desta pagina.",
}: {
  title?: string;
  description?: string;
}) => (
  <div className="rounded-3xl border border-border/50 bg-card p-8 shadow-sm">
    <div className="flex items-start gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
      <div>
        <h2 className="text-[18px] font-bold text-foreground">{title}</h2>
        <p className="mt-1 text-[13.5px] text-muted-foreground">{description}</p>
      </div>
    </div>
    <div className="mt-8 grid gap-4 md:grid-cols-3">
      <Skeleton className="h-28 rounded-2xl" />
      <Skeleton className="h-28 rounded-2xl" />
      <Skeleton className="h-28 rounded-2xl" />
    </div>
  </div>
);

export const PageErrorState = ({
  title = "Nao foi possivel carregar esta pagina",
  description = "Tente novamente em alguns segundos.",
  details,
  onRetry,
  retryLabel = "Tentar novamente",
}: {
  title?: string;
  description?: string;
  details?: string;
} & Retryable) => (
  <div className="rounded-3xl border border-border/50 bg-card p-8 shadow-sm">
    <Alert className="rounded-2xl border-destructive/20 bg-destructive/[0.03]">
      <AlertTriangle className="h-4 w-4 text-destructive" />
      <AlertTitle className="text-[16px] font-bold text-foreground">{title}</AlertTitle>
      <AlertDescription className="mt-1 text-[13.5px] text-muted-foreground">
        {description}
        {details ? <span className="mt-2 block text-[12.5px]">{details}</span> : null}
      </AlertDescription>
    </Alert>
    {onRetry ? (
      <div className="mt-5">
        <Button onClick={onRetry} className="h-10 rounded-full bg-foreground px-5 text-[13px] font-semibold text-background hover:bg-foreground/90">
          <RefreshCw className="mr-2 h-4 w-4" />
          {retryLabel}
        </Button>
      </div>
    ) : null}
  </div>
);

export const SectionLoadingState = ({
  lines = 3,
}: {
  lines?: number;
}) => (
  <div className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
    <div className="space-y-3">
      <Skeleton className="h-5 w-40 rounded-lg" />
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton key={index} className="h-12 rounded-xl" />
      ))}
    </div>
  </div>
);

export const InlineErrorState = ({
  title = "Nao foi possivel carregar esta secao",
  description = "Tente recarregar.",
  onRetry,
  retryLabel = "Recarregar",
}: {
  title?: string;
  description?: string;
} & Retryable) => (
  <div className="rounded-2xl border border-destructive/20 bg-destructive/[0.03] p-4 shadow-sm">
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
        <AlertTriangle className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[14px] font-bold text-foreground">{title}</div>
        <div className="mt-1 text-[12.5px] text-muted-foreground">{description}</div>
        {onRetry ? (
          <Button variant="outline" onClick={onRetry} className="mt-3 h-8 rounded-full border-border/60 px-3 text-[12px] font-semibold hover:bg-background">
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
            {retryLabel}
          </Button>
        ) : null}
      </div>
    </div>
  </div>
);

export const EmptySearchState = ({
  title = "Nada encontrado",
  description = "Ajuste os filtros e tente de novo.",
}: {
  title?: string;
  description?: string;
}) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-secondary/10 py-20 text-center">
    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-border/50 bg-background shadow-sm">
      <SearchX className="h-6 w-6 text-muted-foreground" />
    </div>
    <h3 className="text-[16px] font-bold text-foreground">{title}</h3>
    <p className="mt-1.5 max-w-xs text-[13px] text-muted-foreground">{description}</p>
  </div>
);
