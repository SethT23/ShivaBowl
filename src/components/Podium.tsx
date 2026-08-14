import type { StandingRow } from '../lib/types';

interface PodiumSlotProps {
  row: StandingRow | null;
  label: string;
  sublabel?: string;
  medal: string;
  accentClass: string;
  glowClass?: string;
}

function PodiumSlot({
  row,
  label,
  sublabel,
  medal,
  accentClass,
  glowClass,
}: PodiumSlotProps) {
  return (
    <div
      className={`group relative flex-1 min-w-[160px] rounded-xl border p-4 flex flex-col items-center text-center gap-2 bg-slate-800/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 ${accentClass} ${glowClass ?? ''}`}
    >
      <span
        className="text-2xl drop-shadow-[0_0_6px_rgba(0,0,0,0.5)]"
        aria-hidden="true"
      >
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
              className="w-12 h-12 rounded-full ring-2 ring-slate-900"
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
          {sublabel && (
            <span className="text-[10px] uppercase tracking-wide text-slate-500 mt-0.5">
              {sublabel}
            </span>
          )}
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
  regularSeasonChampion: StandingRow | null;
}

export function Podium({
  champion,
  runnerUp,
  thirdPlace,
  regularSeasonChampion,
}: PodiumProps) {
  const regularSeasonIsChamp =
    regularSeasonChampion != null &&
    champion != null &&
    regularSeasonChampion.team.rosterId === champion.team.rosterId;

  return (
    <div className="flex flex-wrap gap-3">
      <PodiumSlot
        row={champion}
        label="Champion"
        medal="🏆"
        accentClass="border-amber-400/60"
        glowClass="shadow-[0_0_18px_-4px_rgba(251,191,36,0.35)] hover:shadow-[0_0_26px_-4px_rgba(251,191,36,0.55)]"
      />
      <PodiumSlot
        row={runnerUp}
        label="Runner-Up"
        sublabel="Lost the championship"
        medal="🥈"
        accentClass="border-slate-400/40"
        glowClass="hover:shadow-[0_0_18px_-6px_rgba(148,163,184,0.4)]"
      />
      <PodiumSlot
        row={thirdPlace}
        label="Third Place"
        medal="🥉"
        accentClass="border-orange-700/40"
        glowClass="hover:shadow-[0_0_18px_-6px_rgba(194,120,3,0.35)]"
      />
      <PodiumSlot
        row={regularSeasonChampion}
        label="Regular Season #1 Seed"
        sublabel={
          regularSeasonIsChamp ? 'Also won it all' : 'Best record, no ring'
        }
        medal="📊"
        accentClass="border-cyan-400/40"
        glowClass="shadow-[0_0_18px_-4px_rgba(34,211,238,0.25)] hover:shadow-[0_0_26px_-4px_rgba(34,211,238,0.45)]"
      />
    </div>
  );
}
