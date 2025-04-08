'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, X, Maximize, Minimize } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatbotProps {
  studentName: string;
}

export default function Chatbot({ studentName }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Initial greeting when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const initialMessage: Message = {
        id: Date.now().toString(),
        text: `Namaste ${studentName}! I'm your AI assistant. How can I help you with your studies today?`,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages([initialMessage]);
    }
  }, [isOpen, messages.length, studentName]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputText.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    
    // Simulate AI response with predefined answers
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputText),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };
  
  // Predefined responses based on keywords
  const getBotResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('hello') || lowerQuery.includes('hi') || lowerQuery.includes('namaste')) {
      return `Namaste! How can I assist you with your studies today?`;
    }
    
    if (lowerQuery.includes('assignment') || lowerQuery.includes('homework')) {
      return `I can help you understand your assignments. You can ask me specific questions about the topics you're working on, and I'll try to explain them.`;
    }
    
    if (lowerQuery.includes('math') || lowerQuery.includes('mathematics')) {
      return `For mathematics, I can help explain concepts, solve problems, or guide you through the steps. What specific math topic are you working on?`;
    }
    
    if (lowerQuery.includes('science') || lowerQuery.includes('physics') || lowerQuery.includes('chemistry') || lowerQuery.includes('biology')) {
      return `Science is fascinating! I can help explain scientific concepts, formulas, or experiments. What specific area are you studying?`;
    }
    
    if (lowerQuery.includes('english') || lowerQuery.includes('literature')) {
      return `For English and literature, I can help with analyzing texts, understanding themes, or improving your writing. What specific aspect are you working on?`;
    }
    
    if (lowerQuery.includes('history')) {
      return `History is all about understanding our past. I can help with historical events, timelines, or explaining the significance of historical developments. What period or event are you studying?`;
    }
    
    if (lowerQuery.includes('thank')) {
      return `You're welcome! Feel free to ask if you need any more help.`;
    }
    
    if (lowerQuery.includes('bye') || lowerQuery.includes('goodbye')) {
      return `Goodbye! Feel free to come back whenever you need help with your studies.`;
    }
    
    // Default response
    return `That's an interesting question! I'd be happy to help you with that. Could you provide more details so I can give you a more specific answer?`;
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 shadow-lg flex items-center justify-center"
        >
          <Bot className="h-6 w-6" />
        </button>
      )}
      
      {/* Chat Window */}
      {isOpen && (
        <div 
          className={`bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300 ease-in-out ${
            isMinimized ? 'w-64 h-12' : 'w-80 sm:w-96 h-96'
          }`}
        >
          {/* Chat Header */}
          <div className="bg-indigo-600 text-white px-4 py-2 flex justify-between items-center">
            <div className="flex items-center">
              <Bot className="h-5 w-5 mr-2" />
              <h3 className="font-medium">EduAssist AI</h3>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:text-indigo-100"
              >
                {isMinimized ? <Maximize className="h-4 w-4" /> : <Minimize className="h-4 w-4" />}
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-indigo-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Chat Messages */}
          {!isMinimized && (
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.sender === 'user' 
                          ? 'bg-indigo-600 text-white rounded-br-none' 
                          : 'bg-gray-100 text-gray-800 rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <span className="text-xs opacity-70 mt-1 block text-right">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-800 rounded-lg rounded-bl-none px-4 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Chat Input */}
              <form onSubmit={handleSubmit} className="p-2 border-t border-gray-200 flex">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your question..."
                  className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-r-lg px-4 py-2"
                  disabled={!inputText.trim() || isTyping}
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 