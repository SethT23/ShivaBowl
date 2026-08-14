import type { ReactNode } from 'react';

interface TvFrameProps {
  label: string;
  live?: boolean;
  children: ReactNode;
}

export function TvFrame({ label, live, children }: TvFrameProps) {
  return (
    <div className="relative rounded-2xl bg-gradient-to-b from-neutral-800 to-neutral-950 p-2 sm:p-3 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.7)] ring-1 ring-black/40">
      <div className="flex items-center gap-2 px-2 pb-2">
        <span
          className={`w-2 h-2 rounded-full bg-rose-500 ${live ? 'tv-live-dot' : ''}`}
          aria-hidden="true"
        />
        <span className="text-[10px] sm:text-xs font-bold tracking-[0.15em] text-neutral-400 uppercase">
          {label}
        </span>
      </div>
      <div className="relative rounded-lg bg-slate-950 p-3 sm:p-5 overflow-hidden ring-1 ring-white/5">
        <div className="tv-scanlines" aria-hidden="true" />
        <div className="relative z-10 flex flex-col gap-5">{children}</div>
      </div>
    </div>
  );
}
