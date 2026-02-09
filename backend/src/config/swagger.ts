import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import type { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Traceroute API',
      version: '1.0.0',
      description: 'API para execução e gerenciamento de traceroutes',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Traceroute: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            target: { type: 'string' },
            ipResolved: { type: 'string', nullable: true },
            status: { type: 'string', enum: ['pending', 'processing', 'completed', 'failed'] },
            maxHops: { type: 'integer' },
            timeout: { type: 'integer' },
            startedAt: { type: 'string', format: 'date-time' },
            completedAt: { type: 'string', format: 'date-time', nullable: true },
            userId: { type: 'string', format: 'uuid' },
            errorMessage: { type: 'string', nullable: true },
          },
        },
        Hop: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            tracerouteId: { type: 'string', format: 'uuid' },
            hopNumber: { type: 'integer' },
            ipAddress: { type: 'string', nullable: true },
            hostname: { type: 'string', nullable: true },
            latencyMs: { type: 'number', nullable: true },
            isTimeout: { type: 'boolean' },
            country: { type: 'string', nullable: true },
            city: { type: 'string', nullable: true },
            latitude: { type: 'number', nullable: true },
            longitude: { type: 'number', nullable: true },
          },
        },
        CreateTracerouteRequest: {
          type: 'object',
          required: ['target'],
          properties: {
            target: { 
              type: 'string',
              description: 'IP address or hostname to traceroute',
              example: '8.8.8.8'
            },
            maxHops: { 
              type: 'integer',
              minimum: 1,
              maximum: 64,
              default: 30,
              description: 'Maximum number of hops'
            },
            timeout: { 
              type: 'integer',
              minimum: 1000,
              maximum: 30000,
              default: 5000,
              description: 'Timeout in milliseconds'
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            details: { type: 'array', items: { type: 'object' } },
          },
        },
      },
    },
    tags: [
      {
        name: 'Traceroute',
        description: 'Operações relacionadas a traceroute',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Traceroute API Docs',
  }));
  
  // JSON endpoint
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
}