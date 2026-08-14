import { useState } from 'react';
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
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col items-center text-center gap-2">
          {currentLeague?.avatarUrl ? (
            <img
              src={currentLeague.avatarUrl}
              alt=""
              className="w-16 h-16 rounded-full mb-1"
            />
          ) : (
            <span className="text-4xl mb-1" aria-hidden="true">
              🏆
            </span>
          )}
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Shiva Bowl Hall of Fame
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Record book &amp; league history for The Shiva Bowl fantasy
            football league
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
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

      <footer className="max-w-5xl mx-auto px-4 py-6 text-center text-xs text-slate-600">
        Data provided by the Sleeper API. League ID {ROOT_LEAGUE_ID}.
      </footer>
    </div>
  );
}
