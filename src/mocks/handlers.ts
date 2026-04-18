import { delay, http, HttpResponse } from "msw";
import { mockDb } from "@/mocks/db";
import { createMineracaoSchema, profileSchema, settingsPreferencesSchema } from "@/lib/schemas";
import type {
  CheckoutCreditsInput,
  CreateMineracaoInput,
  NotificationPreferences,
  SubscribePlanInput,
  UpdatePaymentMethodInput,
} from "@/types/entities";

const API_PREFIX = "/api";

const withDelay = async (duration = 250) => {
  await delay(duration);
};

export const handlers = [
  http.get(`${API_PREFIX}/dashboard`, async () => {
    await withDelay();
    return HttpResponse.json(mockDb.getDashboard());
  }),

  http.get(`${API_PREFIX}/search`, async ({ request }) => {
    await withDelay(180);
    const url = new URL(request.url);
    const q = url.searchParams.get("q") ?? "";
    return HttpResponse.json(mockDb.search(q));
  }),

  http.get(`${API_PREFIX}/mineracoes`, async () => {
    await withDelay();
    return HttpResponse.json(mockDb.listMineracoes());
  }),

  http.post(`${API_PREFIX}/mineracoes`, async ({ request }) => {
    await withDelay(500);
    const payload = await request.json();
    const parsed = createMineracaoSchema.safeParse(payload);
    if (!parsed.success) {
      return HttpResponse.json(
        { message: "Payload inválido", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const mineracao = mockDb.createMineracao(parsed.data as CreateMineracaoInput);
    return HttpResponse.json(mineracao, { status: 201 });
  }),

  http.get(`${API_PREFIX}/mineracoes/:id`, async ({ params }) => {
    await withDelay();
    const data = mockDb.getMineracao(String(params.id));
    if (!data) return HttpResponse.json({ message: "Mineração não encontrada" }, { status: 404 });
    return HttpResponse.json(data);
  }),

  http.patch(`${API_PREFIX}/mineracoes/:id/status`, async ({ params }) => {
    await withDelay(220);
    const item = mockDb.toggleMineracaoStatus(String(params.id));
    if (!item) return HttpResponse.json({ message: "Mineração não encontrada" }, { status: 404 });
    return HttpResponse.json(item);
  }),

  http.delete(`${API_PREFIX}/mineracoes/:id`, async ({ params }) => {
    await withDelay(250);
    const item = mockDb.deleteMineracao(String(params.id));
    if (!item) return HttpResponse.json({ message: "Mineração não encontrada" }, { status: 404 });
    return HttpResponse.json(item);
  }),

  http.get(`${API_PREFIX}/anuncios`, async () => {
    await withDelay();
    return HttpResponse.json(mockDb.listAnuncios());
  }),

  http.get(`${API_PREFIX}/anuncios/:id`, async ({ params }) => {
    await withDelay();
    const data = mockDb.getAnuncio(String(params.id));
    if (!data) return HttpResponse.json({ message: "Anúncio não encontrado" }, { status: 404 });
    return HttpResponse.json(data);
  }),

  http.get(`${API_PREFIX}/notificacoes`, async () => {
    await withDelay();
    return HttpResponse.json({ items: mockDb.listNotificacoes() });
  }),

  http.patch(`${API_PREFIX}/notificacoes/:id/read`, async ({ params }) => {
    await withDelay(160);
    const item = mockDb.markNotificationAsRead(Number(params.id));
    if (!item) return HttpResponse.json({ message: "Notificação não encontrada" }, { status: 404 });
    return HttpResponse.json(item);
  }),

  http.patch(`${API_PREFIX}/notificacoes/read-all`, async () => {
    await withDelay(180);
    return HttpResponse.json({ items: mockDb.markAllNotificationsAsRead() });
  }),

  http.get(`${API_PREFIX}/notificacoes/preferences`, async () => {
    await withDelay();
    return HttpResponse.json({ preferences: mockDb.getNotificationPreferences() });
  }),

  http.patch(`${API_PREFIX}/notificacoes/preferences`, async ({ request }) => {
    await withDelay(220);
    const payload = (await request.json()) as Partial<NotificationPreferences>;
    return HttpResponse.json({ preferences: mockDb.updateNotificationPreferences(payload) });
  }),

  http.get(`${API_PREFIX}/planos`, async () => {
    await withDelay();
    return HttpResponse.json(mockDb.getPlans());
  }),

  http.post(`${API_PREFIX}/planos/subscribe`, async ({ request }) => {
    await withDelay(500);
    const payload = (await request.json()) as SubscribePlanInput;
    const data = mockDb.subscribePlan(payload);
    if (!data) return HttpResponse.json({ message: "Plano não encontrado" }, { status: 404 });
    return HttpResponse.json(data);
  }),

  http.post(`${API_PREFIX}/planos/cancel`, async () => {
    await withDelay(400);
    return HttpResponse.json(mockDb.cancelSubscription());
  }),

  http.patch(`${API_PREFIX}/planos/payment-method`, async ({ request }) => {
    await withDelay(350);
    const payload = (await request.json()) as UpdatePaymentMethodInput;
    return HttpResponse.json(mockDb.updatePaymentMethod(payload));
  }),

  http.get(`${API_PREFIX}/creditos`, async () => {
    await withDelay();
    return HttpResponse.json(mockDb.getCredits());
  }),

  http.post(`${API_PREFIX}/creditos/checkout`, async ({ request }) => {
    await withDelay(550);
    const payload = (await request.json()) as CheckoutCreditsInput;
    return HttpResponse.json(mockDb.buyCredits(payload));
  }),

  http.get(`${API_PREFIX}/insights`, async () => {
    await withDelay();
    return HttpResponse.json(mockDb.getInsights());
  }),

  http.get(`${API_PREFIX}/perfil`, async () => {
    await withDelay();
    return HttpResponse.json({ profile: mockDb.getProfile() });
  }),

  http.put(`${API_PREFIX}/perfil`, async ({ request }) => {
    await withDelay(250);
    const payload = await request.json();
    const parsed = profileSchema.safeParse(payload);
    if (!parsed.success) {
      return HttpResponse.json(
        { message: "Payload inválido", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }
    return HttpResponse.json({ profile: mockDb.updateProfile(parsed.data) });
  }),

  http.get(`${API_PREFIX}/preferencias`, async () => {
    await withDelay();
    return HttpResponse.json({ preferences: mockDb.getSettings() });
  }),

  http.patch(`${API_PREFIX}/preferencias`, async ({ request }) => {
    await withDelay(220);
    const payload = await request.json();
    const parsed = settingsPreferencesSchema.safeParse(payload);
    if (!parsed.success) {
      return HttpResponse.json(
        { message: "Payload inválido", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }
    return HttpResponse.json({ preferences: mockDb.updateSettings(parsed.data) });
  }),
];
