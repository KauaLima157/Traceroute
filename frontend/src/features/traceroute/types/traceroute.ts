export interface Hop {
  id: string;
  hopNumber: number;
  ipAddress: string | null;
  hostname: string | null;
  latencyMs: number | null;
  isTimeout: boolean;
  country?: string | null;
  city?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface Traceroute {
  id: string;
  target: string;
  status: "processing" | "completed" | "failed";
  startedAt?: string;
  completedAt?: string | null;
  hops?: Hop[];
}
