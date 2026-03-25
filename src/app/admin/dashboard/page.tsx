import Navbar from "@/components/Navbar";
import { prisma } from "@/lib/db";

function fmtPrice(n: number) {
  return n.toLocaleString("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
}

export const revalidate = 0;

export default async function DashboardPage() {
  const [transactions, cars] = await Promise.all([
    prisma.transaction.findMany({ orderBy: { date: "desc" }, take: 10 }),
    prisma.car.findMany(),
  ]);

  const ricavi = transactions.filter(t => t.amount > 0).reduce((a, t) => a + t.amount, 0);
  const costi = transactions.filter(t => t.amount < 0).reduce((a, t) => a + Math.abs(t.amount), 0);
  const margine = ricavi - costi;
  const disponibili = cars.filter(c => c.status === "DISPONIBILE").length;

  const marginiAuto = cars
    .filter(c => c.costAcquisto > 0)
    .map(c => ({ name: `${c.brand} ${c.model.split(" ")[0]}`, margine: c.price - c.costAcquisto, pct: ((c.price - c.costAcquisto) / c.price) * 100 }))
    .sort((a, b) => b.margine - a.margine)
    .slice(0, 5);

  const maxMargine = Math.max(...marginiAuto.map(m => m.margine));

  return (
    <>
      <Navbar isAdmin />
      <div className="page">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-sub">Panoramica economica · aggiornata in tempo reale</p>

        <div className="kpi-grid">
          {[
            { label: "Ricavi", value: fmtPrice(ricavi), delta: null },
            { label: "Costi", value: fmtPrice(costi), delta: null },
            { label: "Margine Netto", value: fmtPrice(margine), delta: margine > 0 ? `+${((margine / (ricavi || 1)) * 100).toFixed(0)}%` : null, up: margine > 0 },
            { label: "Auto Disponibili", value: String(disponibili), delta: `${cars.length} totali`, up: null },
          ].map(k => (
            <div key={k.label} className="kpi-card">
              <div className="kpi-label">{k.label}</div>
              <div className="kpi-value">{k.value}</div>
              {k.delta && <div className={`kpi-delta ${k.up === true ? "up" : k.up === false ? "down" : ""}`}>{k.delta}</div>}
            </div>
          ))}
        </div>

        <div className="dash-grid">
          <div className="dash-card">
            <div className="dash-card-title">Margine per Veicolo</div>
            {marginiAuto.length === 0 && <p style={{ color: "var(--muted)", fontSize: 14 }}>Nessun dato disponibile.</p>}
            {marginiAuto.map(m => (
              <div key={m.name} className="bar-row">
                <div className="bar-label">{m.name}</div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${(m.margine / maxMargine) * 100}%` }} />
                </div>
                <div className="bar-val">{fmtPrice(m.margine)}</div>
              </div>
            ))}
          </div>

          <div className="dash-card">
            <div className="dash-card-title">Ultime Transazioni</div>
            {transactions.length === 0 && <p style={{ color: "var(--muted)", fontSize: 14 }}>Nessuna transazione.</p>}
            {transactions.map(t => (
              <div key={t.id} className="tx-row">
                <div className="tx-meta">
                  <div className="tx-name">{t.description}</div>
                  <div className="tx-date">{new Date(t.date).toLocaleDateString("it-IT", { day: "2-digit", month: "short" })}</div>
                </div>
                <div className={`tx-amount ${t.amount > 0 ? "income" : "cost"}`}>
                  {t.amount > 0 ? "+" : ""}{fmtPrice(t.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
