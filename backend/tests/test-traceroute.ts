import { TracerouteService } from "../src/services/TracerouteService.ts";


async function testTracerouteService() {
  const trace = new TracerouteService();
  
  console.log("=== Testando TracerouteService ===\n");
  try { 
  // Teste 1: Resolver target válido
  console.log("Resolvendo google.com...");
  const hops = await trace.run("google.com", 10);
      console.log(`Total de hops: ${hops.length}\n`);
      
      hops.forEach(hop => {
          console.log(`Hop ${hop.hopNumber}:`);
          console.log(`  IP: ${hop.ipAddress || 'N/A'}`);
          console.log(`  Hostname: ${hop.hostname || 'N/A'}`);
          console.log(`  Latência: ${hop.latencyMs ? hop.latencyMs.toFixed(2) + 'ms' : 'timeout'}`);
          console.log(`  Timeout: ${hop.isTimeout}`);
          console.log();
      });

  
  // Teste 2: Resolver target válido again
  console.log("Resolvendo youtube.com...");
  const hops1 = await trace.run("youtube.com", 10);
      console.log(`Total de hops: ${hops1.length}\n`);
      
      hops1.forEach(hop => {
          console.log(`Hop ${hop.hopNumber}:`);
          console.log(`  IP: ${hop.ipAddress || 'N/A'}`);
          console.log(`  Hostname: ${hop.hostname || 'N/A'}`);
          console.log(`  Latência: ${hop.latencyMs ? hop.latencyMs.toFixed(2) + 'ms' : 'timeout'}`);
          console.log(`  Timeout: ${hop.isTimeout}`);
          console.log();
      });
  } catch (error:any) {
      console.error("Erro:", error.message);
  }

}

testTracerouteService()


function testParser(output: string, platform: string): any[] {
  const service = new TracerouteService();
  return service.parserTest(output, platform);
}

