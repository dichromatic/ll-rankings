"use client";
import { useState } from "react";
import { useSubgroups } from "@/hooks/useSubgroups";
import { useDivergence } from "@/hooks/useAnalysisData";
import { Franchise } from "@/hooks/useFranchiseTheme";
import { DivergenceGrid } from "@/components/analysis/DivergenceGrid";
import { Loader2, ChevronDown, Users2 } from "lucide-react";

export default function DivergencePage() {
  const [franchise, setFranchise] = useState<Franchise>("liella");
  const [subgroupName, setSubgroupName] = useState("All Songs");

  const { data: subgroups } = useSubgroups(franchise);
  const { data: matrix, isLoading } = useDivergence(franchise, subgroupName);

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-900 pb-8">
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tighter italic">
            Taste <span className="text-zinc-600">Divergence</span>
          </h2>
          <div className="flex gap-4 mt-6">
             {/* Franchise Selector */}
             <div className="relative">
              <select 
                value={franchise} 
                onChange={(e) => { setFranchise(e.target.value as Franchise); setSubgroupName("All Songs"); }}
                className="appearance-none bg-zinc-900 border border-zinc-800 px-4 py-2 pr-10 text-[10px] font-black uppercase tracking-widest outline-none focus:border-pink-500"
              >
                <option value="liella">Liella!</option>
                <option value="aqours">Aqours</option>
                <option value="us">u's</option>
                <option value="nijigasaki">Nijigasaki</option>
                <option value="hasunosora">Hasunosora</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 pointer-events-none" />
            </div>
            {/* Subgroup Selector */}
            <div className="relative">
              <select 
                value={subgroupName} 
                onChange={(e) => setSubgroupName(e.target.value)}
                className="appearance-none bg-zinc-900 border border-zinc-800 px-4 py-2 pr-10 text-[10px] font-black uppercase tracking-widest outline-none focus:border-pink-500"
              >
                {subgroups?.map(sg => <option key={sg.id} value={sg.name}>{sg.name}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 pointer-events-none" />
            </div>
          </div>
        </div>
        
        <div className="hidden lg:flex items-center gap-3 bg-zinc-900/50 p-4 rounded-sm border border-zinc-900">
          <Users2 className="w-5 h-5 text-zinc-700" />
          <div className="text-left">
            <div className="text-[10px] font-black uppercase text-zinc-500">Metric</div>
            <div className="text-xs font-bold text-zinc-300">RMS Delta Dist.</div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-zinc-800" />
          <span className="text-[10px] font-black uppercase text-zinc-700 tracking-widest">Constructing Matrix</span>
        </div>
      ) : matrix ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <DivergenceGrid matrix={matrix} franchise={franchise} />
          <div className="mt-6 flex items-center gap-6 justify-center">
            <div className="flex items-center gap-2">
               <div className="w-3 h-3 bg-pink-500" />
               <span className="text-[9px] font-black uppercase text-zinc-500">High Similarity</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-3 h-3 bg-zinc-900" />
               <span className="text-[9px] font-black uppercase text-zinc-500">Low Similarity</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 text-zinc-500 text-xs font-bold uppercase tracking-widest border border-dashed border-zinc-900">
          Insufficient data for matrix computation.
        </div>
      )}
    </div>
  );
}