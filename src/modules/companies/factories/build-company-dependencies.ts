import { CreateCompanyUseCase } from "../application/use-cases/create-company.use-case";
import { ListCompaniesUseCase } from "../application/use-cases/list-companies.use-case";
import { PrismaCompanyRepository } from "../infrastructure/repositories/prisma-company.repository";

const companyRepository = new PrismaCompanyRepository();

export const buildCompanyDependencies = () => ({
  companyRepository,
  createCompanyUseCase: new CreateCompanyUseCase(companyRepository),
  listCompaniesUseCase: new ListCompaniesUseCase(companyRepository),
});
