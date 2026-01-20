import { Ranking } from "@/hooks/useRankings";
import { useFranchiseTheme, Franchise } from "@/hooks/useFranchiseTheme";
import { cn } from "@/lib/utils"; // Utility for tailwind classes

interface Props {
  song: Ranking;
  index: number;
  franchise: Franchise;
}

export const ConsensusRow = ({ song, index, franchise }: Props) => {
  const theme = useFranchiseTheme(franchise);

  return (
    <div className={cn(
      "group flex items-center gap-4 p-4 mb-2 bg-zinc-950 border-l-2 transition-all",
      "hover:bg-zinc-900",
      theme.border // Dynamic accent color
    )}>
      {/* Rank Column */}
      <div className="flex flex-col items-center justify-center w-10">
        <span className="text-2xl font-black tabular-nums text-zinc-700 group-hover:text-zinc-500">
          {index + 1}
        </span>
      </div>

      {/* Song Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-base md:text-lg font-bold text-white truncate uppercase tracking-tight">
          {song.song_name}
        </h3>
        <div className="flex gap-4 mt-1">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-zinc-500 uppercase">Avg Rank</span>
            <span className={cn("text-xs font-mono font-bold", theme.text)}>
              {song.average.toFixed(2)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-zinc-500 uppercase">Votes</span>
            <span className="text-xs font-mono font-bold text-zinc-300">
              {song.submission_count}
            </span>
          </div>
        </div>
      </div>

      {/* Points Column */}
      <div className="text-right hidden sm:block">
        <span className="block text-xl font-black tabular-nums text-white">
          {song.points.toLocaleString()}
        </span>
        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-tighter">
          Score Weight
        </span>
      </div>
    </div>
  );
};