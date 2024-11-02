import { BaseAgent } from './BaseAgent';
import type { SchemaNode, TableSchema, Table } from './types';

export class SchemaAnalyzer extends BaseAgent {
  private schemaTree: SchemaNode;

  constructor(schema: TableSchema[]) {
    super();
    this.schemaTree = this.buildSchemaTree(schema);
  }

  private buildSchemaTree(schema: TableSchema[]): SchemaNode {
    if (!schema?.[0]?.tables) {
      throw new Error('Invalid schema structure');
    }

    const tables = schema[0].tables;
    const coreTables = ['users', 'products', 'orders'];
    const tree: SchemaNode[] = [];

    for (const coreTable of coreTables) {
      const node = this.buildTableNode(tables, coreTable);
      if (node) tree.push(node);
    }

    return {
      tableName: 'root',
      fields: [],
      relationships: [],
      children: tree,
    };
  }

  private buildTableNode(tables: Table[], tableName: string, visited = new Set<string>()): SchemaNode | null {
    if (visited.has(tableName)) return null;
    visited.add(tableName);

    const table = tables.find((t) => t.table_name === tableName);
    if (!table) return null;

    const children: SchemaNode[] = [];
    for (const rel of table.relationships) {
      if (!visited.has(rel.referenced_table)) {
        const childNode = this.buildTableNode(tables, rel.referenced_table, visited);
        if (childNode) children.push(childNode);
      }
    }

    return {
      tableName,
      fields: table.fields,
      relationships: table.relationships,
      children,
    };
  }

  async analyze(query: string): Promise<string> {
    const relevantTables = this.findRelevantTables(query);
    const tableDetails = this.getTableDetails(relevantTables);
    
    const systemPrompt = `You are a PostgreSQL expert tasked with analyzing database queries.

Given the following context:
1. User Query: "${query}"
2. Available Tables: ${JSON.stringify(tableDetails, null, 2)}

Your task is to:
1. Identify the most relevant tables and their relationships
2. Consider only the fields that exist in the schema
3. Analyze query requirements and data access patterns
4. Suggest optimal table joins and conditions
5. Consider performance implications

Rules:
1. Never reference non-existent tables or fields
2. Prioritize direct relationships over complex joins
3. Consider data types and constraints
4. Suggest indexes or optimizations if relevant
5. Flag potential security or access concerns
6. Identify any ambiguous parts requiring clarification

Response format:
{
  "analysis": "Detailed analysis of how to approach the query",
  "tables": ["List of relevant tables"],
  "fields": ["List of relevant fields"],
  "joins": ["Required joins"],
  "conditions": ["Required conditions"],
  "security_concerns": ["Any security considerations"],
  "clarification_needed": boolean,
  "clarification_questions": ["Questions if needed"]
}`;

    const response = await this.model.invoke(systemPrompt);
    return response.content;
  }

  private findRelevantTables(query: string): string[] {
    const tables = new Set<string>();
    this.traverseTree(this.schemaTree, (node) => {
      if (this.isTableRelevant(node, query)) {
        tables.add(node.tableName);
      }
    });
    return Array.from(tables);
  }

  private getTableDetails(tableNames: string[]): any[] {
    return tableNames.map(tableName => {
      const node = this.findNode(this.schemaTree, tableName);
      return node ? {
        name: node.tableName,
        fields: node.fields,
        relationships: node.relationships
      } : null;
    }).filter(Boolean);
  }

  private findNode(node: SchemaNode, tableName: string): SchemaNode | null {
    if (node.tableName === tableName) return node;
    for (const child of node.children || []) {
      const found = this.findNode(child, tableName);
      if (found) return found;
    }
    return null;
  }

  private traverseTree(node: SchemaNode, callback: (node: SchemaNode) => void) {
    callback(node);
    node.children?.forEach(child => this.traverseTree(child, callback));
  }

  private isTableRelevant(node: SchemaNode, query: string): boolean {
    if (node.tableName === 'root') return false;
    const queryTerms = query.toLowerCase().split(' ');
    const tableTerms = node.tableName.toLowerCase().split('_');
    return queryTerms.some(term => 
      tableTerms.includes(term) || 
      node.fields.some(field => field.name.toLowerCase().includes(term))
    );
  }
}