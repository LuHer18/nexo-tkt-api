export type ProjectStatus = "active" | "inactive";

export type Project = {
  id: string;
  companyId: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateProjectInput = {
  companyId: string;
  name: string;
  description?: string;
  status?: ProjectStatus;
  createdById: string;
};
