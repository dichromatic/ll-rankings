"use client";

import { useIsMounted } from "@/hooks/useIsMounted";
import { Swords } from "lucide-react";

export default function MatchPage() {
  const isMounted = useIsMounted();

  if (!isMounted) return <div className="min-h-screen bg-background" />;

  return (
    <div className="max-w-4xl mx-auto py-20 text-center space-y-6 animate-in fade-in duration-700">
      <div className="inline-flex p-6 bg-surface border border-border rounded-none mb-4">
        <Swords className="w-12 h-12 text-muted opacity-20" />
      </div>
      <h2 className="text-4xl font-black uppercase tracking-tighter text-white">
        Social <span className="text-muted font-light">Matchmaking</span>
      </h2>
      <p className="text-muted text-sm font-bold uppercase tracking-widest max-w-md mx-auto leading-relaxed">
        Relational character metadata is required to calculate oshi-bias and soulmate similarity. This module is pending database migration Pass 1.
      </p>
      <div className="pt-8">
        <div className="inline-block px-4 py-1 border border-border text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">
          Status: Awaiting Seed Logic
        </div>
      </div>
    </div>
  );
}