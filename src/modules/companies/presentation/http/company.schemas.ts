import { z } from "zod";

import { paginationQuerySchema } from "../../../../shared/presentation/http/schemas/pagination.schemas";

export const createCompanySchema = z.object({
  name: z.string().min(1).max(150),
  taxId: z.string().max(100).optional(),
  mainContact: z.string().max(150).optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

export const listCompaniesQuerySchema = paginationQuerySchema;
