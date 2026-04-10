import { AppError } from "../../../../shared/domain/errors/app-error";
import type { TicketRepository } from "../../domain/ticket.repository";

export class CreateTicketEstimationUseCase {
  constructor(private readonly repository: TicketRepository) {}

  async execute(input: { ticketId: string; developerId: string; estimatedHours: number; observation?: string }) {
    const [ticket, estimatedStatus] = await Promise.all([
      this.repository.findTicketAssignee(input.ticketId),
      this.repository.findStatusByCode("estimated"),
    ]);

    if (!ticket) {
      throw new AppError("El ticket indicado no existe", 404);
    }

    if (!ticket.assignedToId || ticket.assignedToId !== input.developerId) {
      throw new AppError("Solo el desarrollador asignado puede estimar este ticket", 403);
    }

    if (input.estimatedHours <= 0) {
      throw new AppError("Las horas estimadas deben ser mayores a cero", 400);
    }

    const estimation = await this.repository.createEstimation(input);

    if (estimatedStatus) {
      await this.repository.updateTicketAssignment({
        ticketId: input.ticketId,
        assignedToId: input.developerId,
        statusId: estimatedStatus.id,
      });
      await this.repository.createStatusHistory({
        ticketId: input.ticketId,
        oldStatusId: ticket.statusId,
        newStatusId: estimatedStatus.id,
        changedById: input.developerId,
        comment: input.observation,
      });
    }

    return estimation;
  }
}
