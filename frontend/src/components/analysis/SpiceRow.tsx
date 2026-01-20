import React from "react";
import { cn } from "@/lib/utils";
import { Franchise, useFranchiseTheme } from "@/hooks/useFranchiseTheme";

interface SpiceRowProps {
  username: string;
  score: number;
  rank: number;
  maxScore: number;
  franchise: Franchise;
}

export const SpiceRow = ({ username, score, rank, maxScore, franchise }: SpiceRowProps) => {
  const theme = useFranchiseTheme(franchise);
  // Calculate width percentage relative to the highest spice score in the list
  const widthPercent = (score / maxScore) * 100;

  return (
    <div className="flex items-center gap-6 p-6 mb-3 bg-zinc-950 border border-zinc-900 group hover:border-zinc-700 transition-all rounded-sm">
      {/* Rank Indicator */}
      <div className="flex flex-col items-center justify-center w-12 shrink-0">
        <span className="text-3xl font-black italic text-zinc-800 group-hover:text-zinc-600 transition-colors">
          #{rank}
        </span>
      </div>

      {/* User Info & Visual Meter */}
      <div className="flex-1 min-w-0">
        <div className="flex items-end justify-between mb-3">
          <h3 className="text-xl font-black uppercase tracking-tight text-white truncate">
            {username}
          </h3>
          <div className="text-right">
            <span className={cn("text-2xl font-mono font-black tabular-nums", theme.text)}>
              {score.toFixed(2)}
            </span>
            <span className="block text-[8px] font-black uppercase text-zinc-600 tracking-widest mt-1">
              Deviance Index
            </span>
          </div>
        </div>

        {/* The "Spice" Bar */}
        <div className="h-1.5 w-full bg-zinc-900 rounded-none overflow-hidden">
          <div 
            className={cn("h-full transition-all duration-1000 ease-out", theme.bg)}
            style={{ width: `${widthPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};