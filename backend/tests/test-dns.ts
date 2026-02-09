import { DNSService } from "../src/services/DNSService.ts";

async function testDNSService() {
  const dns = new DNSService();
  
  console.log("=== Testando DNSService ===\n");

  // Teste 1: Resolver hostname válido
  console.log("Resolvendo google.com...");
  const googleIP = await dns.resolveHostname("google.com", 5000);
  console.log(`   Resultado: ${googleIP}\n`);

  // Teste 2: Resolver hostname inválido
  console.log("Resolvendo hostname inválido...");
  const invalidIP = await dns.resolveHostname("site-que-nao-existe-123456.com", 5000);
  console.log(`   Resultado: ${invalidIP}\n`);

  // Teste 3: Reverse lookup de IP público
  console.log("Reverse lookup de 8.8.8.8 (Google DNS)...");
  const googleDNS = await dns.reverseLookup("8.8.8.8");
  console.log(`   Resultado: ${googleDNS}\n`);

  // Teste 4: Reverse lookup de IP privado
  console.log("Reverse lookup de 192.168.1.1 (IP privado)...");
  const privateIP = await dns.reverseLookup("192.168.1.1");
  console.log(`   Resultado: ${privateIP}\n`);

  // Teste 5: IP inválido
  console.log("Reverse lookup de IP inválido...");
  const invalidIPLookup = await dns.reverseLookup("999.999.999.999");
  console.log(`   Resultado: ${invalidIPLookup}\n`);

  // Teste 6: Hostname com formato inválido
  console.log("Resolvendo hostname com formato inválido...");
  const badFormat = await dns.resolveHostname("not a valid hostname!", 5000);
  console.log(`   Resultado: ${badFormat}\n`);

  console.log("=== Testes concluídos ===");
}

testDNSService();