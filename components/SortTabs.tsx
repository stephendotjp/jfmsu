'use client';

import type { SortMode } from '@/lib/types';

const TABS: { id: SortMode; label: string }[] = [
  { id: 'top',      label: 'Top rated' },
  { id: 'reviewed', label: 'Most reviewed' },
  { id: 'risky',   label: 'Highest risk' },
];

export function SortTabs({ active, onChange }: { active: SortMode; onChange: (m: SortMode) => void }) {
  return (
    <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            active === tab.id
              ? 'bg-white text-[#00004b] shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
