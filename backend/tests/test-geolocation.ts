import { GeolocationService } from "../src/services/GeolocationService.ts";

async function testGeolocationService() {
  const geoloc = new GeolocationService();
  
  console.log("=== Testando GeolocationService ===\n");

  // Teste 1: IP público válido (Google DNS)
  console.log("Buscando localização de 8.8.8.8 (Google DNS)...");
  const google = await geoloc.getLocation("8.8.8.8");
  console.log(`   País: ${google.country}`);
  console.log(`   Cidade: ${google.city}`);
  console.log(`   Coordenadas: ${google.latitude}, ${google.longitude}\n`);

  // Teste 2: IP privado (192.168.x.x)
  console.log("Buscando localização de 192.168.1.1 (IP privado)...");
  const private1 = await geoloc.getLocation("192.168.1.1");
  console.log(`   Resultado: ${JSON.stringify(private1)}\n`);

  // Teste 3: IP privado (10.x.x.x)
  console.log("Buscando localização de 10.0.0.1 (IP privado)...");
  const private2 = await geoloc.getLocation("10.0.0.1");
  console.log(`   Resultado: ${JSON.stringify(private2)}\n`);

  // Teste 4: Localhost
  console.log("Buscando localização de 127.0.0.1 (localhost)...");
  const localhost = await geoloc.getLocation("127.0.0.1");
  console.log(`   Resultado: ${JSON.stringify(localhost)}\n`);

  // Teste 5: IP público brasileiro (Vivo)
  console.log("Buscando localização de 177.64.50.1 (provedor brasileiro)...");
  const brazilian = await geoloc.getLocation("177.64.50.1");
  console.log(`   País: ${brazilian.country}`);
  console.log(`   Cidade: ${brazilian.city}`);
  console.log(`   Coordenadas: ${brazilian.latitude}, ${brazilian.longitude}\n`);

  // Teste 6: IP inválido
  console.log("Buscando localização de IP inválido (999.999.999.999)...");
  const invalid = await geoloc.getLocation("999.999.999.999");
  console.log(`   Resultado: ${JSON.stringify(invalid)}\n`);

  // Teste 7: String não-IP
  console.log("Buscando localização de string inválida (abc.def.ghi.jkl)...");
  const notIP = await geoloc.getLocation("abc.def.ghi.jkl");
  console.log(`   Resultado: ${JSON.stringify(notIP)}\n`);

  // Teste 8: Cache (buscar 8.8.8.8 de novo)
  /*
  console.log("Buscando 8.8.8.8 novamente (deve vir do cache)...");
  const googleCached = await geoloc.getLocation("8.8.8.8");
  console.log(`   País: ${googleCached.country}`);
  console.log(`   Cidade: ${googleCached.city}\n`);
  */

  // Teste 9: Múltiplos IPs em sequência
  console.log("Testando múltiplos IPs públicos...");
  const ips = ["1.1.1.1", "8.8.4.4", "208.67.222.222"];
  for (const ip of ips) {
    const result = await geoloc.getLocation(ip);
    console.log(`   ${ip}: ${result.city}, ${result.country}`);
  }

  // Teste 10: Link-local IP (APIPA)
  console.log("Buscando localização de 169.254.1.1 (link-local)...");
  const linkLocal = await geoloc.getLocation("169.254.1.1");
  console.log(`   Resultado: ${JSON.stringify(linkLocal)}\n`);

  console.log("=== Testes concluídos ===");
}

testGeolocationService();