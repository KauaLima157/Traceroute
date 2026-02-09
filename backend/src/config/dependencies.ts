import { TracerouteRepository } from "../repositories/TracerouteRepository.ts";
import { TracerouteService } from "../services/TracerouteService.ts";
import { DNSService } from "../services/DNSService.ts";
import { GeolocationService } from "../services/GeolocationService.ts";
import { RunTracerouteUseCase } from "../core/usecases/RunTracerouteUseCase.ts";
import { TracerouteController } from "../controllers/TracerouteController.ts";

const repository = new TracerouteRepository();
const tracerouteService = new TracerouteService();
const dnsService = new DNSService();
const geoService = new GeolocationService();

const runTracerouteUseCase = new RunTracerouteUseCase(
  tracerouteService,
  repository,
  dnsService,
  geoService
);

export const tracerouteController = new TracerouteController(runTracerouteUseCase, repository);