import { CreateProjectUseCase } from "../application/use-cases/create-project.use-case";
import { ListProjectsUseCase } from "../application/use-cases/list-projects.use-case";
import { PrismaProjectRepository } from "../infrastructure/repositories/prisma-project.repository";

const projectRepository = new PrismaProjectRepository();

export const buildProjectDependencies = () => ({
  projectRepository,
  createProjectUseCase: new CreateProjectUseCase(projectRepository),
  listProjectsUseCase: new ListProjectsUseCase(projectRepository),
});
