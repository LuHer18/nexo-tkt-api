import type { Request, Response } from "express";

import { buildCompanyDependencies } from "../../factories/build-company-dependencies";
import { createCompanySchema, listCompaniesQuerySchema } from "./company.schemas";

const { createCompanyUseCase, listCompaniesUseCase } = buildCompanyDependencies();

export class CompanyController {
  async create(req: Request, res: Response) {
    const payload = createCompanySchema.parse(req.body);

    const company = await createCompanyUseCase.execute({
      ...payload,
      createdById: req.auth!.sub,
    });

    return res.status(201).json({ company });
  }

  async list(req: Request, res: Response) {
    const query = listCompaniesQuerySchema.parse(req.query);
    const result = await listCompaniesUseCase.execute(query);
    return res.status(200).json(result);
  }
}
