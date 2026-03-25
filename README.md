# 🚗 AutoMarket Pro

SaaS per piccoli rivenditori di auto. Vetrina pubblica + gestione auto + dashboard costi/ricavi.

---

## Stack

- **Frontend + Backend**: Next.js 14 (App Router)
- **Database**: PostgreSQL 16
- **ORM**: Prisma
- **Container**: Docker + Docker Compose

---

## 🚀 Avvio in sviluppo (locale)

### 1. Clona e installa
```bash
git clone <repo>
cd automarket
npm install
```

### 2. Configura le env
```bash
cp .env.example .env
# Modifica .env con le tue preferenze
```

### 3. Avvia il DB Postgres
```bash
docker compose up db -d
```

### 4. Inizializza il DB
```bash
npm run db:migrate   # crea le tabelle
npm run db:seed      # carica dati di esempio
```

### 5. Avvia l'app
```bash
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000)

**Admin panel**: http://localhost:3000/admin  
Password default: `admin123`

---

## 🐳 Deploy con Docker Compose (produzione)

### 1. Sul server (es. Hetzner CX22)
```bash
# Installa Docker
curl -fsSL https://get.docker.com | sh

# Clona il progetto
git clone <repo>
cd automarket

# Crea il file .env
cp .env.example .env
nano .env  # <-- cambia TUTTE le password!
```

### 2. Genera un secret sicuro
```bash
openssl rand -base64 32
# Copia l'output in NEXTAUTH_SECRET nel .env
```

### 3. Avvia tutto
```bash
docker compose up -d --build
```

Il sito è online su `http://IP_DEL_SERVER:3000`

### 4. Aggiorna l'app
```bash
git pull
docker compose up -d --build app
```

---

## 💸 Opzioni di Hosting (dal più economico)

| Provider | Prezzo | Note |
|----------|--------|------|
| **Hetzner CX22** | ~€3.79/mese | 🏆 Miglior rapporto qualità/prezzo. VPS 2 vCPU 4GB RAM, uptime 99.9% |
| **Fly.io** | Gratis (con limiti) | Free tier: 3 shared VM + 3GB storage. Ottimo per MVP |
| **Render** | Gratis (sleep) / $7/mese | Free tier va in sleep dopo 15min inattività. Starter no sleep |
| **Railway** | $5 credito free poi ~$5/mese | Semplice deploy da GitHub, postgres incluso |

### 🏆 Raccomandazione: Hetzner CX22 + Nginx

Per €3.79/mese hai un VPS dedicato che non va mai in sleep, 
puoi gestire tranquillamente 10-20 rivenditori diversi sulla stessa macchina.

### Setup Nginx + SSL su Hetzner (opzionale)
```bash
# Installa Nginx e Certbot
sudo apt install nginx certbot python3-certbot-nginx -y

# Configura reverse proxy
sudo nano /etc/nginx/sites-available/automarket
```

```nginx
server {
    server_name tuodominio.it;
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/automarket /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# SSL gratuito con Let's Encrypt
sudo certbot --nginx -d tuodominio.it
```

---

## 📁 Struttura Progetto

```
automarket/
├── docker-compose.yml       # Postgres + App
├── Dockerfile               # Build produzione
├── docker-entrypoint.sh     # Migrations auto al boot
├── prisma/
│   ├── schema.prisma        # Modelli DB (Car, Transaction)
│   └── seed.ts              # Dati di esempio
└── src/
    ├── app/
    │   ├── page.tsx                    # 🌐 Vetrina pubblica
    │   ├── auto/[id]/page.tsx          # 🌐 Scheda auto
    │   ├── admin/
    │   │   ├── login/page.tsx          # 🔒 Login
    │   │   ├── dashboard/page.tsx      # 📊 Dashboard KPI
    │   │   └── gestione/page.tsx       # ⚙️ CRUD auto
    │   └── api/
    │       ├── auth/login              # POST login
    │       ├── auth/logout             # POST logout
    │       ├── cars                    # GET/POST cars
    │       ├── cars/[id]               # GET/PUT/DELETE car
    │       ├── transactions            # GET/POST transactions
    │       └── dashboard               # GET stats aggregate
    ├── components/
    │   └── Navbar.tsx
    └── lib/
        ├── db.ts           # Prisma singleton
        └── auth.ts         # Helper autenticazione
```

---

## 🗺️ Roadmap

- [ ] Multi-tenant (più rivenditori con subdominio proprio)
- [ ] Upload foto reali (S3 / Cloudflare R2)
- [ ] Form contatto/lead con notifica email
- [ ] Stampa PDF scheda auto
- [ ] App mobile (React Native / Expo)
- [ ] Integrazione AutoScout24 API
