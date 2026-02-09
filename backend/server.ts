import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import { tracerouteRoutes } from "./src/routes/tracerouteRoutes.ts";
import { ensureDatabase } from "./src/database/createDatabase.ts";
import { runMigrations } from "./src/database/migrations.ts";
import { guestUserMiddleware } from "./src/middlewares/guestUserMiddleware.ts";
import { logger } from "./src/utils/logger.ts";
import { setupSwagger } from "./src/config/swagger.ts";

const app = express();

app.use(helmet());


app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10kb' })); 

app.use(cookieParser());


app.use(guestUserMiddleware);

setupSwagger(app)

// Rotas
app.use("/api/traceroute", tracerouteRoutes);


app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ 
    error: "Internal server error",
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

async function startServer() {
  try {
    await ensureDatabase();
    await runMigrations();
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();