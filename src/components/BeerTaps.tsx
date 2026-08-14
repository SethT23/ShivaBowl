const TAPS = [
  { name: 'Shiva Gold', color: '#fbbf24' },
  { name: 'Champion Ale', color: '#f59e0b' },
  { name: 'Runner-Up Red', color: '#e11d48' },
  { name: 'Toilet Bowl Stout', color: '#78350f' },
];

export function BeerTaps() {
  return (
    <div
      className="hidden sm:flex items-end justify-center gap-6 sm:gap-10 select-none"
      aria-hidden="true"
    >
      {TAPS.map((tap) => (
        <div key={tap.name} className="flex flex-col items-center gap-1.5">
          <svg
            width="34"
            height="64"
            viewBox="0 0 34 64"
            className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
          >
            <rect x="14" y="0" width="6" height="22" rx="2" fill="#9ca3af" />
            <circle cx="17" cy="6" r="4" fill={tap.color} />
            <rect
              x="4"
              y="20"
              width="26"
              height="12"
              rx="3"
              fill="#374151"
              stroke="#111827"
            />
            <rect x="13" y="30" width="8" height="26" rx="2" fill="#4b5563" />
            <rect x="9" y="54" width="16" height="6" rx="2" fill="#1f2937" />
          </svg>
          <span className="text-[10px] uppercase tracking-wide text-amber-200/70 font-semibold">
            {tap.name}
          </span>
        </div>
      ))}
    </div>
  );
}
