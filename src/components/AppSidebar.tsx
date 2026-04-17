import { NavLink, useLocation } from "react-router-dom";
import { Pickaxe, Coins, CreditCard, Bell, Settings, Sparkles, BarChart3 } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Logo } from "./Logo";
import { Button } from "./ui/button";

const items = [
  { title: "Minerações", url: "/", icon: Pickaxe },
  { title: "Insights", url: "/insights", icon: BarChart3 },
  { title: "Créditos", url: "/creditos", icon: Coins },
  { title: "Planos", url: "/planos", icon: CreditCard },
  { title: "Notificações", url: "/notificacoes", icon: Bell },
  { title: "Configurações", url: "/configuracoes", icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();
  const isActive = (path: string) => path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <Sidebar collapsible="icon" className="border-r border-border/60">
      <SidebarHeader className="border-b border-border/60 p-5">
        <Logo />
      </SidebarHeader>

      <SidebarContent className="px-3 py-6">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {items.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`group h-12 rounded-xl px-3.5 font-semibold transition-smooth ${
                        active
                          ? "bg-primary text-primary-foreground shadow-md hover:bg-primary hover:text-primary-foreground"
                          : "text-foreground/70 hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      <NavLink to={item.url}>
                        <item.icon
                          className={`h-[18px] w-[18px] shrink-0 ${active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"}`}
                          strokeWidth={2.4}
                        />
                        <span className="text-[14px]">{item.title}</span>
                        {item.title === "Notificações" && (
                          <span className={`ml-auto h-1.5 w-1.5 rounded-full ${active ? "bg-accent" : "bg-accent"}`} />
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-secondary to-accent/5 p-4">
          <div className="absolute right-3 top-3">
            <Sparkles className="h-4 w-4 text-accent" />
          </div>
          <div className="mb-2 flex items-center gap-2">
            <span className="font-display text-sm font-extrabold text-foreground">Garimpreço</span>
            <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-extrabold tracking-wider text-primary-foreground">
              PRO
            </span>
          </div>
          <p className="mb-3 text-[11.5px] leading-snug text-muted-foreground">
            Você tem alertas ilimitados e atualizações em tempo real.
          </p>
          <Button variant="outline" size="sm" className="h-8 w-full rounded-lg border-border/80 bg-background text-[12px] font-semibold">
            Minha Conta
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
