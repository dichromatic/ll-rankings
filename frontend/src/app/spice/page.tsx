"use client";

import { useState, useMemo, useContext, use } from "react";
import { useSpiceMeter } from "@/hooks/useAnalysisData";
import { Franchise, useFranchiseTheme } from "@/hooks/useFranchiseTheme";
import { SpiceRow } from "@/components/analysis/SpiceRow";
import { Loader2, ChevronDown, Flame } from "lucide-react";
import { FranchiseContext, SubgroupContext } from "../contexts";
import { cn } from "@/utils/boilerplate";

export default function SpicePage() {
  const franchise = useContext(FranchiseContext);
  const subgroupName = useContext(SubgroupContext);
  const { data: results, isLoading, isError } = useSpiceMeter(franchise);

  const theme = useFranchiseTheme(franchise);

  // Find the highest score to normalize the bars
  const maxScore = useMemo(() => {
    if (!results || results.length === 0) return 1;
    return Math.max(...results.map(r => r.global_spice));
  }, [results]);

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-900 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Flame className={cn("w-5 h-5", theme.text)} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
              Community Meta
            </span>
          </div>
          <h2 className="text-4xl font-black uppercase tracking-tighter">
            Spice <span className="text-zinc-600">Meter</span>
          </h2>
        </div>

        <div className="max-w-[280px] text-right hidden md:block">
          <p className="text-[10px] font-bold text-zinc-500 uppercase leading-relaxed">
            The Spice Meter measures the Root Mean Square distance between an individual user's ranks and the community mean.
          </p>
        </div>
      </div>

      {/* Main List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-6">
            <Loader2 className="w-10 h-10 animate-spin text-zinc-800" />
            <span className="text-[10px] font-black uppercase text-zinc-700 tracking-[0.2em]">
              Scanning community deviance
            </span>
          </div>
        ) : isError ? (
          <div className="bg-red-500/5 border border-red-500/20 p-12 text-center">
            <span className="text-red-500 font-black uppercase text-xs tracking-widest">
              Error retrieving spice metrics
            </span>
          </div>
        ) : results && results.length > 0 ? (
          results.map((user, index) => (
            <SpiceRow 
              key={user.username}
              rank={index + 1}
              username={user.username}
              score={user.global_spice}
              maxScore={maxScore}
              franchise={franchise}
            />
          ))
        ) : (
          <div className="border border-dashed border-zinc-900 py-24 text-center">
            <span className="text-zinc-600 font-black uppercase text-[10px] tracking-[0.2em]">
              No submissions recorded for this franchise
            </span>
          </div>
        )}
      </div>
    </div>
  );
}