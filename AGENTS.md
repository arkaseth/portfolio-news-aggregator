<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Portfolio News Aggregator

## Commands
- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run start` — Start production server
- `npm run lint` — Run ESLint

## Prisma (v7 — breaking changes from v5/v6)
- Schema: `prisma/schema.prisma` — no `url` in datasource block
- Config: `prisma.config.ts` — URL goes here with `defineConfig({ datasource: { url } })`
- Client: Generated to `generated/prisma`
- Adapter: Must pass `@prisma/adapter-libsql` to `PrismaClient({ adapter })`
- Commands: `npx prisma db push`, `npx prisma generate`

## Architecture
- `src/lib/providers/` — External API clients (Yahoo Finance, GNews, Zerodha)
- `src/lib/services/` — Business logic layer
- `src/lib/types/` — Shared TypeScript interfaces
- `src/app/api/` — Next.js Route Handlers
- `src/components/` — React components (ui/, portfolio/, news/)
