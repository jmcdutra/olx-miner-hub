import { apiRequest } from "@/lib/api/client";
import type {
  Anuncio,
  AnuncioDetailsResponse,
  CheckoutCreditsInput,
  CreateMineracaoInput,
  CreditsOverview,
  DashboardResponse,
  InsightsResponse,
  Mineracao,
  MineracaoDetailsResponse,
  NotificationListResponse,
  NotificationPreferences,
  NotificationPreferencesResponse,
  PlanosResponse,
  ProfileResponse,
  SearchResponse,
  SettingsResponse,
  SubscribePlanInput,
  UpdatePaymentMethodInput,
  UserProfile,
  UserSettingsPreferences,
} from "@/types/entities";

export const api = {
  getDashboard: () => apiRequest<DashboardResponse>("/api/dashboard"),
  search: (query: string) => apiRequest<SearchResponse>(`/api/search?q=${encodeURIComponent(query)}`),

  listMineracoes: () => apiRequest<Mineracao[]>("/api/mineracoes"),
  getMineracao: (id: string) => apiRequest<MineracaoDetailsResponse>(`/api/mineracoes/${id}`),
  createMineracao: (payload: CreateMineracaoInput) =>
    apiRequest<Mineracao>("/api/mineracoes", { method: "POST", body: payload }),
  toggleMineracaoStatus: (id: string) =>
    apiRequest<Mineracao>(`/api/mineracoes/${id}/status`, { method: "PATCH" }),
  deleteMineracao: (id: string) =>
    apiRequest<Mineracao>(`/api/mineracoes/${id}`, { method: "DELETE" }),

  listAnuncios: () => apiRequest<Anuncio[]>("/api/anuncios"),
  getAnuncio: (id: string) => apiRequest<AnuncioDetailsResponse>(`/api/anuncios/${id}`),

  listNotifications: () => apiRequest<NotificationListResponse>("/api/notificacoes"),
  markNotificationRead: (id: number) =>
    apiRequest(`/api/notificacoes/${id}/read`, { method: "PATCH" }),
  markAllNotificationsRead: () =>
    apiRequest<NotificationListResponse>("/api/notificacoes/read-all", { method: "PATCH" }),
  getNotificationPreferences: () =>
    apiRequest<NotificationPreferencesResponse>("/api/notificacoes/preferences"),
  updateNotificationPreferences: (payload: Partial<NotificationPreferences>) =>
    apiRequest<NotificationPreferencesResponse>("/api/notificacoes/preferences", {
      method: "PATCH",
      body: payload,
    }),

  getPlanos: () => apiRequest<PlanosResponse>("/api/planos"),
  subscribePlan: (payload: SubscribePlanInput) =>
    apiRequest<PlanosResponse>("/api/planos/subscribe", { method: "POST", body: payload }),
  cancelSubscription: () =>
    apiRequest<PlanosResponse>("/api/planos/cancel", { method: "POST" }),
  updatePaymentMethod: (payload: UpdatePaymentMethodInput) =>
    apiRequest<PlanosResponse>("/api/planos/payment-method", { method: "PATCH", body: payload }),

  getCreditos: () => apiRequest<CreditsOverview>("/api/creditos"),
  buyCredits: (payload: CheckoutCreditsInput) =>
    apiRequest<CreditsOverview>("/api/creditos/checkout", { method: "POST", body: payload }),
  getInsights: () => apiRequest<InsightsResponse>("/api/insights"),

  getProfile: () => apiRequest<ProfileResponse>("/api/perfil"),
  updateProfile: (payload: UserProfile) =>
    apiRequest<ProfileResponse>("/api/perfil", { method: "PUT", body: payload }),
  getSettings: () => apiRequest<SettingsResponse>("/api/preferencias"),
  updateSettings: (payload: UserSettingsPreferences) =>
    apiRequest<SettingsResponse>("/api/preferencias", { method: "PATCH", body: payload }),
};
