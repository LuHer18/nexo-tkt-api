import { Router } from "express";

import { requireAuth } from "../../../../shared/presentation/http/middlewares/require-auth";
import { asyncHandler } from "../../../../shared/presentation/http/middlewares/async-handler";
import { AuthController } from "./auth.controller";

const controller = new AuthController();

export const authRouter = Router();

authRouter.post("/login", asyncHandler((req, res) => controller.login(req, res)));
authRouter.post("/refresh", asyncHandler((req, res) => controller.refresh(req, res)));
authRouter.post("/logout", asyncHandler((req, res) => controller.logout(req, res)));
authRouter.get("/me", requireAuth, asyncHandler((req, res) => controller.me(req, res)));
