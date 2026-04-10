import type { Request, Response } from "express";

import { buildTicketDependencies } from "../../factories/build-ticket-dependencies";
import { createTicketSchema, listTicketsQuerySchema } from "./ticket.schemas";

const { createTicketUseCase, listTicketsUseCase } = buildTicketDependencies();

export class TicketController {
  async create(req: Request, res: Response) {
    const payload = createTicketSchema.parse(req.body);

    const ticket = await createTicketUseCase.execute({
      ...payload,
      createdById: req.auth!.sub,
    });

    return res.status(201).json({ ticket });
  }

  async list(req: Request, res: Response) {
    const query = listTicketsQuerySchema.parse(req.query);
    const result = await listTicketsUseCase.execute(query);
    return res.status(200).json(result);
  }
}
