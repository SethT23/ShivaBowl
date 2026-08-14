import type { SeasonSummary } from '../lib/types';

interface SeasonSelectProps {
  seasons: SeasonSummary[];
  selectedLeagueId: string;
  onChange: (leagueId: string) => void;
}

export function SeasonSelect({
  seasons,
  selectedLeagueId,
  onChange,
}: SeasonSelectProps) {
  return (
    <label className="flex items-center gap-3 text-sm">
      <span className="font-medium text-slate-300">Season</span>
      <select
        value={selectedLeagueId}
        onChange={(e) => onChange(e.target.value)}
        className="bg-slate-800 border border-slate-600 text-slate-100 rounded-md px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
      >
        {seasons.map((s) => (
          <option key={s.leagueId} value={s.leagueId}>
            {s.season} — {s.name}
          </option>
        ))}
      </select>
    </label>
  );
}
