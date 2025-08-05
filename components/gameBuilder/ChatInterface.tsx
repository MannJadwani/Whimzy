"use client";

import React, { useState, useRef, useEffect } from 'react';
import { RetroButton } from '@/components/ui/RetroButton';
import { WhimzyTerminal } from '@/components/ui/WhimzyTerminal';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  onSendMessage: (message: string) => void;
  messages: ChatMessage[];
  isLoading?: boolean;
  className?: string;
}

export function ChatInterface({ 
  onSendMessage, 
  messages, 
  isLoading = false,
  className = ""
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit(e);
    }
  };

  const formatMessage = (message: ChatMessage) => {
    const baseClasses = "p-3 lg:p-4 rounded-lg font-mono text-sm leading-relaxed";
    
    switch (message.type) {
      case 'user':
        return `${baseClasses} bg-purple-900/30 border border-purple-400/30 text-purple-100 ml-4 lg:ml-8`;
      case 'ai':
        return `${baseClasses} bg-cyan-900/30 border border-cyan-400/30 text-cyan-100 mr-4 lg:mr-8`;
      case 'system':
        return `${baseClasses} bg-gray-800/50 border border-gray-500/30 text-gray-300 text-center text-xs`;
      default:
        return baseClasses;
    }
  };

  const getMessageIcon = (type: ChatMessage['type']) => {
    switch (type) {
      case 'user':
        return '👤';
      case 'ai':
        return '🤖';
      case 'system':
        return 'ℹ️';
      default:
        return '';
    }
  };

  return (
    <div className={`h-full flex flex-col bg-gray-900/80 backdrop-blur-sm border-2 border-cyan-400/50 rounded-lg ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-800/90 border-b border-cyan-400/30">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
          <h3 className="text-white font-mono font-bold tracking-wider">AI CHAT</h3>
        </div>
        <div className="text-xs text-gray-400 font-mono">
          {messages.length} messages
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 lg:p-4 space-y-2 lg:space-y-3">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-cyan-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-cyan-400 text-2xl">💬</span>
            </div>
            <p className="text-gray-400 font-mono text-sm">Start chatting to modify your game!</p>
            <p className="text-gray-500 font-mono text-xs mt-2">Try: "Make the player jump higher" or "Add more enemies"</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm">{getMessageIcon(message.type)}</span>
                <span className="text-xs text-gray-400 font-mono">
                  {message.type === 'user' ? 'You' : message.type === 'ai' ? 'Whimzy AI' : 'System'}
                </span>
                <span className="text-xs text-gray-500 font-mono">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <div className={formatMessage(message)}>
                {message.content}
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm">🤖</span>
              <span className="text-xs text-gray-400 font-mono">Whimzy AI</span>
              <span className="text-xs text-gray-500 font-mono">working...</span>
            </div>
            <div className="bg-cyan-900/30 border border-cyan-400/30 text-cyan-100 mr-4 lg:mr-8 p-3 lg:p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-xs font-mono">Opening terminal...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 lg:p-4 bg-gray-800/90 border-t border-cyan-400/30">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="flex-1">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me to modify your game..."
                disabled={isLoading}
                rows={2}
                className="w-full px-3 py-2 lg:px-4 lg:py-3 bg-gray-700/80 border border-cyan-400/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 resize-none font-mono text-sm transition-all duration-200"
              />
              <p className="mt-1 text-xs text-gray-500 font-mono hidden sm:block">
                Press Cmd/Ctrl + Enter to send
              </p>
            </div>
            <div className="flex justify-end sm:flex-col sm:justify-end">
              <RetroButton
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                variant="secondary"
                size="sm"
                className="w-full sm:w-auto"
              >
                SEND
              </RetroButton>
            </div>
          </div>
        </form>
      </div>

      {/* Terminal Loading Popup */}
      <WhimzyTerminal isVisible={isLoading} />
    </div>
  );
}