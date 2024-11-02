import { ChatGroq } from '@langchain/groq';
import { GROQ_API_KEY } from '../config';

export class BaseAgent {
  protected model: ChatGroq;

  constructor() {
    this.model = new ChatGroq({
      apiKey: GROQ_API_KEY,
      modelName: 'mixtral-8x7b-32768',
      temperature: 0.7,
    });
  }
}