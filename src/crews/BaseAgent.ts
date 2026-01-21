import { ChatGroq } from '@langchain/groq';
import { GROQ_API_KEY } from '../config';

export class BaseAgent {
  protected model: ChatGroq;

  constructor(modelName = 'mixtral-8x7b-32768') {
    this.model = new ChatGroq({
      apiKey: GROQ_API_KEY,
      modelName,
      temperature: 0.7,
    });
  }
}
