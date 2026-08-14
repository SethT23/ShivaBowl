const TAPS = [
  { name: 'Shiva Gold', style: 'IPA', color: '#fbbf24', shine: '#fef3c7' },
  { name: 'Champion Ale', style: 'Amber Ale', color: '#f59e0b', shine: '#fed7aa' },
  { name: 'Runner-Up Red', style: 'Red Ale', color: '#f43f5e', shine: '#fecdd3' },
  { name: 'Toilet Bowl Stout', style: 'Stout', color: '#92400e', shine: '#d6a06a' },
];

const INK = '#241206';

function TapFixture({ color, shine }: { color: string; shine: string }) {
  return (
    <svg
      width="52"
      height="128"
      viewBox="0 0 52 128"
      className="drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)] overflow-visible"
    >
      {/* handle ball */}
      <circle cx="26" cy="19" r="19" fill={color} stroke={INK} strokeWidth="3" />
      <ellipse cx="19" cy="12" rx="6" ry="8" fill={shine} opacity="0.8" />

      {/* neck connecting handle to collar */}
      <rect x="20" y="34" width="12" height="10" fill={color} stroke={INK} strokeWidth="3" />

      {/* collar under handle */}
      <rect x="10" y="42" width="32" height="10" rx="4" fill="#3f2d1a" stroke={INK} strokeWidth="3" />

      {/* chrome shaft */}
      <rect x="18" y="51" width="16" height="34" rx="3" fill="#e7ebf0" stroke={INK} strokeWidth="3" />
      <rect x="21" y="54" width="4" height="28" rx="2" fill="#aab2bf" />
      <rect x="29" y="54" width="3" height="28" rx="1.5" fill="#ffffff" opacity="0.9" />

      {/* base mounting collar */}
      <rect x="8" y="83" width="36" height="12" rx="4" fill="#3f2d1a" stroke={INK} strokeWidth="3" />

      {/* spout curving out and down */}
      <path
        d="M26 95 V104 Q26 118 41 118"
        fill="none"
        stroke={INK}
        strokeWidth="13"
        strokeLinecap="round"
      />
      <path
        d="M26 95 V104 Q26 118 41 118"
        fill="none"
        stroke="#e7ebf0"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path
        d="M23 96 V104 Q23 112 30 116"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.7"
      />
      <circle cx="41" cy="118" r="6" fill="#e7ebf0" stroke={INK} strokeWidth="3" />

      {/* drip droplet */}
      <path
        d="M41 128 c-3.2 0-5.2-2.2-5.2-4.8 0-2.6 5.2-8 5.2-8s5.2 5.4 5.2 8c0 2.6-2 4.8-5.2 4.8Z"
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
    <div className="hidden sm:block w-full max-w-lg mx-auto select-none" aria-hidden="true">
      <div className="grid" style={{ gridTemplateColumns: cols }}>
        {TAPS.map((tap) => (
          <div key={tap.name} className="flex justify-center -mb-5 z-10 relative">
            <TapFixture color={tap.color} shine={tap.shine} />
          </div>
        ))}
      </div>
      <div className="bar-counter">
        <div className="grid pt-6 pb-2.5 px-1" style={{ gridTemplateColumns: cols }}>
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
