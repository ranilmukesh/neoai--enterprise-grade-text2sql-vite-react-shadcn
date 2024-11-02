import { BaseAgent } from './BaseAgent';

export class ResultSynthesizer extends BaseAgent {
  async synthesize(query: string, queryResult: any): Promise<string> {
    const prompt = `Given the query "${query}" and the result ${JSON.stringify(queryResult)},
                   provide a clear and concise summary of the findings.
                   Focus on the most relevant insights and present them in a user-friendly manner.`;
    
    const response = await this.model.invoke(prompt);
    return response.content;
  }
}