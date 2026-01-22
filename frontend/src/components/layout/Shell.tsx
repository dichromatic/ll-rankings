"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2, RefreshCw, Plus, ChevronDown } from 'lucide-react';
import { triggerAnalysisRecompute } from '@/utils/api';
import { cn } from '@/utils/boilerplate';
import { Franchise, useFranchiseTheme } from '@/hooks/useFranchiseTheme';
import { FranchiseProvider, SubgroupProvider } from '@/app/contexts';
import { useSubgroups } from '@/hooks/useSubgroups';

export const Shell = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isSyncing, setIsSyncing] = useState(false);
  const [franchise, setFranchise] = useState<Franchise>('liella');
  const [subgroupName, setSubgroupName] = useState<string>('All Songs');

  const { data: subgroups } = useSubgroups(franchise);
  const theme = useFranchiseTheme(franchise);

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
    <FranchiseProvider value={franchise}>
      <SubgroupProvider value={subgroupName}>
        <div className={`min-h-screen bg-background text-text font-sans ${pathname !== "/submit" ? theme.selection : ""}`}>
          {/* HEADER SECTION */}
          <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
            {/* Top Tier: Brand and Actions */}
            <div className="max-w-7xl mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
              <div className="flex items-center gap-4 md:gap-6">
                <Link href="/" className="flex items-center gap-2">
                  <h1 className="text-lg md:text-xl font-black uppercase tracking-tighter text-white">
                    LL <span className={pathname !== "/submit" ? theme.text : "text-muted"}>Rankings</span>
                  </h1>
                </Link>
                {/* Franchise & Subgroup Selectors */
                pathname !== "/submit" && <>
                  <div className="relative">
                    <select 
                      value={franchise}
                      onChange={(e) => { setFranchise(e.target.value as Franchise); setSubgroupName("All Songs"); }}
                      className={cn("appearance-none bg-surface border border-border px-4 py-2 pr-10 text-[10px] font-black uppercase tracking-widest text-white outline-none", theme.focus)}
                    >
                      <option value="liella">Liella!</option>
                      <option value="aqours">Aqours</option>
                      <option value="us">u's</option>
                      <option value="nijigasaki">Nijigasaki</option>
                      <option value="hasunosora">Hasunosora</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted pointer-events-none" />
                  </div>

                  {pathname !== "/spice" && <div className="relative">
                    <select 
                      value={subgroupName}
                      onChange={(e) => setSubgroupName(e.target.value)}
                      className={cn("appearance-none bg-surface border border-border px-4 py-2 pr-10 text-[10px] font-black uppercase tracking-widest text-white outline-none", theme.focus)}
                    >
                      {subgroups?.map(sg => <option key={sg.id} value={sg.name}>{sg.name}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted pointer-events-none" />
                  </div>}
                </>}
              </div>

              <div className="flex items-center gap-3 md:gap-6">
                <button 
                  onClick={onRecompute} 
                  disabled={isSyncing} 
                  className="flex items-center gap-2 text-muted hover:text-white transition-colors"
                  title="Trigger Recompute"
                >
                  {isSyncing ? <Loader2 className={cn("w-4 h-4 animate-spin", theme.text)} /> : <RefreshCw className="w-4 h-4" />}
                  <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-widest">
                    Recompute
                  </span>
                </button>
                
                <button 
                  onClick={() => router.push('/submit')}
                  className={cn("bg-white text-background px-3 md:px-5 py-1.5 md:py-2 rounded-sm text-[10px] md:text-xs font-black uppercase hover:text-white transition-all flex items-center justify-start gap-2", theme.hover)}
                >
                  <Plus className="hidden sm:inline w-3 h-3" />
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
                        ? cn(theme.text, theme.border)
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
      </SubgroupProvider>
    </FranchiseProvider>
  );
};