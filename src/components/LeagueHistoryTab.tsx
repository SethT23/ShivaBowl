import { useMemo, useState } from 'react';
import type { SeasonSummary } from '../lib/types';
import { SeasonDetail } from './SeasonDetail';
import { SeasonSelect } from './SeasonSelect';

interface LeagueHistoryTabProps {
  seasons: SeasonSummary[];
}

export function LeagueHistoryTab({ seasons }: LeagueHistoryTabProps) {
  const [selectedLeagueId, setSelectedLeagueId] = useState(
    seasons[0]?.leagueId ?? '',
  );

  const selectedSeason = useMemo(
    () =>
      seasons.find((s) => s.leagueId === selectedLeagueId) ?? seasons[0] ?? null,
    [seasons, selectedLeagueId],
  );

  if (!selectedSeason) {
    return (
      <p className="text-slate-400 py-10 text-center">
        No season data available yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <SeasonSelect
        seasons={seasons}
        selectedLeagueId={selectedSeason.leagueId}
        onChange={setSelectedLeagueId}
      />
      <SeasonDetail season={selectedSeason} />
    </div>
  );
}
