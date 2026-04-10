export type TicketPriority = "low" | "medium" | "high" | "critical";
export type TicketBillingOrigin = "development" | "support";
export type EstimationStatus = "pending" | "approved" | "rejected" | "adjustment_requested";
export type EstimationDecision = "approved" | "rejected" | "adjustment_requested";

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

export type TicketAssignment = {
  id: string;
  ticketId: string;
  assignedById: string;
  assignedToId: string;
  comment: string | null;
  createdAt: Date;
};

export type CreateTicketAssignmentInput = {
  ticketId: string;
  assignedById: string;
  assignedToId: string;
  comment?: string;
};

export type TicketEstimation = {
  id: string;
  ticketId: string;
  developerId: string;
  estimatedHours: number;
  observation: string | null;
  status: EstimationStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateTicketEstimationInput = {
  ticketId: string;
  developerId: string;
  estimatedHours: number;
  observation?: string;
};

export type TicketEstimationApproval = {
  id: string;
  ticketEstimationId: string;
  approvedById: string;
  decision: EstimationDecision;
  comment: string | null;
  createdAt: Date;
};

export type CreateEstimationDecisionInput = {
  ticketId: string;
  estimationId: string;
  approvedById: string;
  decision: EstimationDecision;
  comment?: string;
};
