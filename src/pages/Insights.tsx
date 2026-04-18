import { TrendingUp, TrendingDown } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { PageErrorState, PageLoadingState } from "@/components/QueryStates";
import { useInsightsQuery } from "@/hooks/api";
import { getErrorMessage } from "@/lib/api/get-error-message";

const fmt = (value: number) => value.toLocaleString("pt-BR");

const Insights = () => {
  const { data, isLoading, isError, error, refetch } = useInsightsQuery();

  if (isLoading) {
    return (
      <AppShell>
        <PageLoadingState title="Carregando insights" description="Montando metricas, distribuicoes e historico de lucro." />
      </AppShell>
    );
  }

  if (isError || !data) {
    return (
      <AppShell>
        <PageErrorState
          title="Nao foi possivel carregar os insights"
          description="As metricas desta area nao puderam ser consolidadas agora."
          details={getErrorMessage(error)}
          onRetry={() => {
            void refetch();
          }}
        />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader
        title="Insights"
        description="Desempenho real das suas operações de garimpo."
      />

      <div className="mb-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {data.metrics.map((metric) => (
          <div key={metric.label} className="rounded-lg border border-border bg-card p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{metric.label}</div>
            <div className="mt-1.5 flex items-baseline gap-2">
              <span className="price font-display text-[24px] font-extrabold leading-none text-foreground">{metric.value}</span>
              <span className={`inline-flex items-center gap-0.5 rounded px-1 py-0.5 font-display text-[10.5px] font-extrabold ${
                metric.up ? "bg-success-soft text-success" : "bg-accent-soft text-accent"
              }`}>
                {metric.up ? <TrendingUp className="h-2.5 w-2.5" strokeWidth={3} /> : <TrendingDown className="h-2.5 w-2.5" strokeWidth={3} />}
                {metric.delta}
              </span>
            </div>
            <div className="mt-1.5 text-[11.5px] text-muted-foreground">vs. mês anterior</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-[15px] font-extrabold text-foreground">Lucro acumulado</h2>
              <p className="text-[12px] text-muted-foreground">Últimos 7 meses</p>
            </div>
            <span className="rounded bg-success-soft px-2 py-0.5 font-display text-[11px] font-extrabold text-success">+583%</span>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.lucroData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12, fontWeight: 700 }} formatter={(value: number) => [`R$ ${fmt(value)}`, "Lucro"]} />
                <Bar dataKey="lucro" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-5">
          <h2 className="font-display text-[15px] font-extrabold text-foreground">Por categoria</h2>
          <p className="text-[12px] text-muted-foreground">Distribuição de oportunidades</p>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.categoriaData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={2}>
                  {data.categoriaData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12, fontWeight: 700 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 space-y-1.5">
            {data.categoriaData.map((categoria) => (
              <div key={categoria.name} className="flex items-center justify-between text-[12.5px]">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-sm" style={{ background: categoria.color }} />
                  <span className="font-semibold text-foreground">{categoria.name}</span>
                </div>
                <span className="price font-display font-extrabold text-foreground">{categoria.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default Insights;
