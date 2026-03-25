"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavbarProps {
  isAdmin?: boolean;
}

export default function Navbar({ isAdmin = false }: NavbarProps) {
  const pathname = usePathname();

  return (
    <nav className="nav">
      <Link href="/" className="nav-logo">AUTOMARKET</Link>
      {isAdmin ? (
        <div className="nav-tabs">
          <Link href="/admin/dashboard" className={`nav-tab ${pathname === "/admin/dashboard" ? "active" : ""}`}>
            📊 Dashboard
          </Link>
          <Link href="/admin/gestione" className={`nav-tab ${pathname === "/admin/gestione" ? "active" : ""}`}>
            ⚙️ Gestione
          </Link>
          <form action="/api/auth/logout" method="POST">
            <button type="submit" className="nav-tab">🚪 Esci</button>
          </form>
        </div>
      ) : (
        <div className="nav-tabs">
          <Link href="/" className={`nav-tab ${pathname === "/" ? "active" : ""}`}>🏠 Vetrina</Link>
          <Link href="/rivenditore" className={`nav-tab ${pathname === "/rivenditore" ? "active" : ""}`}>🌅 Rivenditore</Link>
        </div>
      )}
      <span className="nav-badge">AutoMarket Pro</span>
    </nav>
  );
}
