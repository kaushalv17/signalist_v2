<div align="center">

# 📈 Signalist

### A full-stack stock market intelligence platform built with Next.js 15, MongoDB, Inngest & Finnhub.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Inngest](https://img.shields.io/badge/Inngest-durable%20jobs-7C3AED)](https://www.inngest.com/)
[![Better Auth](https://img.shields.io/badge/Better--Auth-1.x-F59E0B)](https://www.better-auth.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

---

## ✨ What Is Signalist?

Signalist is a production-grade stock tracking and alerting application. Authenticated users can monitor live stock prices, build a personal watchlist, set price alerts that fire automatically during market hours, and receive a personalised daily market news digest — all driven by a robust, event-driven backend.

> Built to demonstrate real-world Next.js App Router architecture, durable background job orchestration with Inngest, secure server-side data fetching, and fully type-safe API design — not just a basic CRUD app.

---

## 🖥️ Features

| Feature | Details |
|---|---|
| 🔐 **Authentication** | Email/password via Better-Auth; 30-day rolling sessions with secure HttpOnly cookies |
| 📊 **Live Market Data** | Real-time stock quotes, company profiles, and full-text stock search via Finnhub |
| 📺 **TradingView Widgets** | Heatmap, Market Overview, Top Stories, and Market Quotes embedded via the official SDK |
| ⭐ **Watchlist** | Add/remove stocks with live price enrichment; upsert-safe writes prevent duplicates |
| 🔔 **Price Alerts** | Upper/lower price alerts per symbol; evaluated every 5 minutes during NYSE hours |
| 📰 **Daily News Digest** | Scheduled cron job personalises news per user based on their watchlist symbols |
| 🛡️ **Security-first** | API keys server-side only, security response headers, per-user DB guards on every mutation |

---

## 🏗️ Architecture

```
signalist/
├── app/
│   ├── (auth)/                  — Sign-in / Sign-up pages (route group)
│   ├── (root)/                  — Protected dashboard, watchlist, stock detail
│   │   ├── loading.tsx          — Suspense skeleton for slow data fetches
│   │   ├── error.tsx            — Error boundary with retry
│   │   └── watchlist/
│   │       └── loading.tsx      — Watchlist-specific skeleton
│   └── api/
│       ├── auth/[...all]/       — Better-Auth catch-all handler
│       └── inngest/             — Inngest webhook endpoint
├── components/
│   ├── forms/                   — Generic, fully-typed RHF form fields
│   └── dashboard/               — WatchlistTable, AlertList, AlertDialog
├── database/
│   ├── mongoose.ts              — Singleton connection pool (HMR-safe, serverless-safe)
│   └── models/                  — Mongoose schemas with compound indexes
├── lib/
│   ├── actions/
│   │   ├── _helpers.ts          — Shared getCurrentUserId (single source of truth)
│   │   ├── alert.actions.ts     — CRUD for price alerts
│   │   ├── auth.actions.ts      — Sign-up, sign-in, sign-out, getSession
│   │   ├── finnhub.actions.ts   — Stock search, quotes, profiles, news
│   │   ├── user.actions.ts      — Admin user queries for Inngest jobs
│   │   └── watchlist.actions.ts — Watchlist CRUD + symbol helpers
│   ├── better-auth/auth.ts      — Lazy-singleton auth instance (edge-runtime safe)
│   ├── inngest/
│   │   ├── client.ts            — Single shared Inngest client
│   │   └── functions.ts         — 3 background job definitions
│   ├── validators/index.ts      — Zod schemas shared between client and server
│   └── utils.ts                 — Formatters, date helpers, news utilities
├── hooks/
│   ├── useDebounce.ts           — Stale-closure-safe debounce hook
│   └── useTradingViewWidget.tsx — TradingView script loader hook
├── middleware.ts                — Route protection + post-login redirect
└── types/index.d.ts             — Global TypeScript declarations
```

---

## ⚙️ Key Engineering Decisions

### 1 · Durable Background Jobs with Inngest

Three jobs run automatically — no separate worker process or queue infra needed:

| Function | Trigger | Behaviour |
|---|---|---|
| `send-sign-up-email` | `app/user.created` event | Fires on registration; retries 3× with back-off |
| `send-daily-news-summary` | `0 8 * * *` (08:00 UTC) | Personalised digest per user; concurrency capped at 5 to respect Finnhub rate limits |
| `check-price-alerts` | `*/5 14-21 * * 1-5` (NYSE hours) | Groups alerts by symbol to eliminate duplicate API calls; atomically marks triggered alerts |

### 2 · MongoDB Connection Pooling

A `global._mongooseCache` singleton survives Next.js Hot Module Replacement in development and prevents connection storms in serverless environments by reusing the in-flight connection promise:

```ts
if (!cached.promise) {
  cached.promise = mongoose.connect(MONGODB_URI, { maxPoolSize: 10 })
    .catch((err) => { cached.promise = null; throw err; });
}
cached.conn = await cached.promise;
```

### 3 · Authorisation on Every Mutation

All Server Actions derive the current user from the session before touching the database. Every write query includes a `userId` filter so no user can modify another user's data:

```ts
// Prevents horizontal privilege escalation — always scoped to the session user
await AlertModel.deleteOne({ _id: alertId, userId });
```

### 4 · Server-Side API Key Security

All Finnhub calls use `process.env.FINNHUB_API_KEY` — a server-only variable validated at call time. There is no `NEXT_PUBLIC_` leak of secrets into the client bundle.

### 5 · ISR + React.cache() for Performance

Stock search is memoised with `React.cache()` to deduplicate identical calls within a render pass. Protected pages use Next.js ISR (`export const revalidate = 60`) so prices stay fresh without a full server round-trip on every visit.

### 6 · Stale-Closure-Safe Debounce Hook

The custom `useDebounce` hook stores the callback in a `useRef` so the debounced wrapper is created once (stable reference) while always calling the latest version of the function — avoiding a common React performance pitfall.

### 7 · Fully Generic Form Components

`InputField`, `SelectField`, and `CountrySelectField` are generic over `FieldValues`, giving full TypeScript inference on `name`, `register`, `control`, and `error` props — zero `any` types, no casts needed at call sites.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router, Server Actions, ISR, Suspense) |
| **Language** | TypeScript 5 — strict mode |
| **Database** | MongoDB Atlas + Mongoose 8 |
| **Auth** | Better-Auth 1.x (cookie-based, server-action-compatible) |
| **Background Jobs** | Inngest (durable functions, cron scheduling, retries, concurrency control) |
| **Market Data API** | Finnhub REST API |
| **Charts** | TradingView Lightweight Widgets (official embed SDK) |
| **Validation** | Zod (schemas shared between server actions and client forms) |
| **Forms** | React Hook Form + `@hookform/resolvers` |
| **UI Components** | Radix UI Primitives + Tailwind CSS v4 |
| **Notifications** | Sonner (toast notifications) |
| **Command Palette** | cmdk |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.17
- **MongoDB Atlas** account — [cloud.mongodb.com](https://cloud.mongodb.com) (free tier works)
- **Finnhub** API key — [finnhub.io](https://finnhub.io/) (free tier works)
- **Inngest** account — [inngest.com](https://www.inngest.com/) (free tier works)

### 1 — Clone & install

```bash
git clone https://github.com/YOUR_USERNAME/signalist.git
cd signalist
npm install
```

### 2 — Configure environment variables

```bash
cp .env.example .env.local
```

Fill in every value in `.env.local`:

```env
# MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/signalist

# Better-Auth — generate with: openssl rand -base64 32
BETTER_AUTH_SECRET=<64-char-random-string>
BETTER_AUTH_URL=http://localhost:3000

# Finnhub — server-side ONLY, never use NEXT_PUBLIC_ for API keys
FINNHUB_API_KEY=<your-finnhub-key>

# Inngest — from your Inngest dashboard
INNGEST_SIGNING_KEY=signkey-prod-xxxxxxxxxxxx
INNGEST_EVENT_KEY=<your-inngest-event-key>

# Public app URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> ⚠️ **Never commit `.env.local`** — it is already listed in `.gitignore`.

### 3 — Run in development

Open **two terminals**:

```bash
# Terminal 1 — Next.js dev server
npm run dev

# Terminal 2 — Inngest local dev server
npm run inngest:dev
```

| URL | What it is |
|---|---|
| http://localhost:3000 | The app |
| http://localhost:8288 | Inngest dev dashboard (inspect jobs, replay events) |

### 4 — Type-check & lint

```bash
npm run type-check   # tsc --noEmit
npm run lint         # next lint
```

---

## 🌐 Deployment (Vercel)

1. Push your repository to GitHub.
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. Add all environment variables from `.env.example` in the Vercel dashboard under **Settings → Environment Variables**.
4. In your Inngest dashboard, set the production endpoint to:
   ```
   https://your-app.vercel.app/api/inngest
   ```
5. Deploy — Vercel handles the rest automatically.

---

## 🗂️ Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | ✅ | MongoDB Atlas connection string |
| `BETTER_AUTH_SECRET` | ✅ | 64-char secret for signing session tokens |
| `BETTER_AUTH_URL` | ✅ | Base URL of your deployed app |
| `FINNHUB_API_KEY` | ✅ | Server-side only — never prefix with `NEXT_PUBLIC_` |
| `INNGEST_SIGNING_KEY` | ✅ | Validates Inngest webhook payloads in production |
| `INNGEST_EVENT_KEY` | ✅ | Authenticates outgoing Inngest events |
| `NEXT_PUBLIC_APP_URL` | ✅ | Public base URL used in client-side links |

---

## 🗃️ Database Schema

### `alerts` collection

| Field | Type | Notes |
|---|---|---|
| `userId` | String | Indexed; references the Better-Auth user |
| `symbol` | String | Uppercased and trimmed automatically |
| `company` | String | Display name of the company |
| `alertType` | `'upper' \| 'lower'` | Direction of the alert |
| `condition` | `'greater' \| 'less'` | Comparison operator |
| `threshold` | Number | Target price in USD |
| `triggered` | Boolean | Set to `true` by the Inngest cron job |
| `isActive` | Boolean | User can pause and resume alerts |
| `triggeredAt` | Date? | Timestamp set when the alert fires |

**Indexes:** `(symbol, isActive, triggered)` · `(userId, createdAt desc)`

### `watchlist` collection

| Field | Type | Notes |
|---|---|---|
| `userId` | String | Indexed |
| `symbol` | String | Unique per user via compound index |
| `company` | String | Display name |
| `addedAt` | Date | Set on insert |

**Unique index:** `(userId, symbol)` — duplicate prevention enforced at the database level.

---

## 🔒 Security Checklist

- ✅ All API secrets are server-side only — zero `NEXT_PUBLIC_` leaks
- ✅ Every DB mutation filters by `userId` from session — no IDOR vulnerabilities
- ✅ Security response headers set globally in `next.config.ts`:
  `X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection`, `Referrer-Policy`, `Permissions-Policy`
- ✅ Middleware preserves `callbackUrl` for post-login redirects to internal paths only
- ✅ Passwords enforced at 8–128 characters; hashing managed by Better-Auth
- ✅ Inngest webhook payloads verified with signing key in production

---

## 📄 License

[MIT](LICENSE) — fork, adapt, and build on top of this freely.

---

<div align="center">

Built with ☕ and TypeScript &nbsp;·&nbsp; PRs and issues welcome

</div>
