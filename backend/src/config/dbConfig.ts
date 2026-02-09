import dotenv from 'dotenv';

dotenv.config();

export const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "traceroutes",
  port: parseInt(process.env.DB_PORT || "5432")
};

if (!process.env.DB_PASSWORD && process.env.NODE_ENV === 'production') {
  throw new Error('DB_PASSWORD must be set in production environment');
}


