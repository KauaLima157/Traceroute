import type { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";
import { logger } from "../utils/logger.ts";

declare global {
  namespace Express {
    interface Request {
      guestUserId: string;
    }
  }
}

export function guestUserMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  let guestUserId = req.cookies?.guest_user_id;

  if (!guestUserId) {
    guestUserId = randomUUID();
    
    res.cookie("guest_user_id", guestUserId, {
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 ano em milissegundos
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production", 
      sameSite: "lax" 
    });

    logger.info(`Novo usuário guest criado: ${guestUserId}`);
  }

  req.guestUserId = guestUserId;

  next();
}