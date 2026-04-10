import { Router } from "express";

import { requireAuth } from "../../../../shared/presentation/http/middlewares/require-auth";
import { requirePermissions } from "../../../../shared/presentation/http/middlewares/require-permissions";
import { asyncHandler } from "../../../../shared/presentation/http/middlewares/async-handler";
import { TicketController } from "./ticket.controller";

const controller = new TicketController();

export const ticketRouter = Router();

ticketRouter.get("/", requireAuth, asyncHandler((req, res) => controller.list(req, res)));
ticketRouter.post("/", requireAuth, requirePermissions("ticket.create"), asyncHandler((req, res) => controller.create(req, res)));
ticketRouter.post(
  "/:ticketId/assign",
  requireAuth,
  requirePermissions("ticket.assign"),
  asyncHandler((req, res) => controller.assign(req, res)),
);
ticketRouter.post(
  "/:ticketId/reassign",
  requireAuth,
  requirePermissions("ticket.reassign"),
  asyncHandler((req, res) => controller.reassign(req, res)),
);
ticketRouter.post(
  "/:ticketId/estimations",
  requireAuth,
  asyncHandler((req, res) => controller.createEstimation(req, res)),
);
ticketRouter.post(
  "/:ticketId/estimations/:estimationId/decision",
  requireAuth,
  requirePermissions("ticket.estimation.approve"),
  asyncHandler((req, res) => controller.decideEstimation(req, res)),
);
