import { Router } from "express";

import { requireAuth } from "../auth/auth.middleware";
import { requirePermissions } from "../auth/rbac.middleware";

export const permissionsRouter = Router();

permissionsRouter.get("/check", requireAuth, requirePermissions("ticket.report.view"), (_req, res) => {
  return res.status(200).json({ message: "Permiso concedido" });
});
