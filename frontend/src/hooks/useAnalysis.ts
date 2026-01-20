import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_BASE = "http://localhost:8000/api/v1";

export interface ControversyResult {
  song_id: string;
  song_name: string;
  avg_rank: number;
  controversy_score: number;
  cv: number;
  bimodality: number;
}

export interface HotTake {
  username: string;
  song_name: string;
  user_rank: number;
  group_avg: number;
  delta: number;
  score: number;
  take_type: "HOT_TAKE" | "GLAZE";
}

export interface SpiceResult {
  username: string;
  global_spice: number;
  group_breakdown: Record<string, number>;
}

export const useControversy = (franchise: string, subgroup: string) => {
  return useQuery({
    queryKey: ["controversy", franchise, subgroup],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE}/analysis/controversy`, { params: { franchise, subgroup } });
      return data.results as ControversyResult[];
    },
    refetchOnWindowFocus: false,
  });
};

export const useHotTakes = (franchise: string, subgroup: string) => {
  return useQuery({
    queryKey: ["takes", franchise, subgroup],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE}/analysis/takes`, { params: { franchise, subgroup } });
      return data.takes as HotTake[];
    },
    refetchOnWindowFocus: false,
  });
};

export const useSpice = (franchise: string) => {
  return useQuery({
    queryKey: ["spice", franchise],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE}/analysis/spice`, { params: { franchise } });
      return data.results as SpiceResult[];
    },
    refetchOnWindowFocus: false,
  });
};