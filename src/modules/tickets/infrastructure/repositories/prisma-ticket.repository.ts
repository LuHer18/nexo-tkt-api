import { prisma } from "../../../../shared/infrastructure/database/prisma/client";
import type { PaginatedResult, PaginationParams } from "../../../../shared/domain/pagination/pagination.types";
import type { OriginTicketLookup, TicketRepository, TicketStatusLookup } from "../../domain/ticket.repository";
import type { CreateTicketInput, Ticket } from "../../domain/ticket.types";

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
}
