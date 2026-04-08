import { Router } from "express";

import { requireAuth } from "../../../../shared/presentation/http/middlewares/require-auth";
import { requirePermissions } from "../../../../shared/presentation/http/middlewares/require-permissions";
import { asyncHandler } from "../../../../shared/presentation/http/middlewares/async-handler";
import { CompanyController } from "./company.controller";

const controller = new CompanyController();

export const companyRouter = Router();

companyRouter.get("/", requireAuth, asyncHandler((req, res) => controller.list(req, res)));
companyRouter.post(
  "/",
  requireAuth,
  requirePermissions("company.create"),
  asyncHandler((req, res) => controller.create(req, res)),
);
