import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface Subgroup {
  id: string;
  name: string;
  franchise: string;
  song_count: number;
  songs: string[];
}

export const useSubgroups = (franchise: string) => {
  return useQuery({
    queryKey: ["subgroups", franchise],
    queryFn: async () => {
      const { data } = await api.get(`/subgroups`, {
        params: { franchise },
      });
      return data as Subgroup[];
    },
    refetchOnWindowFocus: false,
    enabled: !!franchise,
  });
};