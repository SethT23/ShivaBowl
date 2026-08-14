import { ordinal } from '../lib/format';
import type { StandingRow } from '../lib/types';

interface StandingsTableProps {
  standings: StandingRow[];
}

export function StandingsTable({ standings }: StandingsTableProps) {
  const showPotential = standings.some((r) => r.potentialPoints != null);
  const showStreak = standings.some((r) => r.streak);
  const showWaiver = standings.some((r) => r.waiverBudgetUsed != null);
  const showMoves = standings.some((r) => r.totalMoves != null);

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-700/70 shadow-inner shadow-black/40">
      <table className="w-full text-sm text-left border-collapse">
        <thead>
          <tr className="bg-slate-800/80 text-slate-300 uppercase text-xs tracking-wide">
            <th className="px-3 py-2 font-semibold">Place</th>
            <th className="px-3 py-2 font-semibold">Seed</th>
            <th className="px-3 py-2 font-semibold">Team</th>
            <th className="px-3 py-2 font-semibold">Owner</th>
            <th className="px-3 py-2 font-semibold text-center">Record</th>
            {showStreak && (
              <th className="px-3 py-2 font-semibold text-center">Streak</th>
            )}
            <th className="px-3 py-2 font-semibold text-right">PF</th>
            <th className="px-3 py-2 font-semibold text-right">PA</th>
            {showPotential && (
              <th className="px-3 py-2 font-semibold text-right">
                Potential
              </th>
            )}
            {showWaiver && (
              <th className="px-3 py-2 font-semibold text-right">FAAB $</th>
            )}
            {showMoves && (
              <th className="px-3 py-2 font-semibold text-right">Moves</th>
            )}
          </tr>
        </thead>
        <tbody>
          {standings.map((row) => (
            <tr
              key={row.team.rosterId}
              className={`border-t border-slate-700/50 odd:bg-slate-900/30 hover:bg-slate-800/60 transition-colors ${
                row.placement === 1 ? 'bg-amber-400/[0.06]' : ''
              }`}
            >
              <td className="px-3 py-2 font-bold text-amber-300 tabular-nums">
                {row.placement != null ? ordinal(row.placement) : '—'}
              </td>
              <td className="px-3 py-2 text-slate-400 tabular-nums">
                #{row.seed}
              </td>
              <td className="px-3 py-2 flex items-center gap-2 text-slate-100 font-medium whitespace-nowrap">
                {row.team.avatarUrl ? (
                  <img
                    src={row.team.avatarUrl}
                    alt=""
                    className="w-6 h-6 rounded-full shrink-0"
                    loading="lazy"
                  />
                ) : (
                  <span className="w-6 h-6 rounded-full bg-slate-700 shrink-0" />
                )}
                {row.team.teamName}
              </td>
              <td className="px-3 py-2 text-slate-400 whitespace-nowrap">
                {row.team.ownerName}
              </td>
              <td className="px-3 py-2 text-center text-slate-200 tabular-nums whitespace-nowrap">
                {row.wins}-{row.losses}
                {row.ties ? `-${row.ties}` : ''}
              </td>
              {showStreak && (
                <td className="px-3 py-2 text-center text-slate-300 tabular-nums">
                  {row.streak ?? '—'}
                </td>
              )}
              <td className="px-3 py-2 text-right text-slate-300 tabular-nums">
                {row.pointsFor.toFixed(2)}
              </td>
              <td className="px-3 py-2 text-right text-slate-300 tabular-nums">
                {row.pointsAgainst.toFixed(2)}
              </td>
              {showPotential && (
                <td className="px-3 py-2 text-right text-slate-400 tabular-nums">
                  {row.potentialPoints != null
                    ? row.potentialPoints.toFixed(2)
                    : '—'}
                </td>
              )}
              {showWaiver && (
                <td className="px-3 py-2 text-right text-slate-400 tabular-nums">
                  {row.waiverBudgetUsed ?? '—'}
                </td>
              )}
              {showMoves && (
                <td className="px-3 py-2 text-right text-slate-400 tabular-nums">
                  {row.totalMoves ?? '—'}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
