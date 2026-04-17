import { NavLink, useLocation } from "react-router-dom";
import { Pickaxe, Coins, CreditCard, Bell, Settings, BarChart3, Plus } from "lucide-react";
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

const items = [
  { title: "Minerações", url: "/", icon: Pickaxe, badge: "4" },
  { title: "Insights", url: "/insights", icon: BarChart3 },
  { title: "Créditos", url: "/creditos", icon: Coins, badge: "34" },
  { title: "Planos", url: "/planos", icon: CreditCard },
  { title: "Notificações", url: "/notificacoes", icon: Bell, dot: true },
  { title: "Configurações", url: "/configuracoes", icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();
  const isActive = (path: string) => path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <Logo />
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {items.map((item) => {
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
                        {item.badge && (
                          <span className={`ml-auto rounded px-1.5 py-0.5 font-display text-[10.5px] font-extrabold tabular ${
                            active ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                          }`}>
                            {item.badge}
                          </span>
                        )}
                        {item.dot && (
                          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent" />
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-6 border-t border-sidebar-border pt-4">
          <NavLink
            to="/mineracao/nova"
            className="flex h-9 items-center gap-2 rounded-md bg-foreground px-3 text-[13px] font-extrabold text-background transition-colors hover:bg-foreground/90"
          >
            <Plus className="h-4 w-4" strokeWidth={2.6} />
            Nova mineração
          </NavLink>
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <div className="flex items-center justify-between rounded-md bg-secondary px-2.5 py-2">
          <div>
            <div className="font-display text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">Plano</div>
            <div className="font-display text-[13px] font-extrabold text-foreground">Pro</div>
          </div>
          <NavLink to="/planos" className="text-[11.5px] font-extrabold text-primary hover:underline">
            Upgrade
          </NavLink>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
