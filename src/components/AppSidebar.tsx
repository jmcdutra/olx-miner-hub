import { NavLink, useLocation } from "react-router-dom";
import { Plus, Sparkles } from "lucide-react";
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
import { APP_ICONS } from "@/lib/category-icons";
import { NovaMineracaoModal } from "./modals/NovaMineracaoModal";
import { useCreditosQuery, useDashboardQuery, useNotificationsQuery } from "@/hooks/api";

export function AppSidebar() {
  const location = useLocation();
  const { favoritos, comparar } = useApp();
  const [openNova, setOpenNova] = useState(false);
  const { data: dashboard } = useDashboardQuery();
  const { data: creditos } = useCreditosQuery();
  const { data: notifications } = useNotificationsQuery();
  const mineracoes = dashboard?.mineracoes ?? [];
  const unreadCount = notifications?.items.filter((item) => !item.lida).length ?? 0;

  const isActive = (path: string) => path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const main = [
    { title: "Minerações", url: "/", imageSrc: APP_ICONS.mineracoes, badge: mineracoes.length || undefined },
    { title: "Insights", url: "/insights", imageSrc: "/images/eletro.png" },
    { title: "Notificações", url: "/notificacoes", imageSrc: "/images/cameras.png", badge: unreadCount || undefined, dot: unreadCount > 0 },
  ];

  const secundario = [
    { title: "Favoritos", url: "/favoritos", imageSrc: APP_ICONS.favoritos, badge: favoritos.length || undefined },
    { title: "Comparador", url: "/comparar", imageSrc: "/images/autos.png", badge: comparar.length || undefined },
  ];

  const conta = [
    { title: "Créditos", url: "/creditos", imageSrc: APP_ICONS.creditos, badge: creditos?.totalDisponivel ?? undefined },
    { title: "Planos", url: "/planos", imageSrc: "/images/comercio.png" },
    { title: "Configurações", url: "/configuracoes", imageSrc: "/images/default.png" },
  ];

  type SidebarItem = {
    title: string;
    url: string;
    imageSrc: string;
    badge?: number | string;
    dot?: boolean;
  };

  const renderItem = (item: SidebarItem) => {
    const active = isActive(item.url);
    return (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton
          asChild
          className={`group h-10 rounded-lg px-3 text-[14px] font-medium transition-all duration-200 ${
            active
              ? "bg-primary/10 text-primary shadow-sm"
              : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
          }`}
        >
          <NavLink to={item.url}>
            <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-colors ${active ? "bg-background shadow-sm" : "bg-transparent group-hover:bg-background/50"}`}>
              <img src={item.imageSrc} alt="" className={`h-4 w-4 object-contain ${active ? "opacity-100" : "opacity-70 group-hover:opacity-100"}`} loading="lazy" />
            </span>
            <span>{item.title}</span>
            {item.badge !== undefined && item.badge !== 0 && (
              <span className={`ml-auto rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums ${
                active ? "bg-primary text-primary-foreground" : "bg-secondary-foreground/10 text-foreground"
              }`}>
                {item.badge}
              </span>
            )}
            {item.dot && <span className="ml-auto h-2 w-2 rounded-full bg-primary" />}
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <>
      <Sidebar collapsible="icon" className="border-r border-border/40 bg-background/95 backdrop-blur-sm">
        <SidebarHeader className="h-20 flex border-b border-border/40 px-4">
          <Logo />
        </SidebarHeader>

        <SidebarContent className="px-3 py-4 custom-scrollbar">
    

          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {main.map(renderItem)}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="mt-4">
            <SidebarGroupLabel className="px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">
              Workspace
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1 mt-1">
                {secundario.map(renderItem)}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="mt-4">
            <SidebarGroupLabel className="px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">
              Conta
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1 mt-1">
                {conta.map(renderItem)}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        
          <div className="mb-6 px-1">
            <button
              type="button"
              onClick={() => setOpenNova(true)}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-[14px] font-semibold text-primary-foreground shadow-md hover:shadow-lg hover:bg-primary/90 transition-all active:scale-[0.98]"
            >
              <Plus className="h-4.5 w-4.5" strokeWidth={2.5} />
              Nova mineração
            </button>
          </div>

        <SidebarFooter className="p-4 border-t border-border/40">
          <NavLink 
            to="/planos" 
            className="relative flex items-center justify-between overflow-hidden rounded-xl bg-gradient-to-br from-secondary to-secondary/40 border border-border/50 p-3 hover:border-primary/30 transition-all group"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <Sparkles className="h-3 w-3 text-primary" />
                Seu Plano
              </div>
              <div className="text-[14px] font-bold text-foreground mt-0.5">Pro <span className="font-medium text-muted-foreground text-[12px] ml-1">Anual</span></div>
            </div>
            <span className="relative z-10 rounded-full bg-background px-2.5 py-1 text-[11px] font-bold text-primary shadow-sm group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              Upgrade
            </span>
          </NavLink>
        </SidebarFooter>
      </Sidebar>
      <NovaMineracaoModal open={openNova} onOpenChange={setOpenNova} />
    </>
  );
}
