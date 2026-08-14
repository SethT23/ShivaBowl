import { ordinal } from './format';
import { avatarUrl } from './sleeperApi';
import type {
  BracketMatchup,
  BracketRound,
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

interface SlotRef {
  w?: number;
  l?: number;
}

function isSlotRef(value: unknown): value is SlotRef {
  return (
    typeof value === 'object' &&
    value !== null &&
    ('w' in value || 'l' in value)
  );
}

/** Builds a round-by-round bracket, resolving TBD slots from earlier-round results. */
function buildBracketRounds(
  bracket: SleeperBracketMatch[],
  rosterMap: Map<number, StandingRow>,
  totalRosters: number,
  placementOffset: number,
  finalLabel: string,
  toiletLabel: string | null,
): BracketRound[] {
  if (bracket.length === 0) return [];

  const sorted = [...bracket].sort((a, b) => a.r - b.r || a.m - b.m);
  const matchResults = new Map<
    number,
    { winner: number | null; loser: number | null }
  >();
  const roundNumbers = [...new Set(sorted.map((m) => m.r))].sort(
    (a, b) => a - b,
  );
  const maxRound = roundNumbers[roundNumbers.length - 1];

  function resolveSlot(
    raw: SleeperBracketMatch['t1'],
    from: SleeperBracketMatch['t1_from']
  ): number | null {
    if (typeof raw === 'number') return raw;
    const ref = from ?? (isSlotRef(raw) ? raw : null);
    if (!ref) return null;
    if (ref.w != null) return matchResults.get(ref.w)?.winner ?? null;
    if (ref.l != null) return matchResults.get(ref.l)?.loser ?? null;
    return null;
  }

  function roundLabel(round: number, p: number | null | undefined): string {
    if (p != null) {
      if (p === 1) return finalLabel;
      const isLastPlaceGame =
        toiletLabel != null && placementOffset + p + 1 >= totalRosters;
      if (isLastPlaceGame) return toiletLabel;
      return `${ordinal(p)} Place Game`;
    }
    const roundsFromEnd = maxRound - round;
    if (roundsFromEnd === 0) return `Round ${round}`;
    if (roundsFromEnd === 1) return 'Semifinals';
    if (roundsFromEnd === 2) return 'Quarterfinals';
    return `Round ${round}`;
  }

  const rounds = new Map<number, BracketMatchup[]>();

  for (const match of sorted) {
    const team1Id = resolveSlot(match.t1, match.t1_from);
    const team2Id = resolveSlot(match.t2, match.t2_from);
    const winnerId = typeof match.w === 'number' ? match.w : null;
    const loserId = typeof match.l === 'number' ? match.l : null;
    matchResults.set(match.m, { winner: winnerId, loser: loserId });

    const matchup: BracketMatchup = {
      matchId: match.m,
      round: match.r,
      label: roundLabel(match.r, match.p),
      team1:
        team1Id != null
          ? {
              row: rosterMap.get(team1Id) ?? null,
              isWinner: winnerId != null && winnerId === team1Id,
            }
          : null,
      team2:
        team2Id != null
          ? {
              row: rosterMap.get(team2Id) ?? null,
              isWinner: winnerId != null && winnerId === team2Id,
            }
          : null,
      isDecided: winnerId != null,
    };

    const list = rounds.get(match.r) ?? [];
    list.push(matchup);
    rounds.set(match.r, list);
  }

  return roundNumbers.map((round) => ({
    round,
    matchups: (rounds.get(round) ?? []).sort((a, b) => a.matchId - b.matchId),
  }));
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

  // Guard against bracket data implying more placements than there are
  // rosters (e.g. an inconsistent/partial losers bracket) — anything out of
  // range falls back to being ranked by regular-season record instead.
  const allPlacements = new Map(
    [...winnerPlacements, ...loserPlacements].filter(
      ([, place]) => place >= 1 && place <= league.total_rosters,
    ),
  );

  const rows: StandingRow[] = rosters.map((roster) => {
    const settings = roster.settings ?? { wins: 0, losses: 0, ties: 0, fpts: 0 };
    const placement = allPlacements.get(roster.roster_id) ?? null;
    const hasPotential = settings.ppts != null || settings.ppts_decimal != null;
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
      potentialPoints: hasPotential
        ? pointsValue(settings.ppts, settings.ppts_decimal)
        : null,
      placement,
      placementSource: placement != null ? 'bracket' : 'regular-season',
      seed: 0,
      streak: roster.metadata?.streak ?? null,
      waiverBudgetUsed: settings.waiver_budget_used ?? null,
      totalMoves: settings.total_moves ?? null,
    };
  });

  // Regular-season seed: best record first (wins, then ties, then points for).
  const bySeed = [...rows].sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    if (b.ties !== a.ties) return b.ties - a.ties;
    return b.pointsFor - a.pointsFor;
  });
  bySeed.forEach((row, i) => {
    row.seed = i + 1;
  });

  // Fill in remaining final placements (teams not covered by either bracket)
  // by regular-season record, continuing the numbering after bracket teams.
  const unplaced = rows
    .filter((r) => r.placement == null)
    .sort((a, b) => a.seed - b.seed);

  const takenPlacements = new Set(
    rows.map((r) => r.placement).filter((p): p is number => p != null),
  );
  let nextPlace = 1;
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
  const regularSeasonChampion = rows.find((r) => r.seed === 1) ?? null;

  const rosterMap = new Map(rows.map((r) => [r.team.rosterId, r]));

  const winnersRounds = buildBracketRounds(
    winnersBracket,
    rosterMap,
    league.total_rosters,
    0,
    'Championship',
    null,
  );
  const losersRounds = buildBracketRounds(
    losersBracket,
    rosterMap,
    league.total_rosters,
    maxPlacement,
    'Consolation Final',
    'Toilet Bowl',
  );

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
    regularSeasonChampion,
    winnersBracket: winnersRounds,
    losersBracket: losersRounds,
  };
}
