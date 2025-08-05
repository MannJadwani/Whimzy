"use client";

import React, { useState, useEffect } from 'react';

interface WhimzyTerminalProps {
  isVisible: boolean;
  className?: string;
}

export function WhimzyTerminal({ isVisible, className = "" }: WhimzyTerminalProps) {
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  const terminalLines = [
    "$ initializing whimzy.ai...",
    "$ loading neural networks...",
    "$ parsing game requirements...",
    "$ generating code structures...",
    "$ optimizing game mechanics...",
    "$ adding retro styling...",
    "$ compiling game logic...",
    "$ whimzy is coding for you!",
  ];

  // Reset animation when becoming visible
  useEffect(() => {
    if (isVisible) {
      setCurrentLine(0);
      setCurrentChar(0);
    }
  }, [isVisible]);

  // Type animation effect
  useEffect(() => {
    if (!isVisible) return;

    if (currentLine < terminalLines.length) {
      const line = terminalLines[currentLine];
      
      if (currentChar < line.length) {
        const timer = setTimeout(() => {
          setCurrentChar(prev => prev + 1);
        }, 50 + Math.random() * 50); // Vary typing speed
        
        return () => clearTimeout(timer);
      } else {
        // Move to next line after a pause
        const timer = setTimeout(() => {
          setCurrentLine(prev => prev + 1);
          setCurrentChar(0);
        }, 500);
        
        return () => clearTimeout(timer);
      }
    }
  }, [currentLine, currentChar, isVisible, terminalLines]);

  // Cursor blinking effect
  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorTimer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm ${className}`}>
      <div className="w-full max-w-2xl mx-4 animate-in fade-in zoom-in-95 duration-300">
        {/* Terminal Window */}
        <div className="bg-gray-900/95 border-2 border-green-400/70 rounded-lg shadow-2xl overflow-hidden">
          {/* Terminal Header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-gray-800/90 border-b border-green-400/30">
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex-1 text-center">
              <span className="text-green-400 font-mono text-sm font-bold">
                ▼ WHIMZY TERMINAL v2.1.0 ▼
              </span>
            </div>
          </div>

          {/* Terminal Content */}
          <div className="p-6 h-80 overflow-hidden bg-gray-950/90">
            <div className="font-mono text-sm space-y-2">
              {/* Rendered lines */}
              {terminalLines.slice(0, currentLine).map((line, index) => (
                <div key={index} className="text-green-400 flex items-center gap-2">
                  <span className="text-green-500">❯</span>
                  <span>{line}</span>
                  <span className="text-green-500 animate-pulse">✓</span>
                </div>
              ))}
              
              {/* Current typing line */}
              {currentLine < terminalLines.length && (
                <div className="text-green-400 flex items-center gap-2">
                  <span className="text-green-500">❯</span>
                  <span>
                    {terminalLines[currentLine].slice(0, currentChar)}
                    {showCursor && <span className="bg-green-400 text-gray-900 px-0.5">_</span>}
                  </span>
                </div>
              )}
            </div>

            {/* Main Status Display */}
            <div className="mt-8 text-center">
              <div className="inline-block">
                {/* ASCII Art Robot */}
                <div className="text-green-400 font-mono text-xs leading-tight mb-4 opacity-80">
                  <div>    ╭─────────╮</div>
                  <div>    │  ◉   ◉  │</div>
                  <div>    │    ◡    │</div>
                  <div>    ╰─────────╯</div>
                  <div>      ┃     ┃</div>
                  <div>    ╭─┻─╮ ╭─┻─╮</div>
                </div>

                {/* Main Text */}
                <div className="text-xl font-bold text-green-400 mb-2 tracking-wider animate-pulse">
                  WHIMZY IS CODING FOR YOU!
                </div>

                {/* Progress Indicator */}
                <div className="flex justify-center items-center gap-1 mb-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        i <= currentLine 
                          ? 'bg-green-400 shadow-lg shadow-green-400/50' 
                          : 'bg-gray-600'
                      }`}
                      style={{
                        animationDelay: `${i * 100}ms`,
                      }}
                    />
                  ))}
                </div>

                {/* Loading Animation */}
                <div className="flex justify-center items-center gap-1">
                  <div className="text-green-400 font-mono text-sm">
                    Processing
                  </div>
                  <div className="flex gap-1">
                    <span className="animate-bounce text-green-400" style={{ animationDelay: '0ms' }}>.</span>
                    <span className="animate-bounce text-green-400" style={{ animationDelay: '200ms' }}>.</span>
                    <span className="animate-bounce text-green-400" style={{ animationDelay: '400ms' }}>.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Matrix-style background effect */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="matrix-bg h-full w-full">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute animate-pulse text-green-400 font-mono text-xs"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 3}s`,
                      animationDuration: `${2 + Math.random() * 3}s`,
                    }}
                  >
                    {Math.random() > 0.5 ? '0' : '1'}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Terminal Footer */}
          <div className="px-4 py-2 bg-gray-800/90 border-t border-green-400/30">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-green-400">STATUS: ACTIVE</span>
              <span className="text-gray-400">AI PROCESS: RUNNING</span>
              <span className="text-green-400 animate-pulse">●</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}