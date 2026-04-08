import { prisma } from "../../../../shared/infrastructure/database/prisma/client";
import type { PaginatedResult, PaginationParams } from "../../../../shared/domain/pagination/pagination.types";
import type { ProjectRepository } from "../../domain/project.repository";
import type { CreateProjectInput, Project } from "../../domain/project.types";

const mapProject = (project: {
  id: string;
  companyId: string;
  name: string;
  description: string | null;
  status: "active" | "inactive";
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}): Project => ({
  id: project.id,
  companyId: project.companyId,
  name: project.name,
  description: project.description,
  status: project.status,
  createdById: project.createdById,
  createdAt: project.createdAt,
  updatedAt: project.updatedAt,
});

export class PrismaProjectRepository implements ProjectRepository {
  async create(input: CreateProjectInput): Promise<Project> {
    const project = await prisma.project.create({
      data: {
        companyId: input.companyId,
        name: input.name,
        description: input.description,
        status: input.status ?? "active",
        createdById: input.createdById,
      },
    });

    return mapProject(project);
  }

  async list(params: PaginationParams & { companyId?: string }): Promise<PaginatedResult<Project>> {
    const skip = (params.page - 1) * params.pageSize;
    const where = params.companyId ? { companyId: params.companyId } : undefined;

    const [total, projects] = await prisma.$transaction([
      prisma.project.count({ where }),
      prisma.project.findMany({
        where,
        skip,
        take: params.pageSize,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return {
      data: projects.map(mapProject),
      meta: {
        page: params.page,
        pageSize: params.pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / params.pageSize)),
      },
    };
  }

  async companyExists(companyId: string): Promise<boolean> {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: { id: true },
    });

    return Boolean(company);
  }
}
