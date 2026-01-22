import React from "react";
import { cn } from "@/utils/boilerplate";
import { Franchise, useFranchiseTheme } from "@/hooks/useFranchiseTheme";

interface SpiceRowProps {
  username: string; score: number; rank: number; maxScore: number; franchise: Franchise;
}

export const SpiceRow = ({ username, score, rank, maxScore, franchise }: SpiceRowProps) => {
  const theme = useFranchiseTheme(franchise);
  const widthPercent = (score / maxScore) * 100;

  return (
    <div className="flex items-center gap-6 p-6 mb-3 bg-surface border border-border group hover:border-muted transition-all rounded-sm">
      <div className="flex flex-col items-center justify-center w-12 shrink-0">
        <span className="text-3xl font-black text-muted group-hover:text-text transition-colors tabular-nums">
          #{rank}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-end justify-between mb-3">
          <h3 className="text-xl font-black uppercase tracking-tight text-white truncate">
            {username}
          </h3>
          <div className="text-right">
            <span className={cn("text-2xl font-mono font-black tabular-nums", theme.text)}>
              {score.toFixed(2)}
            </span>
            <span className="block text-[8px] font-black uppercase text-muted tracking-widest mt-1">
              Spice Score
            </span>
          </div>
        </div>

        {/* Updated Bar Colors */}
        <div className="h-2 w-full bg-background rounded-none overflow-hidden">
          <div 
            className={cn("h-full transition-all duration-1000 ease-out", theme.bg)}
            style={{ width: `${widthPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};