const TAPS = [
  { name: 'Shiva Gold', style: 'IPA', color: '#fbbf24', dark: '#92400e' },
  { name: 'Champion Ale', style: 'Amber Ale', color: '#f59e0b', dark: '#9a3412' },
  { name: 'Runner-Up Red', style: 'Red Ale', color: '#e11d48', dark: '#881337' },
  { name: 'Toilet Bowl Stout', style: 'Stout', color: '#78350f', dark: '#1c0a02' },
];

function TapFixture({ color }: { color: string }) {
  const gradId = `chrome-${color.replace('#', '')}`;
  return (
    <svg
      width="34"
      height="90"
      viewBox="0 0 34 90"
      className="drop-shadow-[0_3px_5px_rgba(0,0,0,0.65)] overflow-visible"
    >
      <defs>
        <linearGradient id={gradId} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#f3f4f6" />
          <stop offset="35%" stopColor="#8a919e" />
          <stop offset="55%" stopColor="#e5e7eb" />
          <stop offset="100%" stopColor="#5b6270" />
        </linearGradient>
      </defs>

      {/* handle knob */}
      <rect x="9" y="0" width="16" height="26" rx="7" fill={color} stroke="rgba(0,0,0,0.35)" />
      <rect x="12.5" y="3" width="3.5" height="12" rx="1.5" fill="rgba(255,255,255,0.4)" />
      <circle cx="17" cy="20" r="3.4" fill="rgba(0,0,0,0.25)" />

      {/* collar under handle */}
      <rect x="6" y="25" width="22" height="5" rx="1.5" fill="#2b2f38" />

      {/* chrome shaft */}
      <rect x="13" y="30" width="8" height="30" fill={`url(#${gradId})`} />
      <rect x="13" y="30" width="8" height="30" fill="none" stroke="rgba(0,0,0,0.25)" />

      {/* base mounting collar */}
      <rect x="5" y="59" width="24" height="8" rx="2.5" fill="#2b2f38" />

      {/* spout curving out and down */}
      <path
        d="M17 66 V74 Q17 84 27 84"
        fill="none"
        stroke="#8a919e"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path
        d="M17 66 V74 Q17 84 27 84"
        fill="none"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <circle cx="27" cy="86.5" r="2.6" fill="#1f2329" />
    </svg>
  );
}

export function BeerTaps() {
  const cols = `repeat(${TAPS.length}, minmax(0, 1fr))`;

  return (
    <div className="hidden sm:block w-full max-w-md mx-auto select-none" aria-hidden="true">
      <div className="grid" style={{ gridTemplateColumns: cols }}>
        {TAPS.map((tap) => (
          <div key={tap.name} className="flex justify-center -mb-4 z-10 relative">
            <TapFixture color={tap.color} />
          </div>
        ))}
      </div>
      <div className="bar-counter">
        <div className="grid pt-5 pb-2.5 px-1" style={{ gridTemplateColumns: cols }}>
          {TAPS.map((tap) => (
            <div key={tap.name} className="flex flex-col items-center gap-0.5 px-1">
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wide text-amber-100 text-center leading-tight drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]">
                {tap.name}
              </span>
              <span className="text-[8px] uppercase tracking-widest text-amber-200/60">
                {tap.style}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
