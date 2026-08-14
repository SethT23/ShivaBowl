export interface SleeperLeague {
  league_id: string;
  name: string;
  season: string;
  season_type: string;
  status: string;
  sport: string;
  total_rosters: number;
  avatar: string | null;
  previous_league_id: string | null;
  draft_id: string | null;
  settings?: {
    playoff_teams?: number;
    num_teams?: number;
    playoff_week_start?: number;
    [key: string]: unknown;
  };
  metadata?: Record<string, string> | null;
}

export interface SleeperRosterSettings {
  wins: number;
  losses: number;
  ties: number;
  fpts: number;
  fpts_decimal?: number;
  fpts_against?: number;
  fpts_against_decimal?: number;
  ppts?: number;
  ppts_decimal?: number;
  waiver_position?: number;
  waiver_budget_used?: number;
  total_moves?: number;
  [key: string]: unknown;
}

export interface SleeperRoster {
  roster_id: number;
  owner_id: string | null;
  co_owners?: string[] | null;
  league_id: string;
  settings: SleeperRosterSettings;
  metadata?: {
    streak?: string;
    record?: string;
    [key: string]: unknown;
  } | null;
}

export interface SleeperUser {
  user_id: string;
  display_name: string;
  avatar: string | null;
  metadata?: {
    team_name?: string;
    [key: string]: unknown;
  } | null;
}

export interface SleeperBracketMatch {
  r: number;
  m: number;
  t1: number | { w?: number; l?: number } | null;
  t2: number | { w?: number; l?: number } | null;
  w?: number | null;
  l?: number | null;
  t1_from?: { w?: number; l?: number } | null;
  t2_from?: { w?: number; l?: number } | null;
  p?: number | null;
}

export interface TeamInfo {
  rosterId: number;
  ownerId: string | null;
  teamName: string;
  ownerName: string;
  avatarUrl: string | null;
}

export interface StandingRow {
  team: TeamInfo;
  wins: number;
  losses: number;
  ties: number;
  pointsFor: number;
  pointsAgainst: number;
  potentialPoints: number | null;
  placement: number | null;
  placementSource: 'bracket' | 'regular-season';
  seed: number;
  streak: string | null;
  waiverBudgetUsed: number | null;
  totalMoves: number | null;
}

export interface BracketTeamSlot {
  row: StandingRow | null;
  isWinner: boolean;
}

export interface BracketMatchup {
  matchId: number;
  round: number;
  label: string | null;
  team1: BracketTeamSlot | null;
  team2: BracketTeamSlot | null;
  isDecided: boolean;
}

export interface BracketRound {
  round: number;
  matchups: BracketMatchup[];
}

export interface SeasonSummary {
  leagueId: string;
  season: string;
  name: string;
  status: string;
  totalRosters: number;
  avatarUrl: string | null;
  standings: StandingRow[];
  champion: StandingRow | null;
  runnerUp: StandingRow | null;
  thirdPlace: StandingRow | null;
  regularSeasonChampion: StandingRow | null;
  winnersBracket: BracketRound[];
  losersBracket: BracketRound[];
}
