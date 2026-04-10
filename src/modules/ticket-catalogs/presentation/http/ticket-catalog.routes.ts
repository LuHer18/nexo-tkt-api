import { Router } from "express";

import { requireAuth } from "../../../../shared/presentation/http/middlewares/require-auth";
import { asyncHandler } from "../../../../shared/presentation/http/middlewares/async-handler";
import { TicketCatalogController } from "./ticket-catalog.controller";

const controller = new TicketCatalogController();

export const ticketCatalogRouter = Router();

ticketCatalogRouter.get("/types", requireAuth, asyncHandler((req, res) => controller.listTypes(req, res)));
ticketCatalogRouter.get("/statuses", requireAuth, asyncHandler((req, res) => controller.listStatuses(req, res)));
