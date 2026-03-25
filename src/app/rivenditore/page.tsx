import Link from "next/link";
import Navbar from "@/components/Navbar";

const perks = [
  {
    title: "Più serenita operativa",
    text: "Gestione stock, margini e vendite in una sola interfaccia, senza passaggi sparsi.",
    icon: "🌅",
  },
  {
    title: "Decisioni con lucidita",
    text: "Dashboard KPI per vedere subito cosa rende e dove intervenire con priorita.",
    icon: "📈",
  },
  {
    title: "Presentazione che emoziona",
    text: "Schede auto curate e immediate, pensate per trasmettere fiducia al primo sguardo.",
    icon: "✨",
  },
];

export default function RivenditorePage() {
  return (
    <>
      <Navbar />
      <main className="dealer-page">
        <section className="dealer-hero">
          <div className="dealer-glow dealer-glow-left" />
          <div className="dealer-glow dealer-glow-right" />

          <p className="dealer-eyebrow">Area Rivenditore</p>
          <h1 className="dealer-title">
            Vendi con calma,
            <br />
            guida con entusiasmo.
          </h1>
          <p className="dealer-sub">
            Una cabina di regia pensata per trasformare numeri e trattative in una routine chiara,
            leggera e redditizia.
          </p>

          <div className="dealer-actions">
            <Link href="/admin/login" className="dealer-cta dealer-cta-primary">
              Entra nel pannello
            </Link>
            <Link href="/" className="dealer-cta dealer-cta-secondary">
              Torna alla vetrina
            </Link>
          </div>
        </section>

        <section className="dealer-perks">
          {perks.map((perk) => (
            <article key={perk.title} className="dealer-card">
              <span className="dealer-card-icon">{perk.icon}</span>
              <h2>{perk.title}</h2>
              <p>{perk.text}</p>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
