export interface IDNSService {
  resolveHostname(hostname: string, timeoutMs?: number): Promise<string | null>;
  reverseLookup(ip: string): Promise<string | null>;
}