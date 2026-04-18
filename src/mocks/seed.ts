import { anuncios, mineracoes, movimentacoes, notificacoes, planos } from "@/data/mock";
import { createCreditPackage, createDashboardActivity, createInsightProfitPoint, createMockDbState, clone } from "@/mocks/factories";

export const createInitialMockState = () =>
  createMockDbState({
    mineracoes: clone(mineracoes),
    anuncios: clone(anuncios),
    movimentacoes: clone(movimentacoes),
    notificacoes: clone(notificacoes),
    planos: clone(planos),
    creditPackages: [
      createCreditPackage({ qtd: 10, preco: 19.9, bonus: 0, popular: false }),
      createCreditPackage({ qtd: 25, preco: 49.9, bonus: 5, popular: true }),
      createCreditPackage({ qtd: 60, preco: 99.9, bonus: 15, popular: false }),
    ],
    recentActivity: [
      createDashboardActivity({ id: "act-1", color: "bg-accent", title: "Novo iPhone abaixo de R$ 3.300", time: "2 min", link: "/anuncio/anuncio-1" }),
      createDashboardActivity({ id: "act-2", color: "bg-primary", title: "MacBook M1 caiu R$ 200", time: "1 h", link: "/mineracao/macbook-pro-m1" }),
      createDashboardActivity({ id: "act-3", color: "bg-success", title: "+50 créditos renovados", time: "ontem", link: "/creditos" }),
      createDashboardActivity({ id: "act-4", color: "bg-accent", title: "PlayStation 5 raro encontrado", time: "2d", link: "/mineracao/playstation-5" }),
      createDashboardActivity({ id: "act-5", color: "bg-muted-foreground", title: "Plano Pro renovou", time: "3d", link: "/planos" }),
    ],
    lucroData: [
      createInsightProfitPoint({ mes: "Out", lucro: 1200 }),
      createInsightProfitPoint({ mes: "Nov", lucro: 2400 }),
      createInsightProfitPoint({ mes: "Dez", lucro: 1800 }),
      createInsightProfitPoint({ mes: "Jan", lucro: 3200 }),
      createInsightProfitPoint({ mes: "Fev", lucro: 4100 }),
      createInsightProfitPoint({ mes: "Mar", lucro: 5800 }),
      createInsightProfitPoint({ mes: "Abr", lucro: 8200 }),
    ],
  });
