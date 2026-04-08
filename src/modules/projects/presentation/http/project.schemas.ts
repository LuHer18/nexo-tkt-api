import { z } from "zod";

import { paginationQuerySchema } from "../../../../shared/presentation/http/schemas/pagination.schemas";

export const createProjectSchema = z.object({
  companyId: z.uuid(),
  name: z.string().min(1).max(150),
  description: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

export const listProjectsQuerySchema = paginationQuerySchema.extend({
  companyId: z.uuid().optional(),
});
