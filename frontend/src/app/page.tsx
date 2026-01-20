"use client";

import { useState } from "react";
import { Ranking, useRankings } from "@/hooks/useRankings";
import { ConsensusRow } from "@/components/ranking/ConsensusRow";
import { Franchise } from "@/hooks/useFranchiseTheme";
import { Loader2, Filter } from "lucide-react"; // Icons

export default function ConsensusPage() {
  const [franchise, setFranchise] = useState<Franchise>("liella");
  const [subgroup, setSubgroup] = useState("All Songs");

  const { data: rankings, isLoading, isError } = useRankings(franchise, subgroup);

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-zinc-900 pb-8">
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tighter italic">
            Consensus <span className="text-zinc-600">Feed</span>
          </h2>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-2">
            Community rankings based on {rankings?.length || 0} tracks
          </p>
        </div>

        {/* Filter Pill (Sorter Style) */}
        <div className="flex items-center gap-2 bg-zinc-900 p-1 rounded-sm">
          <button className="px-4 py-2 text-[10px] font-black uppercase bg-zinc-800 text-white border border-zinc-700">
            {franchise}
          </button>
          <button className="px-4 py-2 text-[10px] font-black uppercase text-zinc-500 hover:text-white">
            {subgroup}
          </button>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-1">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            {/* ... loading content ... */}
          </div>
        ) : isError ? (
          <div className="text-red-500 font-bold p-10 text-center">Error.</div>
        ) : (
          // Explicitly type the map parameters
          rankings?.map((song: Ranking, index: number) => (
            <ConsensusRow 
              key={song.song_id} 
              song={song} 
              index={index} 
              franchise={franchise} 
            />
          ))
        )}
      </div>
    </div>
  );
}