import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/services";
import type {
  CheckoutCreditsInput,
  CreateMineracaoInput,
  NotificationPreferences,
  SubscribePlanInput,
  UpdatePaymentMethodInput,
  UserProfile,
  UserSettingsPreferences,
} from "@/types/entities";

export const queryKeys = {
  dashboard: ["dashboard"] as const,
  search: (query: string) => ["search", query] as const,
  mineracoes: ["mineracoes"] as const,
  mineracao: (id: string) => ["mineracao", id] as const,
  anuncios: ["anuncios"] as const,
  anuncio: (id: string) => ["anuncio", id] as const,
  notifications: ["notifications"] as const,
  notificationPreferences: ["notification-preferences"] as const,
  planos: ["planos"] as const,
  creditos: ["creditos"] as const,
  insights: ["insights"] as const,
  profile: ["profile"] as const,
  settings: ["settings"] as const,
};

const invalidateCoreData = async (queryClient: ReturnType<typeof useQueryClient>) => {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboard }),
    queryClient.invalidateQueries({ queryKey: queryKeys.mineracoes }),
    queryClient.invalidateQueries({ queryKey: queryKeys.anuncios }),
    queryClient.invalidateQueries({ queryKey: queryKeys.creditos }),
    queryClient.invalidateQueries({ queryKey: queryKeys.insights }),
  ]);
};

export const useDashboardQuery = () =>
  useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: api.getDashboard,
  });

export const useSearchQuery = (query: string) =>
  useQuery({
    queryKey: queryKeys.search(query),
    queryFn: () => api.search(query),
    enabled: query.trim().length > 0,
  });

export const useMineracoesQuery = () =>
  useQuery({
    queryKey: queryKeys.mineracoes,
    queryFn: api.listMineracoes,
  });

export const useMineracaoQuery = (id?: string) =>
  useQuery({
    queryKey: queryKeys.mineracao(id ?? ""),
    queryFn: () => api.getMineracao(id ?? ""),
    enabled: Boolean(id),
  });

export const useCreateMineracaoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateMineracaoInput) => api.createMineracao(payload),
    onSuccess: async () => {
      await invalidateCoreData(queryClient);
    },
  });
};

export const useToggleMineracaoStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.toggleMineracaoStatus(id),
    onSuccess: async (item) => {
      await Promise.all([
        invalidateCoreData(queryClient),
        queryClient.invalidateQueries({ queryKey: queryKeys.mineracao(item.id) }),
      ]);
    },
  });
};

export const useDeleteMineracaoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteMineracao(id),
    onSuccess: async (item) => {
      await Promise.all([
        invalidateCoreData(queryClient),
        queryClient.invalidateQueries({ queryKey: queryKeys.mineracao(item.id) }),
      ]);
    },
  });
};

export const useAnunciosQuery = () =>
  useQuery({
    queryKey: queryKeys.anuncios,
    queryFn: api.listAnuncios,
  });

export const useAnuncioQuery = (id?: string) =>
  useQuery({
    queryKey: queryKeys.anuncio(id ?? ""),
    queryFn: () => api.getAnuncio(id ?? ""),
    enabled: Boolean(id),
  });

export const useNotificationsQuery = () =>
  useQuery({
    queryKey: queryKeys.notifications,
    queryFn: api.listNotifications,
  });

export const useMarkNotificationReadMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.markNotificationRead(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
    },
  });
};

export const useMarkAllNotificationsReadMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.markAllNotificationsRead,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
    },
  });
};

export const useNotificationPreferencesQuery = () =>
  useQuery({
    queryKey: queryKeys.notificationPreferences,
    queryFn: api.getNotificationPreferences,
  });

export const useUpdateNotificationPreferencesMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<NotificationPreferences>) => api.updateNotificationPreferences(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.notificationPreferences });
    },
  });
};

export const usePlanosQuery = () =>
  useQuery({
    queryKey: queryKeys.planos,
    queryFn: api.getPlanos,
  });

export const useSubscribePlanMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SubscribePlanInput) => api.subscribePlan(payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.planos }),
        queryClient.invalidateQueries({ queryKey: queryKeys.creditos }),
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard }),
      ]);
    },
  });
};

export const useCancelSubscriptionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.cancelSubscription,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.planos });
    },
  });
};

export const useUpdatePaymentMethodMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdatePaymentMethodInput) => api.updatePaymentMethod(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.planos });
    },
  });
};

export const useCreditosQuery = () =>
  useQuery({
    queryKey: queryKeys.creditos,
    queryFn: api.getCreditos,
  });

export const useBuyCreditsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CheckoutCreditsInput) => api.buyCredits(payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.creditos }),
        queryClient.invalidateQueries({ queryKey: queryKeys.planos }),
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard }),
      ]);
    },
  });
};

export const useInsightsQuery = () =>
  useQuery({
    queryKey: queryKeys.insights,
    queryFn: api.getInsights,
  });

export const useProfileQuery = () =>
  useQuery({
    queryKey: queryKeys.profile,
    queryFn: api.getProfile,
  });

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UserProfile) => api.updateProfile(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.profile });
    },
  });
};

export const useSettingsQuery = () =>
  useQuery({
    queryKey: queryKeys.settings,
    queryFn: api.getSettings,
  });

export const useUpdateSettingsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UserSettingsPreferences) => api.updateSettings(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.settings });
    },
  });
};
