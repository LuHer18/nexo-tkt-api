import type { PaginatedResult, PaginationParams } from "../../../shared/domain/pagination/pagination.types";
import type {
  CreateEstimationDecisionInput,
  CreateTicketAssignmentInput,
  CreateTicketEstimationInput,
  CreateTicketInput,
  Ticket,
  TicketAssignment,
  TicketEstimation,
  TicketEstimationApproval,
} from "./ticket.types";

export type TicketStatusLookup = {
  id: string;
  code: string;
  name: string;
};

export type OriginTicketLookup = {
  id: string;
  conformityApprovedAt: Date | null;
};

export type TicketAssigneeLookup = {
  id: string;
  assignedToId: string | null;
  statusId: string;
};

export type UserRoleLookup = {
  id: string;
  role: string;
  isActive: boolean;
};

export type TicketEstimationLookup = {
  id: string;
  ticketId: string;
  developerId: string;
  status: "pending" | "approved" | "rejected" | "adjustment_requested";
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
  findTicketAssignee(ticketId: string): Promise<TicketAssigneeLookup | null>;
  findUserRole(userId: string): Promise<UserRoleLookup | null>;
  createAssignment(input: CreateTicketAssignmentInput): Promise<TicketAssignment>;
  updateTicketAssignment(input: { ticketId: string; assignedToId: string; statusId?: string }): Promise<void>;
  createStatusHistory(input: { ticketId: string; oldStatusId?: string | null; newStatusId: string; changedById: string; comment?: string }): Promise<void>;
  createEstimation(input: CreateTicketEstimationInput): Promise<TicketEstimation>;
  findEstimationById(estimationId: string): Promise<TicketEstimationLookup | null>;
  createEstimationDecision(input: CreateEstimationDecisionInput): Promise<TicketEstimationApproval>;
  updateEstimationStatus(input: { estimationId: string; status: "pending" | "approved" | "rejected" | "adjustment_requested" }): Promise<void>;
}
