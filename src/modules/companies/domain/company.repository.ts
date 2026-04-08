import type { Company, CreateCompanyInput } from "./company.types";
import type { PaginatedResult, PaginationParams } from "../../../shared/domain/pagination/pagination.types";

export interface CompanyRepository {
  create(input: CreateCompanyInput): Promise<Company>;
  list(params: PaginationParams): Promise<PaginatedResult<Company>>;
}
