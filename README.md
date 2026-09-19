# VOMLabs Website

Official website for [VOMLabs](https://vomlabs.com) and [VOMHost](https://vomhost.com).

Built with [TanStack Start](https://tanstack.com/start) (React 19 + TypeScript), styled with [Tailwind CSS v4](https://tailwindcss.com) and [shadcn/ui](https://ui.shadcn.com/), backed by [Drizzle ORM](https://orm.drizzle.team) + PostgreSQL, and authenticated with [Better Auth](https://better-auth.com).

## Tech Stack

| Layer     | Technology                                    |
| --------- | --------------------------------------------- |
| Framework | TanStack Start, React 19, TypeScript          |
| Styling   | Tailwind CSS v4, shadcn/ui (`@base-ui/react`) |
| Animation | [Motion](https://motion.dev) (framer-motion)  |
| Data      | Drizzle ORM, PostgreSQL (`postgres`)          |
| Auth      | Better Auth (+ Drizzle adapter)               |
| Tooling   | Bun, Vite, Vitest, oxlint, oxfmt              |
| Deploy    | Docker → Docker Hub (`vomlabs/website`)       |

## Domains

| Domain             | Purpose             |
| ------------------ | ------------------- |
| vomlabs.com        | Main website & docs |
| vomhost.com        | Hosting & infra     |
| store.vomlabs.com  | Products & pricing  |
| status.vomlabs.com | Service status      |
| docs.vomlabs.com   | Documentation       |

## Prerequisites

- [pnpm](https://pnpm.io) `>= 9` (`11.26.0` pinned via `packageManager` in `package.json`)
- Node.js `>= 22`

## Getting Started

```bash
# 1. Install dependencies
pnpm install

# 2. Configure environment
cp .env.example .env   # or create .env with the values below

# 3. Start the dev server (http://localhost:3000)
pnpm run dev
```

### Environment Variables

| Variable             | Description                                                  |
| -------------------- | ------------------------------------------------------------ |
| `DATABASE_URL`       | PostgreSQL connection string used by Drizzle and Better Auth |
| `BETTER_AUTH_URL`    | Public URL of the auth instance (e.g. `https://vomlabs.com`) |
| `BETTER_AUTH_SECRET` | Secret key for Better Auth session signing                   |

Add any additional secrets required by your auth/email provider to `.env`. `.env*` files are gitignored.

## Scripts

| Command              | Description                                                   |
| -------------------- | ------------------------------------------------------------- |
| `pnpm run dev`       | Start the Vite dev server on port `3000`                      |
| `pnpm run build`     | Production build (Vite)                                       |
| `pnpm run preview`   | Preview the production build locally                          |
| `pnpm run start`     | Serve the production build (port via `$PORT`, default `3000`) |
| `pnpm run test`      | Run tests (Vitest)                                            |
| `pnpm run lint`      | Lint with oxlint                                              |
| `pnpm run fmt`       | Format the workspace with oxfmt                               |
| `pnpm run fmt:check` | Verify formatting without writing                             |
| `pnpm run typecheck` | Type-check with `tsc --noEmit`                                |
| `pnpm run db:studio` | Open Drizzle Studio                                           |
| `pnpm run db:push`   | Push schema changes to the database                           |
| `pnpm run db:seed`   | Seed the database (`src/scripts/seed.ts`)                     |

## Project Structure

```
src/
├── components/
│   ├── navbar/              # Navbar (desktop, mobile drawer, actions)
│   ├── sections/home/       # Homepage sections (hero, features, FAQ, etc.)
│   ├── icons/               # Custom SVG icon components
│   └── ui/                  # shadcn/ui primitives
├── hooks/                   # Shared React hooks
├── lib/
│   ├── auth-client.ts       # Better Auth client
│   └── db/                  # Drizzle schema and connection
├── routes/                  # TanStack Router routes
│   ├── api/auth/            # Better Auth API handlers
│   └── admin/               # Admin dashboard
└── scripts/                 # Database seed and tooling scripts
```

## Tooling

The workspace uses [oxc](https://oxc.rs) tooling:

- **oxlint** — linter (correctness errors, perf warnings; React, TypeScript, import, unicorn, and vitest plugins)
- **oxfmt** — formatter (print width 80, semicolons, double quotes, import and Tailwind class sorting)

## CI/CD

GitHub Actions workflows in `.github/workflows/`:

- **`ci.yml`** — on every PR and `main` push: install → lint → format → typecheck → test → build
- **`deploy.yml`** — on `main` pushes, builds and pushes `vomlabs/website` to Docker Hub

## Docker

```bash
# Build and run locally
docker compose up --build

# Or push to Docker Hub manually
docker build -t vomlabs/website .
docker push vomlabs/website
```
