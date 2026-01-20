"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Loader2, RefreshCw } from 'lucide-react';
import { triggerAnalysisRecompute } from '@/lib/api';
import { cn } from '@/lib/utils';

export const Shell = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [isSyncing, setIsSyncing] = useState(false);

  const onRecompute = async () => {
    setIsSyncing(true);
    try {
      await triggerAnalysisRecompute();
      setTimeout(() => {
        setIsSyncing(false);
        window.location.reload();
      }, 3000);
    } catch (error) {
      setIsSyncing(false);
    }
  };

  const navItems = [
    { name: 'Leaderboard', href: '/' },
    { name: 'Analysis', href: '/analysis' },
    { name: 'Divergence', href: '/divergence' },
    { name: 'Spice', href: '/spice' },
  ];

  return (
    <div className="min-h-screen bg-background text-text font-sans selection:bg-accent-liella/30">
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-black tracking-tighter uppercase text-white">
              LL <span className="text-accent-liella">Rankings</span>
            </h1>
            <div className="hidden md:flex gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "text-[11px] font-black uppercase tracking-widest transition-all",
                    pathname === item.href ? "text-accent-liella" : "text-muted hover:text-white"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={onRecompute} disabled={isSyncing} className="hidden sm:flex items-center gap-2 text-muted hover:text-white">
              {isSyncing ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
              <span className="text-[10px] font-bold uppercase tracking-widest">Recompute</span>
            </button>
            <Link href="/submit" className="bg-white text-background px-5 py-2 rounded-sm text-xs font-black uppercase hover:bg-accent-liella hover:text-white transition-all">
              Submit
            </Link>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};