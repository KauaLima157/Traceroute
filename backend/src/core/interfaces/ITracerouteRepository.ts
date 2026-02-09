import { Traceroute } from "../entities/Traceroute.ts";
import { Hop } from "../entities/Hop.ts"

export interface ITracerouteRepository {
    
    createTraceroute(data: Traceroute): Promise<void>;
    updateStatus(id: string, status: string, errorMessage?: string): Promise<void>;

    addHop(hop: Hop): Promise<void>;
    getHops(tracerouteId: string): Promise<Hop[]>;

    getById(id: string): Promise<Traceroute | null>;

    getHistory(userId: string, page: number, limit: number): Promise<Traceroute[]>;

    deleteTraceroute(id: string): Promise<void>;

    getStats(userId: string): Promise<{
        total: number;
        completed: number;
        failed: number;
    }>

}
