import { prisma } from "../../../../shared/infrastructure/database/prisma/client";
import type { TicketCatalogRepository } from "../../domain/ticket-catalog.repository";

export class PrismaTicketCatalogRepository implements TicketCatalogRepository {
  async listTypes() {
    return prisma.ticketType.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        code: true,
        name: true,
        requiresDiagnosis: true,
        requiresSolution: true,
        requiresFeaturesLog: true,
      },
    });
  }

  async listStatuses() {
    return prisma.ticketStatus.findMany({
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        code: true,
        name: true,
      },
    });
  }
}
