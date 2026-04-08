import { prisma } from "../../../../shared/infrastructure/database/prisma/client";
import type { PaginatedResult, PaginationParams } from "../../../../shared/domain/pagination/pagination.types";
import type { CompanyRepository } from "../../domain/company.repository";
import type { Company, CreateCompanyInput } from "../../domain/company.types";

const mapCompany = (company: {
  id: string;
  name: string;
  taxId: string | null;
  mainContact: string | null;
  status: "active" | "inactive";
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}): Company => ({
  id: company.id,
  name: company.name,
  taxId: company.taxId,
  mainContact: company.mainContact,
  status: company.status,
  createdById: company.createdById,
  createdAt: company.createdAt,
  updatedAt: company.updatedAt,
});

export class PrismaCompanyRepository implements CompanyRepository {
  async create(input: CreateCompanyInput): Promise<Company> {
    const company = await prisma.company.create({
      data: {
        name: input.name,
        taxId: input.taxId,
        mainContact: input.mainContact,
        status: input.status ?? "active",
        createdById: input.createdById,
      },
    });

    return mapCompany(company);
  }

  async list(params: PaginationParams): Promise<PaginatedResult<Company>> {
    const skip = (params.page - 1) * params.pageSize;

    const [total, companies] = await prisma.$transaction([
      prisma.company.count(),
      prisma.company.findMany({
        skip,
        take: params.pageSize,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return {
      data: companies.map(mapCompany),
      meta: {
        page: params.page,
        pageSize: params.pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / params.pageSize)),
      },
    };
  }
}
