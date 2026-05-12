# DevHub — Developer Marketplace & Showcase

A production-shaped, full-stack platform for showcasing and selling software
projects, tools, templates, and open-source resources. Built with **Vue 3 +
TypeScript + Element Plus + Tailwind CSS** on the front end and **NestJS +
Prisma + PostgreSQL + Stripe** on the back end.

---

## Highlights

- **Public website** — Home with hero/featured/trending/categories/stats/testimonials/CTA,
  searchable projects list with rich filters, project detail page with markdown,
  screenshots, reviews and changelog, curated open-source resources, blog, about page.
- **Auth** — Email/password login, registration, forgot password,
  guarded routes (`/dashboard`, `/admin`). OAuth stubs (GitHub, Google) ready to wire up.
- **User dashboard** — Overview, purchases, downloads, favorites, profile/security/theme settings.
- **Admin panel** — Dashboard with revenue/downloads/users charts (ECharts),
  projects CRUD with markdown editor + live preview, orders + refund flow,
  users with role/status management, blog/comments moderation, platform settings.
- **Theme** — Dark/light mode with CSS variables, persisted preference, system-aware default.
- **Mock API** — The frontend ships with a 1k-line fake API so it runs end-to-end with
  no backend. Toggle via `VITE_API_BASE_URL` to point at the real NestJS server.
- **NestJS backend** — Auth (JWT + roles), users, projects, categories, tags, orders,
  Stripe payments (checkout sessions + webhook with degraded mock mode when no key),
  blog, comments (with rating recompute), uploads stub, admin analytics, Swagger docs at `/api/docs`.
- **Security** — Helmet, validation pipes, throttler (rate limiting), CORS, bcrypt password
  hashing, role-based guards, raw-body handling for Stripe webhooks.

---

## Repo layout

```
.
├── src/                 # Vue 3 + Vite frontend
├── server/              # NestJS backend
│   ├── prisma/          # Prisma schema + seed
│   └── src/             # Nest modules
├── docker-compose.yml   # Postgres + API for one-command dev
└── .github/workflows/   # CI: typecheck + build for FE and BE
```

---

## Quick start (frontend only, with mock API)

```bash
pnpm install
pnpm dev
# open http://localhost:5173
```

The frontend defaults to its built-in mock API, so you can browse the whole UI
including the admin panel without running the server. Sign in with any email
containing `admin` and a 4+ character password to enter the admin panel.

## Quick start (full stack with docker-compose)

```bash
# 1. Start Postgres + API
docker compose up --build -d

# 2. Run migrations + seed (from the host or `docker compose exec api …`)
cd server
cp .env.example .env
pnpm install
pnpm prisma migrate deploy
pnpm seed

# 3. Run the frontend pointing at the live API
cd ..
echo "VITE_API_BASE_URL=http://localhost:4000/api" > .env
pnpm dev
```

The seed creates:

- `admin@devhub.dev` / `admin1234` (ADMIN role)
- `alex@devhub.dev` / `demo1234` (USER role)

Swagger docs are served at `http://localhost:4000/api/docs`.

---

## Tech stack

### Frontend

- Vue 3 (Composition API) + TypeScript
- Vite 8 (Rolldown)
- Element Plus (UI primitives)
- Tailwind CSS 3 (utilities + design tokens)
- Pinia (state)
- Vue Router 4
- Axios (with auth + 401 interceptors)
- ECharts (admin charts)
- marked (markdown rendering)
- @vueuse/core, dayjs

### Backend

- NestJS 10
- Prisma + PostgreSQL
- JWT (access + refresh) + Passport
- Stripe Checkout (with mock fallback) + webhook handler
- Class-validator DTOs
- @nestjs/swagger for OpenAPI docs
- @nestjs/throttler for rate limiting
- Helmet

---

## Environment variables

Frontend (`.env`):

| Var | Description |
| --- | --- |
| `VITE_API_BASE_URL` | Empty → mock API. Otherwise the URL of the NestJS API (`http://localhost:4000/api`). |

Backend (`server/.env`):

| Var | Description |
| --- | --- |
| `PORT` | Defaults to `4000`. |
| `DATABASE_URL` | PostgreSQL connection string. |
| `JWT_SECRET` / `JWT_REFRESH_SECRET` | Secrets for signing tokens. |
| `JWT_EXPIRES_IN` / `JWT_REFRESH_EXPIRES_IN` | Token TTLs. |
| `CORS_ORIGIN` | Comma-separated origins allowed by CORS. |
| `STRIPE_SECRET_KEY` | Optional. When empty, payments run in mock mode. |
| `STRIPE_WEBHOOK_SECRET` | Required when handling real Stripe events. |
| `STRIPE_SUCCESS_URL` / `STRIPE_CANCEL_URL` | Post-checkout redirect URLs. |

---

## Out of scope / next steps

Things that are scaffolded but require additional credentials or significant
work to fully wire up in production:

- **Real OAuth** (Google/GitHub) — UI buttons + service shape exist; plug
  `passport-google-oauth20` / `passport-github2` strategies once credentials
  are available.
- **Email delivery** — Forgot-password and email verification flows return
  success but do not send mail. Wire up an SMTP provider (Resend, Postmark,
  SES) in `AuthService`.
- **Real Stripe end-to-end** — Provide `STRIPE_SECRET_KEY` and
  `STRIPE_WEBHOOK_SECRET`. The webhook controller is wired with raw body
  parsing already.
- **Real file uploads** — `UploadsController` returns a placeholder URL. Swap
  in S3/MinIO/local-disk storage with `FileInterceptor` and mimetype/size
  validation.
- **AI recommendations**, **PWA**, **i18n**, **sitemap generation** — listed
  as optional in the brief; not implemented to keep the scope focused.

---

## License

MIT
