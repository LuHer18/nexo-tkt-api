import { Router } from "express";
import { prisma } from "../lib/prisma";

export const healthRouter = Router();

healthRouter.get("/", async (_req, res) => {
  const dbCheck = await prisma.$queryRaw`SELECT 1`;

  res.json({
    status: "ok",
    database: "connected",
    timestamp: new Date().toISOString(),
    dbCheck,
  });
});
