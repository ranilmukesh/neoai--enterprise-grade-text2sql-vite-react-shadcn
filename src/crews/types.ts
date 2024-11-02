export interface SchemaNode {
  tableName: string;
  fields: Field[];
  relationships: Relationship[];
  children?: SchemaNode[];
}

export interface Field {
  name: string;
  type: string;
  example: string;
  description: string;
}

export interface Relationship {
  column: string;
  referenced_table: string;
  referenced_column: string;
  referenced_schema: string;
}

export interface Table {
  fields: Field[];
  schema: string;
  metrics: any[];
  table_name: string;
  description: string;
  relationships: Relationship[];
}

export interface TableSchema {
  tables: Table[];
  schema_name: string;
}