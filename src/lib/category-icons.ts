const CATEGORY_ICON_ALIASES: Record<string, string> = {
  agro: "agro",
  autopecas: "autopecas",
  "auto pecas": "autopecas",
  autos: "autos",
  automoveis: "autos",
  "automoveis e comerciais": "autos",
  carros: "autos",
  cameras: "cameras",
  camera: "cameras",
  celulares: "celulares",
  celular: "celulares",
  comercio: "comercio",
  decoracao: "decoracao",
  "casa e decoracao": "decoracao",
  default: "default",
  eletro: "eletro",
  eletrodomesticos: "eletro",
  eletronicos: "eletro",
  notebooks: "eletro",
  notebook: "eletro",
  computadores: "eletro",
  esportes: "esportes",
  hobbies: "hobbies",
  games: "hobbies",
  videogames: "hobbies",
  imoveis: "imoveis",
  infantil: "infantil",
  moda: "moda",
  moveis: "moveis",
};

const normalizeCategory = (value?: string) =>
  (value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

export const getCategoryIcon = (category?: string) => {
  const normalized = normalizeCategory(category);
  const fileName = CATEGORY_ICON_ALIASES[normalized] ?? "default";
  return `/images/${fileName}.png`;
};

export const APP_ICONS = {
  creditos: "/images/cupom.png",
  favoritos: "/images/favoritos.png",
  mineracoes: "/images/default.png",
} as const;
