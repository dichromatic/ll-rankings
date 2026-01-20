import { useQuery } from "@tanstack/react-query";
import axios from "axios";

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
      const { data } = await axios.get(`http://localhost:8000/api/v1/subgroups`, {
        params: { franchise },
      });
      return data as Subgroup[];
    },
  });
};