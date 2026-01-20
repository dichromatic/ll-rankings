"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import { SongSidebar } from "@/components/submission/SongSidebar";
import { Franchise } from "@/hooks/useFranchiseTheme";
import { AlertCircle, CheckCircle2, Send, ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Conflict {
  reason: string;
  line_num: number;
  raw_text: string;
}

export default function SubmitPage() {
  const [username, setUsername] = useState("");
  const [rankings, setRankings] = useState("");
  const [franchise, setFranchise] = useState<Franchise>("liella");
  const [strategy, setStrategy] = useState("retry");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "incomplete" | "success">("idle");
  const [message, setMessage] = useState("");

  const onPost = async () => {
    if (!username || !rankings) return;
    setStatus("loading");
    try {
      const { data } = await api.post("/submit", {
        username,
        franchise,
        subgroup_name: "All Songs",
        ranking_list: rankings,
        missing_song_handling: strategy
      });

      if (data.status === "VALID") {
        setStatus("success");
        setMessage("Submission verified and saved.");
      } else if (data.status === "INCOMPLETE") {
        setStatus("incomplete");
        setRankings(data.missing_songs.map((s: string) => `1. ${s} - Liella!`).join("\n"));
      }
    } catch (e: any) {
      setStatus("error");
      const conflicts = e.response?.data?.conflicts as Record<string, Conflict> | undefined;
      setMessage(conflicts ? `Error at Line ${Object.values(conflicts)[0].line_num}` : "Submission failed.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
      <div className="flex-1 space-y-8">
        <header>
          <h2 className="text-4xl font-black italic uppercase italic">
            Rank <span className="text-zinc-600">Ingestion</span>
          </h2>
        </header>

        <div className="flex flex-wrap gap-4">
          <input 
            className="flex-1 min-w-[240px] bg-zinc-900 border border-zinc-800 p-4 text-sm font-bold outline-none focus:border-pink-500 transition-colors"
            placeholder="Username (Public)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <div className="relative min-w-[180px]">
            <select 
              value={franchise}
              onChange={(e) => setFranchise(e.target.value as Franchise)}
              className="w-full appearance-none bg-zinc-900 border border-zinc-800 p-4 text-[10px] font-black uppercase tracking-widest outline-none"
            >
              <option value="liella">Liella!</option>
              <option value="aqours">Aqours!</option>
              <option value="us">u's</option>
              <option value="nijigasaki">Nijigasaki</option>
              <option value="hasunosora">Hasunosora</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
          </div>
        </div>

        <div className="relative group">
          <textarea 
            className="w-full h-[450px] bg-zinc-950 border border-zinc-900 p-6 font-mono text-xs focus:border-pink-500 outline-none resize-none transition-all"
            placeholder="1. Song Name - Artist..."
            value={rankings}
            onChange={(e) => setRankings(e.target.value)}
          />
          <AnimatePresence>
            {status === 'incomplete' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute bottom-4 left-4 right-4 bg-amber-500 p-3 text-black text-[10px] font-black uppercase">
                Missing songs detected. Please rank the items below.
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button 
          onClick={onPost}
          disabled={status === "loading"}
          className="w-full bg-pink-500 py-5 text-black font-black uppercase tracking-tighter hover:bg-white disabled:opacity-50 transition-all flex items-center justify-center gap-4"
        >
          {status === "loading" ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
          Finalize Rankings
        </button>

        {message && (
          <div className={cn(
            "p-4 border text-[10px] font-black uppercase tracking-widest flex items-center gap-4",
            status === "success" ? "bg-green-500/10 border-green-500/50 text-green-500" : "bg-red-500/10 border-red-500/50 text-red-500"
          )}>
            {status === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {message}
          </div>
        )}
      </div>

      <aside className="w-full lg:w-96">
        <SongSidebar franchise={franchise} />
      </aside>
    </div>
  );
}