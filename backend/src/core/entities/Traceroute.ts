export class Traceroute {
    id!: string;
    target!: string;
    ipResolved!: string | null;
    status!: "pending" | "processing" | "completed" | "failed";
    maxHops!: number;
    timeout!: number;
    startedAt!: Date | null;
    completedAt!: Date | null;
    userId!: string | null;
    errorMessage!: string | null;
    createdAt!: Date;
    updatedAt!: Date;
}

