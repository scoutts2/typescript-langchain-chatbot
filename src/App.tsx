import React, { useState } from 'react';
import { PDFRAGComponent } from './components/PDFRAGComponent';

// Main App component with TypeScript types
function App(): JSX.Element {
  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '30px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
      minHeight: '500px'
    }}>
      <header style={{
        textAlign: 'center',
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: '2px solid #f0f0f0'
      }}>
        <h1 style={{
          color: '#333',
          margin: '10px 0',
          fontSize: '28px',
          fontWeight: '600'
        }}>
          📄 PDF RAG Analyzer
        </h1>
        <p style={{
          color: '#666',
          fontSize: '16px',
          margin: '0'
        }}>
          Upload PDF documents and get AI-powered summaries using LangChain RAG
        </p>
      </header>

      <PDFRAGComponent />
    </div>
  );
}

export default App;
