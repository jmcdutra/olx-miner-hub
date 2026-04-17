import { NavLink, useLocation } from "react-router-dom";
import { Pickaxe, Coins, CreditCard, Bell, Settings, BarChart3, Plus, Heart, GitCompare } from "lucide-react";
import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Logo } from "./Logo";
import { useApp } from "@/context/AppContext";
import { NovaMineracaoModal } from "./modals/NovaMineracaoModal";

export function AppSidebar() {
  const location = useLocation();
  const { favoritos, comparar } = useApp();
  const [openNova, setOpenNova] = useState(false);

  const isActive = (path: string) => path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const main = [
    { title: "Minerações", url: "/", icon: Pickaxe, badge: "4" },
    { title: "Insights", url: "/insights", icon: BarChart3 },
    { title: "Notificações", url: "/notificacoes", icon: Bell, dot: true },
  ];

  const secundario = [
    { title: "Favoritos", url: "/favoritos", icon: Heart, badge: favoritos.length || undefined },
    { title: "Comparador", url: "/comparar", icon: GitCompare, badge: comparar.length || undefined },
  ];

  const conta = [
    { title: "Créditos", url: "/creditos", icon: Coins, badge: "46" },
    { title: "Planos", url: "/planos", icon: CreditCard },
    { title: "Configurações", url: "/configuracoes", icon: Settings },
  ];

  const renderItem = (item: any) => {
    const active = isActive(item.url);
    return (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton
          asChild
          className={`group h-9 rounded-md px-2.5 text-[13.5px] font-semibold ${
            active
              ? "bg-primary-soft text-primary hover:bg-primary-soft hover:text-primary"
              : "text-foreground/75 hover:bg-secondary hover:text-foreground"
          }`}
        >
          <NavLink to={item.url}>
            <item.icon
              className={`h-4 w-4 shrink-0 ${active ? "text-primary" : "text-muted-foreground"}`}
              strokeWidth={2.2}
            />
            <span>{item.title}</span>
            {item.badge !== undefined && item.badge !== 0 && (
              <span className={`ml-auto rounded px-1.5 py-0.5 font-display text-[10.5px] font-extrabold tabular ${
                active ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
              }`}>
                {item.badge}
              </span>
            )}
            {item.dot && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent" />}
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <>
      <Sidebar collapsible="icon" className="border-r border-sidebar-border">
        <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
          <Logo />
        </SidebarHeader>

        <SidebarContent className="px-3 py-3">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {main.map(renderItem)}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="px-2.5 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
              Workspace
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {secundario.map(renderItem)}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="px-2.5 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
              Conta
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {conta.map(renderItem)}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <div className="mt-3 border-t border-sidebar-border pt-3">
            <button
              onClick={() => setOpenNova(true)}
              className="flex h-9 w-full items-center gap-2 rounded-md bg-foreground px-3 text-[13px] font-extrabold text-background transition-colors hover:bg-foreground/90"
            >
              <Plus className="h-4 w-4" strokeWidth={2.6} />
              Nova mineração
            </button>
          </div>
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border p-3">
          <NavLink to="/planos" className="flex items-center justify-between rounded-md bg-secondary px-2.5 py-2 hover:bg-secondary/70">
            <div>
              <div className="font-display text-[10.5px] font-extrabold uppercase tracking-wider text-muted-foreground">Plano</div>
              <div className="font-display text-[13px] font-extrabold text-foreground">Pro</div>
            </div>
            <span className="text-[11.5px] font-extrabold text-primary">Upgrade →</span>
          </NavLink>
        </SidebarFooter>
      </Sidebar>

      <NovaMineracaoModal open={openNova} onOpenChange={setOpenNova} />
    </>
  );
}
