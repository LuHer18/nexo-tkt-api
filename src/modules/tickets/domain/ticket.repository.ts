import type { PaginatedResult, PaginationParams } from "../../../shared/domain/pagination/pagination.types";
import type { CreateTicketInput, Ticket } from "./ticket.types";

export type TicketStatusLookup = {
  id: string;
  code: string;
  name: string;
};

export type OriginTicketLookup = {
  id: string;
  conformityApprovedAt: Date | null;
};

export interface TicketRepository {
  create(input: CreateTicketInput & { code: string; statusId: string }): Promise<Ticket>;
  list(
    params: PaginationParams & {
      companyId?: string;
      projectId?: string;
      ticketTypeId?: string;
      statusId?: string;
      billingOrigin?: "development" | "support";
    },
  ): Promise<PaginatedResult<Ticket>>;
  companyExists(companyId: string): Promise<boolean>;
  projectBelongsToCompany(projectId: string, companyId: string): Promise<boolean>;
  ticketTypeExists(ticketTypeId: string): Promise<boolean>;
  findStatusByCode(code: string): Promise<TicketStatusLookup | null>;
  findOriginTicket(ticketId: string): Promise<OriginTicketLookup | null>;
}
