import { Ranking } from "@/hooks/useRankings";
import { useFranchiseTheme, Franchise } from "@/hooks/useFranchiseTheme";
import { cn } from "@/lib/utils";

interface Props {
  song: Ranking;
  index: number;
  franchise: Franchise;
}

export const ConsensusRow = ({ song, index, franchise }: Props) => {
  const theme = useFranchiseTheme(franchise);

  return (
    <div className={cn(
      "group flex items-center gap-4 p-4 mb-2 bg-surface border border-border border-l-4 transition-all hover:bg-surface-hover",
      theme.border
    )}>
      {/* Rank Indicator */}
      <div className="flex flex-col items-center justify-center w-10">
        <span className="text-2xl font-black tabular-nums text-muted group-hover:text-text transition-colors">
          {index + 1}
        </span>
      </div>

      {/* Song Info (Natural Casing) */}
      <div className="flex-1 min-w-0">
        <h3 className="text-base md:text-lg font-bold text-white truncate tracking-tight">
          {song.song_name}
        </h3>
        <div className="flex gap-4 mt-1">
          <div className="flex flex-col">
            <span className="meta-label">Avg Rank</span>
            <span className={cn("text-xs font-mono font-black", theme.text)}>
              {song.average.toFixed(2)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="meta-label">Votes</span>
            <span className="text-xs font-mono font-black text-text">
              {song.submission_count}
            </span>
          </div>
        </div>
      </div>

      {/* Score Column */}
      <div className="text-right hidden sm:block">
        <span className="block text-xl font-black tabular-nums text-white">
          {song.points.toLocaleString()}
        </span>
        <span className="meta-label tracking-tighter">
          Weight Score
        </span>
      </div>
    </div>
  );
};