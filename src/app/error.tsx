"use client";

export default function ErrorPage() {
  return (
    <main className="page" style={{ textAlign: "center", paddingTop: 96 }}>
      <div style={{ fontSize: 52, marginBottom: 16 }}>🔧</div>
      <h1 className="page-title">Servizio temporaneamente non disponibile</h1>
      <p className="page-sub">Riprova tra qualche istante.</p>
    </main>
  );
}
