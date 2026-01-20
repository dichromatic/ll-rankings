import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  accentColor?: string;
}

export const StatCard = ({ title, icon: Icon, children, accentColor }: StatCardProps) => (
  <div className="bg-zinc-950 border border-zinc-900 rounded-sm overflow-hidden flex flex-col h-full">
    <div className="p-4 border-b border-zinc-900 flex items-center justify-between">
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
        {title}
      </h3>
      <Icon className={cn("w-3 h-3", accentColor || "text-zinc-700")} />
    </div>
    <div className="flex-1 overflow-x-auto">
      <table className="w-full text-left border-collapse">
        {children}
      </table>
    </div>
  </div>
);

export const StatRow = ({ label, sublabel, metric, metricColor, trend }: any) => (
  <tr className="border-b border-zinc-900/50 hover:bg-zinc-900/30 transition-colors group">
    <td className="p-3 pl-4">
      <div className="text-xs font-bold text-zinc-100 group-hover:text-white transition-colors truncate max-w-[140px] md:max-w-[200px]">
        {label}
      </div>
      <div className="text-[9px] font-black uppercase text-zinc-600 tracking-tighter">
        {sublabel}
      </div>
    </td>
    <td className="p-3 text-right pr-4">
      <div className={cn("text-xs font-mono font-black tabular-nums", metricColor || "text-zinc-400")}>
        {metric}
      </div>
      {trend && (
        <div className="text-[8px] font-black uppercase text-zinc-700 leading-none mt-1">
          {trend}
        </div>
      )}
    </td>
  </tr>
);