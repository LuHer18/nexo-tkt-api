export type CompanyStatus = "active" | "inactive";

export type Company = {
  id: string;
  name: string;
  taxId: string | null;
  mainContact: string | null;
  status: CompanyStatus;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateCompanyInput = {
  name: string;
  taxId?: string;
  mainContact?: string;
  status?: CompanyStatus;
  createdById: string;
};
