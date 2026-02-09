import { useMutation, useQuery } from "@tanstack/react-query";
import { createTraceroute, fetchHistory, fetchTraceroute } from "../api/tracerouteApi";

export function useCreateTraceroute() {
  return useMutation({
    mutationFn: (target: string) => createTraceroute(target)
  });
}

export function useTraceroute(id: string) {
  return useQuery({
    queryKey: ["traceroute", id],
    queryFn: () => fetchTraceroute(id),
    enabled: Boolean(id)
  });
}

export function useHistory() {
  return useQuery({
    queryKey: ["traceroute-history"],
    queryFn: () => fetchHistory()
  });
}
