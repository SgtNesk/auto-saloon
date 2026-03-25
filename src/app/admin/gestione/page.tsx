"use client";
import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";

type Car = {
  id: number; brand: string; model: string; year: number; km: number;
  fuel: string; color: string | null; price: number; costAcquisto: number;
  status: "DISPONIBILE" | "RISERVATO" | "VENDUTO"; description: string | null; emoji: string;
};

type CarForm = {
  brand: string;
  model: string;
  year: number;
  km: number;
  fuel: string;
  color: string;
  price: number;
  costAcquisto: number;
  status: Car["status"];
  description: string;
  emoji: string;
};

const FUELS = ["Benzina", "Diesel", "Ibrido", "Elettrico", "GPL"];
const STATUSES = ["DISPONIBILE", "RISERVATO", "VENDUTO"] as const;
const EMOJIS = ["🚗", "🚙", "🏎️", "🚘", "🚐", "🚑"];

function fmtPrice(n: number) {
  return n.toLocaleString("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
}

const empty: CarForm = { brand: "", model: "", year: new Date().getFullYear(), km: 0, fuel: "Benzina", color: "", price: 0, costAcquisto: 0, status: "DISPONIBILE", description: "", emoji: "🚗" };

export default function GestionePage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [filter, setFilter] = useState("TUTTI");
  const [showModal, setShowModal] = useState(false);
  const [editCar, setEditCar] = useState<Car | null>(null);
  const [form, setForm] = useState<CarForm>(empty);
  const [loading, setLoading] = useState(false);

  const fetchCars = useCallback(async () => {
    const res = await fetch("/api/cars");
    const data = await res.json();
    setCars(data);
  }, []);

  useEffect(() => { fetchCars(); }, [fetchCars]);

  const filtered = filter === "TUTTI" ? cars : cars.filter(c => c.status === filter);

  function openNew() { setEditCar(null); setForm(empty); setShowModal(true); }
  function openEdit(car: Car) {
    setEditCar(car);
    setForm({ brand: car.brand, model: car.model, year: car.year, km: car.km, fuel: car.fuel, color: car.color ?? "", price: car.price, costAcquisto: car.costAcquisto, status: car.status, description: car.description ?? "", emoji: car.emoji });
    setShowModal(true);
  }

  async function handleSave() {
    setLoading(true);
    try {
      const method = editCar ? "PUT" : "POST";
      const url = editCar ? `/api/cars/${editCar.id}` : "/api/cars";
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      await fetchCars();
      setShowModal(false);
    } finally { setLoading(false); }
  }

  async function handleDelete(id: number) {
    if (!confirm("Eliminare questa vettura?")) return;
    await fetch(`/api/cars/${id}`, { method: "DELETE" });
    await fetchCars();
  }

  async function changeStatus(id: number, status: Car["status"]) {
    await fetch(`/api/cars/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await fetchCars();
  }

  function setF(k: string, v: unknown) { setForm(f => ({ ...f, [k]: v })); }

  return (
    <>
      <Navbar isAdmin />
      <div className="page">
        <div className="mgmt-header">
          <div>
            <h1 className="page-title" style={{ fontSize: 38, marginBottom: 4 }}>Gestione Vettura</h1>
            <p className="page-sub" style={{ marginBottom: 0 }}>{cars.length} veicoli nel sistema</p>
          </div>
          <button className="btn-add" onClick={openNew}>＋ Aggiungi Auto</button>
        </div>

        <div className="table-wrap">
          <div style={{ display: "flex", gap: 8, padding: "16px 16px 0", flexWrap: "wrap" }}>
            {["TUTTI", ...STATUSES].map(s => (
              <button key={s} className={`filter-btn ${filter === s ? "active" : ""}`} onClick={() => setFilter(s)}>
                {s.charAt(0) + s.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
          <table className="mgmt-table" style={{ marginTop: 8 }}>
            <thead>
              <tr>
                <th>Veicolo</th><th>Anno</th><th>KM</th><th>Prezzo</th>
                <th>Costo Acq.</th><th>Margine</th><th>Stato</th><th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(car => {
                const m = car.price - car.costAcquisto;
                return (
                  <tr key={car.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 22 }}>{car.emoji}</span>
                        <div>
                          <div style={{ fontWeight: 500 }}>{car.brand} {car.model}</div>
                          <div style={{ fontSize: 12, color: "var(--muted)" }}>{car.fuel}</div>
                        </div>
                      </div>
                    </td>
                    <td className="mono text-muted">{car.year}</td>
                    <td className="mono text-muted">{car.km.toLocaleString("it-IT")}</td>
                    <td className="mono">{fmtPrice(car.price)}</td>
                    <td className="mono text-muted">{fmtPrice(car.costAcquisto)}</td>
                    <td className={`mono ${m > 0 ? "text-green" : "text-red"}`} style={{ fontWeight: 600 }}>{fmtPrice(m)}</td>
                    <td>
                      <select
                        value={car.status}
                        onChange={e => changeStatus(car.id, e.target.value as Car["status"])}
                        className={`status-pill ${car.status}`}
                        style={{ border: "none", background: "transparent", cursor: "pointer", fontFamily: "inherit", fontSize: 11 }}
                      >
                        {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>)}
                      </select>
                    </td>
                    <td>
                      <button className="action-btn" onClick={() => openEdit(car)} title="Modifica">✏️</button>
                      <button className="action-btn" onClick={() => handleDelete(car.id)} title="Elimina">🗑️</button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: "center", color: "var(--muted)", padding: "40px 16px" }}>Nessun veicolo trovato.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-title">{editCar ? "Modifica Scheda" : "Nuova Scheda Auto"}</div>
            <div className="form-grid">
              {([["brand", "Marca", "es. BMW"], ["model", "Modello", "es. Serie 3 320d"]] as [string, string, string][]).map(([k, l, p]) => (
                <div key={k} className="form-group">
                  <label className="form-label">{l}</label>
                  <input className="form-input" placeholder={p} value={String(form[k as keyof typeof form])} onChange={e => setF(k, e.target.value)} />
                </div>
              ))}
              <div className="form-group">
                <label className="form-label">Anno</label>
                <input className="form-input" type="number" placeholder="2021" value={form.year} onChange={e => setF("year", parseInt(e.target.value) || 0)} />
              </div>
              <div className="form-group">
                <label className="form-label">Chilometri</label>
                <input className="form-input" type="number" placeholder="45000" value={form.km} onChange={e => setF("km", parseInt(e.target.value) || 0)} />
              </div>
              <div className="form-group">
                <label className="form-label">Carburante</label>
                <select className="form-input" value={form.fuel} onChange={e => setF("fuel", e.target.value)}>
                  {FUELS.map(f => <option key={f}>{f}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Emoji</label>
                <select className="form-input" value={form.emoji} onChange={e => setF("emoji", e.target.value)}>
                  {EMOJIS.map(e => <option key={e}>{e}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Prezzo Vendita (€)</label>
                <input className="form-input" type="number" placeholder="24900" value={form.price || ""} onChange={e => setF("price", parseFloat(e.target.value) || 0)} />
              </div>
              <div className="form-group">
                <label className="form-label">Costo Acquisto (€)</label>
                <input className="form-input" type="number" placeholder="20000" value={form.costAcquisto || ""} onChange={e => setF("costAcquisto", parseFloat(e.target.value) || 0)} />
              </div>
              <div className="form-group">
                <label className="form-label">Stato</label>
                <select className="form-input" value={form.status} onChange={e => setF("status", e.target.value)}>
                  {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Colore</label>
                <input className="form-input" placeholder="es. Nero Metallico" value={form.color} onChange={e => setF("color", e.target.value)} />
              </div>
              <div className="form-group full">
                <label className="form-label">Descrizione</label>
                <textarea className="form-input" placeholder="Note sul veicolo..." rows={3} value={form.description} onChange={e => setF("description", e.target.value)} style={{ resize: "vertical" }} />
              </div>
            </div>
            <div className="form-actions">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Annulla</button>
              <button className="btn-save" onClick={handleSave} disabled={loading}>{loading ? "..." : "SALVA"}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
