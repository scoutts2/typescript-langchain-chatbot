import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";

export default async function handler(req, res) {
  // Handle different HTTP methods
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { question } = req.body;

    // Validate input
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Question is required and must be a string' });
    }

    // Rate limiting: simple check (you can enhance this)
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(`Chat request from IP: ${clientIP}`);

    // Initialize LangChain service with secure API key
    const model = new OpenAI({
      modelName: "gpt-3.5-turbo",
      temperature: 0.7,
      openAIApiKey: process.env.OPENAI_API_KEY, // ← SECURE: Only on server
    });

    // Create prompt template for learning-focused responses
    const template = `You are a helpful assistant teaching TypeScript, React, and LangChain to beginners.
    Please answer this question in a simple, clear, and beginner-friendly way: {question}`;
    
    const prompt = PromptTemplate.fromTemplate(template);
    const formattedPrompt = await prompt.format({
      question: question.trim()
    });

    // Get AI response using simpler API for v0.2.x
    const response = await model.call(formattedPrompt);

    // Log the interaction (for monitoring usage)
    console.log(`Question: "${question.substring(0, 50)}..." | Response length: ${response.length} chars`);

    // Return response
    res.status(200).json({ 
      response: response,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    
    // Handle different types of errors
    if (error.message.includes('API key')) {
      return res.status(500).json({ 
        error: 'AI service configuration error. Please contact support.' 
      });
    }
    
    if (error.message.includes('rate limit')) {
      return res.status(429).json({ 
        error: 'Too many requests. Please try again later.' 
      });
    }

    // Generic error response
    res.status(500).json({ 
      error: 'Something went wrong. Please try again.' 
    });
  }
}
