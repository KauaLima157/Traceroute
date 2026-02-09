import type { Request, Response, NextFunction } from "express";
import { z } from "zod";

export function validatorMiddleware(schema: z.ZodType<any>) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    error: "Validation failed",
                    details: error.issues
                });
            }
            return res.status(500).json({ error: "Internal validation error" });
        }
    };
}

