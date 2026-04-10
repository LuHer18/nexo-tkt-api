import { CreateTicketUseCase } from "../application/use-cases/create-ticket.use-case";
import { ListTicketsUseCase } from "../application/use-cases/list-tickets.use-case";
import { PrismaTicketRepository } from "../infrastructure/repositories/prisma-ticket.repository";

const repository = new PrismaTicketRepository();

export const buildTicketDependencies = () => ({
  repository,
  createTicketUseCase: new CreateTicketUseCase(repository),
  listTicketsUseCase: new ListTicketsUseCase(repository),
});
