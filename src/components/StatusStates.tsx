export function LoadingState() {
  return (
    <div className="rounded-2xl bg-slate-950/40 backdrop-blur-sm ring-1 ring-white/5 shadow-2xl flex flex-col items-center justify-center gap-3 py-20 text-slate-400">
      <div className="w-8 h-8 border-2 border-slate-600 border-t-amber-400 rounded-full animate-spin" />
      <p>Loading league history from Sleeper…</p>
    </div>
  );
}

interface ErrorStateProps {
  message: string;
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="rounded-2xl bg-slate-950/40 backdrop-blur-sm ring-1 ring-white/5 shadow-2xl flex flex-col items-center justify-center gap-2 py-20 text-center px-4">
      <p className="text-red-400 font-semibold">Couldn't load league data</p>
      <p className="text-slate-400 text-sm max-w-md">{message}</p>
    </div>
  );
}
