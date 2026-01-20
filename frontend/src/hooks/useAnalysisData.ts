import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

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
      const { data } = await api.get(`/analysis/controversy`, { params: { franchise, subgroup } });
      return data.results as ControversyResult[];
    },
    enabled: !!franchise && !!subgroup,
  });
};

export const useHotTakes = (franchise: string, subgroup: string) => {
  return useQuery({
    queryKey: ["takes", franchise, subgroup],
    queryFn: async () => {
      const { data } = await api.get(`/analysis/takes`, { params: { franchise, subgroup } });
      return data.takes as HotTake[];
    },
    enabled: !!franchise && !!subgroup,
  });
};

export const useSpiceMeter = (franchise: string) => {
  return useQuery({
    queryKey: ["spice", franchise],
    queryFn: async () => {
      const { data } = await api.get(`/analysis/spice`, { params: { franchise } });
      return data.results as SpiceResult[];
    },
    enabled: !!franchise,
  });
};

export type DivergenceMatrix = Record<string, Record<string, number>>;

export const useDivergence = (franchise: string, subgroup: string) => {
  return useQuery({
    queryKey: ["divergence", franchise, subgroup],
    queryFn: async () => {
      const { data } = await api.get(`/analysis/divergence`, { 
        params: { franchise, subgroup } 
      });
      return data.matrix as DivergenceMatrix;
    },
    enabled: !!franchise && !!subgroup,
    refetchOnWindowFocus: false,
  });
};