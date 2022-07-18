export interface CreateTable {
  name: string;
  columns: any[];
  foreignKeys: any[];
  schema: string;
}

export interface CreateIndex {
  name: string;
  indexName: string;
  columnNames: any[];
}
