import type { TicketCatalogRepository } from "../../domain/ticket-catalog.repository";

export class ListTicketTypesUseCase {
  constructor(private readonly repository: TicketCatalogRepository) {}

  async execute() {
    return this.repository.listTypes();
  }
}
