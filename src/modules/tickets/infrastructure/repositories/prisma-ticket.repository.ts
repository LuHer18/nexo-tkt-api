import { prisma } from "../../../../shared/infrastructure/database/prisma/client";
import type { PaginatedResult, PaginationParams } from "../../../../shared/domain/pagination/pagination.types";
import type { OriginTicketLookup, TicketAssigneeLookup, TicketEstimationLookup, TicketRepository, TicketStatusLookup, UserRoleLookup } from "../../domain/ticket.repository";
import type { CreateEstimationDecisionInput, CreateTicketAssignmentInput, CreateTicketEstimationInput, CreateTicketInput, Ticket, TicketAssignment, TicketEstimation, TicketEstimationApproval } from "../../domain/ticket.types";

const mapTicket = (ticket: {
  id: string;
  code: string;
  companyId: string;
  projectId: string;
  ticketTypeId: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "critical";
  statusId: string;
  createdById: string;
  assignedToId: string | null;
  currentIteration: number;
  parentTicketId: string | null;
  conformityApprovedAt: Date | null;
  conformityApprovedById: string | null;
  billingOrigin: "development" | "support";
  originTicketId: string | null;
  createdAt: Date;
  updatedAt: Date;
  closedAt: Date | null;
  ticketType: { code: string; name: string };
  status: { code: string; name: string };
}): Ticket => ({
  id: ticket.id,
  code: ticket.code,
  companyId: ticket.companyId,
  projectId: ticket.projectId,
  ticketTypeId: ticket.ticketTypeId,
  ticketTypeCode: ticket.ticketType.code,
  ticketTypeName: ticket.ticketType.name,
  title: ticket.title,
  description: ticket.description,
  priority: ticket.priority,
  statusId: ticket.statusId,
  statusCode: ticket.status.code,
  statusName: ticket.status.name,
  createdById: ticket.createdById,
  assignedToId: ticket.assignedToId,
  currentIteration: ticket.currentIteration,
  parentTicketId: ticket.parentTicketId,
  conformityApprovedAt: ticket.conformityApprovedAt,
  conformityApprovedById: ticket.conformityApprovedById,
  billingOrigin: ticket.billingOrigin,
  originTicketId: ticket.originTicketId,
  createdAt: ticket.createdAt,
  updatedAt: ticket.updatedAt,
  closedAt: ticket.closedAt,
});

const mapAssignment = (assignment: {
  id: string;
  ticketId: string;
  assignedById: string;
  assignedToId: string;
  comment: string | null;
  createdAt: Date;
}): TicketAssignment => ({
  id: assignment.id,
  ticketId: assignment.ticketId,
  assignedById: assignment.assignedById,
  assignedToId: assignment.assignedToId,
  comment: assignment.comment,
  createdAt: assignment.createdAt,
});

const mapEstimation = (estimation: {
  id: string;
  ticketId: string;
  developerId: string;
  estimatedHours: { toNumber(): number };
  observation: string | null;
  status: "pending" | "approved" | "rejected" | "adjustment_requested";
  createdAt: Date;
  updatedAt: Date;
}): TicketEstimation => ({
  id: estimation.id,
  ticketId: estimation.ticketId,
  developerId: estimation.developerId,
  estimatedHours: estimation.estimatedHours.toNumber(),
  observation: estimation.observation,
  status: estimation.status,
  createdAt: estimation.createdAt,
  updatedAt: estimation.updatedAt,
});

const mapEstimationApproval = (approval: {
  id: string;
  ticketEstimationId: string;
  approvedById: string;
  decision: "approved" | "rejected" | "adjustment_requested";
  comment: string | null;
  createdAt: Date;
}): TicketEstimationApproval => ({
  id: approval.id,
  ticketEstimationId: approval.ticketEstimationId,
  approvedById: approval.approvedById,
  decision: approval.decision,
  comment: approval.comment,
  createdAt: approval.createdAt,
});

export class PrismaTicketRepository implements TicketRepository {
  async create(input: CreateTicketInput & { code: string; statusId: string }): Promise<Ticket> {
    const ticket = await prisma.ticket.create({
      data: {
        code: input.code,
        companyId: input.companyId,
        projectId: input.projectId,
        ticketTypeId: input.ticketTypeId,
        title: input.title,
        description: input.description,
        priority: input.priority ?? "medium",
        statusId: input.statusId,
        createdById: input.createdById,
        parentTicketId: input.parentTicketId,
        billingOrigin: input.billingOrigin ?? "development",
        originTicketId: input.originTicketId,
      },
      include: {
        ticketType: { select: { code: true, name: true } },
        status: { select: { code: true, name: true } },
      },
    });

    return mapTicket(ticket);
  }

