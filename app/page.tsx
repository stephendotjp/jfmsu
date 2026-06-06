'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Location, SortMode } from '@/lib/types';
import { PREFECTURES, type Prefecture } from '@/lib/prefectures';
import { LocationCard } from '@/components/LocationCard';
import { SkeletonCard } from '@/components/SkeletonCard';
import { SortTabs } from '@/components/SortTabs';

const DEFAULT = PREFECTURES.find(p => p.en === 'Osaka')!;

function parseArea(address: string): string {
  const wardMatch = address.match(/(\S+区)/);
  if (wardMatch) return wardMatch[1];
  const cityMatch = address.match(/(\S+市)/);
  return cityMatch ? cityMatch[1] : 'Other';
}

function sortLocations(locs: Location[], mode: SortMode): Location[] {
  return [...locs].sort((a, b) => {
    if (mode === 'top') return b.rating - a.rating;
    if (mode === 'reviewed') return b.reviewCount - a.reviewCount;
    return a.rating - b.rating;
  });
}

export default function Home() {
  const [prefecture, setPrefecture] = useState<Prefecture>(DEFAULT);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isMock, setIsMock] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>('top');
  const [areaFilter, setAreaFilter] = useState('All');
  const [bgOpacity, setBgOpacity] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const start = maxScroll * 0.2;
      const end = maxScroll * 0.8;
      setBgOpacity(Math.max(0, Math.min(1, (scrollY - start) / (end - start))));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(false);
    setAreaFilter('All');
    fetch(`/api/locations?city=${encodeURIComponent(prefecture.query)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: { locations: Location[]; source: string }) => {
        setLocations(data.locations);
        setIsMock(data.source === 'mock');
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [prefecture]);

  const areas = useMemo(() => {
    const set = new Set(locations.map((l) => parseArea(l.address)));
    return ['All', ...Array.from(set).sort()];
  }, [locations]);

  const displayed = useMemo(() => {
    const filtered = areaFilter === 'All' ? locations : locations.filter((l) => parseArea(l.address) === areaFilter);
    return sortLocations(filtered, sortMode);
  }, [locations, sortMode, areaFilter]);

  return (
    <>
      {/* Scroll-driven avatar — desktop only, sits in the taskbar area */}
      <div
        className="hidden md:block fixed bottom-0 right-6 pointer-events-none select-none"
        style={{ opacity: bgOpacity, zIndex: 5, transition: 'opacity 200ms linear' }}
        aria-hidden="true"
      >
        <img
          src="/jfmsu.png"
          alt=""
          className="w-[150px] h-[150px] object-cover object-top rounded-t-xl"
        />
      </div>

      <div className="flex flex-col min-h-screen relative" style={{ zIndex: 10 }}>
        {/* Header */}
        <header className="bg-[#00004b] text-white py-8 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-white text-[#00004b] font-black text-2xl w-12 h-12 flex items-center justify-center rounded select-none">
                QB
              </div>
              <span className="tracking-[0.3em] text-white/80 font-semibold text-sm uppercase">House</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight lowercase">
              just fuck my shit up
            </h1>
            <p className="text-white/60 text-sm mt-2">
              sorted by google maps rating · highest = least likely to ruin your life
            </p>
          </div>
        </header>

        {/* Prefecture picker */}
        <div className="bg-[#00006e] px-4 py-3">
          <div className="max-w-2xl mx-auto">
            <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Prefecture</p>
            <div className="flex flex-wrap gap-1.5">
              {PREFECTURES.map((p) => (
                <button
                  key={p.en}
                  onClick={() => setPrefecture(p)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    prefecture.en === p.en
                      ? 'bg-white text-[#00004b]'
                      : 'bg-white/10 text-white hover:bg-white/25'
                  }`}
                >
                  {p.en}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full">
          {!loading && !error && locations.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-3 mb-5 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <SortTabs active={sortMode} onChange={setSortMode} />
                {areas.length > 2 && (
                  <select
                    value={areaFilter}
                    onChange={(e) => setAreaFilter(e.target.value)}
                    className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#00004b]"
                  >
                    {areas.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                )}
              </div>
              {isMock && (
                <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2 py-1 rounded-md">
                  demo data
                </span>
              )}
            </div>
          )}

          {loading && (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {!loading && error && (
            <div className="text-center py-16 text-gray-500">
              <p className="text-4xl mb-3">✂️</p>
              <p className="font-semibold">Couldn&apos;t load locations for {prefecture.en}.</p>
              <p className="text-sm mt-1">Try another prefecture.</p>
            </div>
          )}

          {!loading && !error && displayed.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <p className="text-4xl mb-3">✂️</p>
              <p className="font-semibold">No QB Houses found in {prefecture.en}.</p>
              <p className="text-sm mt-1">Lucky you.</p>
            </div>
          )}

          {!loading && !error && displayed.length > 0 && (
            <div className="space-y-3">
              {displayed.map((loc, i) => (
                <LocationCard key={loc.placeId} location={loc} rank={i + 1} />
              ))}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="text-center text-xs text-gray-400 py-6 border-t border-gray-200 bg-white">
          ¥1,350 per regret · not affiliated with QB House
        </footer>
      </div>
    </>
  );
}
