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

  const maxDivergence = useMemo(() => {
    let max = 0;
    Object.values(matrix).forEach(row => {
      Object.values(row).forEach(val => { if (val > max) max = val; });
    });
    return max || 1;
  }, [matrix]);

  return (
    <div className="relative overflow-auto border border-border rounded-sm bg-surface max-h-[70vh]">
      <table className="border-separate border-spacing-0">
        <thead>
          <tr>
            <th className="sticky top-0 left-0 z-30 bg-surface border-b border-r border-border p-4 meta-label text-muted min-w-[140px]">
              Similarity
            </th>
            {users.map(user => (
              <th key={user} className="sticky top-0 z-20 bg-surface border-b border-border p-4 meta-label text-muted whitespace-nowrap min-w-[80px]">
                {user}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map(u1 => (
            <tr key={u1}>
              <th className="sticky left-0 z-20 bg-surface border-r border-border p-4 text-[11px] font-bold text-left text-text whitespace-nowrap">
                {u1}
              </th>
              {users.map(u2 => {
                const value = matrix[u1][u2];
                const opacity = u1 === u2 ? 1 : Math.max(0.05, 1 - (value / maxDivergence));
                return (
                  <td key={u2}
                    style={{ backgroundColor: u1 === u2 ? 'transparent' : `rgba(248, 82, 173, ${Math.pow(opacity, 2)})` }}
                    className="p-4 text-center text-[10px] font-mono font-black border-b border-r border-border/30 text-white"
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