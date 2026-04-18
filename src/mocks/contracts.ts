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

export interface MockDbState {
  mineracoes: Mineracao[];
  anuncios: Anuncio[];
  movimentacoes: Movimentacao[];
  notificacoes: Notificacao[];
  planos: Plano[];
  notificationPreferences: NotificationPreferences;
  profile: UserProfile;
  settings: UserSettingsPreferences;
  subscription: Subscription;
  creditPackages: CreditsOverview["pacotes"];
  avulsos: number;
  recentActivity: DashboardActivity[];
  lucroData: InsightProfitPoint[];
}

export type FactoryOverrides<T> = Partial<T>;
