"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2, RefreshCw, Plus } from 'lucide-react';
import { triggerAnalysisRecompute } from '@/lib/api';
import { cn } from '@/lib/utils';

export const Shell = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
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
      {/* HEADER SECTION */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        {/* Top Tier: Brand and Actions */}
        <div className="max-w-7xl mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <h1 className="text-lg md:text-xl font-black uppercase tracking-tighter text-white">
              LL <span className="text-accent-liella">Rankings</span>
            </h1>
          </Link>

          <div className="flex items-center gap-3 md:gap-6">
            <button 
              onClick={onRecompute} 
              disabled={isSyncing} 
              className="flex items-center gap-2 text-muted hover:text-white transition-colors"
              title="Trigger Recompute"
            >
              {isSyncing ? <Loader2 className="w-4 h-4 animate-spin text-accent-liella" /> : <RefreshCw className="w-4 h-4" />}
              <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-widest">
                Recompute
              </span>
            </button>
            
            <button 
              onClick={() => router.push('/submit')}
              className="bg-white text-background px-3 md:px-5 py-1.5 md:py-2 rounded-sm text-[10px] md:text-xs font-black uppercase hover:bg-accent-liella hover:text-white transition-all flex items-center gap-2"
            >
              <Plus className="w-3 h-3 md:hidden" />
              <span>Submit</span>
            </button>
          </div>
        </div>

        {/* Bottom Tier: Scrollable Tabs */}
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar border-t border-border/50 md:border-t-0">
          <div className="flex items-center md:justify-start gap-6 h-10 md:h-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-b-2 py-2 md:py-0",
                  pathname === item.href 
                    ? "text-accent-liella border-accent-liella" 
                    : "text-muted border-transparent hover:text-white"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {children}
      </main>

      {/* MOBILE SCROLLBAR UTILITY (Inline to ensure availability) */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};