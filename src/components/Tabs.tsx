import type { ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  children: ReactNode;
}

export function Tabs({ tabs, activeTab, onChange, children }: TabsProps) {
  return (
    <div>
      <div
        role="tablist"
        aria-label="Hall of Fame sections"
        className="flex gap-1 border-b border-slate-700/70 mb-6"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              role="tab"
              type="button"
              aria-selected={isActive}
              onClick={() => onChange(tab.id)}
              className={`px-4 py-2.5 text-sm sm:text-base font-semibold rounded-t-lg -mb-px border-b-2 transition-colors cursor-pointer ${
                isActive
                  ? 'border-amber-400 text-amber-300 bg-slate-800/60'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {children}
    </div>
  );
}
