import type { NextFunction, Request, Response } from "express";

import { AppError } from "../../../domain/errors/app-error";
import { buildAuthDependencies } from "../../../../modules/auth/factories/build-auth-dependencies";

const { userReader } = buildAuthDependencies();

export const requirePermissions = (...requiredPermissions: string[]) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth?.sub) {
      return next(new AppError("Usuario no autenticado", 401));
    }

    try {
      const user = await userReader.getById(req.auth.sub);

      if (!user) {
        return next(new AppError("Usuario inválido", 401));
      }

      const grantedPermissions = new Set(user.permissions);
      const hasAllPermissions = requiredPermissions.every((permission) => grantedPermissions.has(permission));

      if (!hasAllPermissions) {
        return next(new AppError("No tienes permisos suficientes", 403));
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
};
