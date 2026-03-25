import Link from "next/link";
import Navbar from "@/components/Navbar";
import { prisma } from "@/lib/db";

function fmtPrice(n: number) {
  return n.toLocaleString("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
}

const BG_COLORS: Record<string, string> = {
  BMW: "linear-gradient(135deg, #1a2a4a 0%, #0f1a2e 100%)",
  Volkswagen: "linear-gradient(135deg, #1e1e3a 0%, #111 100%)",
  Audi: "linear-gradient(135deg, #2a1a1a 0%, #111 100%)",
  Mercedes: "linear-gradient(135deg, #1a2a1a 0%, #111 100%)",
  Toyota: "linear-gradient(135deg, #2a1a2a 0%, #111 100%)",
};

export const revalidate = 60;
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const cars = await prisma.car.findMany({
    where: { status: "DISPONIBILE" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="page-eyebrow">Selezionati per te</div>
        <h1 className="page-title">Il tuo prossimo<br />mezzo ti aspetta.</h1>
        <p className="page-sub">{cars.length} vetture disponibili · Finanziamento · Garanzia inclusa</p>

        {cars.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "var(--muted)" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🔧</div>
            <p>Nessuna vettura disponibile al momento.</p>
          </div>
        ) : (
          <div className="cars-grid">
            {cars.map((car) => (
              <Link key={car.id} href={`/auto/${car.id}`} className="car-card">
                <div
                  className="car-img-wrap"
                  style={{ background: BG_COLORS[car.brand] ?? "linear-gradient(135deg, #1a1a1a, #222)" }}
                >
                  {car.images.length > 0 ? (
                    <img src={car.images[0]} alt={`${car.brand} ${car.model}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span>{car.emoji}</span>
                  )}
                  <div className="car-badge">{car.year}</div>
                </div>
                <div className="car-body">
                  <div className="car-brand">{car.brand}</div>
                  <div className="car-name">{car.model}</div>
                  <div className="car-specs">
                    <div className="car-spec">km<span>{car.km.toLocaleString("it-IT")}</span></div>
                    <div className="car-spec">carb.<span>{car.fuel}</span></div>
                  </div>
                  <div className="car-price">{fmtPrice(car.price)}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
