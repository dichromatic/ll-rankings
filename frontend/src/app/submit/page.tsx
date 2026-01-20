"use client";
import { useState } from "react";
import { api } from "@/lib/api"; // Use the centralized client
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
    if (!username || !rankings) {
      setMessage("Username and ranking list are required.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    try {
      // Logic: Centralized api has baseURL '/api/v1'
      // This call hits: POST /api/v1/submit
      const { data } = await api.post("/submit", {
        username,
        franchise,
        subgroup_name: "All Songs",
        ranking_list: rankings,
        missing_song_handling: strategy
      });

      if (data.status === "VALID") {
        setStatus("success");
        setMessage("Rankings successfully recorded.");
        setRankings(""); // Clear on success
      } else if (data.status === "INCOMPLETE") {
        setStatus("incomplete");
        // Format missing songs with rank '1.' so they pass the backend matcher immediately
        setRankings(data.missing_songs.map((s: string) => `1. ${s} - Liella!`).join("\n"));
      }
    } catch (e: any) {
      setStatus("error");
      const conflicts = e.response?.data?.conflicts as Record<string, Conflict> | undefined;
      if (conflicts) {
        const firstError = Object.values(conflicts)[0];
        setMessage(`Line ${firstError.line_num}: ${firstError.reason}`);
      } else {
        setMessage("API Error: Ensure backend is running.");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 animate-in fade-in duration-500">
      <div className="flex-1 space-y-8">
        <h2 className="text-4xl font-black uppercase tracking-tighter text-white">Rank <span className="text-muted font-light">Ingestion</span></h2>
        
        <div className="flex flex-wrap gap-4">
          <input 
            className="flex-1 min-w-[240px] bg-zinc-900 border border-zinc-800 p-4 text-sm font-bold outline-none focus:border-pink-500 transition-all"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <div className="relative">
            <select 
              value={franchise}
              onChange={(e) => setFranchise(e.target.value as Franchise)}
              className="appearance-none bg-zinc-900 border border-zinc-800 p-4 pr-12 text-[10px] font-black uppercase tracking-widest outline-none focus:border-pink-500"
            >
              <option value="liella">Liella!</option>
              <option value="aqours">Aqours</option>
              <option value="us">u's</option>
              <option value="nijigasaki">Nijigasaki</option>
              <option value="hasunosora">Hasunosora</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
          </div>
        </div>

        <div className="relative">
          <textarea 
            className="w-full h-[450px] bg-zinc-950 border border-zinc-800 p-6 font-mono text-xs focus:border-pink-500 outline-none resize-none"
            placeholder="Format: 1. Song Name - Artist"
            value={rankings}
            onChange={(e) => setRankings(e.target.value)}
          />
          <AnimatePresence>
            {status === "incomplete" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-4 left-4 right-4 bg-amber-500 p-3 text-black text-[10px] font-black uppercase"
              >
                Draft Saved. Rank the missing songs displayed above to finish.
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
            "p-4 text-[10px] font-black uppercase tracking-widest flex items-center gap-4 border",
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