"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Builder() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Generate a new game ID and redirect to the dynamic route
    const newGameId = `game-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const prompt = searchParams.get('prompt');
    
    if (prompt) {
      router.replace(`/builder/${newGameId}?prompt=${encodeURIComponent(prompt)}`);
    } else {
      router.replace(`/builder/${newGameId}`);
    }
  }, [router, searchParams]);

  // Show a minimal loading state while redirecting
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-white font-mono">
        <div className="animate-spin w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full mx-auto mb-4" />
        Creating new game session...
      </div>
    </div>
  );
} 