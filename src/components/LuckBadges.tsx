import type { StandingRow } from '../lib/types';

function rankBlurb(row: StandingRow): string {
  return `#${row.winRank} in wins, #${row.pointsRank} in points for`;
}

interface LuckSlotProps {
  row: StandingRow | null;
  label: string;
  emoji: string;
  accentClass: string;
  glowClass: string;
}

function LuckSlot({ row, label, emoji, accentClass, glowClass }: LuckSlotProps) {
  return (
    <div
      className={`flex-1 min-w-[220px] rounded-xl border p-4 flex items-center gap-3 bg-slate-800/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 ${accentClass} ${glowClass}`}
    >
      <span className="text-2xl shrink-0" aria-hidden="true">
        {emoji}
      </span>
      {row ? (
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold">
            {label}
          </p>
          <p className="font-bold text-slate-100 truncate">
            {row.team.teamName}
          </p>
          <p className="text-xs text-slate-400 tabular-nums">
            {row.wins}-{row.losses}
            {row.ties ? `-${row.ties}` : ''} · {rankBlurb(row)}
          </p>
        </div>
      ) : (
        <div>
          <p className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold">
            {label}
          </p>
          <p className="text-sm text-slate-500">Not enough data</p>
        </div>
      )}
    </div>
  );
}

interface LuckBadgesProps {
  luckiest: StandingRow | null;
  unluckiest: StandingRow | null;
}

export function LuckBadges({ luckiest, unluckiest }: LuckBadgesProps) {
  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-sm font-bold uppercase tracking-wide text-slate-300">
        Luck of the Draw
      </h4>
      <div className="flex flex-wrap gap-3">
        <LuckSlot
          row={luckiest}
          label="Luckiest — Won More Than Their Points Deserved"
          emoji="🍀"
          accentClass="border-emerald-400/40"
          glowClass="hover:shadow-[0_0_18px_-6px_rgba(52,211,153,0.4)]"
        />
        <LuckSlot
          row={unluckiest}
          label="Unluckiest — Scored a Lot, Won Less"
          emoji="💀"
          accentClass="border-rose-500/40"
          glowClass="hover:shadow-[0_0_18px_-6px_rgba(244,63,94,0.4)]"
        />
      </div>
    </div>
  );
}
