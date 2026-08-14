import type { StandingRow } from '../lib/types';

function ordinal(n: number): string {
  const rem100 = n % 100;
  if (rem100 >= 11 && rem100 <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}

interface StandingsTableProps {
  standings: StandingRow[];
}

export function StandingsTable({ standings }: StandingsTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-700/70">
      <table className="w-full text-sm text-left border-collapse">
        <thead>
          <tr className="bg-slate-800/80 text-slate-300 uppercase text-xs tracking-wide">
            <th className="px-3 py-2 font-semibold">Place</th>
            <th className="px-3 py-2 font-semibold">Team</th>
            <th className="px-3 py-2 font-semibold">Owner</th>
            <th className="px-3 py-2 font-semibold text-center">Record</th>
            <th className="px-3 py-2 font-semibold text-right">PF</th>
            <th className="px-3 py-2 font-semibold text-right">PA</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((row) => (
            <tr
              key={row.team.rosterId}
              className="border-t border-slate-700/50 odd:bg-slate-900/30 hover:bg-slate-800/50"
            >
              <td className="px-3 py-2 font-semibold text-amber-300">
                {row.placement != null ? ordinal(row.placement) : '—'}
              </td>
              <td className="px-3 py-2 flex items-center gap-2 text-slate-100 font-medium">
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
              <td className="px-3 py-2 text-slate-400">{row.team.ownerName}</td>
              <td className="px-3 py-2 text-center text-slate-200 tabular-nums">
                {row.wins}-{row.losses}
                {row.ties ? `-${row.ties}` : ''}
              </td>
              <td className="px-3 py-2 text-right text-slate-300 tabular-nums">
                {row.pointsFor.toFixed(2)}
              </td>
              <td className="px-3 py-2 text-right text-slate-300 tabular-nums">
                {row.pointsAgainst.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
