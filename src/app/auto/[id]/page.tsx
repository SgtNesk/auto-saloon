import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ImageCarousel from "@/components/ImageCarousel";
import { prisma } from "@/lib/db";

function fmtPrice(n: number) {
  return n.toLocaleString("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
}

export default async function CarDetailPage({ params }: { params: { id: string } }) {
  const car = await prisma.car.findUnique({ where: { id: parseInt(params.id) } });

  if (!car || car.status !== "DISPONIBILE") notFound();

  return (
    <>
      <Navbar />
      <div className="page">
        <Link href="/" className="back-btn">← Torna alla vetrina</Link>
        <div className="detail-grid">
          <div>
            <ImageCarousel images={car.images} emoji={car.emoji} />
            <div style={{ marginTop: 24 }}>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: "var(--muted)", marginBottom: 4 }}>{car.brand}</div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: 44, letterSpacing: 1, marginBottom: 20 }}>{car.model}</h1>
              <div className="detail-specs-grid">
                {[
                  ["Anno", car.year],
                  ["Chilometri", `${car.km.toLocaleString("it-IT")} km`],
                  ["Carburante", car.fuel],
                  ["Colore", car.color ?? "—"],
                ].map(([l, v]) => (
                  <div key={String(l)} className="spec-box">
                    <div className="label">{l}</div>
                    <div className="value">{v}</div>
                  </div>
                ))}
              </div>
              {car.description && (
                <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7, marginTop: 8 }}>{car.description}</p>
              )}
              {!car.description && (
                <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7 }}>
                  Veicolo in ottimo stato, revisione regolare, disponibile per visita e prova su strada. Finanziamento disponibile con le principali finanziarie partner.
                </p>
              )}
            </div>
          </div>

          <div>
            <div className="price-box" style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: "var(--muted)", marginBottom: 4 }}>Prezzo di vendita</div>
              <div className="price-big">{fmtPrice(car.price)}</div>
              <a href="tel:+390000000000" className="btn-primary">📞 CONTATTA ORA</a>
              <a href="https://wa.me/390000000000" className="btn-secondary">💬 Invia WhatsApp</a>
            </div>
            <div className="price-box">
              <div className="features-list">
                {[
                  ["🛡️", "Garanzia", "12 mesi"],
                  ["📋", "Documenti", "Pronti"],
                  ["🔧", "Tagliando", "Eseguito"],
                  ["💳", "Finanziamento", "Disponibile"],
                ].map(([ic, l, v]) => (
                  <div key={l} className="feature-row">
                    <span style={{ fontSize: 22 }}>{ic}</span>
                    <div>
                      <div className="fl">{l}</div>
                      <div className="fv">{v}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
