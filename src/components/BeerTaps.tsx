const TAPS = [
  {
    name: 'Shiva Bowl Gold',
    style: 'Golden Ale',
    color: '#002244',
    shine: '#6b91c4',
    shape: 'football',
  },
  {
    name: 'Points Per Ale',
    style: 'Pale Ale',
    color: '#69be28',
    shine: '#b6e28c',
    shape: 'ball',
  },
  {
    name: 'Sunday Night Stout',
    style: 'Stout',
    color: '#a5acaf',
    shine: '#e8eaec',
    shape: 'shield',
  },
  {
    name: "Ryan's Red Ale",
    style: 'Red Ale',
    color: '#ffffff',
    shine: '#dbe4f0',
    shape: 'diamond',
  },
] as const;

type Shape = (typeof TAPS)[number]['shape'];

const INK = '#241206';
const CX = 22;

function Head({ shape, color, shine }: { shape: Shape; color: string; shine: string }) {
  switch (shape) {
    case 'football':
      return (
        <>
          <ellipse cx={CX} cy="38" rx="17" ry="36" fill={color} stroke={INK} strokeWidth="3" />
          <ellipse cx="16" cy="24" rx="5" ry="9" fill={shine} opacity="0.75" />
          <line x1={CX} y1="16" x2={CX} y2="60" stroke="#ffffff" strokeWidth="2" opacity="0.85" />
          {[24, 32, 40, 48].map((y) => (
            <line key={y} x1={CX - 4} y1={y} x2={CX + 4} y2={y} stroke="#ffffff" strokeWidth="1.6" opacity="0.85" />
          ))}
        </>
      );
    case 'ball':
      return (
        <>
          <circle cx={CX} cy="24" r="19" fill={color} stroke={INK} strokeWidth="3" />
          <ellipse cx="16" cy="16" rx="5.5" ry="7" fill={shine} opacity="0.8" />
        </>
      );
    case 'shield':
      return (
        <>
          <path
            d="M4 18 Q4 2 22 2 Q40 2 40 18 L40 48 Q40 68 22 78 Q4 68 4 48 Z"
            fill={color}
            stroke={INK}
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M10 10 Q12 6 18 6"
            fill="none"
            stroke={shine}
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.8"
          />
        </>
      );
    case 'diamond':
      return (
        <>
          <polygon
            points="22,4 42,32 22,60 2,32"
            fill={color}
            stroke={INK}
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <polygon points="22,10 33,32 22,30 11,32" fill={shine} opacity="0.7" />
        </>
      );
  }
}

const HEAD_BOTTOM: Record<Shape, number> = {
  football: 78,
  ball: 48,
  shield: 82,
  diamond: 64,
};

function TapFixture({ shape, color, shine }: { shape: Shape; color: string; shine: string }) {
  const headBottom = HEAD_BOTTOM[shape];
  const neckTop = headBottom;
  const shaftTop = neckTop + 13;
  const total = shaftTop + 24;

  return (
    <svg
      width="44"
      height={total}
      viewBox={`0 0 44 ${total}`}
      className="drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)] overflow-visible"
    >
      <Head shape={shape} color={color} shine={shine} />

      {/* neck connecting handle to shaft */}
      <rect x={CX - 6} y={neckTop} width="12" height="13" fill={color} stroke={INK} strokeWidth="2.5" />

      {/* short chrome shaft down to the manifold */}
      <rect x={CX - 9} y={shaftTop} width="18" height="24" rx="3" fill="#e7ebf0" stroke={INK} strokeWidth="2.5" />
      <rect x={CX - 5} y={shaftTop + 3} width="4" height="18" rx="2" fill="#aab2bf" />
      <rect x={CX + 3} y={shaftTop + 3} width="3" height="18" rx="1.5" fill="#ffffff" opacity="0.9" />
    </svg>
  );
}

function Manifold({ count }: { count: number }) {
  const cols = `repeat(${count}, minmax(0, 1fr))`;

  return (
    <div className="relative h-8 px-4">
      {/* support legs down to the counter */}
      <div className="absolute left-[8%] top-2 bottom-[-14px] w-2.5 rounded-sm bg-gradient-to-b from-slate-200 via-slate-500 to-slate-700 ring-1 ring-black/40" />
      <div className="absolute right-[8%] top-2 bottom-[-14px] w-2.5 rounded-sm bg-gradient-to-b from-slate-200 via-slate-500 to-slate-700 ring-1 ring-black/40" />

      {/* chrome manifold bar */}
      <div className="absolute inset-x-0 top-1 h-4 rounded-full bg-gradient-to-b from-slate-100 via-slate-400 to-slate-600 ring-1 ring-black/40 shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />

      {/* one spout per tap, hanging off the front of the manifold */}
      <div className="relative grid h-full" style={{ gridTemplateColumns: cols }}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex justify-center">
            <svg width="14" height="26" viewBox="0 0 14 26" className="overflow-visible">
              <path d="M7 6 V14 Q7 22 7 22" fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round" />
              <path d="M7 6 V14 Q7 22 7 22" fill="none" stroke="#dfe4ea" strokeWidth="4.5" strokeLinecap="round" />
              <circle cx="7" cy="22" r="3.4" fill="#dfe4ea" stroke={INK} strokeWidth="2" />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BeerTaps() {
  const cols = `repeat(${TAPS.length}, minmax(0, 1fr))`;

  return (
    <div className="hidden sm:block w-full max-w-2xl mx-auto select-none" aria-hidden="true">
      <div className="grid items-end" style={{ gridTemplateColumns: cols }}>
        {TAPS.map((tap) => (
          <div key={tap.name} className="flex justify-center relative z-10">
            <TapFixture shape={tap.shape} color={tap.color} shine={tap.shine} />
          </div>
        ))}
      </div>
      <Manifold count={TAPS.length} />
      <div className="bar-counter">
        <div className="grid pt-4 pb-2.5 px-1" style={{ gridTemplateColumns: cols }}>
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
