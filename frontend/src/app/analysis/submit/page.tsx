"use client";

import { useState } from "react";
import axios from "axios";
import { SongSidebar } from "@/components/submission/SongSidebar";
import { AlertCircle, CheckCircle2, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Conflict {
  reason: string;
  line_num: number;
  raw_text: string;
  expected_format?: string;
  suggestions?: string[];
}

export default function SubmitPage() {
  const [username, setUsername] = useState("");
  const [rankings, setRankings] = useState("");
  const [strategy, setStrategy] = useState("retry");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "incomplete" | "success">("idle");
  const [message, setMessage] = useState("");
  const [missingSongs, setMissingSongs] = useState<string[]>([]);

    const postRanking = async () => {
    setStatus("loading");
    try {
        const { data } = await axios.post("http://localhost:8000/api/v1/submit", {
        username,
        franchise: "liella",
        subgroup_name: "All Songs",
        ranking_list: rankings,
        missing_song_handling: strategy
        });

        if (data.status === "VALID") {
        setStatus("success");
        setMessage("Rankings finalized and recorded.");
        } else if (data.status === "INCOMPLETE") {
        setStatus("incomplete");
        setMissingSongs(data.missing_songs);
        // Automatically pre-fill the box with missing songs formatted correctly
        setRankings(data.missing_songs.map((s: string) => `1. ${s} - Liella!`).join("\n"));
        }
    } catch (e: any) {
        setStatus("error");
        
        // Explicitly cast the error object so TypeScript knows it contains Conflict objects
        const conflicts = e.response?.data?.conflicts as Record<string, Conflict> | undefined;

        if (conflicts && Object.keys(conflicts).length > 0) {
        const firstError = Object.values(conflicts)[0];
        setMessage(`Error at Line ${firstError.line_num}: ${firstError.reason.replace('_', ' ')}`);
        } else {
        setMessage("Connection failed. Ensure the backend is running.");
        }
    }
    };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 flex flex-col lg:flex-row gap-8">
      {/* Main Form Area */}
      <div className="flex-1 space-y-6">
        <header>
          <h2 className="text-3xl font-black italic uppercase">Rank <span className="text-zinc-600">Ingestion</span></h2>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-2">
            Submit your master list to generate statistical profiles
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            className="bg-zinc-950 border border-zinc-900 p-4 outline-none focus:border-accent-liella text-sm"
            placeholder="Username (e.g. Keke_Tang)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <select 
            className="bg-zinc-950 border border-zinc-900 p-4 text-sm outline-none"
            value={strategy}
            onChange={(e) => setStrategy(e.target.value)}
          >
            <option value="retry">Retry strategy (Manual Fix)</option>
            <option value="end">Append strategy (Auto Fill)</option>
          </select>
        </div>

        <div className="relative">
          <textarea 
            className="w-full h-[400px] bg-zinc-950 border border-zinc-900 p-6 font-mono text-sm outline-none focus:border-accent-liella resize-none"
            placeholder="1. Song Name - Liella!&#10;2. Another Song - Liella!"
            value={rankings}
            onChange={(e) => setRankings(e.target.value)}
          />
          
          <AnimatePresence>
            {status === "incomplete" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute inset-x-0 bottom-0 bg-amber-500/90 p-4 text-black text-xs font-bold"
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>Rank the missing songs below and click submit again to merge.</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button 
          onClick={postRanking}
          disabled={status === "loading"}
          className="w-full bg-accent-liella py-5 text-black font-black uppercase tracking-tighter hover:bg-white transition-all flex items-center justify-center gap-3"
        >
          {status === "loading" ? "Syncing..." : <><Send className="w-4 h-4" /> Finalize Rankings</>}
        </button>

        {message && (
          <div className={cn(
            "p-4 text-xs font-bold uppercase tracking-widest flex items-center gap-3",
            status === "success" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
          )}>
            {status === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {message}
          </div>
        )}
      </div>

      {/* Side Reference */}
      <aside className="w-full lg:w-80 h-[600px] lg:h-auto">
        <SongSidebar franchise="liella" />
      </aside>
    </div>
  );
}