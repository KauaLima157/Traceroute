import type { ITracerouteService } from "../core/interfaces/ITracerouteService.ts";
import { Traceroute } from "../core/entities/Traceroute.ts";
import { targetValidator } from "../utils/targetValidator.ts";
import type { RawHop } from "../core/types/HopTypes.ts";
import { spawn } from "child_process";
import { logger } from "../utils/logger.ts";

export class TracerouteService implements ITracerouteService {
    run(target: string, maxHops: number = 30): Promise<RawHop[]> {
    
        if(!targetValidator.isValidIP(target) && !targetValidator.isValidHostname(target)){
            logger.warn("Invalid target for traceroute", {
                target,
                reason: "Not a valid IP or hostname"
            });
            throw new Error("Ip ou Host inválido");
        }
        
        const platform = process.platform;
        const isLinux = platform === "linux";
        const isWin = platform === "win32";

        const cmd = isLinux ? "traceroute" : isWin ? "tracert" : "traceroute";
        const args = isLinux
            ? ['-m', String(maxHops), '-n', target]
            : ['-h', String(maxHops), target];

        logger.info("Starting traceroute command", {
            target,
            maxHops,
            platform,
            command: cmd,
            args
        });

        return new Promise((resolve, reject) => {
            const outputChunks: string[] = [];
            const errorChunks: string[] = [];
            const startTime = Date.now();
            
            const childProcess = spawn(cmd, args);
            
            childProcess.stdout.on('data', (chunk) => {
                outputChunks.push(chunk.toString());
            });
           
            childProcess.stderr.on('data', (chunk) => {
                errorChunks.push(chunk.toString());
            });
            
            childProcess.on('close', (code) => {
                const duration = Date.now() - startTime;
                
                if (code !== 0) {
                    const errorOutput = errorChunks.join("");
                    
                    logger.error("Traceroute command failed", {
                        target,
                        exitCode: code,
                        error: errorOutput,
                        durationMs: duration
                    });
                    
                    reject(new Error(`Traceroute falhou: ${errorOutput}`));
                } else {
                    const output = outputChunks.join('');
                    
                    logger.debug("Traceroute command completed, parsing output", {
                        target,
                        durationMs: duration,
                        outputLength: output.length
                    });
                    
                    try {
                        const hops = this.#parserTracer(output, platform);
                        
                        logger.info("Traceroute parsed successfully", {
                            target,
                            hopCount: hops.length,
                            durationMs: duration
                        });
                        
                        resolve(hops);
                    } catch (parseError: any) {
                        logger.error("Failed to parse traceroute output", {
                            target,
                            error: parseError.message,
                            stack: parseError.stack,
                            rawOutputSample: output.substring(0, 500) 
                        });
                        
                        reject(new Error(`Erro ao parsear traceroute: ${parseError.message}`));
                    }
                }
            });
            
            childProcess.on('error', (err) => {
                logger.error("Traceroute command not found or failed to spawn", {
                    target,
                    command: cmd,
                    error: err.message,
                    stack: err.stack
                });
                
                reject(new Error(`Comando não encontrado: ${err.message}`));
            });
        });
    }

    #parserTracer(tracerraw: string, platform: string): RawHop[] {
        const hops: RawHop[] = [];

        if (platform === "linux") {
            const lines = tracerraw.split("\n");
            const hopRegex = /^\s*(\d+)\s+([^\s(]+)?\s*(?:\(([\d.]+)\))?(.*)$/;

            logger.debug("Parsing Linux traceroute output", {
                totalLines: lines.length
            });

            let parsedLines = 0;
            let skippedLines = 0;

            for (const line of lines) {
                const cleaned = line.trim();

                
                if (
                    !cleaned ||
                    cleaned.startsWith("traceroute") ||
                    cleaned.includes("hops max") ||
                    cleaned.includes("bytes")
                ) {
                    skippedLines++;
                    continue;
                }

                const match = cleaned.match(hopRegex);
                if (!match) {
                    logger.debug("Line did not match hop regex", { 
                        line: cleaned.substring(0, 100) 
                    });
                    skippedLines++;
                    continue;
                }

                const [, hopStr, hostname, ipAddr, restRaw] = match;

                if (!hopStr) {
                    skippedLines++;
                    continue;
                }
                
                const hopNumber = parseInt(hopStr);
                const rest = restRaw ?? "";
                const timeout = cleaned.includes("*");

                if (timeout) {
                    hops.push({
                        hopNumber,
                        ipAddress: null,
                        hostname: null,
                        latencyMs: null,
                        isTimeout: true
                    });
                    parsedLines++;
                    continue;
                }

                
                const matches = rest.match(/\d+(?:\.\d+)?\s*ms/g) || [];
                const latencies = matches
                    .filter((v): v is string => typeof v === "string")
                    .map(v => parseFloat(v.replace("ms", "").trim()));

                const avgLatency = latencies.length
                    ? latencies.reduce((a, b) => a + b, 0) / latencies.length
                    : null;

                
                const errorMatch = rest.match(/!\w+/);

                if (errorMatch) {
                    logger.debug("Hop has ICMP error", {
                        hopNumber,
                        errorCode: errorMatch[0]
                    });
                    
                    hops.push({
                        hopNumber,
                        ipAddress: ipAddr ?? null,
                        hostname: hostname ?? null,
                        latencyMs: null,
                        isTimeout: true
                    });
                    parsedLines++;
                    continue;
                }

                hops.push({
                    hopNumber,
                    ipAddress: ipAddr ?? hostname ?? null,
                    hostname: hostname ?? null,
                    latencyMs: avgLatency,
                    isTimeout: false
                });
                parsedLines++;
            }

            logger.debug("Linux traceroute parsing completed", {
                totalLines: lines.length,
                parsedHops: parsedLines,
                skippedLines,
                hopCount: hops.length
            });
        }

        if (platform === "win32") {
            logger.warn("Windows traceroute parsing not implemented yet", {
                platform
            });
        }

        return hops;
    }

    parserTest(tracerraw: string, platform: string): RawHop[] {
        logger.debug("Running parser test", {
            platform,
            inputLength: tracerraw.length
        });
        
        return this.#parserTracer(tracerraw, platform);
    }
}