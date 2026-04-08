import type { ProjectRepository } from "../../domain/project.repository";
import type { PaginationParams } from "../../../../shared/domain/pagination/pagination.types";

export class ListProjectsUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(params: PaginationParams & { companyId?: string }) {
    return this.projectRepository.list(params);
  }
}
