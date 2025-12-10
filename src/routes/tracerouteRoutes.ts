import { Router } from "express";
import { TracerouteController } from "../controllers/TracerouteController.ts";
import { RunTracerouteUseCase } from "../core/usecases/RunTracerouteUseCase.ts";
import { TracerouteService } from "../services/TracerouteService.ts";
import { DNSService } from "../services/DNSService.ts";
import { GeolocationService } from "../services/GeolocationService.ts";
import { TracerouteRepository } from "../repositories/TracerouteRepository.ts";

export const tracerouteRoutes = Router();

const tracerouteService = new TracerouteService();
const dnsService = new DNSService();
const geoService = new GeolocationService();
const repository = new TracerouteRepository();

const runTracerouteUseCase = new RunTracerouteUseCase(
  tracerouteService,
  repository,
  dnsService,
  geoService
);

const controller = new TracerouteController(runTracerouteUseCase, repository);

/**
 * @swagger
 * tags:
 *   name: Traceroute
 *   description: Operações relacionadas a traceroutes
 */

/**
 * @swagger
 * /api/traceroute:
 *   post:
 *     summary: Inicia um novo traceroute
 *     tags: [Traceroute]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTracerouteRequest'
 *     responses:
 *       202:
 *         description: Traceroute iniciado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Traceroute'
 *       400:
 *         description: Target ausente ou inválido
 *       500:
 *         description: Erro interno ao processar o traceroute
 */
tracerouteRoutes.post("/", (req, res) => controller.create(req, res));


/**
 * @swagger
 * /api/traceroute/history:
 *   get:
 *     summary: Retorna histórico de traceroutes do usuário
 *     tags: [Traceroute]
 *     parameters:
 *       - in: query
 *         name: page
 *       - in: query
 *         name: limit
 *     responses:
 *       200:
 *         description: Lista paginada de traceroutes
 *       500:
 *         description: Erro interno
 */
tracerouteRoutes.get("/history", (req, res) => controller.getHistory(req, res));


/**
 * @swagger
 * /api/traceroute/stats:
 *   get:
 *     summary: Retorna estatísticas do usuário sobre traceroutes
 *     tags: [Traceroute]
 *     responses:
 *       200:
 *         description: Estatísticas gerais
 *       500:
 *         description: Erro interno
 */
tracerouteRoutes.get("/stats", (req, res) => controller.getStats(req, res));


/**
 * @swagger
 * /api/traceroute/{id}:
 *   get:
 *     summary: Retorna detalhes de um traceroute específico
 *     tags: [Traceroute]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Detalhes do traceroute
 *       403:
 *         description: Outro usuário
 *       404:
 *         description: Não encontrado
 *       500:
 *         description: Erro interno
 */
tracerouteRoutes.get("/:id", (req, res) =>
  controller.getById(req, res)
);


/**
 * @swagger
 * /api/traceroute/{id}:
 *   delete:
 *     summary: Remove um traceroute
 *     tags: [Traceroute]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Removido com sucesso
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Não encontrado
 *       500:
 *         description: Erro interno
 */
tracerouteRoutes.delete("/:id", (req, res) =>
  controller.delete(req, res)
);
