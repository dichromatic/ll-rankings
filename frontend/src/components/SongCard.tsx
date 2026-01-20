// frontend/src/components/SongCard.tsx

interface SongProps {
  rank: number;
  name: string;
  average: number;
  points: number;
  franchise: string;
}

export const SongCard = ({ rank, name, average, points, franchise }: SongProps) => {
  return (
    <div className="flex items-center gap-4 bg-zinc-900 border-l-4 border-accent-liella p-4 hover:bg-zinc-800 transition-colors">
      <span className="text-3xl font-black text-zinc-700 w-12">{rank}</span>
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-bold text-white truncate">{name}</h3>
        <p className="text-xs text-zinc-500 uppercase tracking-widest">
          Consensus Average: {average.toFixed(2)}
        </p>
      </div>
      <div className="text-right">
        <div className="text-xl font-mono font-bold text-white">{points}</div>
        <div className="text-[10px] text-zinc-500 uppercase">Points</div>
      </div>
    </div>
  );
};