  async list(
    params: PaginationParams & {
      companyId?: string;
      projectId?: string;
      ticketTypeId?: string;
      statusId?: string;
      billingOrigin?: "development" | "support";
    },
  ): Promise<PaginatedResult<Ticket>> {
    const skip = (params.page - 1) * params.pageSize;
    const where = {
      companyId: params.companyId,
      projectId: params.projectId,
      ticketTypeId: params.ticketTypeId,
      statusId: params.statusId,
      billingOrigin: params.billingOrigin,
    };

    const [total, tickets] = await prisma.$transaction([
      prisma.ticket.count({ where }),
      prisma.ticket.findMany({
        where,
        skip,
        take: params.pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          ticketType: { select: { code: true, name: true } },
          status: { select: { code: true, name: true } },
        },
      }),
    ]);

    return {
      data: tickets.map(mapTicket),
      meta: {
        page: params.page,
        pageSize: params.pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / params.pageSize)),
      },
    };
  }

  async companyExists(companyId: string): Promise<boolean> {
    const company = await prisma.company.findUnique({ where: { id: companyId }, select: { id: true } });
    return Boolean(company);
  }

  async projectBelongsToCompany(projectId: string, companyId: string): Promise<boolean> {
    const project = await prisma.project.findFirst({
      where: { id: projectId, companyId },
      select: { id: true },
    });

    return Boolean(project);
  }

  async ticketTypeExists(ticketTypeId: string): Promise<boolean> {
    const ticketType = await prisma.ticketType.findUnique({ where: { id: ticketTypeId }, select: { id: true } });
    return Boolean(ticketType);
  }

  async findStatusByCode(code: string): Promise<TicketStatusLookup | null> {
    return prisma.ticketStatus.findUnique({
      where: { code },
      select: { id: true, code: true, name: true },
    });
  }

  async findOriginTicket(ticketId: string): Promise<OriginTicketLookup | null> {
    return prisma.ticket.findUnique({
      where: { id: ticketId },
      select: { id: true, conformityApprovedAt: true },
    });
  }

  async findTicketAssignee(ticketId: string): Promise<TicketAssigneeLookup | null> {
    return prisma.ticket.findUnique({
      where: { id: ticketId },
      select: { id: true, assignedToId: true, statusId: true },
    });
  }

  async findUserRole(userId: string): Promise<UserRoleLookup | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        isActive: true,
        role: { select: { name: true } },
      },
    });

    if (!user) return null;

    return {
      id: user.id,
      isActive: user.isActive,
      role: user.role.name,
    };
  }

  async createAssignment(input: CreateTicketAssignmentInput): Promise<TicketAssignment> {
    const assignment = await prisma.ticketAssignment.create({
      data: {
        ticketId: input.ticketId,
        assignedById: input.assignedById,
        assignedToId: input.assignedToId,
        comment: input.comment,
      },
    });

    return mapAssignment(assignment);
  }

  async updateTicketAssignment(input: { ticketId: string; assignedToId: string; statusId?: string }): Promise<void> {
    await prisma.ticket.update({
      where: { id: input.ticketId },
      data: {
        assignedToId: input.assignedToId,
        statusId: input.statusId,
      },
    });
  }

  async createStatusHistory(input: { ticketId: string; oldStatusId?: string | null; newStatusId: string; changedById: string; comment?: string }): Promise<void> {
    await prisma.ticketStatusHistory.create({
      data: {
        ticketId: input.ticketId,
        oldStatusId: input.oldStatusId,
        newStatusId: input.newStatusId,
        changedById: input.changedById,
        comment: input.comment,
      },
    });
  }

  async createEstimation(input: CreateTicketEstimationInput): Promise<TicketEstimation> {
    const estimation = await prisma.ticketEstimation.create({
      data: {
        ticketId: input.ticketId,
        developerId: input.developerId,
        estimatedHours: input.estimatedHours,
        observation: input.observation,
      },
    });

    return mapEstimation(estimation);
  }

  async findEstimationById(estimationId: string): Promise<TicketEstimationLookup | null> {
    return prisma.ticketEstimation.findUnique({
      where: { id: estimationId },
      select: { id: true, ticketId: true, developerId: true, status: true },
    });
  }

  async createEstimationDecision(input: CreateEstimationDecisionInput): Promise<TicketEstimationApproval> {
    const approval = await prisma.ticketEstimationApproval.create({
      data: {
        ticketEstimationId: input.estimationId,
        approvedById: input.approvedById,
        decision: input.decision,
        comment: input.comment,
      },
    });

    return mapEstimationApproval(approval);
  }

  async updateEstimationStatus(input: { estimationId: string; status: "pending" | "approved" | "rejected" | "adjustment_requested" }): Promise<void> {
    await prisma.ticketEstimation.update({
      where: { id: input.estimationId },
      data: { status: input.status },
    });
  }
}
