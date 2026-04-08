import type { CreateProjectInput, Project } from "./project.types";
import type { PaginatedResult, PaginationParams } from "../../../shared/domain/pagination/pagination.types";

export interface ProjectRepository {
  create(input: CreateProjectInput): Promise<Project>;
  list(params: PaginationParams & { companyId?: string }): Promise<PaginatedResult<Project>>;
  companyExists(companyId: string): Promise<boolean>;
}
