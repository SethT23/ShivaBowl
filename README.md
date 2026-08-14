# Shiva Bowl Hall of Fame

A record book for **The Shiva Bowl** fantasy football league (hosted on
[Sleeper](https://sleeper.com)). The app reads directly from the public
Sleeper API in the browser — no backend, no API key. Styled like a sports
bar: neon marquee header, wood-grain background, and each season's stats
"on screen" inside a TV-bezel panel.

League ID: `1389392186746875904` (set in `src/App.tsx`).

## What it shows

- **League History** — pick any season from a dropdown and see that year's:
  - Champion, Runner-Up (lost the championship game), Third Place, and the
    Regular Season #1 Seed (best regular-season record, independent of how
    the playoffs shook out).
  - The full playoff bracket and consolation/"Toilet Bowl" bracket,
    round by round, with byes and TBD slots resolved.
  - Full standings: final place, regular-season seed, record, streak,
    points for/against, potential (optimal-lineup) points, FAAB spent, and
    waiver moves — whichever of these Sleeper actually recorded for that
    season.
  - "Luck of the Draw": that season's luckiest team (best win-rank vs.
    points-for-rank gap — won more than their scoring would predict) and
    unluckiest team (the reverse — scored well but didn't win as much).
- **Previous Leagues** — every prior season's league instance (Sleeper links
  each season to the last via `previous_league_id`), listed newest-first as
  expandable rows with the same results detail inline.
- **All-time luck banner** (shown above both tabs) — the luckiest and
  unluckiest team across the entire league history, by comparing each
  owner's career win % rank to their career total points-for rank.

Both sections are derived from the same season data:

- `GET /league/{id}` walked backwards via `previous_league_id` to build the
  full history chain.
- `GET /league/{id}/rosters` and `/users` for records, points, and team/owner
  names.
- `GET /league/{id}/winners_bracket` and `/losers_bracket` to determine final
  placement and render the bracket. Winners-bracket placement games
  (`p` field) assign 1st/2nd/3rd/etc.; losers-bracket placement games
  continue the numbering afterwards (e.g. 5th/6th, 7th/"Toilet Bowl"). Any
  team a bracket doesn't place, or a placement that lands out of range, is
  ranked by regular-season record instead — this is also what happens for a
  season still in progress.

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
  `SeasonSummary` (standings, seeds, win/points ranks, champion/runner-up/
  third, regular season champion, per-season luck, and bracket round data).
- `src/lib/careerStats.ts` — aggregates every owner's record and points
  across all seasons into all-time win %, total points, and the resulting
  league-wide luckiest/unluckiest team.
- `src/hooks/useLeagueHistory.ts` — fetches and caches the full history for
  the configured league.
- `src/components/` — `Tabs`, `SeasonSelect`, `Podium`, `LuckBadges`,
  `CareerLuckBar`, `BracketView`, `StandingsTable`, `TvFrame`, `BeerTaps`,
  `SeasonDetail`, and the two tab views (`LeagueHistoryTab`,
  `PreviousLeaguesTab`).
