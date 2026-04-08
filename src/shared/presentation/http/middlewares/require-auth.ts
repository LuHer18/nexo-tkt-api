import type { NextFunction, Request, Response } from "express";

import { AppError } from "../../../domain/errors/app-error";
import { verifyAccessToken } from "../../../../modules/auth/domain/auth-token.service";

export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  const authorization = req.header("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return next(new AppError("Token de acceso requerido", 401));
  }

  const token = authorization.replace("Bearer ", "").trim();

  try {
    req.auth = verifyAccessToken(token);
    return next();
  } catch {
    return next(new AppError("Token inválido o expirado", 401));
  }
};
