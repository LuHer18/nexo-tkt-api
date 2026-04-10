import { ListTicketStatusesUseCase } from "../application/use-cases/list-ticket-statuses.use-case";
import { ListTicketTypesUseCase } from "../application/use-cases/list-ticket-types.use-case";
import { PrismaTicketCatalogRepository } from "../infrastructure/repositories/prisma-ticket-catalog.repository";

const repository = new PrismaTicketCatalogRepository();

export const buildTicketCatalogDependencies = () => ({
  repository,
  listTicketTypesUseCase: new ListTicketTypesUseCase(repository),
  listTicketStatusesUseCase: new ListTicketStatusesUseCase(repository),
});
