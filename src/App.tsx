import { useState } from 'react';
import { BeerTaps } from './components/BeerTaps';
import { LeagueHistoryTab } from './components/LeagueHistoryTab';
import { PreviousLeaguesTab } from './components/PreviousLeaguesTab';
import { Tabs, type TabItem } from './components/Tabs';
import { LoadingState, ErrorState } from './components/StatusStates';
import { useLeagueHistory } from './hooks/useLeagueHistory';

const ROOT_LEAGUE_ID = '1389392186746875904';

const TABS: TabItem[] = [
  { id: 'history', label: 'League History' },
  { id: 'previous', label: 'Previous Leagues' },
];

export default function App() {
  const { loading, error, seasons } = useLeagueHistory(ROOT_LEAGUE_ID);
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  const currentLeague = seasons[0];

  return (
    <div className="relative min-h-screen flex flex-col text-slate-100">
      <header className="relative border-b border-amber-400/10 bg-black/30 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 pt-10 pb-6 flex flex-col items-center text-center gap-3">
          {currentLeague?.avatarUrl ? (
            <img
              src={currentLeague.avatarUrl}
              alt=""
              className="w-16 h-16 rounded-full ring-2 ring-amber-400/40"
            />
          ) : (
            <span className="text-4xl mb-1" aria-hidden="true">
              🏆
            </span>
          )}
          <h1 className="neon-title text-3xl sm:text-5xl tracking-tight">
            Shiva Bowl Hall of Fame
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-lg">
            Pull up a stool — every champion, choke job, and record from{' '}
            <span className="text-amber-300/90 font-medium">
              The Shiva Bowl
            </span>{' '}
            fantasy football league.
          </p>
          <div className="mt-2">
            <BeerTaps />
          </div>
        </div>
      </header>

      <main className="relative flex-1 max-w-5xl w-full mx-auto px-4 py-8">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : (
          <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab}>
            {activeTab === 'history' ? (
              <LeagueHistoryTab seasons={seasons} />
            ) : (
              <PreviousLeaguesTab seasons={seasons} />
            )}
          </Tabs>
        )}
      </main>

      <footer className="relative max-w-5xl mx-auto px-4 pb-10 pt-4 text-center text-xs text-slate-600">
        Data provided by the Sleeper API. League ID {ROOT_LEAGUE_ID}.
      </footer>

      <div className="bartop" />
    </div>
  );
}
