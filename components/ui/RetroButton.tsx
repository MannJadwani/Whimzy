"use client";

import React from 'react';

interface RetroButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export function RetroButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button'
}: RetroButtonProps) {
  const baseClasses = `
    relative font-mono font-bold tracking-wider uppercase
    transition-all duration-200 transform
    border-2 rounded-none
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    active:scale-95
  `;

  const variantClasses = {
    primary: `
      bg-gradient-to-b from-purple-500 to-purple-700
      border-purple-400 text-white
      hover:from-purple-400 hover:to-purple-600
      focus:ring-purple-400
      shadow-lg shadow-purple-500/25
      hover:shadow-purple-400/40
    `,
    secondary: `
      bg-gradient-to-b from-cyan-500 to-cyan-700
      border-cyan-400 text-white
      hover:from-cyan-400 hover:to-cyan-600
      focus:ring-cyan-400
      shadow-lg shadow-cyan-500/25
      hover:shadow-cyan-400/40
    `,
    accent: `
      bg-gradient-to-b from-pink-500 to-pink-700
      border-pink-400 text-white
      hover:from-pink-400 hover:to-pink-600
      focus:ring-pink-400
      shadow-lg shadow-pink-500/25
      hover:shadow-pink-400/40
    `
  };

  const sizeClasses = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-6 py-2 text-sm',
    lg: 'px-8 py-3 text-base'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {/* Pixel corners decoration */}
      <div className="absolute top-0 left-0 w-1 h-1 bg-white opacity-60" />
      <div className="absolute top-0 right-0 w-1 h-1 bg-white opacity-60" />
      <div className="absolute bottom-0 left-0 w-1 h-1 bg-white opacity-60" />
      <div className="absolute bottom-0 right-0 w-1 h-1 bg-white opacity-60" />
      
      <span className="relative z-10">{children}</span>
    </button>
  );
}