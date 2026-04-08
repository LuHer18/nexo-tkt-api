import { AppError } from "../../../../shared/domain/errors/app-error";
import type { ProjectRepository } from "../../domain/project.repository";
import type { CreateProjectInput } from "../../domain/project.types";

export class CreateProjectUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(input: CreateProjectInput) {
    if (!input.name.trim()) {
      throw new AppError("El nombre del proyecto es obligatorio", 400);
    }

    const companyExists = await this.projectRepository.companyExists(input.companyId);

    if (!companyExists) {
      throw new AppError("La empresa indicada no existe", 404);
    }

    return this.projectRepository.create(input);
  }
}
