import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import { AppError } from "../../../domain/errors/app-error";

export const errorHandler = (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Payload inválido",
      issues: error.issues,
    });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  return res.status(500).json({ message: "Error interno del servidor" });
};
