import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "langchain/prompts";
import { StringOutputParser } from "langchain/output_parsers";
import pdf from "pdf-parse";

export default async function handler(req, res) {
  // Handle different HTTP methods
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if API key is available
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    // Get the PDF file from the request
    const { pdfData, fileName } = req.body;

    if (!pdfData) {
      return res.status(400).json({ error: 'PDF file is required' });
    }

    // Check base64 data size (roughly 1.33x larger than original file)
    const base64Size = Buffer.byteLength(pdfData, 'utf8');
    const estimatedFileSize = base64Size * 0.75; // Convert base64 to approximate original size
    
    if (estimatedFileSize > 5 * 1024 * 1024) { // 5MB limit
      return res.status(413).json({ 
        error: `File too large! Please upload a PDF smaller than 5MB. Estimated size: ${(estimatedFileSize / 1024 / 1024).toFixed(2)}MB` 
      });
    }

    console.log(`Processing PDF: ${fileName || 'unnamed'} (estimated size: ${(estimatedFileSize / 1024 / 1024).toFixed(2)}MB)`);

    // Convert base64 PDF data to buffer
    const pdfBuffer = Buffer.from(pdfData, 'base64');

    // Extract text from PDF
    const pdfData_extracted = await pdf(pdfBuffer);
    const pdfText = pdfData_extracted.text;

    if (!pdfText || pdfText.trim().length === 0) {
      return res.status(400).json({ error: 'No text found in PDF. Please ensure the PDF contains readable text.' });
    }

    console.log(`Extracted ${pdfText.length} characters from PDF`);

    // Truncate text if too long (to avoid token limits)
    const maxTextLength = 8000; // Conservative limit for GPT-3.5-turbo
    const truncatedText = pdfText.length > maxTextLength 
      ? pdfText.substring(0, maxTextLength) + '... [text truncated]'
      : pdfText;

    // Initialize the chat model
    const model = new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
      temperature: 0.7,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    // Create a prompt template for document summarization
    const template = `You are an expert document analyst. Based on the following document content, provide a comprehensive summary.

Document Content:
{context}

Please provide:
1. A brief overview of the document
2. Key points and main topics
3. Important details or findings
4. Any conclusions or recommendations mentioned

Summary:`;

    const prompt = PromptTemplate.fromTemplate(template);
    const outputParser = new StringOutputParser();

    // Create the chain
    const chain = prompt.pipe(model).pipe(outputParser);

    // Generate summary using the document text
    const summary = await chain.invoke({
      context: truncatedText
    });

    console.log(`Generated summary of ${summary.length} characters`);

    // Return the summary
    res.status(200).json({ 
      summary: summary,
      fileName: fileName || 'Document',
      textLength: pdfText.length,
      chunksCount: 1, // Simplified - no chunking for now
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('PDF RAG Error:', error);
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

    if (error.message.includes('PDF')) {
      return res.status(400).json({ 
        error: 'PDF processing error. Please ensure the file is a valid PDF with readable text.' 
      });
    }

    // Return the actual error message for debugging
    res.status(500).json({ 
      error: `Backend error: ${error.message}` 
    });
  }
}