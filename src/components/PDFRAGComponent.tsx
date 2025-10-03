import React, { useState } from 'react';

// TypeScript interfaces for component props and state
interface SummaryResult {
  summary: string;
  fileName: string;
  textLength: number;
  chunksCount: number;
  timestamp: string;
}

interface PDFRAGComponentProps {
  // This component doesn't need props, but shows TypeScript interface usage
}

// TypeScript const assertion for function component
export const PDFRAGComponent: React.FC<PDFRAGComponentProps> = (): JSX.Element => {
  // State with TypeScript types
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [summary, setSummary] = useState<SummaryResult | null>(null);
  const [error, setError] = useState<string>('');

  // Function to handle file selection with TypeScript types
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
        setError('');
        setSummary(null);
      } else {
        setError('Please select a PDF file.');
        setSelectedFile(null);
      }
    }
  };

  // Function to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        // Remove the data URL prefix
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = error => reject(error);
    });
  };

  // Function to handle PDF processing with TypeScript types
  const handleProcessPDF = async (): Promise<void> => {
    if (!selectedFile) {
      setError('Please select a PDF file first.');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      // Convert file to base64
      const pdfData = await fileToBase64(selectedFile);

      // Call our PDF RAG API
      const response = await fetch('/api/pdf-rag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          pdfData: pdfData,
          fileName: selectedFile.name
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process PDF');
      }

      const result: SummaryResult = await response.json();
      setSummary(result);
    } catch (error) {
      // TypeScript error handling
      const errorMessage: string = error instanceof Error ? error.message : "Unknown error occurred";
      setError(`Error processing PDF: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* PDF Upload Section */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ 
          color: '#333', 
          marginBottom: '20px',
          fontSize: '24px',
          fontWeight: '600'
        }}>
          📄 PDF Document Analyzer
        </h2>
        
        <p style={{ 
          color: '#666', 
          marginBottom: '20px',
          fontSize: '16px',
          lineHeight: '1.5'
        }}>
          Upload a PDF document to get an AI-powered summary using LangChain RAG (Retrieval-Augmented Generation).
        </p>

        {/* File Upload */}
        <div style={{ marginBottom: '20px' }}>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            style={{
              padding: '12px',
              border: '2px dashed #007bff',
              borderRadius: '8px',
              backgroundColor: '#f8f9fa',
              width: '100%',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          />
          {selectedFile && (
            <p style={{ 
              marginTop: '10px', 
              color: '#28a745',
              fontWeight: '600'
            }}>
              ✅ Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>

        {/* Process Button */}
        <button
          onClick={handleProcessPDF}
          disabled={!selectedFile || isProcessing}
          style={{
            padding: '12px 24px',
            backgroundColor: selectedFile && !isProcessing ? '#007bff' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: selectedFile && !isProcessing ? 'pointer' : 'not-allowed',
            opacity: selectedFile && !isProcessing ? 1 : 0.6
          }}
        >
          {isProcessing ? '🔄 Processing PDF...' : '🚀 Analyze Document'}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div style={{
          padding: '15px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          ❌ {error}
        </div>
      )}

      {/* Summary Display */}
      {summary && (
        <div style={{
          padding: '20px',
          backgroundColor: '#d4edda',
          border: '1px solid #c3e6cb',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h3 style={{ 
            color: '#155724', 
            marginBottom: '15px',
            fontSize: '20px',
            fontWeight: '600'
          }}>
            📋 Document Summary: {summary.fileName}
          </h3>
          
          <div style={{ 
            backgroundColor: 'white',
            padding: '15px',
            borderRadius: '6px',
            border: '1px solid #c3e6cb',
            whiteSpace: 'pre-wrap',
            lineHeight: '1.6',
            fontSize: '14px',
            color: '#333'
          }}>
            {summary.summary}
          </div>

          <div style={{ 
            marginTop: '15px',
            fontSize: '12px',
            color: '#6c757d'
          }}>
            📊 Document Stats: {summary.textLength.toLocaleString()} characters, {summary.chunksCount} chunks processed
          </div>
        </div>
      )}

      {/* Instructions */}
      <div style={{
        padding: '15px',
        backgroundColor: '#e2e3e5',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#495057'
      }}>
        <h4 style={{ marginBottom: '10px', color: '#495057' }}>💡 How it works:</h4>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li>Upload a PDF document (max 10MB recommended)</li>
          <li>LangChain extracts and processes the text</li>
          <li>AI creates chunks and embeddings for RAG</li>
          <li>Get a comprehensive summary of your document</li>
        </ul>
      </div>
    </div>
  );
};
