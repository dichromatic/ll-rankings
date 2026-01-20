import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export interface Ranking {
  song_id: string;
  song_name: string;
  points: number;
  average: number;
  submission_count: number;
}

export const useRankings = (franchise: string, subgroup: string) => {
  return useQuery({
    queryKey: ["rankings", franchise, subgroup],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE}/analysis/rankings`, {
        params: { franchise, subgroup },
      });
      return data.rankings as Ranking[];
    },
    // Don't refetch on window focus to save resources
    refetchOnWindowFocus: false,
  });
};