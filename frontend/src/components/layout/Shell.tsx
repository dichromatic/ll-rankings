// frontend/src/components/layout/Shell.tsx
import React from 'react';

export const Shell = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-zinc-100 font-sans selection:bg-pink-500/30">
      <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-lg font-black tracking-tighter uppercase">
              LL <span className="text-pink-500">Rankings</span>
            </h1>
          </div>
          <div className="flex gap-4">
             <button className="bg-zinc-100 text-black px-4 py-1.5 rounded-sm text-xs font-bold uppercase hover:bg-pink-500 hover:text-white transition-all">
              Submit
            </button>
          </div>
        </div>
      </nav>
      <main className="max-w-5xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};