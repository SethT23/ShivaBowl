import type {
  SleeperBracketMatch,
  SleeperLeague,
  SleeperRoster,
  SleeperUser,
} from './types';

const BASE_URL = 'https://api.sleeper.app/v1';

export class SleeperApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'SleeperApiError';
    this.status = status;
  }
}

async function fetchJson<T>(path: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`);
  } catch {
    throw new SleeperApiError(
      `Could not reach Sleeper (${path}). Check your network connection.`,
    );
  }
  if (!res.ok) {
    throw new SleeperApiError(
      `Sleeper API request failed for ${path} (${res.status})`,
      res.status,
    );
  }
  return (await res.json()) as T;
}

export function getLeague(leagueId: string): Promise<SleeperLeague> {
  return fetchJson<SleeperLeague>(`/league/${leagueId}`);
}

export function getRosters(leagueId: string): Promise<SleeperRoster[]> {
  return fetchJson<SleeperRoster[]>(`/league/${leagueId}/rosters`);
}

export function getUsers(leagueId: string): Promise<SleeperUser[]> {
  return fetchJson<SleeperUser[]>(`/league/${leagueId}/users`);
}

export async function getWinnersBracket(
  leagueId: string,
): Promise<SleeperBracketMatch[]> {
  try {
    return await fetchJson<SleeperBracketMatch[]>(
      `/league/${leagueId}/winners_bracket`,
    );
  } catch {
    return [];
  }
}

export async function getLosersBracket(
  leagueId: string,
): Promise<SleeperBracketMatch[]> {
  try {
    return await fetchJson<SleeperBracketMatch[]>(
      `/league/${leagueId}/losers_bracket`,
    );
  } catch {
    return [];
  }
}

/**
 * Walks the previous_league_id chain starting at leagueId, returning every
 * league in the dynasty (newest first). Sleeper links each season's league
 * object to the prior season's via previous_league_id.
 */
export async function getLeagueChain(
  leagueId: string,
): Promise<SleeperLeague[]> {
  const chain: SleeperLeague[] = [];
  const seen = new Set<string>();
  let currentId: string | null = leagueId;

  while (currentId && !seen.has(currentId)) {
    seen.add(currentId);
    const league = await getLeague(currentId);
    chain.push(league);
    currentId =
      league.previous_league_id && league.previous_league_id !== '0'
        ? league.previous_league_id
        : null;
  }

  return chain;
}

export function avatarUrl(avatar: string | null | undefined): string | null {
  if (!avatar) return null;
  return `https://sleepercdn.com/avatars/thumbs/${avatar}`;
}
