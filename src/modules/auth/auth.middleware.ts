import type { NextFunction, Request, Response } from "express";

import { verifyAccessToken } from "./auth.utils";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token de acceso requerido" });
  }

  const token = authorization.replace("Bearer ", "").trim();

  try {
    req.auth = verifyAccessToken(token);
    return next();
  } catch {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};
