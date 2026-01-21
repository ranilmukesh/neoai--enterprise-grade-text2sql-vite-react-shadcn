import { SchemaAnalyzer } from './SchemaAnalyzer';
import type { TableSchema } from './types';

export class CrewManager {
  private schemaAnalyzer: SchemaAnalyzer;

  constructor(schema: TableSchema[], modelName?: string) {
    this.schemaAnalyzer = new SchemaAnalyzer(schema, modelName);
  }

  async processQuery(query: string, modelName?: string): Promise<string> {
    try {
      if (modelName) {
        this.schemaAnalyzer.setModel(modelName);
      }
      return await this.schemaAnalyzer.analyze(query);
    } catch (error) {
      console.error('Error processing query:', error);
      return 'An error occurred while processing your query. Please try again.';
    }
  }
}
