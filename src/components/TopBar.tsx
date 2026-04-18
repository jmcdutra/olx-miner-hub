import { Search, Bell, Sun, Moon, GitCompare } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { mineracoes, anuncios } from "@/data/mock";
import { useApp } from "@/context/AppContext";
import { APP_ICONS, getCategoryIcon } from "@/lib/category-icons";

export const TopBar = () => {
  const navigate = useNavigate();
  const { comparar } = useApp();
  const [theme, setTheme] = useState<"light" | "dark">(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("dark") ? "dark" : "light"
  );
  const [query, setQuery] = useState("");
  const [openSearch, setOpenSearch] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

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

  const q = query.trim().toLowerCase();
  const minResults = q ? mineracoes.filter((m) => m.titulo.toLowerCase().includes(q)).slice(0, 4) : [];
  const adResults = q ? anuncios.filter((a) => a.titulo.toLowerCase().includes(q)).slice(0, 4) : [];
  const hasResults = minResults.length + adResults.length > 0;

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur lg:px-6">
      <SidebarTrigger className="h-8 w-8 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground" />

      <div ref={searchRef} className="relative flex-1 max-w-2xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={2.2} />
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpenSearch(true); }}
          onFocus={() => setOpenSearch(true)}
          placeholder="Buscar produto, mineração ou anúncio…"
          className="h-9 w-full rounded-md border border-border bg-card pl-9 pr-3 text-[13.5px] font-medium text-foreground placeholder:text-muted-foreground/80 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
        />

        {openSearch && q && (
          <div className="absolute left-0 right-0 top-11 z-50 overflow-hidden rounded-md border border-border bg-card shadow-lg">
            {!hasResults && (
              <div className="px-4 py-6 text-center text-[12.5px] text-muted-foreground">Nenhum resultado para "{query}"</div>
            )}
            {minResults.length > 0 && (
              <div>
                <div className="border-b border-border px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Minerações</div>
                {minResults.map((m) => (
                  <Link
                    key={m.id}
                    to={`/mineracao/${m.id}`}
                    onClick={() => { setOpenSearch(false); setQuery(""); }}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-secondary"
                  >
                    <img src={getCategoryIcon(m.categoria)} alt="" className="h-8 w-8 rounded-lg object-contain bg-secondary/70 p-1" loading="lazy" />
                    <div className="flex-1 min-w-0">
                      <div className="truncate font-display text-[13px] font-extrabold text-foreground">{m.titulo}</div>
                      <div className="text-[11px] text-muted-foreground">{m.categoria} · {m.cidade}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            {adResults.length > 0 && (
              <div>
                <div className="border-y border-border px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Anúncios</div>
                {adResults.map((a) => (
                  <Link
                    key={a.id}
                    to={`/anuncio/${a.id}`}
                    onClick={() => { setOpenSearch(false); setQuery(""); }}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-secondary"
                  >
                    <img src={a.capa} alt="" className="h-8 w-8 rounded object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="truncate text-[12.5px] font-semibold text-foreground">{a.titulo}</div>
                      <div className="text-[11px] font-extrabold text-foreground price">R$ {a.preco.toLocaleString("pt-BR")} <span className="font-medium text-success">+{a.margemPercentual}%</span></div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        {comparar.length > 0 && (
          <button
            onClick={() => navigate("/comparar")}
            className="flex h-9 items-center gap-1.5 rounded-md border border-primary/30 bg-primary-soft px-2.5 text-[12px] font-extrabold text-primary hover:bg-primary-soft/70"
          >
            <GitCompare className="h-3.5 w-3.5" strokeWidth={2.4} />
            Comparar ({comparar.length})
          </button>
        )}

        <button
          onClick={() => navigate('/creditos')}
          className="hidden h-9 items-center gap-1.5 rounded-md border border-border bg-card px-2.5 text-[12px] font-extrabold text-foreground transition-colors hover:bg-secondary md:flex"
        >
          <img src={APP_ICONS.creditos} alt="" className="h-4 w-4 object-contain" loading="lazy" />
          <span className="tabular">46</span>
          <span className="font-semibold text-muted-foreground">créditos</span>
        </button>

        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:bg-secondary"
          aria-label="Alternar tema"
        >
          {theme === "light" ? <Moon className="h-4 w-4" strokeWidth={2.2} /> : <Sun className="h-4 w-4" strokeWidth={2.2} />}
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
