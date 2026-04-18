import { Search, Bell, Sun, Moon, GitCompare, ChevronDown, Loader2, AlertCircle } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useNavigate, Link } from "react-router-dom";
import { useDeferredValue, useEffect, useState, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { APP_ICONS, getCategoryIcon } from "@/lib/category-icons";
import { useCreditosQuery, useNotificationsQuery, useSearchQuery } from "@/hooks/api";

export const TopBar = () => {
  const navigate = useNavigate();
  const { comparar } = useApp();
  const [theme, setTheme] = useState<"light" | "dark">(
    () => typeof document !== "undefined" && document.documentElement.classList.contains("dark") ? "dark" : "light"
  );
  const [query, setQuery] = useState("");
  const [openSearch, setOpenSearch] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const deferredQuery = useDeferredValue(query.trim());
  const searchQuery = useSearchQuery(deferredQuery);
  const { data: searchData, isFetching: isSearching, isError: searchError } = searchQuery;
  const { data: creditos } = useCreditosQuery();
  const { data: notifications } = useNotificationsQuery();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setOpenSearch(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const q = deferredQuery.toLowerCase();
  const minResults = q ? (searchData?.mineracoes ?? []) : [];
  const adResults = q ? (searchData?.anuncios ?? []) : [];
  const hasResults = minResults.length + adResults.length > 0;
  const hasUnread = Boolean(notifications?.items.some((item) => !item.lida));

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border/40 bg-background/80 px-4 backdrop-blur-md transition-all lg:px-6">
      <SidebarTrigger className="h-9 w-9 rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors" />

      {/* Barra de Pesquisa Estilo Marketplace */}
      <div ref={searchRef} className="relative flex-1 max-w-3xl mx-auto hidden sm:block">
        <div className="relative group">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" strokeWidth={2} />
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpenSearch(true); }}
            onFocus={() => setOpenSearch(true)}
            placeholder="Buscar produtos, minerações, ou anúncios..."
            className="h-10 w-full rounded-full border border-border/50 bg-secondary/30 pl-10 pr-12 text-[14px] text-foreground placeholder:text-muted-foreground/70 transition-all hover:bg-secondary/50 hover:border-border focus:bg-background focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/10 shadow-sm"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-muted-foreground bg-background px-1.5 py-0.5 rounded border border-border/50">
            ⌘K
          </div>
        </div>

        {/* Dropdown de Resultados Premium */}
        {openSearch && q && (
          <div className="absolute left-0 right-0 top-14 z-50 overflow-hidden rounded-xl border border-border/50 bg-background shadow-2xl animate-in fade-in slide-in-from-top-2">
            {isSearching && (
              <div className="flex items-center justify-center gap-2 px-4 py-6 text-[13px] text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Buscando resultados...
              </div>
            )}
            {searchError && !isSearching && (
              <div className="flex items-center justify-center gap-2 px-4 py-6 text-[13px] text-muted-foreground">
                <AlertCircle className="h-4 w-4 text-destructive" />
                Nao foi possivel buscar agora.
              </div>
            )}
            {!isSearching && !searchError && !hasResults && (
              <div className="px-4 py-8 text-center text-[13px] text-muted-foreground">Nenhum resultado encontrado para <span className="font-semibold text-foreground">"{query}"</span></div>
            )}
            
            {!isSearching && !searchError && <div className="max-h-[70vh] overflow-y-auto p-2">
              {minResults.length > 0 && (
                <div className="mb-2">
                  <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Minerações</div>
                  {minResults.map((m) => (
                    <Link
                      key={m.id}
                      to={`/mineracao/${m.id}`}
                      onClick={() => { setOpenSearch(false); setQuery(""); }}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-secondary/80"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-secondary/50 border border-border/50">
                        <img src={getCategoryIcon(m.categoria)} alt="" className="h-5 w-5 object-contain" loading="lazy" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="truncate text-[14px] font-medium text-foreground">{m.titulo}</div>
                        <div className="text-[12px] text-muted-foreground">{m.categoria} • {m.cidade}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              {adResults.length > 0 && (
                <div>
                  <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground border-t border-border/40 mt-1 pt-3">Anúncios</div>
                  {adResults.map((a) => (
                    <Link
                      key={a.id}
                      to={`/anuncio/${a.id}`}
                      onClick={() => { setOpenSearch(false); setQuery(""); }}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-secondary/80"
                    >
                      <img src={a.capa} alt="" className="h-10 w-10 shrink-0 rounded-md object-cover border border-border/50" />
                      <div className="flex-1 min-w-0 flex justify-between items-center">
                        <div>
                          <div className="truncate text-[13px] font-medium text-foreground">{a.titulo}</div>
                          <div className="text-[11px] text-success font-medium">Margem: +{a.margemPercentual}%</div>
                        </div>
                        <div className="text-[14px] font-semibold text-foreground whitespace-nowrap">R$ {a.preco.toLocaleString("pt-BR")}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>}
          </div>
        )}
      </div>

      {/* Ações da Direita */}
      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        {comparar.length > 0 && (
          <button
            onClick={() => navigate("/comparar")}
            className="hidden sm:flex h-9 items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3.5 text-[13px] font-semibold text-primary transition-all hover:bg-primary/10 hover:border-primary/30"
          >
            <GitCompare className="h-4 w-4" />
            Comparar ({comparar.length})
          </button>
        )}

        <button
          onClick={() => navigate('/creditos')}
          className="hidden h-9 items-center gap-1.5 rounded-full border border-border/50 bg-secondary/30 px-3.5 text-[13px] font-medium text-foreground transition-all hover:bg-secondary hover:border-border md:flex"
        >
          <img src={APP_ICONS.creditos} alt="" className="h-4 w-4 object-contain" />
          <span className="font-semibold">{creditos?.totalDisponivel ?? 0}</span>
          <span className="text-muted-foreground">créditos</span>
        </button>

        <div className="h-5 w-px bg-border/50 mx-1 hidden sm:block"></div>

        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          {theme === "light" ? <Moon className="h-4.5 w-4.5" strokeWidth={2} /> : <Sun className="h-4.5 w-4.5" strokeWidth={2} />}
        </button>

        <button
          onClick={() => navigate('/notificacoes')}
          className="relative flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Bell className="h-4.5 w-4.5" strokeWidth={2} />
          {hasUnread && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive border-2 border-background" />}
        </button>

        <button
          onClick={() => navigate('/configuracoes')}
          className="flex h-9 items-center gap-2 rounded-full border border-border/50 bg-secondary/30 pl-1 pr-3 text-[13px] font-medium text-foreground transition-all hover:bg-secondary hover:border-border ml-1"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-primary/70 text-[11px] font-bold text-primary-foreground shadow-sm">
            MC
          </span>
          <span className="hidden md:inline font-semibold">Marina</span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden md:block" />
        </button>
      </div>
    </header>
  );
};
