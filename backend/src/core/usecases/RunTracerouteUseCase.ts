import type { IUseCase } from "../interfaces/IUseCase.ts";
import type { ITracerouteService } from "../interfaces/ITracerouteService.ts";
import type { ITracerouteRepository } from "../interfaces/ITracerouteRepository.ts";
import type { IDNSService } from "../interfaces/IDNSService.ts";
import type { IGeolocationService } from "../interfaces/IGeolocationService.ts";
import { Traceroute } from "../entities/Traceroute.ts";
import { Hop } from "../entities/Hop.ts";
import { randomUUID } from "crypto";
import { logger } from "../../utils/logger.ts";

interface RunTracerouteInput {
  target: string;
  maxHops?: number;
  timeout?: number;
  userId: string;
}

interface RunTracerouteOutput {
  id: string;
  status: "processing" | "completed" | "failed";
}

export class RunTracerouteUseCase implements IUseCase<RunTracerouteInput, RunTracerouteOutput> {
  constructor(
    private tracerouteService: ITracerouteService,
    private tracerouteRepository: ITracerouteRepository,
    private dnsService: IDNSService,
    private geoService: IGeolocationService
  ) {}

  async execute(input: RunTracerouteInput): Promise<RunTracerouteOutput> {
    const traceroute = new Traceroute();
    traceroute.id = randomUUID();
    traceroute.target = input.target;
    traceroute.status = "processing";
    traceroute.maxHops = input.maxHops || 30;
    traceroute.timeout = input.timeout || 5000;
    traceroute.startedAt = new Date();
    traceroute.completedAt = null;
    traceroute.userId = input.userId;
    traceroute.ipResolved = null;
    traceroute.errorMessage = null;
    traceroute.createdAt = new Date();
    traceroute.updatedAt = new Date();

    logger.info('Starting traceroute execution', { 
      tracerouteId: traceroute.id,
      target: input.target,
      maxHops: traceroute.maxHops,
      userId: input.userId
    });
    
    await this.tracerouteRepository.createTraceroute(traceroute);

    
    this.#executeInBackground(traceroute.id, input.target, input.maxHops || 30)
      .catch((err: any) => {
        logger.error('Critical error in background traceroute execution', { 
          tracerouteId: traceroute.id,
          error: err.message,
          stack: err.stack
        });
      });

    return {
      id: traceroute.id,
      status: "processing"
    };
  }

  async #executeInBackground(
    tracerouteId: string,
    target: string,
    maxHops: number
  ): Promise<void> {
    const startTime = Date.now();
    
    logger.info('Background traceroute execution started', { 
      tracerouteId, 
      target, 
      maxHops 
    });
    
    try {
      
      const rawHops = await this.tracerouteService.run(target, maxHops);
      
      logger.info('Traceroute command completed', { 
        tracerouteId,
        hopsFound: rawHops.length,
        durationMs: Date.now() - startTime
      });
      
      for (let i = 0; i < rawHops.length; i++) {
        const rawHop = rawHops[i];
        
        if (!rawHop) {
          logger.debug('Skipping null hop', { tracerouteId, index: i });
          continue;
        }
        
        logger.debug('Processing hop', { 
          tracerouteId,
          hopNumber: rawHop.hopNumber,
          ipAddress: rawHop.ipAddress,
          isTimeout: rawHop.isTimeout
        });
        
        try {
          const hop = await this.#processHop(tracerouteId, rawHop);
          await this.tracerouteRepository.addHop(hop);
          
          logger.debug('Hop saved successfully', { 
            tracerouteId,
            hopNumber: hop.hopNumber,
            hasGeo: !!(hop.country || hop.city)
          });
          
        } catch (hopError: any) {
          logger.error('Failed to process hop', { 
            tracerouteId,
            hopNumber: rawHop.hopNumber,
            error: hopError.message,
            stack: hopError.stack
          });
        }
      }
      
     
      const totalDuration = Date.now() - startTime;
      await this.tracerouteRepository.updateStatus(tracerouteId, "completed");
      
      logger.info('Traceroute completed successfully', { 
        tracerouteId,
        totalHops: rawHops.length,
        durationMs: totalDuration
      });
      
    } catch (error: any) {
      logger.error('Traceroute execution failed', { 
        tracerouteId,
        target,
        error: error.message,
        stack: error.stack,
        durationMs: Date.now() - startTime
      });
      
      await this.tracerouteRepository.updateStatus(
        tracerouteId, 
        "failed", 
        error.message
      );
    }
  }

  async #processHop(tracerouteId: string, rawHop: any): Promise<Hop> {
    const hop = new Hop();
    hop.id = randomUUID();
    hop.tracerouteId = tracerouteId;
    hop.hopNumber = rawHop.hopNumber;
    hop.ipAddress = rawHop.ipAddress;
    hop.latencyMs = rawHop.latencyMs;
    hop.isTimeout = rawHop.isTimeout;
    hop.createdAt = new Date();

    if (!rawHop.hostname && rawHop.ipAddress && !rawHop.isTimeout) {
      logger.debug('Performing reverse DNS lookup', { 
        tracerouteId,
        hopNumber: hop.hopNumber,
        ipAddress: rawHop.ipAddress 
      });
      
      hop.hostname = await this.dnsService.reverseLookup(rawHop.ipAddress);
      
      if (hop.hostname) {
        logger.debug('Reverse DNS resolved', { 
          tracerouteId,
          hopNumber: hop.hopNumber,
          hostname: hop.hostname 
        });
      }
    } else {
      hop.hostname = rawHop.hostname;
    }

    if (rawHop.ipAddress && !rawHop.isTimeout) {
      try {
        const geo = await this.geoService.getLocation(rawHop.ipAddress);
        hop.country = geo.country;
        hop.city = geo.city;
        hop.latitude = geo.latitude;
        hop.longitude = geo.longitude;
        
        if (geo.country || geo.city) {
          logger.debug('Geolocation found', { 
            tracerouteId,
            hopNumber: hop.hopNumber,
            country: geo.country,
            city: geo.city
          });
        }
      } catch (geoError: any) {
        logger.warn('Failed to fetch geolocation', { 
          tracerouteId,
          hopNumber: hop.hopNumber,
          ipAddress: rawHop.ipAddress,
          error: geoError.message
        });
        
        hop.country = null;
        hop.city = null;
        hop.latitude = null;
        hop.longitude = null;
      }
    } else {
      hop.country = null;
      hop.city = null;
      hop.latitude = null;
      hop.longitude = null;
    }

    return hop;
  }
}