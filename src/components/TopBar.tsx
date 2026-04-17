import { Search, Bell, Sparkles, LogOut } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const TopBar = () => {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-40 flex h-20 items-center gap-4 border-b border-border/60 bg-background/80 px-8 backdrop-blur-xl lg:px-12">
      <SidebarTrigger className="h-9 w-9 rounded-xl hover:bg-secondary" />

      <div className="relative flex-1 max-w-2xl">
        <Search className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground" strokeWidth={2.4} />
        <Input
          placeholder="Buscar produtos, mineração ou anúncios…"
          className="h-12 rounded-2xl border-border/80 bg-secondary/60 pl-12 pr-4 font-medium text-[14px] placeholder:text-muted-foreground/70 focus-visible:bg-card focus-visible:ring-2 focus-visible:ring-primary/30"
        />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <button className="flex h-11 items-center gap-2 rounded-2xl bg-accent-soft px-4 font-bold text-accent transition-smooth hover:bg-accent hover:text-accent-foreground" onClick={() => navigate('/creditos')}>
          <Sparkles className="h-4 w-4" strokeWidth={2.6} />
          <span className="text-[14px]">34 créditos</span>
        </button>

        <button className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-card transition-smooth hover:bg-secondary" onClick={() => navigate('/notificacoes')}>
          <Bell className="h-[18px] w-[18px] text-foreground" strokeWidth={2.4} />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-accent ring-2 ring-background animate-pulse-glow" />
        </button>

        <div className="hidden items-center gap-3 rounded-2xl border border-border bg-card px-3 py-1.5 md:flex">
          <span className="font-display text-[14px] font-bold text-foreground">Marina Costa</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-bold font-display text-[12px] font-extrabold text-white">
            MC
          </div>
        </div>

        <button className="flex h-11 w-11 items-center justify-center rounded-2xl text-muted-foreground transition-smooth hover:bg-secondary hover:text-destructive">
          <LogOut className="h-[18px] w-[18px]" strokeWidth={2.4} />
        </button>
      </div>
    </header>
  );
};
