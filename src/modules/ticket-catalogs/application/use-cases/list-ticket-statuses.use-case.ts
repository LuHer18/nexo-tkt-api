import type { TicketCatalogRepository } from "../../domain/ticket-catalog.repository";

export class ListTicketStatusesUseCase {
  constructor(private readonly repository: TicketCatalogRepository) {}

  async execute() {
    return this.repository.listStatuses();
  }
}
