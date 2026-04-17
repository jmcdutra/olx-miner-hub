import { Search, Bell } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";

export const TopBar = () => {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur lg:px-6">
      <SidebarTrigger className="h-8 w-8 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground" />

      <div className="relative flex-1 max-w-2xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={2.2} />
        <input
          placeholder="Buscar produto, mineração ou anúncio…"
          className="h-9 w-full rounded-md border border-border bg-card pl-9 pr-3 text-[13.5px] font-medium text-foreground placeholder:text-muted-foreground/80 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={() => navigate('/creditos')}
          className="hidden h-9 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-[12.5px] font-extrabold text-foreground transition-colors hover:bg-secondary md:flex"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          <span className="tabular">34</span>
          <span className="font-semibold text-muted-foreground">créditos</span>
        </button>

        <button
          onClick={() => navigate('/notificacoes')}
          className="relative flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:bg-secondary"
          aria-label="Notificações"
        >
          <Bell className="h-4 w-4" strokeWidth={2.2} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
        </button>

        <button
          onClick={() => navigate('/configuracoes')}
          className="flex h-9 items-center gap-2 rounded-md border border-border bg-card pl-1 pr-2.5 text-[12.5px] font-extrabold text-foreground transition-colors hover:bg-secondary"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded bg-primary font-display text-[11px] font-extrabold text-primary-foreground">
            MC
          </span>
          <span className="hidden md:inline">Marina</span>
        </button>
      </div>
    </header>
  );
};
