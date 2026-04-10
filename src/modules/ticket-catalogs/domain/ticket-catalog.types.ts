export type TicketTypeCatalogItem = {
  id: string;
  code: string;
  name: string;
  requiresDiagnosis: boolean;
  requiresSolution: boolean;
  requiresFeaturesLog: boolean;
};

export type TicketStatusCatalogItem = {
  id: string;
  code: string;
  name: string;
};
