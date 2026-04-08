import "dotenv/config";

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "../shared/config/env";
import { apiRouter } from "../shared/presentation/http/routes";

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: true, credentials: true }) as express.RequestHandler);
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(cookieParser());

  app.get("/", (_req, res) => {
    res.json({
      service: "nexo-tkt-api",
      status: "running",
      environment: env.NODE_ENV,
      architecture: "clean-architecture",
    });
  });

  app.use("/api", apiRouter);

  return app;
};
