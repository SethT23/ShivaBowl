import type { CareerLuckSummary, CareerStanding, SeasonSummary } from './types';

/**
 * Aggregates every team's regular-season-to-date record and scoring across
 * all seasons in the league's history, grouped by Sleeper owner (a team's
 * roster_id resets every season, but owner_id persists across years).
 */
export function computeCareerLuck(seasons: SeasonSummary[]): CareerLuckSummary {
  interface Accumulator {
    ownerId: string;
    ownerName: string;
    teamName: string;
    avatarUrl: string | null;
    seasonsPlayed: number;
    wins: number;
    losses: number;
    ties: number;
    pointsFor: number;
    latestSeason: string;
  }

  const byOwner = new Map<string, Accumulator>();

  for (const season of seasons) {
    for (const row of season.standings) {
      const ownerId = row.team.ownerId;
      if (!ownerId) continue;

      const existing = byOwner.get(ownerId);
      if (!existing || season.season > existing.latestSeason) {
        byOwner.set(ownerId, {
          ownerId,
          ownerName: row.team.ownerName,
          teamName: row.team.teamName,
          avatarUrl: row.team.avatarUrl,
          seasonsPlayed: (existing?.seasonsPlayed ?? 0) + 1,
          wins: (existing?.wins ?? 0) + row.wins,
          losses: (existing?.losses ?? 0) + row.losses,
          ties: (existing?.ties ?? 0) + row.ties,
          pointsFor: (existing?.pointsFor ?? 0) + row.pointsFor,
          latestSeason: season.season,
        });
      } else {
        existing.seasonsPlayed += 1;
        existing.wins += row.wins;
        existing.losses += row.losses;
        existing.ties += row.ties;
        existing.pointsFor += row.pointsFor;
      }
    }
  }

  const standings: CareerStanding[] = [...byOwner.values()].map((acc) => {
    const games = acc.wins + acc.losses + acc.ties;
    return {
      ownerId: acc.ownerId,
      ownerName: acc.ownerName,
      teamName: acc.teamName,
      avatarUrl: acc.avatarUrl,
      seasonsPlayed: acc.seasonsPlayed,
      wins: acc.wins,
      losses: acc.losses,
      ties: acc.ties,
      winPct: games > 0 ? (acc.wins + acc.ties * 0.5) / games : 0,
      pointsFor: acc.pointsFor,
      winPctRank: 0,
      pointsForRank: 0,
      luckScore: 0,
    };
  });

  const byWinPct = [...standings].sort((a, b) => {
    if (b.winPct !== a.winPct) return b.winPct - a.winPct;
    return b.pointsFor - a.pointsFor;
  });
  byWinPct.forEach((s, i) => {
    s.winPctRank = i + 1;
  });

  const byPoints = [...standings].sort((a, b) => {
    if (b.pointsFor !== a.pointsFor) return b.pointsFor - a.pointsFor;
    return b.winPct - a.winPct;
  });
  byPoints.forEach((s, i) => {
    s.pointsForRank = i + 1;
    s.luckScore = s.pointsForRank - s.winPctRank;
  });

  const luckiest =
    standings.length > 1
      ? standings.reduce((best, s) => (s.luckScore > best.luckScore ? s : best))
      : null;
  const unluckiest =
    standings.length > 1
      ? standings.reduce((worst, s) => (s.luckScore < worst.luckScore ? s : worst))
      : null;

  return { standings, luckiest, unluckiest };
}
