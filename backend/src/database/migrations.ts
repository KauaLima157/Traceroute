import { logger } from "../utils/logger.ts";
import { traceRoutePool } from "./connection.js";

export async function runMigrations() {
  await traceRoutePool.query(`
    CREATE TABLE IF NOT EXISTS traceroutes (
      id UUID PRIMARY KEY,
      target VARCHAR(255),
      ip_resolved VARCHAR(45),
      status VARCHAR(20),
      max_hops INT,
      timeout INT,
      started_at TIMESTAMP,
      completed_at TIMESTAMP,
      user_id UUID,
      error_message TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await traceRoutePool.query(`
    CREATE TABLE IF NOT EXISTS hops (
      id UUID PRIMARY KEY,
      traceroute_id UUID REFERENCES traceroutes(id) ON DELETE CASCADE,
      hop_number INT,
      ip_address VARCHAR(45),
      hostname VARCHAR(255),
      latency_ms FLOAT,
      is_timeout BOOLEAN,
      country VARCHAR(100),
      city VARCHAR(100),
      latitude FLOAT,
      longitude FLOAT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  logger.debug("Tables created successfully");
}
