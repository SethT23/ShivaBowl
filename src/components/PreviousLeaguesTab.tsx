import { useState } from 'react';
import type { SeasonSummary } from '../lib/types';
import { SeasonDetail } from './SeasonDetail';

interface PreviousLeaguesTabProps {
  seasons: SeasonSummary[];
}

function statusLabel(status: string): string {
  return status
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function PreviousLeaguesTab({ seasons }: PreviousLeaguesTabProps) {
  const [expandedId, setExpandedId] = useState<string | null>(
    seasons[0]?.leagueId ?? null,
  );

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-slate-400">
        Every prior instance of the league, linked season to season. Expand a
        row to see that year's full results.
      </p>
      <div className="flex flex-col gap-2">
        {seasons.map((season) => {
          const isOpen = expandedId === season.leagueId;
          return (
            <div
              key={season.leagueId}
              className="rounded-lg border border-slate-700/70 overflow-hidden"
            >
              <button
                type="button"
                onClick={() =>
                  setExpandedId(isOpen ? null : season.leagueId)
                }
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-slate-800/50 hover:bg-slate-800/80 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {season.avatarUrl ? (
                    <img
                      src={season.avatarUrl}
                      alt=""
                      className="w-8 h-8 rounded-full shrink-0"
                      loading="lazy"
                    />
                  ) : (
                    <span className="w-8 h-8 rounded-full bg-slate-700 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-100 truncate">
                      {season.season} — {season.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {season.totalRosters} teams · {statusLabel(season.status)}
                      {season.champion
                        ? ` · Champion: ${season.champion.team.teamName}`
                        : ''}
                    </p>
                  </div>
                </div>
                <span
                  className={`shrink-0 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                >
                  ▾
                </span>
              </button>
              {isOpen ? (
                <div className="px-4 py-4 border-t border-slate-700/70 bg-slate-900/40">
                  <SeasonDetail season={season} />
                  <p className="mt-3 text-[11px] text-slate-500">
                    Sleeper League ID: {season.leagueId}
                  </p>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
