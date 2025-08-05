"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to builder page immediately
    router.push('/builder');
  }, [router]);

  // Show loading while redirecting
  return (
    <div className="h-screen flex items-center justify-center bg-gray-900">
      <div className="text-white font-mono text-center">
        <div className="animate-spin w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full mx-auto mb-4" />
        Redirecting to Game Builder...
      </div>
    </div>
  );
}