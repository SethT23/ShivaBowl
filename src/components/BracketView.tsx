import type { BracketRound, BracketTeamSlot } from '../lib/types';

function labelAccent(label: string | null): string {
  if (!label) return 'bg-slate-700/60 text-slate-300';
  if (label === 'Championship')
    return 'bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/40';
  if (label === 'Toilet Bowl')
    return 'bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/40';
  if (label.includes('Place Game') || label === 'Consolation Final')
    return 'bg-cyan-400/10 text-cyan-300 ring-1 ring-cyan-400/30';
  return 'bg-slate-700/60 text-slate-300';
}

function TeamRow({ slot }: { slot: BracketTeamSlot | null }) {
  if (!slot || !slot.row) {
    return (
      <div className="flex items-center gap-2 px-2.5 py-1.5 text-slate-500 italic text-xs">
        TBD
      </div>
    );
  }
  const { row, isWinner } = slot;
  return (
    <div
      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs sm:text-sm transition-colors ${
        isWinner
          ? 'text-slate-50 font-semibold bg-amber-400/10'
          : 'text-slate-500'
      }`}
    >
      {row.team.avatarUrl ? (
        <img
          src={row.team.avatarUrl}
          alt=""
          className={`w-5 h-5 rounded-full shrink-0 ${isWinner ? '' : 'opacity-60 grayscale'}`}
          loading="lazy"
        />
      ) : (
        <span className="w-5 h-5 rounded-full bg-slate-700 shrink-0" />
      )}
      <span className="truncate">{row.team.teamName}</span>
      {isWinner && (
        <span aria-hidden="true" className="ml-auto text-amber-300 shrink-0">
          ▲
        </span>
      )}
    </div>
  );
}

interface BracketViewProps {
  title: string;
  rounds: BracketRound[];
}

export function BracketView({ title, rounds }: BracketViewProps) {
  if (rounds.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-sm font-bold uppercase tracking-wide text-slate-300">
        {title}
      </h4>
      <div className="overflow-x-auto">
        <div className="flex gap-4 min-w-max pb-1">
          {rounds.map((round) => (
            <div key={round.round} className="flex flex-col gap-3 w-44 sm:w-52">
              <p className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold text-center">
                Round {round.round}
              </p>
              <div className="flex flex-col gap-4 justify-center flex-1">
                {round.matchups.map((matchup) => (
                  <div
                    key={matchup.matchId}
                    className="rounded-lg border border-slate-700/70 bg-slate-900/50 overflow-hidden"
                  >
                    {matchup.label && (
                      <div
                        className={`text-[10px] font-bold uppercase tracking-wide text-center py-1 ${labelAccent(matchup.label)}`}
                      >
                        {matchup.label}
                      </div>
                    )}
                    <div className="divide-y divide-slate-800">
                      <TeamRow slot={matchup.team1} />
                      <TeamRow slot={matchup.team2} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
