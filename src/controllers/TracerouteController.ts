import type { Request, Response } from "express";
import { RunTracerouteUseCase } from "../core/usecases/RunTracerouteUseCase.ts";
import type { ITracerouteRepository } from "../core/interfaces/ITracerouteRepository.ts";

export class TracerouteController {
  constructor(
    private runTracerouteUseCase: RunTracerouteUseCase,
    private tracerouteRepository: ITracerouteRepository
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { target, maxHops, timeout } = req.body;

      if (!target) {
        res.status(400).json({ error: "Target is required" });
        return;
      }

      
      const result = await this.runTracerouteUseCase.execute({
        target,
        maxHops,
        timeout,
        userId: req.guestUserId 
      });

      res.status(202).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if(!id){res.status(403).json({ error: "Id é necessário"}) 
        return}

      const traceroute = await this.tracerouteRepository.getById(id);

      if (!traceroute) {
        res.status(404).json({ error: "Traceroute not found" });
        return;
      }

      if (traceroute.userId !== req.guestUserId) {
        res.status(403).json({ error: "Forbidden: This traceroute belongs to another user" });
        return;
      }

      const hops = await this.tracerouteRepository.getHops(id);

      res.status(200).json({
        ...traceroute,
        hops
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getHistory(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10 } = req.query;

      const history = await this.tracerouteRepository.getHistory(
        req.guestUserId, 
        Number(page),
        Number(limit)
      );

      res.status(200).json({ data: history, page, limit });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if(!id){res.status(403).json({ error: "Id é necessário"}) 
        return}

      const traceroute = await this.tracerouteRepository.getById(id);
      
      if (!traceroute) {
        res.status(404).json({ error: "Traceroute not found" });
        return;
      }

      if (traceroute.userId !== req.guestUserId) {
        res.status(403).json({ error: "Forbidden for this user" });
        return;
      }

      await this.tracerouteRepository.deleteTraceroute(id);

      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.tracerouteRepository.getStats(req.guestUserId);

      res.status(200).json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}