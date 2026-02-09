import { Traceroute } from "../entities/Traceroute.ts";

// Dados mínimos para criar traceroute
export type TracerouteInput = Pick<Traceroute, 
  'target' | 
  'maxHops' | 
  'timeout'
>;

// Traceroute com status específico
export type ProcessingTraceroute = Traceroute & {
  status: "processing";  // Força ser "processing"
};

export type CompletedTraceroute = Traceroute & {
  status: "completed";
  completedAt: Date; 
};