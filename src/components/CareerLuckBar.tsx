import type { CareerStanding } from '../lib/types';

function formatPct(pct: number): string {
  return `${(pct * 100).toFixed(1)}%`;
}

interface CareerLuckCardProps {
  standing: CareerStanding | null;
  label: string;
  emoji: string;
  accentClass: string;
  glowClass: string;
}

function CareerLuckCard({
  standing,
  label,
  emoji,
  accentClass,
  glowClass,
}: CareerLuckCardProps) {
  return (
    <div
      className={`flex-1 min-w-[240px] rounded-xl border p-4 flex items-center gap-3 bg-slate-800/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 ${accentClass} ${glowClass}`}
    >
      <span className="text-2xl shrink-0" aria-hidden="true">
        {emoji}
      </span>
      {standing ? (
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold">
            {label}
          </p>
          <p className="font-bold text-slate-100 truncate">
            {standing.teamName}
          </p>
          <p className="text-xs text-slate-400 tabular-nums">
            {formatPct(standing.winPct)} win rate (#{standing.winPctRank}) ·{' '}
            {standing.pointsFor.toFixed(0)} career pts (#
            {standing.pointsForRank}) · {standing.seasonsPlayed}{' '}
            {standing.seasonsPlayed === 1 ? 'season' : 'seasons'}
          </p>
        </div>
      ) : (
        <div>
          <p className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold">
            {label}
          </p>
          <p className="text-sm text-slate-500">Not enough data yet</p>
        </div>
      )}
    </div>
  );
}

interface CareerLuckBarProps {
  luckiest: CareerStanding | null;
  unluckiest: CareerStanding | null;
}

export function CareerLuckBar({ luckiest, unluckiest }: CareerLuckBarProps) {
  if (!luckiest && !unluckiest) return null;

  return (
    <div className="flex flex-col gap-2 mb-6">
      <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500 px-1">
        All-Time Luck — Win % vs. Career Points For
      </h2>
      <div className="flex flex-wrap gap-3">
        <CareerLuckCard
          standing={luckiest}
          label="Luckiest Team in League History"
          emoji="🍀"
          accentClass="border-emerald-400/40"
          glowClass="hover:shadow-[0_0_18px_-6px_rgba(52,211,153,0.4)]"
        />
        <CareerLuckCard
          standing={unluckiest}
          label="Unluckiest Team in League History"
          emoji="💀"
          accentClass="border-rose-500/40"
          glowClass="hover:shadow-[0_0_18px_-6px_rgba(244,63,94,0.4)]"
        />
      </div>
    </div>
  );
}
