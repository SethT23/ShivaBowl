const TAPS = [
  { name: 'Shiva Bowl Gold', style: 'Golden Ale', color: '#002244', shine: '#6b91c4' },
  { name: 'Points Per Ale', style: 'Pale Ale', color: '#69be28', shine: '#b6e28c' },
  { name: 'Sunday Night Stout', style: 'Stout', color: '#a5acaf', shine: '#e8eaec' },
  { name: "Ryan's Red Ale", style: 'Red Ale', color: '#ffffff', shine: '#dbe4f0' },
];

const INK = '#241206';

function TapFixture({ color, shine }: { color: string; shine: string }) {
  return (
    <svg
      width="60"
      height="184"
      viewBox="0 0 60 184"
      className="drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)] overflow-visible"
    >
      {/* handle paddle */}
      <rect x="13" y="0" width="34" height="56" rx="11" fill={color} stroke={INK} strokeWidth="3" />
      <rect x="19" y="8" width="8" height="32" rx="4" fill={shine} opacity="0.8" />

      {/* neck connecting handle to collar */}
      <rect x="23" y="56" width="14" height="10" fill={color} stroke={INK} strokeWidth="3" />

      {/* collar under handle */}
      <rect x="10" y="66" width="40" height="12" rx="4" fill="#3f2d1a" stroke={INK} strokeWidth="3" />

      {/* chrome shaft */}
      <rect x="19" y="78" width="22" height="42" rx="4" fill="#e7ebf0" stroke={INK} strokeWidth="3" />
      <rect x="23" y="82" width="5" height="34" rx="2" fill="#aab2bf" />
      <rect x="33" y="82" width="4" height="34" rx="2" fill="#ffffff" opacity="0.9" />

      {/* base mounting collar */}
      <rect x="8" y="120" width="44" height="14" rx="4" fill="#3f2d1a" stroke={INK} strokeWidth="3" />

      {/* spout curving out and down */}
      <path
        d="M30 134 V146 Q30 160 47 160"
        fill="none"
        stroke={INK}
        strokeWidth="15"
        strokeLinecap="round"
      />
      <path
        d="M30 134 V146 Q30 160 47 160"
        fill="none"
        stroke="#e7ebf0"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M27 136 V146 Q27 154 36 158"
        fill="none"
        stroke="#ffffff"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.7"
      />
      <circle cx="47" cy="160" r="7.5" fill="#e7ebf0" stroke={INK} strokeWidth="3" />

      {/* drip droplet */}
      <path
        d="M47 178 c-3.6 0-5.85-2.5-5.85-5.4 0-2.9 5.85-9 5.85-9s5.85 6.1 5.85 9c0 2.9-2.25 5.4-5.85 5.4Z"
        fill={color}
        stroke={INK}
        strokeWidth="2"
      />
    </svg>
  );
}

export function BeerTaps() {
  const cols = `repeat(${TAPS.length}, minmax(0, 1fr))`;

  return (
    <div className="hidden sm:block w-full max-w-xl mx-auto select-none" aria-hidden="true">
      <div className="grid" style={{ gridTemplateColumns: cols }}>
        {TAPS.map((tap) => (
          <div key={tap.name} className="flex justify-center -mb-6 z-10 relative">
            <TapFixture color={tap.color} shine={tap.shine} />
          </div>
        ))}
      </div>
      <div className="bar-counter">
        <div className="grid pt-7 pb-2.5 px-1" style={{ gridTemplateColumns: cols }}>
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
