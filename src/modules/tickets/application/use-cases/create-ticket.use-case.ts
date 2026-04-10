import { randomUUID } from "crypto";

import { AppError } from "../../../../shared/domain/errors/app-error";
import type { TicketRepository } from "../../domain/ticket.repository";
import type { CreateTicketInput } from "../../domain/ticket.types";

const buildTicketCode = () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = randomUUID().slice(0, 8).toUpperCase();
  return `TKT-${date}-${suffix}`;
};

export class CreateTicketUseCase {
  constructor(private readonly repository: TicketRepository) {}

  async execute(input: CreateTicketInput) {
    if (!input.title.trim()) {
      throw new AppError("El título del ticket es obligatorio", 400);
    }

    if (!input.description.trim()) {
      throw new AppError("La descripción del ticket es obligatoria", 400);
    }

    const [companyExists, projectBelongs, ticketTypeExists, defaultStatus] = await Promise.all([
      this.repository.companyExists(input.companyId),
      this.repository.projectBelongsToCompany(input.projectId, input.companyId),
      this.repository.ticketTypeExists(input.ticketTypeId),
      this.repository.findStatusByCode("new"),
    ]);

    if (!companyExists) {
      throw new AppError("La empresa indicada no existe", 404);
    }

    if (!projectBelongs) {
      throw new AppError("El proyecto no pertenece a la empresa indicada", 400);
    }

    if (!ticketTypeExists) {
      throw new AppError("El tipo de ticket indicado no existe", 404);
    }

    if (!defaultStatus) {
      throw new AppError("No existe el estado inicial de ticket", 500);
    }

    const billingOrigin = input.billingOrigin ?? "development";

    if (billingOrigin === "support") {
      if (!input.originTicketId) {
        throw new AppError("El soporte debe indicar un ticket origen", 400);
      }

      const originTicket = await this.repository.findOriginTicket(input.originTicketId);

      if (!originTicket) {
        throw new AppError("El ticket origen no existe", 404);
      }

      if (!originTicket.conformityApprovedAt) {
        throw new AppError("Solo se puede crear soporte independiente desde un ticket a conformidad", 400);
      }
    }

    return this.repository.create({
      ...input,
      billingOrigin,
      code: buildTicketCode(),
      statusId: defaultStatus.id,
    });
  }
}
