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
        className="flex gap-1 border-b border-white/10 mb-6"
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
              className={`px-4 py-2.5 text-sm sm:text-base font-semibold rounded-t-lg -mb-px border-b-2 transition-all cursor-pointer ${
                isActive
                  ? 'border-amber-400 text-amber-300 bg-white/[0.04] shadow-[0_-2px_16px_-4px_rgba(251,191,36,0.35)]'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div className="rounded-2xl bg-slate-950/40 backdrop-blur-sm ring-1 ring-white/5 p-3 sm:p-5 shadow-2xl">
        {children}
      </div>
    </div>
  );
}
