export type TicketPriority = "low" | "medium" | "high" | "critical";
export type TicketBillingOrigin = "development" | "support";

export type Ticket = {
  id: string;
  code: string;
  companyId: string;
  projectId: string;
  ticketTypeId: string;
  ticketTypeCode: string;
  ticketTypeName: string;
  title: string;
  description: string;
  priority: TicketPriority;
  statusId: string;
  statusCode: string;
  statusName: string;
  createdById: string;
  assignedToId: string | null;
  currentIteration: number;
  parentTicketId: string | null;
  conformityApprovedAt: Date | null;
  conformityApprovedById: string | null;
  billingOrigin: TicketBillingOrigin;
  originTicketId: string | null;
  createdAt: Date;
  updatedAt: Date;
  closedAt: Date | null;
};

export type CreateTicketInput = {
  companyId: string;
  projectId: string;
  ticketTypeId: string;
  title: string;
  description: string;
  priority?: TicketPriority;
  parentTicketId?: string;
  billingOrigin?: TicketBillingOrigin;
  originTicketId?: string;
  createdById: string;
};
