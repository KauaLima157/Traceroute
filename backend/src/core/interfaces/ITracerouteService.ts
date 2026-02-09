import type { RawHop } from "../types/HopTypes.ts";

export interface ITracerouteService {
  run(target: string, maxHops?: number): Promise<RawHop[]>;
}

