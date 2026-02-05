// frontend/src/components/IndividualRankRow.tsx

import { FranchiseContext } from "@/app/contexts";
import { IndividualRank } from "@/hooks/useAnalysisData";
import { useFranchiseTheme } from "@/hooks/useFranchiseTheme";
import { cn } from "@/utils/boilerplate";
import { useContext } from "react";

interface IndividualRankProps {
  rank: IndividualRank
}

export const IndividualRankRow = ({ rank }: IndividualRankProps) => {
  const franchise = useContext(FranchiseContext);
  const theme = useFranchiseTheme(franchise);

  return (
    <div className={cn("flex items-center gap-4 bg-zinc-900 border-l-4 p-4 hover:bg-zinc-800 transition-colors", theme.border)}>
      <span className="text-3xl font-black text-zinc-700 w-12">{rank.rank}</span>
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-bold text-white truncate">{rank.song_name}</h3>
        <p className="text-xs text-zinc-500 uppercase tracking-widest">
          Community Average: {rank.avg}
        </p>
      </div>
      <div className="text-right">
        <div className="text-xl font-mono font-bold text-white">{Number(rank.delta).toLocaleString(undefined, {style: 'percent', minimumFractionDigits:2})}</div>
        <div className="text-[10px] text-zinc-500 uppercase">Delta</div>
      </div>
    </div>
  );
};