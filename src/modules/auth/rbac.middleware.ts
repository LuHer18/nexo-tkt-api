import type { NextFunction, Request, Response } from "express";

import { prisma } from "../../lib/prisma";

export const requirePermissions = (...requiredPermissions: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth?.sub) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.auth.sub },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Usuario inválido" });
    }

    const grantedPermissions = new Set(user.role.rolePermissions.map((item) => item.permission.code));
    const hasAllPermissions = requiredPermissions.every((permission) => grantedPermissions.has(permission));

    if (!hasAllPermissions) {
      return res.status(403).json({
        message: "No tienes permisos suficientes",
        requiredPermissions,
      });
    }

    return next();
  };
};
