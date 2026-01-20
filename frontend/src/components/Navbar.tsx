// frontend/src/components/Navbar.tsx

import Link from "next/link";

export const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-zinc-800 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-black uppercase tracking-tighter">
            LL <span className="text-accent-liella">Rankings</span>
          </h1>
          <div className="hidden md:flex gap-6">
            <Link href="/" className="nav-link active">Leaderboard</Link>
            <Link href="/analysis" className="nav-link">Analysis</Link>
            <Link href="/social" className="nav-link">Social</Link>
          </div>
        </div>
        <button className="bg-white text-black px-6 py-2 text-sm font-bold uppercase hover:bg-accent-liella hover:text-white transition-all">
          Submit
        </button>
      </div>
    </nav>
  );
};