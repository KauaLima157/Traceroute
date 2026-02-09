export class Hop {
    id!: string;
    tracerouteId!: string;
    hopNumber!: number;
    ipAddress!: string | null;
    hostname!: string | null;
    latencyMs!: number | null;
    isTimeout!: boolean;
    country!: string | null;
    city!: string | null;
    latitude!: number | null;
    longitude!: number | null;
    createdAt!: Date;
}
