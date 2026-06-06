'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Location, SortMode } from '@/lib/types';
import { PREFECTURES, type Prefecture } from '@/lib/prefectures';
import { jfmsuScore, relativeTier } from '@/lib/risk';
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

  // Mean raw rating across all returned locations — used for Bayesian shrinkage
  const cityMean = useMemo(() => {
    if (locations.length === 0) return 0;
    return locations.reduce((s, l) => s + l.rating, 0) / locations.length;
  }, [locations]);

  const areas = useMemo(() => {
    const set = new Set(locations.map((l) => parseArea(l.address)));
    return ['All', ...Array.from(set).sort()];
  }, [locations]);

  // Filtered set (before sort)
  const filtered = useMemo(() =>
    areaFilter === 'All' ? locations : locations.filter(l => parseArea(l.address) === areaFilter),
    [locations, areaFilter]
  );

  // Quality rank map — always sorted best→worst by jfmsuScore so tiers don't
  // flip when the user switches to a different sort mode
  const qualityRankMap = useMemo(() => {
    const sorted = [...filtered].sort(
      (a, b) => jfmsuScore(b.rating, b.reviewCount, cityMean) - jfmsuScore(a.rating, a.reviewCount, cityMean)
    );
    return new Map(sorted.map((l, i) => [l.placeId, i + 1]));
  }, [filtered, cityMean]);

  // Displayed list — re-ordered by the active sort tab
  const displayed = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sortMode === 'top')      return jfmsuScore(b.rating, b.reviewCount, cityMean) - jfmsuScore(a.rating, a.reviewCount, cityMean);
      if (sortMode === 'reviewed') return b.reviewCount - a.reviewCount;
      return jfmsuScore(a.rating, a.reviewCount, cityMean) - jfmsuScore(b.rating, b.reviewCount, cityMean);
    });
  }, [filtered, sortMode, cityMean]);

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
        <div className="bg-[#00006e] px-4 py-4">
          <div className="max-w-2xl mx-auto">
            <label className="block text-white/50 text-xs uppercase tracking-wider mb-1.5">
              Prefecture
            </label>
            <div className="relative">
              <select
                value={prefecture.en}
                onChange={(e) => {
                  const p = PREFECTURES.find((p) => p.en === e.target.value)!;
                  setPrefecture(p);
                }}
                className="w-full appearance-none bg-white text-[#00004b] font-semibold text-sm rounded-lg px-4 py-2.5 pr-10 border-0 focus:outline-none focus:ring-2 focus:ring-white/40 cursor-pointer"
              >
                {PREFECTURES.map((p) => (
                  <option key={p.en} value={p.en}>{p.en}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#00004b]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>
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
              {displayed.map((loc, i) => {
                const qualityRank = qualityRankMap.get(loc.placeId) ?? i + 1;
                const tier = relativeTier(qualityRank, displayed.length);
                const score = jfmsuScore(loc.rating, loc.reviewCount, cityMean);
                return (
                  <LocationCard
                    key={loc.placeId}
                    location={loc}
                    rank={i + 1}
                    tier={tier}
                    score={score}
                  />
                );
              })}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="text-center text-xs text-gray-400 py-6 border-t border-gray-200 bg-white">
          ¥1,350 per regret · not affiliated with QB House ·{' '}
          <a
            href="https://x.com/stephendotjp"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-600 underline underline-offset-2"
          >
            @stephendotjp
          </a>
        </footer>
      </div>
    </>
  );
}
