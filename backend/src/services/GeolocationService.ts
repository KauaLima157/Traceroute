import type { GeoLocation } from "../core/types/HopTypes.ts";
import type { IGeolocationService } from "../core/interfaces/IGeolocationService.ts";
import axios from "axios";
import { targetValidator } from "../utils/targetValidator.ts";
import { logger } from "../utils/logger.ts";

export class GeolocationService implements IGeolocationService {
  async getLocation(ip: string): Promise<GeoLocation> {
    
  const nullLocation = {country: null, city: null, latitude: null, longitude: null};

  
  if (!targetValidator.isValidIP(ip) || targetValidator.isPrivateIP(ip)) {
    logger.warn("invalid IP", {
      IP: ip
    })
    return nullLocation;  
  }
 
  try { 
    const response = await axios.get(`http://ip-api.com/json/${ip}`, {
      timeout: 5000
    });
    
    if (response.data.status === "success") { 
      const { country, city, lat, lon } = response.data;

      logger.debug("Geocalização encontrada com sucesso", {
        Country: country, 
        City: city, 
        latitude: lat, 
        longitude: lon
      })

      return {country, city, latitude: lat, longitude: lon};
    } else {
      return nullLocation;
    }
  } catch(err: any) {
    logger.error(` Erro ao buscar o ip`, { 
      IP: ip, 
      error: err.message,
      stack: err.stack
    });
    return nullLocation;  
  }
}

}