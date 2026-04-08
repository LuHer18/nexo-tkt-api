import { Router } from "express";

import { authRouter } from "../../../../modules/auth/presentation/http/auth.routes";
import { permissionsRouter } from "../../../../modules/permissions/presentation/http/permissions.routes";
import { errorHandler } from "../middlewares/error-handler";
import { healthRouter } from "./health.routes";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/permissions", permissionsRouter);
apiRouter.use("/health", healthRouter);
apiRouter.use(errorHandler);
