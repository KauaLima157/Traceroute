import type { IDNSService } from "../core/interfaces/IDNSService.ts";
import {promises as dnsPromises} from 'node:dns'
import { targetValidator } from "../utils/targetValidator.ts";
import { logger } from "../utils/logger.ts";
import { log } from "node:console";

export class DNSService implements IDNSService {

  async resolveHostname(hostname: string, timeoutMs: number = 5000): Promise<string | null> {
  if (!targetValidator.isValidHostname(hostname)) { 
    logger.warn(`hostname inválido inválido`, {
      Hostname: hostname
    });
    return null; }
  
  try {
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('DNS timeout')), timeoutMs)
    );
    
    const lookupPromise = dnsPromises.lookup(hostname);
    
    const result = await Promise.race([lookupPromise, timeoutPromise]);
    return result.address || null;

  } catch (error: any) {
    logger.error(`Erro ao resolver o host`, {
      Hostname: hostname,
      error: error.message,
      stack: error.stack
    })
    return null;
  }
}
  
  
  async reverseLookup(ip: string): Promise<string | null> {
  try {
    if (!targetValidator.isValidIP(ip)) {
      logger.warn(`IP inválido`,{  
        IP: ip
    });
      return null;
    }
    
    const hostnames = await dnsPromises.reverse(ip);
    
    if (hostnames && hostnames.length > 0) {
      return hostnames[0] || null;
    }
    
    logger.warn(`Nenhum hostname encontrado para IP`, {
      IP: ip
    });
    return null;
  } catch (error: any) {
    logger.error(` Erro no reverse lookup`, {
      IP: ip, 
      error: error.message,
      stack: error.stack
    });
    return null;
  }
}

}

