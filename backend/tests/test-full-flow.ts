import { TracerouteService } from "../src/services/TracerouteService.ts";
import { DNSService } from "../src/services/DNSService.ts";
import { GeolocationService } from "../src/services/GeolocationService.ts";
import { TracerouteRepository } from "../src/repositories/TracerouteRepository.ts";
import { RunTracerouteUseCase } from "../src/core/usecases/RunTracerouteUseCase.ts";
import { randomUUID } from "crypto";

async function debugFullFlow() {
  console.log("========================================");
  console.log("INICIANDO DEBUG COMPLETO DO FLUXO");
  console.log("========================================\n");

  const target = "google.com";
  const maxHops = 10;
  const userId = randomUUID();

  // Inicializa serviços
  const tracerouteService = new TracerouteService();
  const dnsService = new DNSService();
  const geoService = new GeolocationService();
  const repository = new TracerouteRepository();

  console.log("Serviços inicializados\n");

  // TESTE 1: Traceroute Service
  console.log("--- TESTE 1: TracerouteService ---");
  try {
    const rawHops = await tracerouteService.run(target, maxHops);
    console.log(`Traceroute retornou ${rawHops.length} hops\n`);
    
    rawHops.slice(0, 3).forEach(hop => {
      console.log(`  Hop ${hop.hopNumber}:`);
      console.log(`    IP: ${hop.ipAddress}`);
      console.log(`    Latency: ${hop.latencyMs}ms`);
      console.log(`    Timeout: ${hop.isTimeout}\n`);
    });
  } catch (error: any) {
    console.error(`❌ Erro no TracerouteService:`, error.message);
    return;
  }

  // TESTE 2: DNS Service
  console.log("--- TESTE 2: DNSService ---");
  try {
    const testIP = "8.8.8.8";
    const hostname = await dnsService.reverseLookup(testIP);
    console.log(`Reverse lookup de ${testIP}: ${hostname}\n`);
  } catch (error: any) {
    console.error(`❌ Erro no DNSService:`, error.message);
  }

  // TESTE 3: Geolocation Service
  console.log("--- TESTE 3: GeolocationService ---");
  try {
    const testIP = "8.8.8.8";
    const geo = await geoService.getLocation(testIP);
    console.log(`Geolocalização de ${testIP}:`);
    console.log(`  País: ${geo.country}`);
    console.log(`  Cidade: ${geo.city}`);
    console.log(`  Coordenadas: ${geo.latitude}, ${geo.longitude}\n`);
  } catch (error: any) {
    console.error(`❌ Erro no GeolocationService:`, error.message);
  }

  // TESTE 4: Use Case Completo
  console.log("--- TESTE 4: RunTracerouteUseCase (Fluxo Completo) ---");
  const useCase = new RunTracerouteUseCase(
    tracerouteService,
    repository,
    dnsService,
    geoService
  );

  try {
    console.log(`Executando traceroute para ${target}...`);
    const result = await useCase.execute({
      target,
      maxHops,
      userId
    });

    console.log(`Traceroute iniciado: ${result.id}`);
    console.log(`Status: ${result.status}\n`);

    // Aguarda 30 segundos para o processamento
    console.log("⏳ Aguardando 30 segundos para processamento...\n");
    await new Promise(resolve => setTimeout(resolve, 30000));

    // Verifica no banco
    console.log("--- VERIFICANDO NO BANCO ---");
    const traceroute = await repository.getById(result.id);
    
    if (traceroute) {
      console.log(`Traceroute encontrado no banco:`);
      console.log(`  ID: ${traceroute.id}`);
      console.log(`  Target: ${traceroute.target}`);
      console.log(`  Status: ${traceroute.status}`);
      console.log(`  Error: ${traceroute.errorMessage || 'nenhum'}\n`);

      const hops = await repository.getHops(result.id);
      console.log(` Hops salvos no banco: ${hops.length}`);
      
      if (hops.length > 0) {
        console.log(`\n Primeiros 5 hops:`);
        hops.slice(0, 5).forEach(hop => {
          console.log(`  Hop ${hop.hopNumber}:`);
          console.log(`    IP: ${hop.ipAddress || 'N/A'}`);
          console.log(`    Hostname: ${hop.hostname || 'N/A'}`);
          console.log(`    Localização: ${hop.city || 'N/A'}, ${hop.country || 'N/A'}`);
          console.log(`    Latência: ${hop.latencyMs ? hop.latencyMs + 'ms' : 'timeout'}`);
          console.log(`    Timeout: ${hop.isTimeout}\n`);
        });
      } else {
        console.error(`❌ PROBLEMA: Nenhum hop foi salvo no banco!`);
      }
    } else {
      console.error(`❌ Traceroute não encontrado no banco!`);
    }

  } catch (error: any) {
    console.error(`❌ Erro no UseCase:`, error.message);
    console.error(`Stack:`, error.stack);
  }

  console.log("\n========================================");
  console.log("DEBUG COMPLETO FINALIZADO");
  console.log("========================================");
}

// Executa o debug
debugFullFlow().catch(console.error);