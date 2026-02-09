import { apiFetch } from "../../../services/apiClient";
import type { Traceroute } from "../types/traceroute";

export function createTraceroute(target: string) {
  return apiFetch<Traceroute>("/api/traceroute", {
    method: "POST",
    body: JSON.stringify({ target })
  });
}

export function fetchTraceroute(id: string) {
  return apiFetch<Traceroute>(`/api/traceroute/${id}`);
}

export function fetchHistory() {
  return apiFetch<{ data: Traceroute[] }>("/api/traceroute/history");
}
