"use client";

import React from 'react';

export function PixelBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base dark background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-950 to-slate-950" />
      
      {/* Animated grid pattern - Brighter */}
      <div className="absolute inset-0 opacity-40">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(139, 92, 246, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            animation: 'gridMove 20s linear infinite'
          }}
        />
      </div>
      
      {/* Floating pixel elements - Brighter and More */}
      <div className="absolute inset-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-cyan-300 opacity-80 rounded-full shadow-lg shadow-cyan-400/50"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `pixelFloat ${5 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
        
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={`purple-${i}`}
            className="absolute w-3 h-3 bg-purple-300 opacity-70 rounded-full shadow-lg shadow-purple-400/50"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `pixelFloat ${7 + Math.random() * 8}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 7}s`
            }}
          />
        ))}
        
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`pink-${i}`}
            className="absolute w-2 h-2 bg-pink-300 opacity-60 rounded-full shadow-lg shadow-pink-400/50"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `pixelFloat ${6 + Math.random() * 9}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 6}s`
            }}
          />
        ))}
      </div>
      
      {/* Gradient overlays for depth - More colorful */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/10 via-transparent to-gray-950/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-cyan-900/20" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-purple-950/5 to-transparent" />
      
      <style jsx>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(40px, 40px); }
        }
        
        @keyframes pixelFloat {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
            opacity: 0.6;
          }
          50% { 
            transform: translateY(-20px) rotate(180deg); 
            opacity: 0.2;
          }
        }
      `}</style>
    </div>
  );
}