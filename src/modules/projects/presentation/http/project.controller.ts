import type { Request, Response } from "express";

import { buildProjectDependencies } from "../../factories/build-project-dependencies";
import { createProjectSchema, listProjectsQuerySchema } from "./project.schemas";

const { createProjectUseCase, listProjectsUseCase } = buildProjectDependencies();

export class ProjectController {
  async create(req: Request, res: Response) {
    const payload = createProjectSchema.parse(req.body);

    const project = await createProjectUseCase.execute({
      ...payload,
      createdById: req.auth!.sub,
    });

    return res.status(201).json({ project });
  }

  async list(req: Request, res: Response) {
    const query = listProjectsQuerySchema.parse(req.query);
    const result = await listProjectsUseCase.execute(query);
    return res.status(200).json(result);
  }
}
