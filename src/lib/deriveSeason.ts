import { avatarUrl } from './sleeperApi';
import type {
  SeasonSummary,
  SleeperBracketMatch,
  SleeperLeague,
  SleeperRoster,
  SleeperUser,
  StandingRow,
  TeamInfo,
} from './types';

function buildTeamInfo(roster: SleeperRoster, users: SleeperUser[]): TeamInfo {
  const owner = users.find((u) => u.user_id === roster.owner_id) ?? null;
  const teamName =
    owner?.metadata?.team_name?.trim() ||
    owner?.display_name ||
    `Team ${roster.roster_id}`;
  return {
    rosterId: roster.roster_id,
    ownerId: roster.owner_id,
    teamName,
    ownerName: owner?.display_name ?? 'Unknown Owner',
    avatarUrl: avatarUrl(owner?.avatar),
  };
}

function pointsValue(whole?: number, decimal?: number): number {
  return (whole ?? 0) + (decimal ?? 0) / 100;
}

/** Extract { rosterId -> placement } from a bracket's explicit placement games. */
function placementsFromBracket(
  bracket: SleeperBracketMatch[],
  offset: number,
): { placements: Map<number, number>; maxPlacement: number } {
  const placements = new Map<number, number>();
  let maxPlacement = offset;

  for (const match of bracket) {
    if (match.p == null) continue;
    const winnerPlace = offset + match.p;
    const loserPlace = offset + match.p + 1;
    if (typeof match.w === 'number') {
      placements.set(match.w, winnerPlace);
      maxPlacement = Math.max(maxPlacement, winnerPlace);
    }
    if (typeof match.l === 'number') {
      placements.set(match.l, loserPlace);
      maxPlacement = Math.max(maxPlacement, loserPlace);
    }
  }

  return { placements, maxPlacement };
}

export function buildSeasonSummary(
  league: SleeperLeague,
  rosters: SleeperRoster[],
  users: SleeperUser[],
  winnersBracket: SleeperBracketMatch[],
  losersBracket: SleeperBracketMatch[],
): SeasonSummary {
  const { placements: winnerPlacements, maxPlacement } = placementsFromBracket(
    winnersBracket,
    0,
  );
  const { placements: loserPlacements } = placementsFromBracket(
    losersBracket,
    maxPlacement,
  );

  const allPlacements = new Map<number, number>([
    ...winnerPlacements,
    ...loserPlacements,
  ]);

  const rows: StandingRow[] = rosters.map((roster) => {
    const settings = roster.settings ?? { wins: 0, losses: 0, ties: 0, fpts: 0 };
    const placement = allPlacements.get(roster.roster_id) ?? null;
    return {
      team: buildTeamInfo(roster, users),
      wins: settings.wins ?? 0,
      losses: settings.losses ?? 0,
      ties: settings.ties ?? 0,
      pointsFor: pointsValue(settings.fpts, settings.fpts_decimal),
      pointsAgainst: pointsValue(
        settings.fpts_against,
        settings.fpts_against_decimal,
      ),
      placement,
      placementSource: placement != null ? 'bracket' : 'regular-season',
    };
  });

  // Fill in remaining placements (teams not covered by either bracket) by
  // regular-season record, continuing the numbering after the bracket teams.
  const unplaced = rows
    .filter((r) => r.placement == null)
    .sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      if (b.ties !== a.ties) return b.ties - a.ties;
      return b.pointsFor - a.pointsFor;
    });

  let nextPlace = rows.filter((r) => r.placement != null).length + 1;
  // If some placements are already taken (bracket didn't start at 1 for some
  // reason) find the true next available slot instead of trusting the count.
  const takenPlacements = new Set(
    rows.map((r) => r.placement).filter((p): p is number => p != null),
  );
  nextPlace = 1;
  while (takenPlacements.has(nextPlace)) nextPlace += 1;

  for (const row of unplaced) {
    while (takenPlacements.has(nextPlace)) nextPlace += 1;
    row.placement = nextPlace;
    takenPlacements.add(nextPlace);
    nextPlace += 1;
  }

  rows.sort((a, b) => (a.placement ?? 999) - (b.placement ?? 999));

  const champion = rows.find((r) => r.placement === 1) ?? null;
  const runnerUp = rows.find((r) => r.placement === 2) ?? null;
  const thirdPlace = rows.find((r) => r.placement === 3) ?? null;

  return {
    leagueId: league.league_id,
    season: league.season,
    name: league.name,
    status: league.status,
    totalRosters: league.total_rosters,
    avatarUrl: avatarUrl(league.avatar),
    standings: rows,
    champion,
    runnerUp,
    thirdPlace,
  };
}
