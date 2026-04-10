import type { Request, Response } from "express";

import { buildTicketCatalogDependencies } from "../../factories/build-ticket-catalog-dependencies";

const { listTicketTypesUseCase, listTicketStatusesUseCase } = buildTicketCatalogDependencies();

export class TicketCatalogController {
  async listTypes(_req: Request, res: Response) {
    const ticketTypes = await listTicketTypesUseCase.execute();
    return res.status(200).json({ ticketTypes });
  }

  async listStatuses(_req: Request, res: Response) {
    const ticketStatuses = await listTicketStatusesUseCase.execute();
    return res.status(200).json({ ticketStatuses });
  }
}
