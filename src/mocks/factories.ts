import type {
  Anuncio,
  CreditsOverview,
  DashboardActivity,
  InsightProfitPoint,
  Mineracao,
  Movimentacao,
  Notificacao,
  NotificationPreferences,
  Plano,
  Subscription,
  UserProfile,
  UserSettingsPreferences,
} from "@/types/entities";
import type { FactoryOverrides, MockDbState } from "@/mocks/contracts";

export const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

export const createNotificationPreferences = (
  overrides: FactoryOverrides<NotificationPreferences> = {},
): NotificationPreferences => ({
  novos: true,
  queda: true,
  resumo: true,
  push: false,
  ...overrides,
});

export const createUserProfile = (
  overrides: FactoryOverrides<UserProfile> = {},
): UserProfile => ({
  name: "Marina Costa",
  email: "marina@garimpreco.app",
  phone: "(11) 99999-0000",
  location: "São Paulo, SP",
  ...overrides,
});

export const createUserSettings = (
  overrides: FactoryOverrides<UserSettingsPreferences> = {},
): UserSettingsPreferences => ({
  idioma: "Português (Brasil)",
  moeda: "Real (R$)",
  fuso: "GMT-3 São Paulo",
  ...overrides,
});

export const createSubscription = (
  overrides: FactoryOverrides<Subscription> = {},
): Subscription => ({
  planId: "pro",
  planName: "Pro",
  cycle: "Anual",
  nextBillingDate: "29 Abr 2026",
  amount: 89,
  paymentMethod: { brand: "VISA", last4: "4242" },
  status: "active",
  ...overrides,
});

export const createCreditPackage = (
  overrides: FactoryOverrides<CreditsOverview["pacotes"][number]> = {},
): CreditsOverview["pacotes"][number] => ({
  qtd: 10,
  preco: 19.9,
  bonus: 0,
  popular: false,
  ...overrides,
});

export const createDashboardActivity = (
  overrides: FactoryOverrides<DashboardActivity> = {},
): DashboardActivity => ({
  id: `act-${Date.now()}`,
  color: "bg-primary",
  title: "Nova atividade",
  time: "agora",
  link: "/",
  ...overrides,
});

export const createInsightProfitPoint = (
  overrides: FactoryOverrides<InsightProfitPoint>,
): InsightProfitPoint => ({
  mes: "Jan",
  lucro: 0,
  ...overrides,
});

export const createMineracao = (
  overrides: FactoryOverrides<Mineracao>,
): Mineracao => ({
  id: "mineracao-1",
  titulo: "Produto monitorado",
  categoria: "Eletrônicos",
  cidade: "São Paulo, SP",
  precoMin: 1000,
  precoMax: 2000,
  precoAlvo: 2500,
  status: "ativo",
  anuncios: 0,
  novosHoje: 0,
  atualizadoHa: "agora",
  menorPreco: 1500,
  margem: 20,
  capa: "",
  historico: [
    { dia: "Seg", preco: 2000 },
    { dia: "Ter", preco: 1950 },
    { dia: "Qua", preco: 1900 },
    { dia: "Qui", preco: 1850 },
    { dia: "Sex", preco: 1800 },
    { dia: "Sab", preco: 1750 },
    { dia: "Dom", preco: 1700 },
  ],
  ...overrides,
});

export const createAnuncio = (
  overrides: FactoryOverrides<Anuncio>,
): Anuncio => ({
  id: "anuncio-1",
  mineracaoId: "mineracao-1",
  titulo: "Anuncio de exemplo",
  plataforma: "OLX",
  preco: 1500,
  precoAntigo: null,
  cidade: "São Paulo, SP",
  bairro: "Centro",
  publicadoHa: "1 hora",
  vendedor: "Marina C.",
  score: 80,
  fotos: 4,
  capa: "",
  descricao: "Descricao de exemplo.",
  margemEstimada: 300,
  margemPercentual: 20,
  vendaRapida: "5-7 dias",
  destaque: null,
  ...overrides,
});

export const createMovimentacao = (
  overrides: FactoryOverrides<Movimentacao>,
): Movimentacao => ({
  id: Date.now(),
  tipo: "credito",
  descricao: "Movimentação",
  detalhe: "Evento do sistema",
  valor: 0,
  data: "hoje",
  ...overrides,
});

export const createNotificacao = (
  overrides: FactoryOverrides<Notificacao>,
): Notificacao => ({
  id: Date.now(),
  tipo: "sistema",
  titulo: "Notificação",
  descricao: "Evento do sistema",
  tempo: "agora",
  lida: false,
  ...overrides,
});

export const createPlano = (
  overrides: FactoryOverrides<Plano>,
): Plano => ({
  id: "starter",
  nome: "Starter",
  descricao: "Plano de entrada",
  preco: 39,
  creditos: 15,
  features: [],
  popular: false,
  atual: false,
  ...overrides,
});

export const createMockDbState = (
  overrides: Partial<MockDbState> = {},
): MockDbState => ({
  mineracoes: [],
  anuncios: [],
  movimentacoes: [],
  notificacoes: [],
  planos: [],
  notificationPreferences: createNotificationPreferences(),
  profile: createUserProfile(),
  settings: createUserSettings(),
  subscription: createSubscription(),
  creditPackages: [],
  avulsos: 0,
  recentActivity: [],
  lucroData: [],
  ...overrides,
});
