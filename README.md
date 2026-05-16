# Float
 
> Send money to friends. Set limits. Stay in control.
 
Float is a peer-to-peer payments app. Users send money to friends with a daily spending cap, view a unified activity feed of sent and received transfers, and manage their balance from a clean single-page interface. Built to be auditable from day one — every transfer is logged, every limit is enforced server-side, and the data model is small enough to fit in your head.
 
## Monorepo
 
```
float/
├── api/    # Express + Prisma + Postgres backend
└── web/    # Static HTML + vanilla JS + Tailwind frontend
```
 
The `api/` package serves the public API on `:3001` and persists to Postgres via Prisma. The `web/` package is a zero-build static site served on `:8080` that talks to the API over fetch with bearer-token auth.
 
## Quick start
 
```bash
pnpm install
cd api && pnpm dev      # API on :3001
cd ../web && pnpm dev   # Web on :8080
```
 
The web app expects the API at `/api`. In dev we run both on the same origin via a local reverse-proxy.
 
## Stack
 
| Layer    | Tech                                              |
|----------|---------------------------------------------------|
| Backend  | Node 22 · TypeScript · Express 4 · Prisma 5       |
| Database | Postgres 16                                       |
| Auth     | Bearer token (token == user id, demo only)        |
| Frontend | Static HTML · Vanilla JS · Tailwind via CDN       |
 
## Shipping next (v0.2)
 
Two coordinated PRs implementing self-serve transfers + daily spending limits. Reviewed together because the API shape changes and the UI consumes the new shape.
 
1. **[#1 · feat(api): add daily spending limits and send-money endpoint](../../pull/1)** by Marc Dubois — new `POST /api/transfers` and `dailySpendLimit` field, with a new `direction`-tagged response shape on `GET /api/transfers`. Breaking shape change; web is shipping the matching UI.
2. **[#2 · feat(web): integrate send-money UI with new transfers API](../../pull/2)** by Léa Martin — Send button, daily limit indicator under the balance, activity feed updates to the new shape. Depends on #1.
## Roadmap
 
- **v0.2** — Self-serve transfers with daily caps *(in review)*
- v0.3 — Friends list + recent recipients
- v0.4 — Linked bank accounts via Plaid
- v0.5 — Refunds and dispute flow
## Team
 
- Alex Moreau — founder, full-stack
- Marc Dubois — backend
- Léa Martin — frontend
## License
 
UNLICENSED — internal Float project.
