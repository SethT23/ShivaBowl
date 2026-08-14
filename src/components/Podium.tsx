import type { StandingRow } from '../lib/types';

interface PodiumSlotProps {
  row: StandingRow | null;
  label: string;
  medal: string;
  accentClass: string;
}

function PodiumSlot({ row, label, medal, accentClass }: PodiumSlotProps) {
  return (
    <div
      className={`flex-1 min-w-[160px] rounded-xl border p-4 flex flex-col items-center text-center gap-2 bg-slate-800/50 ${accentClass}`}
    >
      <span className="text-2xl" aria-hidden="true">
        {medal}
      </span>
      <span className="text-xs uppercase tracking-wide text-slate-400 font-semibold">
        {label}
      </span>
      {row ? (
        <>
          {row.team.avatarUrl ? (
            <img
              src={row.team.avatarUrl}
              alt=""
              className="w-12 h-12 rounded-full"
              loading="lazy"
            />
          ) : (
            <span className="w-12 h-12 rounded-full bg-slate-700" />
          )}
          <span className="font-bold text-slate-100 leading-tight">
            {row.team.teamName}
          </span>
          <span className="text-xs text-slate-400">{row.team.ownerName}</span>
          <span className="text-xs text-slate-300 tabular-nums">
            {row.wins}-{row.losses}
            {row.ties ? `-${row.ties}` : ''} · {row.pointsFor.toFixed(1)} pts
          </span>
        </>
      ) : (
        <span className="text-sm text-slate-500 py-4">Not decided</span>
      )}
    </div>
  );
}

interface PodiumProps {
  champion: StandingRow | null;
  runnerUp: StandingRow | null;
  thirdPlace: StandingRow | null;
}

export function Podium({ champion, runnerUp, thirdPlace }: PodiumProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <PodiumSlot
        row={champion}
        label="Champion"
        medal="🏆"
        accentClass="border-amber-400/60 shadow-[0_0_0_1px_rgba(251,191,36,0.15)]"
      />
      <PodiumSlot
        row={runnerUp}
        label="Runner-up"
        medal="🥈"
        accentClass="border-slate-400/40"
      />
      <PodiumSlot
        row={thirdPlace}
        label="Third Place"
        medal="🥉"
        accentClass="border-orange-700/40"
      />
    </div>
  );
}
