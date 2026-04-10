import { Router } from "express";

import { requireAuth } from "../../../../shared/presentation/http/middlewares/require-auth";
import { requirePermissions } from "../../../../shared/presentation/http/middlewares/require-permissions";
import { asyncHandler } from "../../../../shared/presentation/http/middlewares/async-handler";
import { TicketController } from "./ticket.controller";

const controller = new TicketController();

export const ticketRouter = Router();

ticketRouter.get("/", requireAuth, asyncHandler((req, res) => controller.list(req, res)));
ticketRouter.post("/", requireAuth, requirePermissions("ticket.create"), asyncHandler((req, res) => controller.create(req, res)));
