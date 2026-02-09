import { Hop } from "../entities/Hop.ts";

// Hop sem geolocalização (retorno do TracerouteService)
export type RawHop = Pick<Hop, 
  'hopNumber' | 
  'ipAddress' | 
  'hostname' | 
  'latencyMs' | 
  'isTimeout'
>;

export type GeoLocation = {
  country: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
};


// Hop sem campos auto-gerados (para criar novo)
export type HopInput = Omit<Hop, 'id' | 'createdAt'>;

