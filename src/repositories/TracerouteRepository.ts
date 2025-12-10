import type { ITracerouteRepository } from "../core/interfaces/ITracerouteRepository.ts";
import type { Traceroute } from "../core/entities/Traceroute.ts";
import type { Hop } from "../core/entities/Hop.ts";
import { traceRoutePool } from "../database/connection.ts";
import { logger } from "../utils/logger.ts";

export class TracerouteRepository implements ITracerouteRepository {
    
    async createTraceroute(data: Traceroute): Promise<void> {
        logger.info('Creating traceroute in database', { 
            tracerouteId: data.id,
            target: data.target,
            userId: data.userId 
        });
        
        try {
            await traceRoutePool.query(`
                INSERT INTO traceroutes (
                    id, target, ip_resolved, status, max_hops, timeout,
                    started_at, user_id
                ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
            `, [
                data.id,
                data.target,
                data.ipResolved,
                data.status,
                data.maxHops,
                data.timeout,
                data.startedAt,
                data.userId 
            ]);
            
            logger.info('Traceroute created successfully', { tracerouteId: data.id });
        } catch (error: any) {
            logger.error('Failed to create traceroute', { 
                tracerouteId: data.id,
                error: error.message,
                stack: error.stack 
            });
            throw error;
        }
    }

    async updateStatus(id: string, status: string, error_message?: string): Promise<void> {
        logger.info('Updating traceroute status', { 
            tracerouteId: id, 
            newStatus: status,
            hasError: !!error_message 
        });
        
        try {
            const result = await traceRoutePool.query(`
                UPDATE traceroutes
                SET status = $1, error_message = $2, completed_at = NOW() 
                WHERE id = $3
                RETURNING id
            `, [
                status,
                error_message ?? null,
                id
            ]);
            
            if (result.rowCount === 0) {
                logger.warn('Traceroute not found for status update', { tracerouteId: id });
            } else {
                logger.info('Status updated successfully', { 
                    tracerouteId: id, 
                    status 
                });
            }
        } catch (error: any) {
            logger.error('Failed to update status', { 
                tracerouteId: id,
                error: error.message 
            });
            throw error;
        }
    }

    async addHop(hop: Hop): Promise<void> {
        logger.debug('Saving hop to database', {
            hopId: hop.id,
            tracerouteId: hop.tracerouteId,
            hopNumber: hop.hopNumber,
            ipAddress: hop.ipAddress,
            hostname: hop.hostname,
            isTimeout: hop.isTimeout
        });
        
        try {
            const result = await traceRoutePool.query(`
                INSERT INTO hops (
                    id, traceroute_id, hop_number, ip_address,
                    hostname, latency_ms, is_timeout, country,
                    city, latitude, longitude
                ) VALUES (
                    $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11
                )
                RETURNING id
            `, [
                hop.id,
                hop.tracerouteId,
                hop.hopNumber,
                hop.ipAddress,
                hop.hostname,
                hop.latencyMs,
                hop.isTimeout,
                hop.country,
                hop.city,
                hop.latitude,
                hop.longitude
            ]);
            
            logger.debug('Hop saved successfully', { 
                hopId: result.rows[0].id,
                hopNumber: hop.hopNumber 
            });
        } catch (error: any) {
            logger.error('Failed to save hop', { 
                hopNumber: hop.hopNumber,
                tracerouteId: hop.tracerouteId,
                error: error.message,
                errorDetails: error 
            });
            throw error;
        }
    }

    async getHops(tracerouteId: string): Promise<Hop[]> {
        logger.debug('Fetching hops from database', { tracerouteId });
        
        try {
            const { rows } = await traceRoutePool.query(`
                SELECT * FROM hops 
                WHERE traceroute_id = $1 
                ORDER BY hop_number
            `, [tracerouteId]);
            
            logger.debug('Hops fetched successfully', { 
                tracerouteId, 
                hopCount: rows.length 
            });
            
            return rows;
        } catch (error: any) {
            logger.error('Failed to fetch hops', { 
                tracerouteId,
                error: error.message 
            });
            throw error;
        }
    }

    async getById(id: string): Promise<Traceroute | null> {
        logger.debug('Fetching traceroute by ID', { tracerouteId: id });
        
        try {
            const { rows } = await traceRoutePool.query(`
                SELECT * FROM traceroutes
                WHERE id = $1
            `, [id]);
            
            if (rows[0]) {
                logger.debug('Traceroute found', { 
                    tracerouteId: id,
                    target: rows[0].target,
                    status: rows[0].status 
                });
            } else {
                logger.debug('Traceroute not found', { tracerouteId: id });
            }
            
            return rows[0] ?? null;
        } catch (error: any) {
            logger.error('Failed to fetch traceroute', { 
                tracerouteId: id,
                error: error.message 
            });
            throw error;
        }
    }

    async getHistory(userId: string, page: number, limit: number): Promise<Traceroute[]> {
        const offset = (page - 1) * limit;

        logger.debug('Fetching traceroute history', { 
            userId, 
            page, 
            limit, 
            offset 
        });

        try {
            const { rows } = await traceRoutePool.query(`
                SELECT * FROM traceroutes
                WHERE user_id = $1
                ORDER BY started_at DESC
                LIMIT $2 OFFSET $3
            `, [userId, limit, offset]);

            logger.debug('History fetched successfully', { 
                userId, 
                resultCount: rows.length 
            });

            return rows;
        } catch (error: any) {
            logger.error('Failed to fetch history', { 
                userId,
                error: error.message 
            });
            throw error;
        }
    }

    async deleteTraceroute(id: string): Promise<void> {
        logger.info('Deleting traceroute', { tracerouteId: id });
        
        try {
            await traceRoutePool.query(`DELETE FROM hops WHERE traceroute_id = $1`, [id]);
            await traceRoutePool.query(`DELETE FROM traceroutes WHERE id = $1`, [id]);
            
            logger.info('Traceroute deleted successfully', { tracerouteId: id });
        } catch (error: any) {
            logger.error('Failed to delete traceroute', { 
                tracerouteId: id,
                error: error.message 
            });
            throw error;
        }
    }

    async getStats(userId: string) {
        logger.debug('Fetching user stats', { userId });
        
        try {
            const { rows } = await traceRoutePool.query(`
                SELECT
                    COUNT(*)::int AS total,
                    COUNT(*) FILTER (WHERE status = 'completed')::int AS completed,
                    COUNT(*) FILTER (WHERE status = 'failed')::int AS failed
                FROM traceroutes
                WHERE user_id = $1
            `, [userId]); 

            logger.debug('Stats fetched successfully', { 
                userId, 
                stats: rows[0] 
            });

            return rows[0];
        } catch (error: any) {
            logger.error('Failed to fetch stats', { 
                userId,
                error: error.message 
            });
            throw error;
        }
    }
}