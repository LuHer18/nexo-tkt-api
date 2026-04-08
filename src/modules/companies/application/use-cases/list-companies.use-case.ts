import type { CompanyRepository } from "../../domain/company.repository";
import type { PaginationParams } from "../../../../shared/domain/pagination/pagination.types";

export class ListCompaniesUseCase {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async execute(params: PaginationParams) {
    return this.companyRepository.list(params);
  }
}
