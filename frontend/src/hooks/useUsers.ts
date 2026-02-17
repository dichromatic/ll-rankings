import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/api";

export interface User {
  username: string;
}

export const useUsers = (franchise: string) => {
  return useQuery({
    queryKey: ["users", franchise],
    queryFn: async () => {
      const { data } = await api.get(`/users`, {
        params: { franchise },
      });
      return data as User[];
    },
    refetchOnWindowFocus: false,
    enabled: !!franchise,
  });
};