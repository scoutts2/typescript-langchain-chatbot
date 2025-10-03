import OpenAI from 'openai';

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
    
    // Debug: Check if API key is loaded
    console.log('API Key exists:', !!process.env.OPENAI_API_KEY);
    console.log('API Key length:', process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0);

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Create prompt for learning-focused responses
    const prompt = `You are a helpful assistant teaching TypeScript, React, and LangChain to beginners.
    Please answer this question in a simple, clear, and beginner-friendly way: ${question.trim()}`;

    // Get AI response using direct OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const response = completion.choices[0].message.content;

    // Log the interaction (for monitoring usage)
    console.log(`Question: "${question.substring(0, 50)}..." | Response length: ${response.length} chars`);

    // Return response
    res.status(200).json({ 
      response: response,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
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

    // Return the actual error message for debugging
    res.status(500).json({ 
      error: `Backend error: ${error.message}` 
    });
  }
}
