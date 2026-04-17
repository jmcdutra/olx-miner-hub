import { TrendingUp, TrendingDown, Activity, DollarSign, Target, Sparkles } from "lucide-react";
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";

const lucroData = [
  { mes: "Out", lucro: 1200 },
  { mes: "Nov", lucro: 2400 },
  { mes: "Dez", lucro: 1800 },
  { mes: "Jan", lucro: 3200 },
  { mes: "Fev", lucro: 4100 },
  { mes: "Mar", lucro: 5800 },
  { mes: "Abr", lucro: 8200 },
];

const categoriaData = [
  { name: "Eletrônicos", value: 45, color: "hsl(var(--primary))" },
  { name: "Games", value: 25, color: "hsl(var(--accent))" },
  { name: "Móveis", value: 18, color: "hsl(var(--success))" },
  { name: "Outros", value: 12, color: "hsl(var(--muted-foreground))" },
];

const Insights = () => {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Painel analítico"
        title="Insights"
        description="Veja o desempenho real das suas operações de garimpo."
      />

      <div className="mb-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Lucro estimado", value: "R$ 8.200", delta: "+42%", up: true, icon: DollarSign },
          { label: "Margem média", value: "28%", delta: "+3.2pp", up: true, icon: TrendingUp },
          { label: "Anúncios analisados", value: "847", delta: "+128", up: true, icon: Activity },
          { label: "Tempo médio venda", value: "5,2 dias", delta: "-1,1d", up: false, icon: Target },
        ].map((s, i) => (
          <div key={i} className="rounded-3xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <s.icon className="h-[18px] w-[18px]" strokeWidth={2.6} />
              </div>
              <div className={`flex items-center gap-1 rounded-full px-2 py-0.5 font-display text-[11px] font-extrabold ${s.up ? "bg-success/10 text-success" : "bg-accent/10 text-accent"}`}>
                {s.up ? <TrendingUp className="h-3 w-3" strokeWidth={3} /> : <TrendingDown className="h-3 w-3" strokeWidth={3} />}
                {s.delta}
              </div>
            </div>
            <div className="font-display text-[32px] font-extrabold leading-none text-foreground">{s.value}</div>
            <div className="mt-2 text-[13px] font-semibold text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        <div className="rounded-3xl border border-border bg-card p-7">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-display text-[20px] font-extrabold text-foreground">Lucro acumulado</h2>
              <p className="mt-1 text-[13px] text-muted-foreground">Últimos 7 meses</p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-success/10 px-3 py-1.5 font-display text-[12px] font-extrabold text-success">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={2.8} />
              Crescimento de 583%
            </div>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lucroData}>
                <defs>
                  <linearGradient id="barG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(var(--accent))" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" fontSize={12} fontWeight={600} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} fontWeight={600} tickFormatter={(v) => `R$${v / 1000}k`} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--border))', fontFamily: 'Sora', fontWeight: 700 }} formatter={(v: number) => [`R$ ${v.toLocaleString('pt-BR')}`, 'Lucro']} />
                <Bar dataKey="lucro" fill="url(#barG)" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-7">
          <h2 className="font-display text-[20px] font-extrabold text-foreground">Por categoria</h2>
          <p className="mt-1 text-[13px] text-muted-foreground">Distribuição de oportunidades</p>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoriaData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" paddingAngle={4}>
                  {categoriaData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--border))', fontFamily: 'Sora', fontWeight: 700 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {categoriaData.map((c, i) => (
              <div key={i} className="flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />
                  <span className="font-display font-bold text-foreground">{c.name}</span>
                </div>
                <span className="font-display font-extrabold text-foreground">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default Insights;
