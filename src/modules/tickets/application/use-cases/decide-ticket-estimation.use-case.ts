import { AppError } from "../../../../shared/domain/errors/app-error";
import type { TicketRepository } from "../../domain/ticket.repository";
import type { EstimationDecision } from "../../domain/ticket.types";

const statusCodeByDecision: Record<EstimationDecision, "approved" | "rejected" | "in_estimation"> = {
  approved: "approved",
  rejected: "rejected",
  adjustment_requested: "in_estimation",
};

export class DecideTicketEstimationUseCase {
  constructor(private readonly repository: TicketRepository) {}

  async execute(input: { ticketId: string; estimationId: string; approvedById: string; decision: EstimationDecision; comment?: string }) {
    const [ticket, estimation] = await Promise.all([
      this.repository.findTicketAssignee(input.ticketId),
      this.repository.findEstimationById(input.estimationId),
    ]);

    if (!ticket) {
      throw new AppError("El ticket indicado no existe", 404);
    }

    if (!estimation || estimation.ticketId !== input.ticketId) {
      throw new AppError("La estimación indicada no existe para este ticket", 404);
    }

    if (estimation.status === "approved") {
      throw new AppError("La estimación ya fue aprobada", 400);
    }

    const targetStatus = await this.repository.findStatusByCode(statusCodeByDecision[input.decision]);

    if (!targetStatus) {
      throw new AppError("No existe el estado de ticket requerido para la decisión", 500);
    }

    await this.repository.updateEstimationStatus({
      estimationId: input.estimationId,
      status: input.decision,
    });

    const approval = await this.repository.createEstimationDecision(input);

    await this.repository.updateTicketAssignment({
      ticketId: input.ticketId,
      assignedToId: ticket.assignedToId ?? estimation.developerId,
      statusId: targetStatus.id,
    });

    await this.repository.createStatusHistory({
      ticketId: input.ticketId,
      oldStatusId: ticket.statusId,
      newStatusId: targetStatus.id,
      changedById: input.approvedById,
      comment: input.comment,
    });

    return approval;
  }
}
