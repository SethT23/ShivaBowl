import type { SeasonSummary } from '../lib/types';
import { BracketView } from './BracketView';
import { Podium } from './Podium';
import { StandingsTable } from './StandingsTable';
import { TvFrame } from './TvFrame';

interface SeasonDetailProps {
  season: SeasonSummary;
}

export function SeasonDetail({ season }: SeasonDetailProps) {
  const isFinal = season.status === 'complete';

  return (
    <TvFrame
      label={`${season.season} Season — ${isFinal ? 'Final' : season.status.replace('_', ' ')}`}
      live={!isFinal}
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          {season.avatarUrl ? (
            <img
              src={season.avatarUrl}
              alt=""
              className="w-10 h-10 rounded-full"
              loading="lazy"
            />
          ) : null}
          <div>
            <h3 className="text-lg font-bold text-slate-100">
              {season.season} · {season.name}
            </h3>
            <p className="text-xs text-slate-400">
              {season.totalRosters} teams ·{' '}
              {isFinal ? 'Final results' : `Status: ${season.status.replace('_', ' ')}`}
            </p>
          </div>
        </div>
      </div>

      {!isFinal && season.standings.some((r) => r.placementSource === 'bracket') ? (
        <p className="text-xs text-amber-300/80 bg-amber-400/10 border border-amber-400/20 rounded-md px-3 py-2">
          This season isn't finished yet — placements below reflect the
          playoff bracket and standings so far, not final results.
        </p>
      ) : null}
      {!isFinal && !season.standings.some((r) => r.placementSource === 'bracket') ? (
        <p className="text-xs text-amber-300/80 bg-amber-400/10 border border-amber-400/20 rounded-md px-3 py-2">
          This season isn't finished yet — teams below are ordered by current
          regular-season record, not final results.
        </p>
      ) : null}

      <Podium
        champion={season.champion}
        runnerUp={season.runnerUp}
        thirdPlace={season.thirdPlace}
        regularSeasonChampion={season.regularSeasonChampion}
      />

      <BracketView title="Playoff Bracket" rounds={season.winnersBracket} />
      <BracketView
        title="Consolation Bracket"
        rounds={season.losersBracket}
      />

      <StandingsTable standings={season.standings} />
    </TvFrame>
  );
}
