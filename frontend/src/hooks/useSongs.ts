import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface MasterSong {
  id: string;
  name: string;
}

export const useSongs = (franchise: string) => {
  return useQuery({
    queryKey: ["master-songs", franchise],
    queryFn: async () => {
      const { data } = await api.get(`/health/songs`, {
        params: { franchise },
      });
      return data.songs as MasterSong[];
    },
    refetchOnWindowFocus: false,
    enabled: !!franchise,
  });
};