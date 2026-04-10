import type { Request, Response } from "express";

import { buildTicketDependencies } from "../../factories/build-ticket-dependencies";
import {
  assignTicketSchema,
  createTicketEstimationSchema,
  createTicketSchema,
  decideTicketEstimationSchema,
  listTicketsQuerySchema,
} from "./ticket.schemas";

const {
  assignTicketUseCase,
  createTicketUseCase,
  createTicketEstimationUseCase,
  decideTicketEstimationUseCase,
  listTicketsUseCase,
  reassignTicketUseCase,
} = buildTicketDependencies();

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

  async assign(req: Request, res: Response) {
    const { ticketId } = req.params as { ticketId: string };
    const payload = assignTicketSchema.parse(req.body);

    const assignment = await assignTicketUseCase.execute({
      ticketId,
      assignedById: req.auth!.sub,
      assignedToId: payload.assignedToId,
      comment: payload.comment,
    });

    return res.status(201).json({ assignment });
  }

  async reassign(req: Request, res: Response) {
    const { ticketId } = req.params as { ticketId: string };
    const payload = assignTicketSchema.parse(req.body);

    const assignment = await reassignTicketUseCase.execute({
      ticketId,
      assignedById: req.auth!.sub,
      assignedToId: payload.assignedToId,
      comment: payload.comment,
    });

    return res.status(201).json({ assignment });
  }

  async createEstimation(req: Request, res: Response) {
    const { ticketId } = req.params as { ticketId: string };
    const payload = createTicketEstimationSchema.parse(req.body);

    const estimation = await createTicketEstimationUseCase.execute({
      ticketId,
      developerId: req.auth!.sub,
      estimatedHours: payload.estimatedHours,
      observation: payload.observation,
    });

    return res.status(201).json({ estimation });
  }

  async decideEstimation(req: Request, res: Response) {
    const { ticketId, estimationId } = req.params as { ticketId: string; estimationId: string };
    const payload = decideTicketEstimationSchema.parse(req.body);

    const approval = await decideTicketEstimationUseCase.execute({
      ticketId,
      estimationId,
      approvedById: req.auth!.sub,
      decision: payload.decision,
      comment: payload.comment,
    });

    return res.status(201).json({ approval });
  }
}
