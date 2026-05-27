# Portfolio News Aggregator

Track your stock/MF portfolio, view stats, and read relevant news.

---

## Architecture

```
src/
├── app/api/                  # REST API endpoints
│   ├── holdings/             # CRUD for portfolio holdings
│   ├── holdings/[id]/        # Single holding operations
│   ├── market-data/          # Yahoo Finance quotes & search
│   ├── news/                 # GNews articles for holdings
│   ├── portfolio/stats/      # Computed portfolio statistics
│   └── zerodha/              # Import from Zerodha Kite API
├── components/
│   ├── ui/                   # Card, StatCard, LoadingSpinner
│   ├── portfolio/            # HoldingForm, HoldingList, PortfolioStats, ImportZerodha
│   └── news/                 # NewsCard, NewsFeed
└── lib/
    ├── providers/            # External API clients (Yahoo Finance, GNews, Zerodha)
    ├── services/             # Business logic layer
    ├── types/                # TypeScript interfaces (holding, market, news)
    ├── db/                   # Prisma client singleton
    └── utils/                # Constants
prisma/                       # Schema (SQLite)
prisma.config.ts              # Prisma config with datasource URL
```

## Tech Stack

| Layer          | Choice                          |
|----------------|---------------------------------|
| Framework      | Next.js 16 (App Router)         |
| Language       | TypeScript                      |
| Database       | SQLite via Prisma 7             |
| Styling        | Tailwind CSS 4                  |
| Market Data    | yahoo-finance2 (no API key)     |
| News           | GNews API (free key required)   |
| Broker Import  | Zerodha Kite Connect (optional) |

## Design Patterns

- **Provider pattern** — External APIs wrapped behind classes (`YahooFinanceProvider`, `GNewsProvider`, `ZerodhaProvider`)
- **Service layer** — Business logic isolated from HTTP (`PortfolioService`, `MarketDataService`, `NewsService`, `StatsService`)
- **Thin API routes** — Validate input, delegate to services, return JSON
- **Client components** — React `"use client"` components call API endpoints
- **Singleton DB** — Prisma client cached globally in development

## API Endpoints

| Method | Endpoint                | Description              |
|--------|-------------------------|--------------------------|
| GET    | `/api/holdings`         | List all holdings        |
| POST   | `/api/holdings`         | Add a holding            |
| GET    | `/api/holdings/[id]`    | Get single holding       |
| PUT    | `/api/holdings/[id]`    | Update holding           |
| DELETE | `/api/holdings/[id]`    | Delete holding           |
| GET    | `/api/market-data`      | Quote by ticker or search by query |
| GET    | `/api/news`             | News for holdings (or specific ticker) |
| GET    | `/api/portfolio/stats`  | Computed stats           |
| POST   | `/api/zerodha`          | Import from Zerodha      |

## Commands

| Command            | Description              |
|--------------------|--------------------------|
| `npm run dev`      | Start development server |
| `npm run build`    | Build for production     |
| `npm run start`    | Start production server  |
| `npm run lint`     | Run ESLint               |

## Prisma (v7 — breaking changes from v5/v6)

- Schema: `prisma/schema.prisma` — no `url` in datasource block
- Config: `prisma.config.ts` — URL goes here with `defineConfig({ datasource: { url } })`
- Client: Generated to `generated/prisma`
- Adapter: Must pass `@prisma/adapter-better-sqlite3` to `PrismaClient({ adapter })`
- Commands: `npx prisma db push`, `npx prisma generate`

## Environment Variables (`.env`)

```
DATABASE_URL="file:./dev.db"
GNEWS_API_KEY="your_gnews_api_key_here"
ZERODHA_API_KEY="your_zerodha_api_key_here"
ZERODHA_ACCESS_TOKEN="your_zerodha_access_token_here"
```

## Setup

1. Install dependencies — `npm install`
2. Generate Prisma client & push schema — `npx prisma generate && npx prisma db push`
3. Get a free GNews API key at https://gnews.io and set `GNEWS_API_KEY` in `.env`
4. (Optional) Set Zerodha credentials in `.env` for auto-import
5. Start dev server — `npm run dev`
6. Open http://localhost:3000
