import React, { useState } from 'react';

// TypeScript interfaces for component props and state
interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatComponentProps {
  // This component doesn't need props, but shows TypeScript interface usage
}

// TypeScript const assertion for function component
export const ChatComponent: React.FC<ChatComponentProps> = (): JSX.Element => {
  // State with TypeScript types (no API key needed now!)
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setLoading] = useState<boolean>(false);

  // Function to add message with TypeScript typing
  const addMessage = (text: string, sender: 'user' | 'ai'): void => {
    const newMessage: Message = {
      id: Date.now(),
      text,
      sender,
      timestamp: new Date()
    };
    setMessages((prev: Message[]) => [...prev, newMessage]);
  };

  // Function to handle form submission with TypeScript types
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!inputText.trim()) return;

    const userMessage: string = inputText.trim();
    addMessage(userMessage, 'user');
    setInputText('');
    setLoading(true);

    try {
      // Call our secure backend API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: userMessage }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get AI response');
      }

      const data = await response.json();
      addMessage(data.response, 'ai');
    } catch (error) {
      // TypeScript error handling
      const errorMessage: string = error instanceof Error ? error.message : "Unknown error occurred";
      addMessage(`Sorry, there was an error: ${errorMessage}`, 'ai');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle input change with TypeScript types
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputText(e.target.value);
  };

  // No API key handling needed - backend handles security!

  return (
    <div style={{ padding: '20px' }}>
      {/* No API Key Input needed - backend handles it securely! */}
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <p style={{ 
          fontSize: '14px', 
          color: '#28a745',
          fontWeight: '600',
          margin: '0',
          padding: '10px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #28a745'
        }}>
          🔒 Secure Chat - Your conversations are handled safely by our backend!
        </p>
      </div>

      {/* Chat Messages */}
      <div style={{
        border: '2px solid #e1e5e9',
        borderRadius: '8px',
        height: '300px',
        overflowY: 'auto',
        padding: '15px',
        marginBottom: '15px',
        backgroundColor: '#f8f9fa'
      }}>
        {messages.length === 0 && (
          <p style={{ 
            color: '#666', 
            textAlign: 'center', 
            margin: '50px 0',
            fontStyle: 'italic'
          }}>
            Start a conversation! Ask about TypeScript, React, or LangChain.
          </p>
        )}
        
        {messages.map((message: Message) => (
          <div key={message.id} style={{
            marginBottom: '15px',
            padding: '10px',
            borderRadius: '8px',
            backgroundColor: message.sender === 'user' ? '#007bff' : '#e9ecef',
            color: message.sender === 'user' ? 'white' : '#333',
            alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '80%',
            marginLeft: message.sender === 'ai' ? '0' : 'auto',
            marginRight: message.sender === 'ai' ? 'auto' : '0'
          }}>
            <div style={{ fontWeight: '600', marginBottom: '5px' }}>
              {message.sender === 'user' ? '👤 You' : '🤖 AI'}
            </div>
            <div>{message.text}</div>
          </div>
        ))}
        
        {isLoading && (
          <div style={{
            marginBottom: '15px',
            padding: '10px',
            borderRadius: '8px',
            backgroundColor: '#fff3cd',
            textAlign: 'center',
            fontStyle: 'italic',
            color: '#856404'
          }}>
            🤖 AI is thinking...
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            placeholder="Ask about TypeScript, React, or LangChain..."
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '12px',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            style={{
              padding: '12px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1
            }}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};
