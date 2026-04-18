import type { anuncios, mineracoes, movimentacoes, notificacoes, planos } from "@/data/mock";

export type Mineracao = (typeof mineracoes)[number];
export type Anuncio = (typeof anuncios)[number];
export type Movimentacao = (typeof movimentacoes)[number];
export type Plano = (typeof planos)[number];
export type Notificacao = (typeof notificacoes)[number];

export type NotificationType = Notificacao["tipo"];

export interface NotificationPreferences {
  novos: boolean;
  queda: boolean;
  resumo: boolean;
  push: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
}

export interface UserSettingsPreferences {
  idioma: string;
  moeda: string;
  fuso: string;
}

export interface PaymentMethod {
  brand: string;
  last4: string;
}

export interface Subscription {
  planId: string;
  planName: string;
  cycle: string;
  nextBillingDate: string;
  amount: number;
  paymentMethod: PaymentMethod;
  status: "active" | "canceled";
}

export interface CreditPackage {
  qtd: number;
  preco: number;
  bonus: number;
  popular: boolean;
}

export interface CheckoutCreditsInput {
  qtd: number;
  preco: number;
  bonus?: number;
}

export interface SubscribePlanInput {
  planId: string;
}

export interface UpdatePaymentMethodInput {
  brand: string;
  last4: string;
}

export interface DashboardStat {
  id: string;
  label: string;
  value: string;
  hint: string;
  accent?: boolean;
}

export interface DashboardActivity {
  id: string;
  color: string;
  title: string;
  time: string;
  link: string;
}

export interface DashboardResponse {
  mineracoes: Mineracao[];
  stats: DashboardStat[];
  recentActivity: DashboardActivity[];
}

export interface SearchResponse {
  mineracoes: Mineracao[];
  anuncios: Anuncio[];
}

export interface NotificationPreferencesResponse {
  preferences: NotificationPreferences;
}

export interface NotificationListResponse {
  items: Notificacao[];
}

export interface ProfileResponse {
  profile: UserProfile;
}

export interface SettingsResponse {
  preferences: UserSettingsPreferences;
}

export interface PlanosResponse {
  planos: Plano[];
  subscription: Subscription;
}

export interface CreditsOverview {
  planoCreditos: number;
  ativas: number;
  avulsos: number;
  totalDisponivel: number;
  usagePct: number;
  pacotes: CreditPackage[];
  movimentacoes: Movimentacao[];
}

export interface InsightsMetric {
  label: string;
  value: string;
  delta: string;
  up: boolean;
}

export interface InsightProfitPoint {
  mes: string;
  lucro: number;
}

export interface InsightCategoryPoint {
  name: string;
  value: number;
  color: string;
}

export interface InsightsResponse {
  metrics: InsightsMetric[];
  lucroData: InsightProfitPoint[];
  categoriaData: InsightCategoryPoint[];
}

export interface AnuncioDetailsResponse {
  anuncio: Anuncio;
  mineracao: Mineracao;
}

export interface MineracaoDetailsResponse {
  mineracao: Mineracao;
  anuncios: Anuncio[];
}

export interface CreateMineracaoInput {
  produto: string;
  categoria: string;
  estado: string;
  cidade: string;
  plataformas: string[];
  precoMin: number | null;
  precoMax: number;
  precoAlvo: number | null;
}
