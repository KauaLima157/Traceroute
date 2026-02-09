import pg from "pg";
import { dbConfig } from "../config/dbConfig.ts";
import { logger } from "../utils/logger.ts";

export async function ensureDatabase() {
  const adminPool = new pg.Pool({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    database: "postgres" 
  });

  try {
    const res = await adminPool.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbConfig.database]
    );

    if (res.rowCount === 0) {
      logger.info("Database not found. Creating…");

      const safeName = dbConfig.database.replace(/[^a-z0-9_]/gi, '');
      if (safeName !== dbConfig.database) {
        throw new Error('Invalid database name');
      }

      await adminPool.query(`CREATE DATABASE "${safeName}"`);
      logger.info("Database created successfully!");
    } else {
      logger.info("Database already exists.");
    }
  } catch (error) {
    logger.error('Error ensuring database:', error);
    throw error;
  } finally {
    await adminPool.end();
  }
}