import type {
  CheckoutCreditsInput,
  CreditsOverview,
  CreateMineracaoInput,
  DashboardResponse,
  InsightCategoryPoint,
  InsightsMetric,
  InsightsResponse,
  NotificationPreferences,
  SearchResponse,
  SettingsResponse,
  SubscribePlanInput,
  UpdatePaymentMethodInput,
  UserProfile,
  UserSettingsPreferences,
} from "@/types/entities";
import type { MockDbState } from "@/mocks/contracts";
import {
  clone,
  createDashboardActivity,
  createMineracao,
  createMovimentacao,
} from "@/mocks/factories";
import { createInitialMockState } from "@/mocks/seed";

let db: MockDbState = createInitialMockState();

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const normalize = (value?: string) =>
  (value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const fmt = (value: number) => value.toLocaleString("pt-BR");
const getAtivasCount = () => db.mineracoes.filter((item) => item.status === "ativo").length;
const getCurrentPlan = () => db.planos.find((item) => item.atual) ?? db.planos[1] ?? db.planos[0];

const getCreditsOverview = (): CreditsOverview => {
  const planoCreditos = getCurrentPlan()?.creditos ?? 0;
  const ativas = getAtivasCount();
  const avulsos = db.avulsos;

  return {
    planoCreditos,
    ativas,
    avulsos,
    totalDisponivel: planoCreditos + avulsos - ativas,
    usagePct: Math.round((ativas / planoCreditos) * 100),
    pacotes: clone(db.creditPackages),
    movimentacoes: clone(db.movimentacoes),
  };
};

const getDashboardStats = (): DashboardResponse["stats"] => {
  const totalAnuncios = db.mineracoes.reduce((acc, item) => acc + item.anuncios, 0);
  const novosHoje = db.mineracoes.reduce((acc, item) => acc + item.novosHoje, 0);
  const ativas = getAtivasCount();

  return [
    { id: "ativas", label: "Ativas", value: String(ativas), hint: `${ativas} de 50 vagas no plano`, accent: true },
    { id: "monitorados", label: "Anúncios Monitorados", value: fmt(totalAnuncios), hint: `+${novosHoje} atualizações hoje` },
    { id: "margem", label: "Margem Média", value: "28%", hint: "8% acima da sua meta" },
    { id: "lucro", label: "Lucro Estimado", value: "R$ 8.2k", hint: "Com base no menor preço" },
  ];
};

const buildInsightsMetrics = (): InsightsMetric[] => [
  { label: "Lucro estimado", value: "R$ 8.200", delta: "+42%", up: true },
  { label: "Margem média", value: "28%", delta: "+3,2pp", up: true },
  { label: "Anúncios analisados", value: "847", delta: "+128", up: true },
  { label: "Tempo médio venda", value: "5,2 dias", delta: "-1,1d", up: false },
];

const buildInsightsCategories = (): InsightCategoryPoint[] => {
  const total = db.mineracoes.length || 1;
  const grouped = db.mineracoes.reduce<Record<string, number>>((acc, item) => {
    acc[item.categoria] = (acc[item.categoria] ?? 0) + 1;
    return acc;
  }, {});

  const palette = [
    "hsl(var(--primary))",
    "hsl(var(--accent))",
    "hsl(var(--success))",
    "hsl(var(--muted-foreground))",
  ];

  return Object.entries(grouped).map(([name, count], index) => ({
    name,
    value: Math.round((count / total) * 100),
    color: palette[index % palette.length],
  }));
};

const pushRecentActivity = (title: string, link: string, color = "bg-primary") => {
  db.recentActivity.unshift(
    createDashboardActivity({
      id: `act-${Date.now()}`,
      color,
      title,
      time: "agora",
      link,
    }),
  );
};

export const mockDb = {
  reset() {
    db = createInitialMockState();
  },

  getDashboard(): DashboardResponse {
    return {
      mineracoes: clone(db.mineracoes),
      stats: getDashboardStats(),
      recentActivity: clone(db.recentActivity),
    };
  },

  search(query: string): SearchResponse {
    const normalized = normalize(query);
    if (!normalized) {
      return { mineracoes: [], anuncios: [] };
    }

    return {
      mineracoes: db.mineracoes.filter((item) => normalize(item.titulo).includes(normalized)).slice(0, 4),
      anuncios: db.anuncios.filter((item) => normalize(item.titulo).includes(normalized)).slice(0, 4),
    };
  },

  listMineracoes() {
    return clone(db.mineracoes);
  },

  getMineracao(id: string) {
    const mineracao = db.mineracoes.find((item) => item.id === id);
    if (!mineracao) return null;

    return {
      mineracao: clone(mineracao),
      anuncios: db.anuncios.filter((item) => item.mineracaoId === id).map(clone),
    };
  },

  createMineracao(input: CreateMineracaoInput) {
    const newId = `${slugify(input.produto)}-${Date.now()}`;
    const cidade = input.cidade ? `${input.cidade}, ${input.estado}` : input.estado;
    const menorPreco = Math.round(input.precoMax * 0.92);
    const precoAlvo = input.precoAlvo ?? Math.round(input.precoMax * 1.2);

    const mineracao = createMineracao({
      id: newId,
      titulo: input.produto,
      categoria: input.categoria,
      cidade,
      precoMin: input.precoMin ?? Math.round(input.precoMax * 0.75),
      precoMax: input.precoMax,
      precoAlvo,
      status: "ativo",
      anuncios: 0,
      novosHoje: 0,
      atualizadoHa: "agora",
      menorPreco,
      margem: precoAlvo > 0 ? Number((((precoAlvo - menorPreco) / precoAlvo) * 100).toFixed(1)) : 0,
      historico: [
        { dia: "Seg", preco: input.precoMax },
        { dia: "Ter", preco: Math.round(input.precoMax * 0.99) },
        { dia: "Qua", preco: Math.round(input.precoMax * 0.98) },
        { dia: "Qui", preco: Math.round(input.precoMax * 0.97) },
        { dia: "Sex", preco: Math.round(input.precoMax * 0.95) },
        { dia: "Sab", preco: Math.round(input.precoMax * 0.94) },
        { dia: "Dom", preco: menorPreco },
      ],
    });

    db.mineracoes.unshift(mineracao);
    db.movimentacoes.unshift(
      createMovimentacao({
        id: Date.now(),
        tipo: "debito",
        descricao: `Mineração: ${input.produto}`,
        detalhe: "Nova operação criada",
        valor: -1,
        data: "hoje",
      }),
    );
    pushRecentActivity(`Nova mineração criada: ${input.produto}`, `/mineracao/${newId}`);

    return clone(mineracao);
  },

  toggleMineracaoStatus(id: string) {
    const mineracao = db.mineracoes.find((item) => item.id === id);
    if (!mineracao) return null;

    mineracao.status = mineracao.status === "ativo" ? "pausado" : "ativo";
    pushRecentActivity(
      mineracao.status === "ativo" ? `${mineracao.titulo} foi retomada` : `${mineracao.titulo} foi pausada`,
      `/mineracao/${mineracao.id}`,
      mineracao.status === "ativo" ? "bg-success" : "bg-warning",
    );
    return clone(mineracao);
  },

  deleteMineracao(id: string) {
    const mineracao = db.mineracoes.find((item) => item.id === id);
    if (!mineracao) return null;

    db.mineracoes = db.mineracoes.filter((item) => item.id !== id);
    db.anuncios = db.anuncios.filter((item) => item.mineracaoId !== id);
    pushRecentActivity(`Mineração removida: ${mineracao.titulo}`, "/", "bg-destructive");
    return clone(mineracao);
  },

  listAnuncios() {
    return clone(db.anuncios);
  },

  getAnuncio(id: string) {
    const anuncio = db.anuncios.find((item) => item.id === id);
    if (!anuncio) return null;

    const mineracao = db.mineracoes.find((item) => item.id === anuncio.mineracaoId);
    if (!mineracao) return null;

    return {
      anuncio: clone(anuncio),
      mineracao: clone(mineracao),
    };
  },

  listNotificacoes() {
    return clone(db.notificacoes);
  },

  markNotificationAsRead(id: number) {
    const item = db.notificacoes.find((notification) => notification.id === id);
    if (!item) return null;

    item.lida = true;
    return clone(item);
  },

  markAllNotificationsAsRead() {
    db.notificacoes = db.notificacoes.map((item) => ({ ...item, lida: true }));
    return clone(db.notificacoes);
  },

  getNotificationPreferences() {
    return clone(db.notificationPreferences);
  },

  updateNotificationPreferences(input: Partial<NotificationPreferences>) {
    db.notificationPreferences = { ...db.notificationPreferences, ...input };
    return clone(db.notificationPreferences);
  },

  getPlans() {
    return {
      planos: clone(db.planos),
      subscription: clone(db.subscription),
    };
  },

  buyCredits(input: CheckoutCreditsInput) {
    const total = input.qtd + (input.bonus ?? 0);
    db.avulsos += total;
    db.movimentacoes.unshift(
      createMovimentacao({
        id: Date.now(),
        tipo: "credito",
        descricao: `Pacote ${input.qtd}${input.bonus ? ` + ${input.bonus} bônus` : ""}`,
        detalhe: "Compra aprovada no checkout demo",
        valor: total,
        data: "hoje",
      }),
    );
    pushRecentActivity(`+${total} créditos adicionados à conta`, "/creditos", "bg-success");
    return getCreditsOverview();
  },

  subscribePlan(input: SubscribePlanInput) {
    const target = db.planos.find((item) => item.id === input.planId);
    if (!target) return null;

    db.planos = db.planos.map((item) => ({ ...item, atual: item.id === input.planId }));
    db.subscription = {
      ...db.subscription,
      planId: target.id,
      planName: target.nome,
      amount: target.preco,
      status: "active",
    };
    pushRecentActivity(`Plano alterado para ${target.nome}`, "/planos");

    return {
      planos: clone(db.planos),
      subscription: clone(db.subscription),
    };
  },

  cancelSubscription() {
    db.subscription = {
      ...db.subscription,
      status: "canceled",
    };
    pushRecentActivity("Assinatura cancelada no fim do ciclo", "/planos", "bg-muted-foreground");

    return {
      planos: clone(db.planos),
      subscription: clone(db.subscription),
    };
  },

  updatePaymentMethod(input: UpdatePaymentMethodInput) {
    db.subscription = {
      ...db.subscription,
      paymentMethod: {
        brand: input.brand,
        last4: input.last4,
      },
    };

    return {
      planos: clone(db.planos),
      subscription: clone(db.subscription),
    };
  },

  getCredits(): CreditsOverview {
    return getCreditsOverview();
  },

  getInsights(): InsightsResponse {
    return {
      metrics: buildInsightsMetrics(),
      lucroData: clone(db.lucroData),
      categoriaData: buildInsightsCategories(),
    };
  },

  getProfile() {
    return clone(db.profile);
  },

  updateProfile(input: UserProfile) {
    db.profile = { ...input };
    return clone(db.profile);
  },

  getSettings(): SettingsResponse["preferences"] {
    return clone(db.settings);
  },

  updateSettings(input: UserSettingsPreferences) {
    db.settings = { ...input };
    return clone(db.settings);
  },
};
