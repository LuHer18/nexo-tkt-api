import { z } from "zod";

import { paginationQuerySchema } from "../../../../shared/presentation/http/schemas/pagination.schemas";

export const createTicketSchema = z.object({
  companyId: z.uuid(),
  projectId: z.uuid(),
  ticketTypeId: z.uuid(),
  title: z.string().min(1).max(160),
  description: z.string().min(1),
  priority: z.enum(["low", "medium", "high", "critical"]).optional(),
  parentTicketId: z.uuid().optional(),
  billingOrigin: z.enum(["development", "support"]).optional(),
  originTicketId: z.uuid().optional(),
});

export const listTicketsQuerySchema = paginationQuerySchema.extend({
  companyId: z.uuid().optional(),
  projectId: z.uuid().optional(),
  ticketTypeId: z.uuid().optional(),
  statusId: z.uuid().optional(),
  billingOrigin: z.enum(["development", "support"]).optional(),
});

export const assignTicketSchema = z.object({
  assignedToId: z.uuid(),
  comment: z.string().min(1).optional(),
});

export const createTicketEstimationSchema = z.object({
  estimatedHours: z.coerce.number().positive(),
  observation: z.string().min(1).optional(),
});

export const decideTicketEstimationSchema = z.object({
  decision: z.enum(["approved", "rejected", "adjustment_requested"]),
  comment: z.string().min(1).optional(),
});
