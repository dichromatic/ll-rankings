import { useState } from "react";
import { useSongs } from "@/hooks/useSongs";
import { Search, Copy, Check } from "lucide-react";
import { cn } from "@/utils/boilerplate";
import { Franchise, useFranchiseTheme } from "@/hooks/useFranchiseTheme";

export const SongSidebar = ({ franchise }: { franchise: Franchise }) => {
  const [query, setQuery] = useState("");
  const { data: songs } = useSongs(franchise);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const theme = useFranchiseTheme(franchise);

  const filtered = songs?.filter(s => 
    s.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 50);

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(`${text} - Liella!`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 border border-zinc-900 rounded-sm">
      <div className="p-4 border-b border-zinc-900">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3">
          Song Reference (Click to Copy)
        </h4>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500" />
          <input 
            className={cn("w-full bg-black border border-zinc-800 py-2 pl-8 pr-4 text-xs outline-none", theme.focus)}
            placeholder="Search database..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filtered?.map(song => (
          <button
            key={song.id}
            onClick={() => copy(song.name, song.id)}
            className="w-full flex items-center justify-between p-2 text-left text-[11px] font-medium hover:bg-zinc-900 transition-colors group"
          >
            <span className="truncate pr-4">{song.name}</span>
            {copiedId === song.id ? (
              <Check className="w-3 h-3 text-green-500" />
            ) : (
              <Copy className="w-3 h-3 text-zinc-700 opacity-0 group-hover:opacity-100" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};