import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Franchise, useFranchiseTheme } from "@/hooks/useFranchiseTheme";

interface Props {
  matrix: Record<string, Record<string, number>>;
  franchise: Franchise;
}

export const DivergenceGrid = ({ matrix, franchise }: Props) => {
  const theme = useFranchiseTheme(franchise);
  const users = useMemo(() => Object.keys(matrix).sort(), [matrix]);

  // Find max value to normalize the heatmap opacity
  const maxDivergence = useMemo(() => {
    let max = 0;
    Object.values(matrix).forEach(row => {
      Object.values(row).forEach(val => {
        if (val > max) max = val;
      });
    });
    return max || 1;
  }, [matrix]);

  return (
    <div className="relative overflow-auto border border-zinc-900 rounded-sm bg-zinc-950 max-h-[70vh]">
      <table className="border-separate border-spacing-0">
        <thead>
          <tr>
            {/* Top-Left Corner (Sticky) */}
            <th className="sticky top-0 left-0 z-30 bg-zinc-950 border-b border-r border-zinc-900 p-4 text-[9px] font-black uppercase text-zinc-600 min-w-[140px]">
              User Similarity
            </th>
            {/* Horizontal Header (Sticky) */}
            {users.map(user => (
              <th key={user} className="sticky top-0 z-20 bg-zinc-950 border-b border-zinc-900 p-4 text-[9px] font-black uppercase text-zinc-500 whitespace-nowrap min-w-[80px]">
                {user}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map(u1 => (
            <tr key={u1}>
              {/* Vertical Header (Sticky) */}
              <th className="sticky left-0 z-20 bg-zinc-950 border-r border-zinc-900 p-4 text-[10px] font-bold text-left text-zinc-400 whitespace-nowrap">
                {u1}
              </th>
              {/* Data Cells */}
              {users.map(u2 => {
                const value = matrix[u1][u2];
                // Similarity calculation: Lower value = Higher similarity = More Opaque
                // Higher values (divergent) approach 0 opacity
                const opacity = u1 === u2 ? 1 : Math.max(0.05, 1 - (value / maxDivergence));
                
                return (
                  <td 
                    key={u2}
                    style={{ 
                      backgroundColor: u1 === u2 ? 'transparent' : `rgba(248, 82, 173, ${Math.pow(opacity, 2)})`,
                      // We use the theme accent logic later for multi-franchise
                    }}
                    className={cn(
                      "p-4 text-center text-[10px] font-mono font-black border-b border-r border-zinc-900/30",
                      u1 === u2 ? "text-zinc-800" : opacity > 0.6 ? "text-black" : "text-zinc-400"
                    )}
                  >
                    {value.toFixed(1)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};