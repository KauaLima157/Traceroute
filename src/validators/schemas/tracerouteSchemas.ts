import { z } from "zod";

export const createTracerouteSchema = z.object({
  target: z.string()
    .min(1, "Target é obrigatório")
    .max(255, "Target muito longo")
    .refine((val) => {
      // Valida se é IP ou hostname válido
      const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
      const hostnameRegex = /^([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i;
      return ipRegex.test(val) || hostnameRegex.test(val);
    }, "Target deve ser um IP ou hostname válido"),
  
  maxHops: z.number()
    .int()
    .min(1, "maxHops deve ser no mínimo 1")
    .max(64, "maxHops deve ser no máximo 64")
    .optional()
    .default(30),
  
  timeout: z.number()
    .int()
    .min(1000, "timeout deve ser no mínimo 1000ms")
    .max(30000, "timeout deve ser no máximo 30000ms")
    .optional()
    .default(5000)
});