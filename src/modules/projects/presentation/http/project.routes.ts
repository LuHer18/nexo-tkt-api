import { Router } from "express";

import { requireAuth } from "../../../../shared/presentation/http/middlewares/require-auth";
import { requirePermissions } from "../../../../shared/presentation/http/middlewares/require-permissions";
import { asyncHandler } from "../../../../shared/presentation/http/middlewares/async-handler";
import { ProjectController } from "./project.controller";

const controller = new ProjectController();

export const projectRouter = Router();

projectRouter.get("/", requireAuth, asyncHandler((req, res) => controller.list(req, res)));
projectRouter.post(
  "/",
  requireAuth,
  requirePermissions("project.create"),
  asyncHandler((req, res) => controller.create(req, res)),
);
