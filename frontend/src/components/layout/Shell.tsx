"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Loader2, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { cn } from '@/lib/utils';

export const Shell = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [isSyncing, setIsSyncing] = useState(false);

  const triggerRecompute = async () => {
    setIsSyncing(true);
    try {
      await axios.post("http://localhost:8000/api/v1/analysis/trigger");
      setTimeout(() => {
        setIsSyncing(false);
        window.location.reload(); // Refresh data across all components
      }, 3000);
    } catch (e) {
      setIsSyncing(false);
    }
  };

  const navItems = [
    { name: 'Consensus', href: '/' },
    { name: 'Analysis', href: '/analysis' },
    { name: 'Divergence', href: '/divergence' },
    { name: 'Spice', href: '/spice' },
  ];

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-pink-500/30">
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-lg font-black tracking-tighter uppercase italic">
              LL <span className="text-pink-500">Rankings</span>
            </h1>
            <div className="hidden md:flex gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "text-[10px] font-black uppercase tracking-widest transition-colors",
                    pathname === item.href ? "text-pink-500" : "text-zinc-500 hover:text-white"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={triggerRecompute}
              disabled={isSyncing}
              className="hidden sm:flex items-center gap-2 text-zinc-500 hover:text-white transition-colors"
            >
              {isSyncing ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
              <span className="text-[10px] font-black uppercase tracking-widest">Recompute</span>
            </button>
            <Link href="/submit" className="bg-white text-black px-4 py-1.5 rounded-sm text-xs font-bold uppercase hover:bg-pink-500 hover:text-white transition-all">
              Submit
            </Link>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-8 pb-24">
        {children}
      </main>
    </div>
  );
};