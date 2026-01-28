"use client";
import { useContext, useState } from "react";
import { useRankings, Ranking } from "@/hooks/useRankings";
import { useSubgroups } from "@/hooks/useSubgroups";
import { ConsensusRow } from "@/components/ranking/ConsensusRow";
import { useIsMounted } from "@/hooks/useIsMounted";
import { Loader2, ChevronDown } from "lucide-react";
import { FranchiseContext, SubgroupContext } from "./contexts";
import { useFranchiseTheme } from "@/hooks/useFranchiseTheme";
import { cn } from "@/utils/boilerplate";

export default function ConsensusPage() {
  const isMounted = useIsMounted();
  const franchise = useContext(FranchiseContext);
  const subgroupName = useContext(SubgroupContext);
  const theme = useFranchiseTheme(franchise);

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
        </div>
      </div>

      <div className="space-y-1">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className={cn("w-8 h-8 animate-spin", theme.text)} />
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