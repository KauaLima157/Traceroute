import net from 'node:net'

export class targetValidator {
  static isValidIP(ip: string): boolean {
    return net.isIP(ip) !== 0;
  }

  static isValidIPv4(ip: string): boolean {
    if (net.isIP(ip) !== 4) return false;
    
    const parts = ip.split('.').map(Number);
    return parts.every(part => part >= 0 && part <= 255);
  }

  static isPrivateIP(ip: string): boolean {
    if (!this.isValidIPv4(ip)) return false;
    
    const parts = ip.split('.').map(Number) as [number, number, number, number];

    const [a, b] = parts;

    // Loopback (localhost)
    if (a === 127) return true;
        
    // Private ranges
    if (a === 10) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
        
    // Link-local (APIPA)
    if (a === 169 && b === 254) return true;
        
    // Any address
    if (ip === '0.0.0.0') return true;

    return false;
  }

  static isValidHostname(hostname: string): boolean {
    const hostnameRegex = /^([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i;
    return hostnameRegex.test(hostname);
  }
}