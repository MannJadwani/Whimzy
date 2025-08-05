"use client";

import React from 'react';

interface FloatingImageProps {
  src: string;
  alt: string;
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  size?: 'sm' | 'md' | 'lg';
  animationDelay?: string;
  className?: string;
}

function FloatingImage({ 
  src, 
  alt, 
  position, 
  size = 'md', 
  animationDelay = '0s',
  className = '' 
}: FloatingImageProps) {
  const sizeClasses = {
    sm: 'w-24 h-24 md:w-32 md:h-32',
    md: 'w-32 h-32 md:w-40 md:h-40',
    lg: 'w-40 h-40 md:w-48 md:h-48'
  };

  const positionStyles = {
    ...position
  };

  return (
    <div 
      className={`
        absolute z-10 opacity-70 hover:opacity-100 transition-all duration-500
        ${sizeClasses[size]} ${className}
      `}
      style={{
        ...positionStyles,
        animation: `floatUpDown 6s ease-in-out infinite`,
        animationDelay
      }}
    >
      <div className="relative w-full h-full group">
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover rounded-lg border-2 border-purple-400/60 group-hover:border-cyan-400/80 transition-all duration-300 shadow-lg shadow-purple-500/30 group-hover:shadow-cyan-400/50"
        />
        {/* Glow effect on hover */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/20 to-cyan-500/20 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Pixel corners - Brighter */}
        <div className="absolute top-0 left-0 w-2 h-2 bg-purple-400 opacity-80" />
        <div className="absolute top-0 right-0 w-2 h-2 bg-cyan-400 opacity-80" />
        <div className="absolute bottom-0 left-0 w-2 h-2 bg-cyan-400 opacity-80" />
        <div className="absolute bottom-0 right-0 w-2 h-2 bg-purple-400 opacity-80" />
      </div>
    </div>
  );
}

export function FloatingImages() {
  const images = [
    {
      src: '/assets/landing-images/cyberpunk_ninja_pixel_art.png',
      alt: 'Cyberpunk Ninja',
      position: { top: '10%', left: '5%' },
      size: 'md' as const,
      animationDelay: '0s'
    },
    {
      src: '/assets/landing-images/wizard_gameboy_pixel.png',
      alt: 'Pixel Wizard',
      position: { top: '20%', right: '8%' },
      size: 'lg' as const,
      animationDelay: '1s'
    },
    {
      src: '/assets/landing-images/cute_robot_retro_futuristic.png',
      alt: 'Cute Robot',
      position: { top: '45%', left: '3%' },
      size: 'sm' as const,
      animationDelay: '2s'
    },
    {
      src: '/assets/landing-images/samurai_bear_pixel_sword.png',
      alt: 'Samurai Bear',
      position: { top: '60%', right: '5%' },
      size: 'md' as const,
      animationDelay: '3s'
    },
    {
      src: '/assets/landing-images/punk_girl_neon_pixel_roller.png',
      alt: 'Punk Girl',
      position: { bottom: '25%', left: '7%' },
      size: 'md' as const,
      animationDelay: '4s'
    },
    {
      src: '/assets/landing-images/elf_archer_rpg_pixel_forest.png',
      alt: 'Elf Archer',
      position: { bottom: '15%', right: '10%' },
      size: 'lg' as const,
      animationDelay: '5s'
    },
    {
      src: '/assets/landing-images/retro_alien_arcade_blaster.png',
      alt: 'Retro Alien',
      position: { top: '75%', left: '12%' },
      size: 'sm' as const,
      animationDelay: '1.5s'
    },
    {
      src: '/assets/landing-images/robotic_cowboy_arcade_style.png',
      alt: 'Robotic Cowboy',
      position: { top: '35%', right: '15%' },
      size: 'sm' as const,
      animationDelay: '2.5s'
    }
  ];

  // Mobile-friendly subset of images
  const mobileImages = [
    {
      src: '/assets/landing-images/cute_robot_retro_futuristic.png',
      alt: 'Cute Robot',
      position: { top: '15%', right: '5%' },
      size: 'sm' as const,
      animationDelay: '0s'
    },
    {
      src: '/assets/landing-images/wizard_gameboy_pixel.png',
      alt: 'Pixel Wizard',
      position: { bottom: '20%', left: '5%' },
      size: 'sm' as const,
      animationDelay: '2s'
    }
  ];

  return (
    <>
      {/* Desktop floating images */}
      {images.map((image, index) => (
        <FloatingImage
          key={`desktop-${index}`}
          src={image.src}
          alt={image.alt}
          position={image.position}
          size={image.size}
          animationDelay={image.animationDelay}
          className="hidden lg:block"
        />
      ))}
      
      {/* Mobile floating images */}
      {mobileImages.map((image, index) => (
        <FloatingImage
          key={`mobile-${index}`}
          src={image.src}
          alt={image.alt}
          position={image.position}
          size={image.size}
          animationDelay={image.animationDelay}
          className="block lg:hidden"
        />
      ))}
    </>
  );
}