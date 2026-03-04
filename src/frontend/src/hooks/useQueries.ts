import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Certificate } from "../backend.d";
import { useActor } from "./useActor";

export function useGetTotalPledges() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["totalPledges"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getTotalPledges();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

export function useGetRecentCertificates() {
  const { actor, isFetching } = useActor();
  return useQuery<Array<Certificate>>({
    queryKey: ["recentCertificates"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRecentCertificates();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useTakePledge() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<Certificate, Error, { name: string; email: string }>({
    mutationFn: async ({ name, email }) => {
      if (!actor) throw new Error("Not connected");
      return actor.takePledge(name, email);
    },
    onSuccess: () => {
      // Refresh the pledge count and wall after successful submission
      queryClient.invalidateQueries({ queryKey: ["totalPledges"] });
      queryClient.invalidateQueries({ queryKey: ["recentCertificates"] });
    },
  });
}
