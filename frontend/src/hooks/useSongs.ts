import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

interface MasterSong {
  id: string;
  name: string;
}

export const useSongs = (franchise: string) => {
  return useQuery({
    queryKey: ["master-songs", franchise],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE}/health/songs`, {
        params: { franchise },
      });
      return data.songs as MasterSong[];
    },
  });
};