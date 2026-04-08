import { Router } from "express";
import { authRouter } from "../modules/auth/auth.routes";
import { permissionsRouter } from "../modules/permissions/permissions.routes";
import { healthRouter } from "./health.route";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/permissions", permissionsRouter);
apiRouter.use("/health", healthRouter);
