# PDF Document Analyzer

A powerful web application that analyzes PDF documents and provides AI-powered summaries using OpenAI's GPT models.

## 🎯 What This App Does

This application demonstrates **AI document processing** by:
- **Uploading PDF documents** from your device
- **Extracting text** using PDF parsing
- **Generating comprehensive summaries** using OpenAI GPT
- **Handling file uploads** and size validation
- **Providing real-time feedback** during processing

## 🚀 Key LangChain Concepts You'll Learn

### 🧠 **RAG (Retrieval-Augmented Generation)**
- **Text Chunking**: Splitting documents into manageable pieces
- **Embeddings**: Converting text to vector representations
- **Vector Stores**: Storing and searching semantic information
- **Context Retrieval**: Finding relevant information for AI responses

### 🔧 **LangChain Components**
- **`RecursiveCharacterTextSplitter`**: Intelligent text chunking
- **`MemoryVectorStore`**: In-memory vector storage
- **`OpenAIEmbeddings`**: Text-to-vector conversion
- **`ChatOpenAI`**: Conversational AI model
- **`PromptTemplate`**: Structured prompt creation
- **`StringOutputParser`**: Response formatting

### ⚡ **Advanced LangChain Patterns**
- **Chain Composition**: `prompt.pipe(model).pipe(outputParser)`
- **Vector Similarity Search**: Semantic document retrieval
- **Context-Aware Generation**: AI responses based on document content

## 🏗️ Architecture

### **Frontend (React + TypeScript)**
- **PDF Upload Interface**: Drag-and-drop file selection
- **Progress Indicators**: Real-time processing feedback
- **Summary Display**: Formatted AI-generated summaries
- **Error Handling**: User-friendly error messages

### **Backend (LangChain RAG)**
- **PDF Processing**: Text extraction from PDF files
- **Text Chunking**: Intelligent document segmentation
- **Embedding Generation**: Vector representations
- **RAG Pipeline**: Context retrieval + AI generation
- **Summary Creation**: Comprehensive document analysis

## 📋 Prerequisites

- Node.js (version 16 or higher) - for local development
- Vercel account (free) - for deployment
- OpenAI API key - for embeddings and AI generation

## 🚀 Getting Started

### **Quick Start (Production)**
Ready to deploy! Just follow the deployment steps below.

### **Local Development**
If you want to run locally first:

1. **Install Node.js**
   Visit [nodejs.org](https://nodejs.org/) and download the LTS version.

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Open Browser**
   Go to `http://localhost:3000` and start analyzing PDFs!

### **Features**
- 📄 **PDF Upload**: Drag-and-drop interface
- 🧠 **RAG Processing**: Advanced LangChain pipeline
- 📊 **Document Stats**: Character count, chunk analysis
- 🔒 **Secure Processing**: Server-side AI processing
- ⚡ **Real-time Feedback**: Processing indicators

## 🚀 Deployment Instructions

### **Deploy to Vercel (Recommended)**

1. **Create GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: PDF RAG Analyzer with LangChain"
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git push -u origin main
   ```

2. **Deploy with Vercel**
   - Go to [vercel.com](https://vercel.com) and sign up
   - Click "New Project" → Import your GitHub repository
   - Vercel will auto-detect your Vite + React setup
   - Click "Deploy" (no configuration needed!)

3. **Add Environment Variables**
   In your Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add `OPENAI_API_KEY` with your actual OpenAI API key
   - Redeploy

4. **Secure & Live!**
   Your app will be available at `https://your-project-name.vercel.app`

## 📁 Project Structure

```
├── api/
│   └── pdf-rag.js          # LangChain RAG backend
├── src/
│   ├── main.tsx           # React entry point
│   ├── App.tsx            # Main layout component
│   └── components/
│       └── PDFRAGComponent.tsx  # PDF upload & summary interface
├── vercel.json            # Deployment configuration
├── package.json           # Dependencies & scripts
└── README.md              # This file
```

## 🔬 How RAG Works

### **Step 1: Document Processing**
```
PDF Upload → Text Extraction → Text Chunking → Embeddings
```

### **Step 2: Vector Storage**
```
Chunks → OpenAI Embeddings → Memory Vector Store
```

### **Step 3: Summary Generation**
```
Vector Search → Context Retrieval → AI Generation → Summary
```

## 🎓 Learning Outcomes

### **LangChain Mastery**
- ✅ **RAG Implementation**: Complete retrieval-augmented generation
- ✅ **Vector Operations**: Embeddings and similarity search
- ✅ **Chain Composition**: Building complex AI pipelines
- ✅ **Document Processing**: PDF parsing and text extraction
- ✅ **Context Management**: Intelligent information retrieval

### **TypeScript Skills**
- ✅ **Interface Design**: Complex data structure typing
- ✅ **Async Operations**: Promise handling with proper types
- ✅ **Error Handling**: Type-safe error management
- ✅ **File Processing**: Binary data handling

### **React Development**
- ✅ **File Upload**: Drag-and-drop interfaces
- ✅ **State Management**: Complex application state
- ✅ **User Feedback**: Progress indicators and error states
- ✅ **Component Design**: Reusable, typed components

## 🔧 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build locally
npm run clean    # Remove build files
```

## 🚀 Next Steps for Learning

- **Add More Document Types**: Support for Word, TXT, etc.
- **Implement Chat Interface**: Ask questions about uploaded documents
- **Add Vector Persistence**: Store embeddings in databases
- **Multi-Document Analysis**: Compare multiple documents
- **Custom Chunking Strategies**: Experiment with different splitting methods

## 📚 Resources

- [LangChain Documentation](https://python.langchain.com/docs/)
- [JavaScript LangChain](https://js.langchain.com/docs/)
- [OpenAI Embeddings Guide](https://platform.openai.com/docs/guides/embeddings)
- [RAG Best Practices](https://docs.langchain.com/docs/use-cases/question-answering/)

## 🎯 Real-World Applications

This RAG implementation can be extended for:
- **Document Analysis**: Legal, medical, academic papers
- **Knowledge Management**: Corporate document repositories
- **Research Assistance**: Academic paper summarization
- **Content Creation**: Automated content generation from sources

Happy learning with LangChain RAG! 🎓📄