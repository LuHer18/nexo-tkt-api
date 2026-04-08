import { Router } from "express";

import { requireAuth } from "../../../../shared/presentation/http/middlewares/require-auth";
import { requirePermissions } from "../../../../shared/presentation/http/middlewares/require-permissions";

export const permissionsRouter = Router();

permissionsRouter.get("/check", requireAuth, requirePermissions("ticket.report.view"), (_req, res) => {
  return res.status(200).json({ message: "Permiso concedido" });
});
