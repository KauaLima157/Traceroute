import type { GeoLocation } from "../types/HopTypes.ts";

export interface IGeolocationService {
  getLocation(ip: string): Promise<GeoLocation>;

}