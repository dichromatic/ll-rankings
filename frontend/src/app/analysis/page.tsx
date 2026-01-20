"use client";
import { useState, useMemo } from "react";
import { useRankings } from "@/hooks/useRankings";
import { useSubgroups } from "@/hooks/useSubgroups";
import { useControversy, useHotTakes, useSpiceMeter } from "@/hooks/useAnalysisData";
import { useFranchiseTheme, Franchise } from "@/hooks/useFranchiseTheme";
import { StatCard, StatRow } from "@/components/analysis/StatCard";
import { 
  Flame, TrendingDown, Target, ShieldCheck, 
  Zap, Compass, UserMinus, ChevronDown 
} from "lucide-react";

export default function AnalysisPage() {
  const [franchise, setFranchise] = useState<Franchise>("liella");
  const [subgroupName, setSubgroupName] = useState("All Songs");
  const theme = useFranchiseTheme(franchise);

  const { data: subgroups } = useSubgroups(franchise);
  const { data: rankings } = useRankings(franchise, subgroupName);
  const { data: controversy } = useControversy(franchise, subgroupName);
  const { data: takes } = useHotTakes(franchise, subgroupName);
  const { data: spice } = useSpiceMeter(franchise);

  // Logic: Universal Favorites (Top 10 sorted by CV Agreement)
  const universalTop = useMemo(() => {
    if (!rankings || !controversy) return [];
    return rankings.slice(0, 10).map(r => {
      const c = controversy.find(x => x.song_name === r.song_name);
      const agreement = c ? Math.max(0, 100 - (c.cv * 100)) : 0;
      return { ...r, agreement };
    });
  }, [rankings, controversy]);

  // Logic: Sleepers (Songs with high Glaze score but lower average rank)
  const sleepers = useMemo(() => {
    if (!takes) return [];
    return takes.filter(t => t.score < -15).slice(0, 10);
  }, [takes]);

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Selector Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-900 pb-8">
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tighter italic">Statistical <span className="text-zinc-600">Profiles</span></h2>
          <div className="flex gap-4 mt-6">
            <div className="relative">
              <select 
                value={franchise} 
                onChange={(e) => { setFranchise(e.target.value as Franchise); setSubgroupName("All Songs"); }}
                className="appearance-none bg-zinc-900 border border-zinc-800 px-4 py-2 pr-10 text-[10px] font-black uppercase tracking-widest outline-none focus:border-pink-500"
              >
                <option value="liella">Liella!</option>
                <option value="aqours">Aqours</option>
                <option value="us">u's</option>
                <option value="nijigasaki">Nijigasaki</option>
                <option value="hasunosora">Hasunosora</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 pointer-events-none" />
            </div>
            <div className="relative">
              <select 
                value={subgroupName} 
                onChange={(e) => setSubgroupName(e.target.value)}
                className="appearance-none bg-zinc-900 border border-zinc-800 px-4 py-2 pr-10 text-[10px] font-black uppercase tracking-widest outline-none focus:border-pink-500"
              >
                {subgroups?.map(sg => <option key={sg.id} value={sg.name}>{sg.name}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Universally Loved */}
        <StatCard title="Universal Favorites" icon={ShieldCheck} accentColor="text-green-500">
          <tbody>
            {universalTop.map(s => (
              <StatRow 
                key={s.song_id}
                label={s.song_name}
                sublabel={`Avg Rank #${s.average}`}
                metric={`${s.agreement.toFixed(1)}%`}
                metricColor="text-green-400"
                trend="Agreement"
              />
            ))}
          </tbody>
        </StatCard>

        {/* Most Disputed */}
        <StatCard title="Controversial" icon={Flame} accentColor="text-red-500">
          <tbody>
            {controversy?.slice(0, 10).map(s => (
              <StatRow 
                key={s.song_id}
                label={s.song_name}
                sublabel={`CV: ${s.cv.toFixed(4)}`}
                metric={s.controversy_score.toFixed(2)}
                metricColor="text-red-400"
                trend="Polarization"
              />
            ))}
          </tbody>
        </StatCard>

        {/* Sleepers */}
        <StatCard title="Biggest Sleepers" icon={Compass} accentColor="text-blue-500">
          <tbody>
            {sleepers.map((t, i) => (
              <StatRow 
                key={i}
                label={t.song_name}
                sublabel={t.username}
                metric={`+${Math.abs(t.delta).toFixed(1)}`}
                metricColor="text-blue-400"
                trend="Point Gap"
              />
            ))}
          </tbody>
        </StatCard>

        {/* Spice Leaders */}
        <StatCard title="Community Outliers" icon={Zap} accentColor="text-amber-500">
          <tbody>
            {spice?.slice(0, 10).map((u, i) => (
              <StatRow 
                key={i}
                label={u.username}
                sublabel="Global Deviance"
                metric={u.global_spice.toFixed(2)}
                metricColor="text-amber-400"
                trend="Spice Score"
              />
            ))}
          </tbody>
        </StatCard>

      </div>
    </div>
  );
}