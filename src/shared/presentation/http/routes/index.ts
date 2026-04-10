import { Router } from "express";

import { authRouter } from "../../../../modules/auth/presentation/http/auth.routes";
import { companyRouter } from "../../../../modules/companies/presentation/http/company.routes";
import { permissionsRouter } from "../../../../modules/permissions/presentation/http/permissions.routes";
import { projectRouter } from "../../../../modules/projects/presentation/http/project.routes";
import { ticketCatalogRouter } from "../../../../modules/ticket-catalogs/presentation/http/ticket-catalog.routes";
import { ticketRouter } from "../../../../modules/tickets/presentation/http/ticket.routes";
import { errorHandler } from "../middlewares/error-handler";
import { healthRouter } from "./health.routes";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/companies", companyRouter);
apiRouter.use("/permissions", permissionsRouter);
apiRouter.use("/projects", projectRouter);
apiRouter.use("/ticket-catalogs", ticketCatalogRouter);
apiRouter.use("/tickets", ticketRouter);
apiRouter.use("/health", healthRouter);
apiRouter.use(errorHandler);
