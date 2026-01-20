"use client";
import { useState } from "react";
import { useRankings, Ranking } from "@/hooks/useRankings";
import { useSubgroups } from "@/hooks/useSubgroups";
import { ConsensusRow } from "@/components/ranking/ConsensusRow";
import { Franchise } from "@/hooks/useFranchiseTheme";
import { useIsMounted } from "@/hooks/useIsMounted";
import { Loader2, ChevronDown } from "lucide-react";

export default function ConsensusPage() {
  const isMounted = useIsMounted();
  const [franchise, setFranchise] = useState<Franchise>("liella");
  const [subgroupName, setSubgroupName] = useState("All Songs");

  const { data: subgroups } = useSubgroups(franchise);
  const { data: rankings, isLoading } = useRankings(franchise, subgroupName);

  // Prevent hydration error by rendering a placeholder until mounted
  if (!isMounted) return <div className="min-h-screen bg-background" />;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-border pb-8">
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tighter text-white">
            Consensus <span className="text-muted font-light">Feed</span>
          </h2>
          <div className="flex gap-4 mt-6">
            <div className="relative group">
              <select 
                value={franchise} 
                onChange={(e) => { setFranchise(e.target.value as Franchise); setSubgroupName("All Songs"); }}
                className="appearance-none bg-surface border border-border px-4 py-2 pr-10 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-accent-liella"
              >
                <option value="liella">Liella!</option>
                <option value="aqours">Aqours</option>
                <option value="us">u's</option>
                <option value="nijigasaki">Nijigasaki</option>
                <option value="hasunosora">Hasunosora</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted pointer-events-none" />
            </div>

            <div className="relative">
              <select 
                value={subgroupName} 
                onChange={(e) => setSubgroupName(e.target.value)}
                className="appearance-none bg-surface border border-border px-4 py-2 pr-10 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-accent-liella"
              >
                {subgroups?.map(sg => <option key={sg.id} value={sg.name}>{sg.name}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-accent-liella" />
            <span className="text-[10px] font-black uppercase text-muted tracking-widest">Refreshing community consensus</span>
          </div>
        ) : (
          rankings?.map((song: Ranking, index: number) => (
            <ConsensusRow key={song.song_id} song={song} index={index} franchise={franchise} />
          ))
        )}
      </div>
    </div>
  );
}