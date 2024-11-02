import { BaseAgent } from './BaseAgent';
import { SchemaAnalyzer } from './SchemaAnalyzer';

export class QueryProcessor extends BaseAgent {
  private schemaAnalyzer: SchemaAnalyzer;

  constructor(schemaAnalyzer: SchemaAnalyzer) {
    super();
    this.schemaAnalyzer = schemaAnalyzer;
  }

  async processQuery(query: string): Promise<any> {
    const schemaAnalysis = await this.schemaAnalyzer.analyze(query);
    const sqlQuery = await this.generateSQL(query, schemaAnalysis);

    return {
      analysis: schemaAnalysis,
      sql: sqlQuery,
    };
  }

  private async generateSQL(query: string, analysis: any): Promise<string> {
    const prompt = `Based on the analysis: ${analysis}
                   Generate a SQL query that answers: "${query}"
                   Ensure the query is optimized and follows best practices.`;
    
    const response = await this.model.invoke(prompt);
    return response.content;
  }
}