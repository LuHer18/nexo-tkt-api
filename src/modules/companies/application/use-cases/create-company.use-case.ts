import { AppError } from "../../../../shared/domain/errors/app-error";
import type { CompanyRepository } from "../../domain/company.repository";
import type { CreateCompanyInput } from "../../domain/company.types";

export class CreateCompanyUseCase {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async execute(input: CreateCompanyInput) {
    if (!input.name.trim()) {
      throw new AppError("El nombre de la empresa es obligatorio", 400);
    }

    return this.companyRepository.create(input);
  }
}
