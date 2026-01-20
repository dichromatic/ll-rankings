import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

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
      const { data } = await api.get(`/analysis/rankings`, {
        params: { franchise, subgroup },
      });
      return data.rankings as Ranking[];
    },
    refetchOnWindowFocus: false,
    enabled: !!franchise && !!subgroup, // Only fetch if params exist
  });
};