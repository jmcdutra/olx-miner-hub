import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "./context/AppContext";
import Index from "./pages/Index.tsx";
import Mineracao from "./pages/Mineracao.tsx";
import NovaMineracao from "./pages/NovaMineracao.tsx";
import Anuncio from "./pages/Anuncio.tsx";
import Creditos from "./pages/Creditos.tsx";
import Planos from "./pages/Planos.tsx";
import Notificacoes from "./pages/Notificacoes.tsx";
import Configuracoes from "./pages/Configuracoes.tsx";
import Insights from "./pages/Insights.tsx";
import Favoritos from "./pages/Favoritos.tsx";
import Comparar from "./pages/Comparar.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" />
      <BrowserRouter>
        <AppProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/mineracao/nova" element={<NovaMineracao />} />
            <Route path="/mineracao/:id" element={<Mineracao />} />
            <Route path="/anuncio/:id" element={<Anuncio />} />
            <Route path="/favoritos" element={<Favoritos />} />
            <Route path="/comparar" element={<Comparar />} />
            <Route path="/creditos" element={<Creditos />} />
            <Route path="/planos" element={<Planos />} />
            <Route path="/notificacoes" element={<Notificacoes />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
