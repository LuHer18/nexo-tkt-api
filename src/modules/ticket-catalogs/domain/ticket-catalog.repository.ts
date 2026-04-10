import type { TicketStatusCatalogItem, TicketTypeCatalogItem } from "./ticket-catalog.types";

export interface TicketCatalogRepository {
  listTypes(): Promise<TicketTypeCatalogItem[]>;
  listStatuses(): Promise<TicketStatusCatalogItem[]>;
}
