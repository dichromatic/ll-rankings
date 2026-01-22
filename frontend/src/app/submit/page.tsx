"use client";
import { useState } from "react";
import { api } from "@/utils/api";
import { SongSidebar } from "@/components/submission/SongSidebar";
import { Franchise, useFranchiseTheme } from "@/hooks/useFranchiseTheme";
import { useIsMounted } from "@/hooks/useIsMounted";
import { AlertCircle, CheckCircle2, Send, ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@/utils/boilerplate";
import { motion, AnimatePresence } from "framer-motion";

interface Conflict {
  reason: string; line_num: number; raw_text: string;
}

export default function SubmitPage() {
  const isMounted = useIsMounted();
  const [username, setUsername] = useState("");
  const [rankings, setRankings] = useState("");
  const [franchise, setFranchise] = useState<Franchise>("liella");
  const [strategy, setStrategy] = useState("retry");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "incomplete" | "success">("idle");
  const [message, setMessage] = useState("");

  const theme = useFranchiseTheme(franchise);

  const onPost = async () => {
    if (!username || !rankings) return;
    setStatus("loading");
    try {
      const { data } = await api.post("/submit", {
        username, franchise, subgroup_name: "All Songs", ranking_list: rankings, missing_song_handling: strategy
      });
      if (data.status === "VALID") {
        setStatus("success"); setMessage("Rankings verified and stored."); setRankings("");
      } else if (data.status === "INCOMPLETE") {
        setStatus("incomplete"); setRankings(data.missing_songs.map((s: string) => `1. ${s} - ${franchise}`).join("\n"));
      }
    } catch (e: any) {
      setStatus("error");
      const conflicts = e.response?.data?.conflicts as Record<string, Conflict> | undefined;
      setMessage(conflicts ? `Error at Line ${Object.values(conflicts)[0].line_num}` : "API Connectivity failure.");
    }
  };

  if (!isMounted) return <div className="min-h-screen bg-background" />;

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
      <div className="flex-1 space-y-8">
        <h2 className="text-4xl font-black uppercase tracking-tighter text-white">
          Rank <span className="text-muted font-light">Ingestion</span>
        </h2>

        <div className="flex flex-wrap gap-4">
          <input 
            className={cn("flex-1 min-w-[240px] bg-surface border border-border p-4 text-sm font-bold text-white outline-none", theme.focus)}
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <div className="relative min-w-[180px]">
            <select 
              value={franchise}
              onChange={(e) => setFranchise(e.target.value as Franchise)}
              className="w-full appearance-none bg-surface border border-border p-4 text-[10px] font-black uppercase tracking-widest text-white outline-none"
            >
              <option value="liella">Liella!</option>
              <option value="aqours">Aqours</option>
              <option value="us">u's</option>
              <option value="nijigasaki">Nijigasaki</option>
              <option value="hasunosora">Hasunosora</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
          </div>
        </div>

        <div className="relative">
          <textarea 
            className={cn("w-full h-[450px] bg-background border border-border p-6 font-mono text-xs text-text outline-none resize-none", theme.focus)}
            placeholder="1. Song Name - Artist..."
            value={rankings}
            onChange={(e) => setRankings(e.target.value)}
          />
          <AnimatePresence>
            {status === 'incomplete' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute bottom-4 left-4 right-4 bg-amber-500 p-3 text-black text-[10px] font-black uppercase shadow-xl">
                Partial list detected. Fill out the remaining songs shown above.
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button 
          onClick={onPost}
          disabled={status === "loading"}
          className={cn("w-full bg-white py-5 text-background font-black uppercase tracking-widest hover:text-white disabled:opacity-50 transition-all flex items-center justify-center gap-4", theme.hover)}
        >
          {status === "loading" ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
          Finalize List
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