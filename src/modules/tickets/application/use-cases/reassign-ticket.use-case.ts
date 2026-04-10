import { AppError } from "../../../../shared/domain/errors/app-error";
import type { TicketRepository } from "../../domain/ticket.repository";

export class ReassignTicketUseCase {
  constructor(private readonly repository: TicketRepository) {}

  async execute(input: { ticketId: string; assignedById: string; assignedToId: string; comment?: string }) {
    const [ticket, developer, assignedStatus] = await Promise.all([
      this.repository.findTicketAssignee(input.ticketId),
      this.repository.findUserRole(input.assignedToId),
      this.repository.findStatusByCode("assigned"),
    ]);

    if (!ticket) {
      throw new AppError("El ticket indicado no existe", 404);
    }

    if (!ticket.assignedToId) {
      throw new AppError("El ticket aún no tiene un desarrollador asignado", 400);
    }

    if (ticket.assignedToId === input.assignedToId) {
      throw new AppError("El ticket ya está asignado a ese desarrollador", 400);
    }

    if (!developer || !developer.isActive || developer.role !== "developer") {
      throw new AppError("Solo se puede reasignar a un desarrollador activo", 400);
    }

    if (!assignedStatus) {
      throw new AppError("No existe el estado asignado", 500);
    }

    const assignment = await this.repository.createAssignment(input);
    await this.repository.updateTicketAssignment({
      ticketId: input.ticketId,
      assignedToId: input.assignedToId,
      statusId: assignedStatus.id,
    });
    await this.repository.createStatusHistory({
      ticketId: input.ticketId,
      oldStatusId: ticket.statusId,
      newStatusId: assignedStatus.id,
      changedById: input.assignedById,
      comment: input.comment,
    });

    return assignment;
  }
}
