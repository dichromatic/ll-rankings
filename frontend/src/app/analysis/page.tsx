"use client";
import { useState, useMemo, useContext } from "react";
import { useRankings, Ranking } from "@/hooks/useRankings";
import { useSubgroups } from "@/hooks/useSubgroups";
import { useControversy, useHotTakes } from "@/hooks/useAnalysisData";
import { useIsMounted } from "@/hooks/useIsMounted";
import { StatCard, StatRow } from "@/components/analysis/StatCard";
import { 
  Flame, Target, ShieldCheck, 
  ArrowUpDown, Swords, ChevronDown 
} from "lucide-react";
import { FranchiseContext, SubgroupContext } from "../contexts";

export default function AnalysisPage() {
  const isMounted = useIsMounted();
  const franchise = useContext(FranchiseContext);
  const subgroupName = useContext(SubgroupContext);

  const { data: subgroups } = useSubgroups(franchise);
  const { data: rankings } = useRankings(franchise, subgroupName);
  const { data: controversy } = useControversy(franchise, subgroupName);
  const { data: takes } = useHotTakes(franchise, subgroupName);

  // 1. Universal Favorites (Literal Top 10 by average/points)
  const favorites = useMemo(() => rankings?.slice(0, 10) || [], [rankings]);

  // 2. Top / Bottom 10 Comparison
  const extremes = useMemo(() => {
    if (!rankings) return [];
    const top5 = rankings.slice(0, 5).map(s => ({ ...s, type: 'TOP' }));
    const btm5 = rankings.slice(-5).map(s => ({ ...s, type: 'BTM' }));
    return [...top5, ...btm5];
  }, [rankings]);

  // 3. Most Disputed (User A vs User B delta)
  const disputed = useMemo(() => {
    if (!takes) return [];
    const grouped: Record<string, { 
      song: string, 
      min: number, max: number, 
      minUser: string, maxUser: string 
    }> = {};

    takes.forEach(t => {
      if (!grouped[t.song_name]) {
        grouped[t.song_name] = { 
          song: t.song_name, 
          min: t.user_rank, max: t.user_rank, 
          minUser: t.username, maxUser: t.username 
        };
      } else {
        if (t.user_rank < grouped[t.song_name].min) {
          grouped[t.song_name].min = t.user_rank;
          grouped[t.song_name].minUser = t.username;
        }
        if (t.user_rank > grouped[t.song_name].max) {
          grouped[t.song_name].max = t.user_rank;
          grouped[t.song_name].maxUser = t.username;
        }
      }
    });

    return Object.values(grouped)
      .map(g => ({ ...g, diff: g.max - g.min }))
      .sort((a, b) => b.diff - a.diff)
      .slice(0, 10);
  }, [takes]);

  if (!isMounted) return <div className="min-h-screen bg-background" />;

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
        <h2 className="text-4xl font-black uppercase tracking-tighter text-white">
          Statistical <span className="text-muted font-light">Outliers</span>
        </h2>
      </div>

      {/* Grid of working Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Universal Favourites */}
        <StatCard title="Universal Favourites" icon={ShieldCheck} accentColor="text-green-500">
          <tbody>
            {favorites.map((s, i) => (
              <StatRow 
                key={s.song_id}
                label={s.song_name}
                sublabel={`Global Rank #${i + 1}`}
                metric={s.average.toFixed(2)}
                metricColor="text-white"
                trend="Average"
              />
            ))}
          </tbody>
        </StatCard>

        {/* Card 2: Most Controversial */}
        <StatCard title="Most Controversial" icon={Flame} accentColor="text-red-500">
          <tbody>
            {controversy?.slice(0, 10).map(s => (
              <StatRow 
                key={s.song_id}
                label={s.song_name}
                sublabel={`CV: ${s.cv.toFixed(4)}`}
                metric={s.controversy_score.toFixed(2)}
                metricColor="text-red-400"
                trend="Score"
              />
            ))}
          </tbody>
        </StatCard>

        {/* Card 3: Top / Bottom Mix */}
        <StatCard title="Polar Extremes" icon={ArrowUpDown} accentColor="text-pink-500">
          <tbody>
            {extremes.map((s, i) => (
              <StatRow 
                key={i}
                label={s.song_name}
                sublabel={s.type === 'TOP' ? 'Elite Tier' : 'Bottom Tier'}
                metric={s.average.toFixed(1)}
                metricColor={s.type === 'TOP' ? "text-green-400" : "text-red-400"}
                trend={s.type}
              />
            ))}
          </tbody>
        </StatCard>

        {/* Card 4: Most Disputed (User vs User) */}
        <StatCard title="Most Disputed" icon={Swords} accentColor="text-amber-500">
          <tbody>
            {disputed.map((d, i) => (
              <StatRow 
                key={i}
                label={d.song}
                sublabel={`${d.minUser} vs ${d.maxUser}`}
                metric={`Δ ${d.diff.toFixed(0)}`}
                metricColor="text-amber-400"
                trend="User Range"
              />
            ))}
          </tbody>
        </StatCard>

      </div>
    </div>
  );
}