"use client";

import React from 'react';

interface ExamplePromptProps {
  title: string;
  description: string;
  fullPrompt: string;
  image: string;
  onClick: (prompt: string) => void;
  className?: string;
}

export function ExamplePrompt({ 
  title, 
  description, 
  fullPrompt,
  image,
  onClick, 
  className = ""
}: ExamplePromptProps) {
  const handleClick = () => {
    onClick(fullPrompt);
  };

  return (
    <button
      onClick={handleClick}
      className={`
        group relative p-3
        bg-gray-900/70 border-2 border-cyan-500/30
        hover:border-cyan-400 hover:bg-gray-800/80
        rounded-lg transition-all duration-300
        transform hover:scale-105 hover:-translate-y-1
        shadow-lg hover:shadow-cyan-500/25
        text-left w-full
        backdrop-blur-sm
        ${className}
      `}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        {/* Image */}
        <div className="w-full h-24 mb-3 relative overflow-hidden rounded border border-purple-500/20">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
        </div>
        
        {/* Content */}
        <h3 className="font-bold text-white text-sm font-mono tracking-wide mb-1">
          {title}
        </h3>
        
        <p className="text-gray-400 text-xs font-mono leading-relaxed">
          {description}
        </p>
      </div>

      {/* Pixel border decoration */}
      <div className="absolute top-1 left-1 w-1 h-1 bg-cyan-400 opacity-60" />
      <div className="absolute top-1 right-1 w-1 h-1 bg-purple-400 opacity-60" />
      <div className="absolute bottom-1 left-1 w-1 h-1 bg-purple-400 opacity-60" />
      <div className="absolute bottom-1 right-1 w-1 h-1 bg-cyan-400 opacity-60" />
    </button>
  );
}