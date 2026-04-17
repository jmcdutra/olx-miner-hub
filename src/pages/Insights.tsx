import { TrendingUp, TrendingDown } from "lucide-react";
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell } from "recharts";
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
  { name: "Celulares", value: 45, color: "hsl(var(--primary))" },
  { name: "Games", value: 25, color: "hsl(var(--accent))" },
  { name: "Notebooks", value: 18, color: "hsl(var(--success))" },
  { name: "Outros", value: 12, color: "hsl(var(--muted-foreground))" },
];

const fmt = (v: number) => v.toLocaleString("pt-BR");

const Insights = () => {
  return (
    <AppShell>
      <PageHeader
        title="Insights"
        description="Desempenho real das suas operações de garimpo."
      />

      <div className="mb-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Lucro estimado", value: "R$ 8.200", delta: "+42%", up: true },
          { label: "Margem média", value: "28%", delta: "+3,2pp", up: true },
          { label: "Anúncios analisados", value: "847", delta: "+128", up: true },
          { label: "Tempo médio venda", value: "5,2 dias", delta: "-1,1d", up: false },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-card p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{s.label}</div>
            <div className="mt-1.5 flex items-baseline gap-2">
              <span className="font-display text-[24px] font-extrabold leading-none text-foreground price">{s.value}</span>
              <span className={`inline-flex items-center gap-0.5 rounded px-1 py-0.5 font-display text-[10.5px] font-extrabold ${
                s.up ? "bg-success-soft text-success" : "bg-accent-soft text-accent"
              }`}>
                {s.up ? <TrendingUp className="h-2.5 w-2.5" strokeWidth={3} /> : <TrendingDown className="h-2.5 w-2.5" strokeWidth={3} />}
                {s.delta}
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
              <BarChart data={lucroData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12, fontWeight: 700 }} formatter={(v: number) => [`R$ ${fmt(v)}`, "Lucro"]} />
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
                <Pie data={categoriaData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={2}>
                  {categoriaData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12, fontWeight: 700 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 space-y-1.5">
            {categoriaData.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-[12.5px]">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-sm" style={{ background: c.color }} />
                  <span className="font-semibold text-foreground">{c.name}</span>
                </div>
                <span className="font-display font-extrabold text-foreground price">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default Insights;
