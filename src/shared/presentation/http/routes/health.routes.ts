import { Router } from "express";

import { prisma } from "../../../infrastructure/database/prisma/client";
import { asyncHandler } from "../middlewares/async-handler";

export const healthRouter = Router();

healthRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const dbCheck = await prisma.$queryRaw`SELECT 1`;

    res.json({
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
      dbCheck,
    });
  }),
);
