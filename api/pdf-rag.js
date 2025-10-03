import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "langchain/prompts";
import { StringOutputParser } from "langchain/output_parsers";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
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

    console.log(`Processing PDF: ${fileName || 'unnamed'}`);

    // Convert base64 PDF data to buffer
    const pdfBuffer = Buffer.from(pdfData, 'base64');

    // Extract text from PDF
    const pdfData_extracted = await pdf(pdfBuffer);
    const pdfText = pdfData_extracted.text;

    if (!pdfText || pdfText.trim().length === 0) {
      return res.status(400).json({ error: 'No text found in PDF. Please ensure the PDF contains readable text.' });
    }

    console.log(`Extracted ${pdfText.length} characters from PDF`);

    // Split the text into chunks for RAG
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const chunks = await textSplitter.splitText(pdfText);

    // Create embeddings and vector store
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const vectorStore = await MemoryVectorStore.fromTexts(
      chunks,
      {},
      embeddings
    );

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

    // Get all chunks as context (for summarization, we use all content)
    const allChunks = chunks.join('\n\n');

    // Generate summary using RAG
    const summary = await chain.invoke({
      context: allChunks
    });

    console.log(`Generated summary of ${summary.length} characters`);

    // Return the summary
    res.status(200).json({ 
      summary: summary,
      fileName: fileName || 'Document',
      textLength: pdfText.length,
      chunksCount: chunks.length,
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
