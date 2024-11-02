import { SchemaAnalyzer } from './SchemaAnalyzer';
import type { TableSchema } from './types';

export class CrewManager {
  private schemaAnalyzer: SchemaAnalyzer;

  constructor(schema: TableSchema[]) {
    this.schemaAnalyzer = new SchemaAnalyzer(schema);
  }

  async processQuery(query: string): Promise<string> {
    try {
      return await this.schemaAnalyzer.analyze(query);
    } catch (error) {
      console.error('Error processing query:', error);
      return 'An error occurred while processing your query. Please try again.';
    }
  }
}