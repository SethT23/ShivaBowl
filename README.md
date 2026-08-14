# Shiva Bowl Hall of Fame

A record book for **The Shiva Bowl** fantasy football league (hosted on
[Sleeper](https://sleeper.com)). The app reads directly from the public
Sleeper API in the browser — no backend, no API key.

League ID: `1389392186746875904` (set in `src/App.tsx`).

## What it shows

- **League History** — pick any season from a dropdown and see that year's
  champion, runner-up, third place, and full final standings (record,
  points for/against).
- **Previous Leagues** — every prior season's league instance (Sleeper links
  each season to the last via `previous_league_id`), listed newest-first as
  expandable rows with the same results detail inline.

Both sections are derived from the same season data:

- `GET /league/{id}` walked backwards via `previous_league_id` to build the
  full history chain.
- `GET /league/{id}/rosters` and `/users` for records, points, and team/owner
  names.
- `GET /league/{id}/winners_bracket` and `/losers_bracket` to determine final
  placement (champion, runner-up, etc.) from the playoff results; any teams
  not covered by a bracket placement game are ranked by regular-season
  record as a fallback (used for in-progress seasons).

Results are cached per browser tab (`sessionStorage`, 15 minutes) to avoid
re-fetching the whole history chain on every tab switch.

## Development

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check + production build
npm run lint      # oxlint
```

## Project layout

- `src/lib/sleeperApi.ts` — thin Sleeper API client + history-chain walker.
- `src/lib/deriveSeason.ts` — turns raw rosters/users/brackets into a
  `SeasonSummary` (standings, champion/runner-up/third).
- `src/hooks/useLeagueHistory.ts` — fetches and caches the full history for
  the configured league.
- `src/components/` — `Tabs`, `SeasonSelect`, `Podium`, `StandingsTable`,
  `SeasonDetail`, and the two tab views (`LeagueHistoryTab`,
  `PreviousLeaguesTab`).
