import type { PaginatedResult, PaginationParams } from "../../../../shared/domain/pagination/pagination.types";
import type { TicketRepository } from "../../domain/ticket.repository";
import type { Ticket } from "../../domain/ticket.types";

type ListTicketsParams = PaginationParams & {
  companyId?: string;
  projectId?: string;
  ticketTypeId?: string;
  statusId?: string;
  billingOrigin?: "development" | "support";
};

export class ListTicketsUseCase {
  constructor(private readonly repository: TicketRepository) {}

  async execute(params: ListTicketsParams): Promise<PaginatedResult<Ticket>> {
    return this.repository.list(params);
  }
}
