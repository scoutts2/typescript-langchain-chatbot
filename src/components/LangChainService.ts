import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "langchain/prompts";
import { StringOutputParser } from "langchain/output_parsers";

// TypeScript interface for API configuration
interface LangChainConfig {
  apiKey: string;
  modelName: string;
  temperature: number;
}

// LangChain service class with TypeScript types
export class LangChainService {
  private model: ChatOpenAI;
  private chain: any;

  constructor(config: LangChainConfig) {
    // Initialize the model with TypeScript type annotations
    this.model = new ChatOpenAI({
      modelName: config.modelName,
      temperature: config.temperature,
      apiKey: config.apiKey,
    });

    // Create a prompt template
    const template: string = `You are a helpful assistant learning TypeScript and React. 
    Please answer this question in a simple, beginner-friendly way: {question}`;
    
    const prompt: PromptTemplate = PromptTemplate.fromTemplate(template);
    
    // Chain everything together
    const outputParser: StringOutputParser = new StringOutputParser();
    this.chain = prompt.pipe(this.model).pipe(outputParser);
  }

  // Method to get AI response with proper TypeScript types
  async getResponse(question: string): Promise<string> {
    try {
      const response: string = await this.chain.invoke({
        question: question
      });
      return response;
    } catch (error) {
      // TypeScript error handling
      const errorMessage: string = error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`LangChain Error: ${errorMessage}`);
    }
  }
}

// Helper function to create LangChain service instance
export const createLangChainService = (apiKey: string): LangChainService => {
  return new LangChainService({
    apiKey,
    modelName: "gpt .5-turbo",
    temperature: 0.7
  });
};
