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
    <div className={cn(`flex items-center gap-4 bg-gradient-to-r from-zinc-900 from-60% sm:from-65% md:from-70% lg:from-75% ${rank.delta > 0 ? "to-green-600" : (rank.delta < 0 ? "to-red-600" : "to-zinc-900")} to-76% sm:to-80% md:to-84% lg:to-88% border-l-4 p-4 hover:from-zinc-800 transition-colors`, theme.border)}>
      <span className="text-3xl font-black text-zinc-700 w-12">{rank.rank}</span>
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-bold text-white truncate">{rank.song_name}</h3>
        <p className="text-xs w-3/5 text-zinc-500 uppercase tracking-widest">
          Community Average: {rank.avg}
        </p>
      </div>
      <div className="text-right">
        <div className="text-xl font-mono font-bold text-white">{Number(rank.delta).toLocaleString(undefined, {style: 'percent', minimumFractionDigits:2})}</div>
        <div className="text-[10px] text-white uppercase">Delta</div>
      </div>
    </div>
  );
};