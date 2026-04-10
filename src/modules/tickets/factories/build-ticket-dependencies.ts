import { AssignTicketUseCase } from "../application/use-cases/assign-ticket.use-case";
import { CreateTicketUseCase } from "../application/use-cases/create-ticket.use-case";
import { CreateTicketEstimationUseCase } from "../application/use-cases/create-ticket-estimation.use-case";
import { DecideTicketEstimationUseCase } from "../application/use-cases/decide-ticket-estimation.use-case";
import { ListTicketsUseCase } from "../application/use-cases/list-tickets.use-case";
import { ReassignTicketUseCase } from "../application/use-cases/reassign-ticket.use-case";
import { PrismaTicketRepository } from "../infrastructure/repositories/prisma-ticket.repository";

const repository = new PrismaTicketRepository();

export const buildTicketDependencies = () => ({
  repository,
  assignTicketUseCase: new AssignTicketUseCase(repository),
  createTicketUseCase: new CreateTicketUseCase(repository),
  createTicketEstimationUseCase: new CreateTicketEstimationUseCase(repository),
  decideTicketEstimationUseCase: new DecideTicketEstimationUseCase(repository),
  listTicketsUseCase: new ListTicketsUseCase(repository),
  reassignTicketUseCase: new ReassignTicketUseCase(repository),
});
