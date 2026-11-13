# fitness-dashboard

Read-only dashboard over the `Fitness/` folder of the [digi-twin](../digi-twin) vault.
The markdown logs stay the single source of truth — this app parses them live on
every request, so logging a workout through the normal Obsidian/MCP flow updates
the dashboard on refresh. No database, no sync.

## Views

- **KPI row** — current weight (+delta vs the June baseline) and the three main-lift PRs
- **Weight** — trend line with logged-range whiskers, 170 lbs goal line, and a table view
- **Current PRs** — bar comparison from the PR Log's standing table
- **Training** — week-by-week heatmap (max effort → dynamic → light, `(Planned)` entries dimmed)
- **PR history** — every logged main-lift PR, newest first (collapsed to the last 8)
- **Measurements** — the tape log; empty until the vault's baseline row is filled in
- **Accessory working weights** — prescribed load per accessory with ESTIMATE badges, the
  DE speed-wave position for upper and lower, and the logged actuals behind them
- **Injury & pain** — standing cautions to program around, plus the dated incident log
- **Meals** — last 14 logged days with goals-met status

## Run

```bash
bun install
bun run dev        # API on :3001 + Vite on :5173
```

Production: `bun run build && bun run start` — one Bun process serves the SPA and API.

### GitHub Pages (live online)

`.github/workflows/pages.yml` builds a static copy on every push to `master` with
`VITE_VAULT_URL` pointing at the public digi-twin repo on `raw.githubusercontent.com`.
The browser fetches the vault markdown directly and runs the same parsers client-side,
so pushing a vault update shows up online without a redeploy (GitHub's raw CDN caches
for ~5 minutes). Only dashboard code changes trigger a rebuild.

One-time setup: repo **Settings → Pages → Source: GitHub Actions**.

## Config

| Env | Default | Purpose |
|-----|---------|---------|
| `VAULT_PATH` | `~/Websites/digi-twin` | Vault root (reads its `Fitness/` folder) |
| `PORT` | `3001` | API / production server port |
| `VITE_VAULT_URL` | unset | Build-time. When set, the SPA fetches vault files from this base URL instead of `/api` (used for Pages) |

## Structure

```
src/
  index.ts        # Bun.serve entry — API route + static SPA
  shared/         # buildDashboard — vault files → Dashboard, used by server and static build
  endpoints/      # HTTP handlers
  parsers/        # markdown → typed data (weight, workouts, meals, profile PRs)
  types/          # shared FE/BE types
  frontend/       # Vue 3 SPA (Options API, Tailwind)
```

## Vault files read

| File | Feeds |
|------|-------|
| `Progress/Weight Log.md` | Weight chart, milestones, weight KPI |
| `Progress/PR Log.md` | Current PRs bars, PR tiles, PR history |
| `Progress/Measurements.md` | Measurements table |
| `Progress/Accessory Working Weights.md` | Working weights, DE wave, logged actuals |
| `Progress/Injury & Pain Log.md` | Standing cautions, incidents |
| `Workouts/Workout Log.md` | Training heatmap |
| `Meals/Meal Log.md` | Meals table |

`Fitness/Personal/` is gitignored in the vault and deliberately not read.

Parsers depend on the vault's log conventions (see `skills/mike-fitness/SKILL.md`
in the vault): workout headings `## YYYY-MM-DD [(Planned)] — Title`, `(PR)` markers
in exercise rows, the Weight Log's single table, and rep maxes written as `255x3`.
