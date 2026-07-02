# fitness-dashboard

Read-only dashboard over the `Fitness/` folder of the [digi-twin](../digi-twin) vault.
The markdown logs stay the single source of truth — this app parses them live on
every request, so logging a workout through the normal Obsidian/MCP flow updates
the dashboard on refresh. No database, no sync.

## Views

- **KPI row** — current weight (+delta vs the June baseline) and the three main-lift PRs
- **Weight** — trend line with logged-range whiskers, 170 lbs goal line, and a table view
- **Current PRs** — bar comparison from the profile's PR table
- **Training** — week-by-week heatmap (max effort → dynamic → light, `(Planned)` entries dimmed)
- **Meals** — last 14 logged days with goals-met status

## Run

```bash
bun install
bun run dev        # API on :3001 + Vite on :5173
```

Production: `bun run build && bun run start` — one Bun process serves the SPA and API.

## Config

| Env | Default | Purpose |
|-----|---------|---------|
| `VAULT_PATH` | `~/Websites/digi-twin` | Vault root (reads its `Fitness/` folder) |
| `PORT` | `3001` | API / production server port |

## Structure

```
src/
  index.ts        # Bun.serve entry — API route + static SPA
  endpoints/      # HTTP handlers
  parsers/        # markdown → typed data (weight, workouts, meals, profile PRs)
  types/          # shared FE/BE types
  frontend/       # Vue 3 SPA (Options API, Tailwind)
```

Parsers depend on the vault's log conventions (see `skills/mike-fitness/SKILL.md`
in the vault): workout headings `## YYYY-MM-DD [(Planned)] — Title`, `(PR)` markers
in exercise rows, and the Weight Log's single table.
