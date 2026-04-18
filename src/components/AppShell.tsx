import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { TopBar } from "./TopBar";

export const AppShell = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      {/* Fundo sutil para destacar os cards de conteúdo */}
      <div className="flex min-h-screen w-full bg-muted/20 dark:bg-background transition-colors duration-300">
        <AppSidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <TopBar />
          {/* Espaçamento otimizado para visualização ampla */}
          <main className="flex-1 px-4 py-6 md:px-6 lg:px-8 lg:py-8 max-w-[1600px] mx-auto w-full">
            <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};