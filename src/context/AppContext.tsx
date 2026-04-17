import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { toast } from "sonner";

interface AppContextValue {
  // Favoritos
  favoritos: string[];
  toggleFavorito: (anuncioId: string, titulo?: string) => void;
  isFavorito: (anuncioId: string) => boolean;

  // Comparador (até 3)
  comparar: string[];
  toggleComparar: (anuncioId: string, titulo?: string) => void;
  limparComparar: () => void;
  isComparando: (anuncioId: string) => boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [comparar, setComparar] = useState<string[]>([]);

  const toggleFavorito = useCallback((id: string, titulo?: string) => {
    setFavoritos((prev) => {
      if (prev.includes(id)) {
        toast("Removido dos favoritos", { description: titulo });
        return prev.filter((x) => x !== id);
      }
      toast.success("Salvo nos favoritos", { description: titulo });
      return [...prev, id];
    });
  }, []);

  const toggleComparar = useCallback((id: string, titulo?: string) => {
    setComparar((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id);
      }
      if (prev.length >= 3) {
        toast.error("Máximo de 3 anúncios para comparar", {
          description: "Remova um antes de adicionar outro.",
        });
        return prev;
      }
      toast.success("Adicionado ao comparador", { description: titulo });
      return [...prev, id];
    });
  }, []);

  const limparComparar = useCallback(() => {
    setComparar([]);
    toast("Comparador limpo");
  }, []);

  return (
    <AppContext.Provider
      value={{
        favoritos,
        toggleFavorito,
        isFavorito: (id) => favoritos.includes(id),
        comparar,
        toggleComparar,
        isComparando: (id) => comparar.includes(id),
        limparComparar,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
};
