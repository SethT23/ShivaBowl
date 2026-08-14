import { useEffect, useState } from 'react';
import { buildSeasonSummary } from '../lib/deriveSeason';
import {
  getLeagueChain,
  getLosersBracket,
  getRosters,
  getUsers,
  getWinnersBracket,
} from '../lib/sleeperApi';
import type { SeasonSummary, SleeperLeague } from '../lib/types';

export interface LeagueHistoryState {
  loading: boolean;
  error: string | null;
  leagueChain: SleeperLeague[];
  seasons: SeasonSummary[];
}

const CACHE_KEY_PREFIX = 'shiva-bowl-history:';
const CACHE_TTL_MS = 1000 * 60 * 15;

interface CacheEntry {
  savedAt: number;
  leagueChain: SleeperLeague[];
  seasons: SeasonSummary[];
}

function readCache(rootLeagueId: string): CacheEntry | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY_PREFIX + rootLeagueId);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CacheEntry;
    if (Date.now() - parsed.savedAt > CACHE_TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(rootLeagueId: string, entry: CacheEntry) {
  try {
    sessionStorage.setItem(
      CACHE_KEY_PREFIX + rootLeagueId,
      JSON.stringify(entry),
    );
  } catch {
    // ignore quota errors
  }
}

export function useLeagueHistory(rootLeagueId: string): LeagueHistoryState {
  const [state, setState] = useState<LeagueHistoryState>({
    loading: true,
    error: null,
    leagueChain: [],
    seasons: [],
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setState((s) => ({ ...s, loading: true, error: null }));

      const cached = readCache(rootLeagueId);
      if (cached) {
        setState({
          loading: false,
          error: null,
          leagueChain: cached.leagueChain,
          seasons: cached.seasons,
        });
        return;
      }

      try {
        const leagueChain = await getLeagueChain(rootLeagueId);

        const seasons = await Promise.all(
          leagueChain.map(async (league) => {
            const [rosters, users, winnersBracket, losersBracket] =
              await Promise.all([
                getRosters(league.league_id),
                getUsers(league.league_id),
                getWinnersBracket(league.league_id),
                getLosersBracket(league.league_id),
              ]);
            return buildSeasonSummary(
              league,
              rosters,
              users,
              winnersBracket,
              losersBracket,
            );
          }),
        );

        if (cancelled) return;

        writeCache(rootLeagueId, {
          savedAt: Date.now(),
          leagueChain,
          seasons,
        });

        setState({ loading: false, error: null, leagueChain, seasons });
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : 'Failed to load league data.';
        setState({ loading: false, error: message, leagueChain: [], seasons: [] });
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [rootLeagueId]);

  return state;
}
