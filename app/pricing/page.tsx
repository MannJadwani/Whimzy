
"use client";

import React from 'react';
import { PixelBackground } from '@/components/ui/PixelBackground';
import { RetroNavbar } from '@/components/ui/RetroNavbar';
import { RetroButton } from '@/components/ui/RetroButton';

type PricingCardProps = {
  title: string;
  price: string;
  description: string;
  features: string[];
  actionLabel: string;
  isPopular?: boolean;
  isComingSoon?: boolean;
  href?: string;
};

const PricingCard = ({ title, price, description, features, actionLabel, isPopular = false, isComingSoon = false, href }: PricingCardProps) => (
  <div className={`
    relative bg-gray-900/80 backdrop-blur-sm border-2 
    ${isPopular ? 'border-cyan-400/60 shadow-cyan-500/25' : 'border-purple-400/30'} 
    hover:border-cyan-400/60 rounded-lg overflow-hidden 
    transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1
    shadow-lg hover:shadow-purple-500/25
    flex flex-col w-full max-w-sm min-h-[500px]
    ${isComingSoon ? 'opacity-75' : ''}
  `}>
    {/* Popular badge */}
    {isPopular && (
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
        <span className="bg-gradient-to-r from-cyan-400 to-purple-400 text-black px-4 py-1 text-xs font-mono font-bold rounded-full">
          RECOMMENDED
        </span>
      </div>
    )}

    {/* Coming Soon badge */}
    {isComingSoon && (
      <div className="absolute top-4 right-4">
        <span className="bg-yellow-500/80 text-black px-3 py-1 text-xs font-mono font-bold rounded">
          COMING SOON
        </span>
      </div>
    )}

    {/* Header */}
    <div className="p-6 text-center">
      <h3 className="text-white font-mono font-bold text-2xl mb-2 tracking-wide">
        {title}
      </h3>
      <div className="mb-4">
        <span className="text-4xl font-mono font-bold bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent">
          {price}
        </span>
      </div>
      <p className="text-gray-300 text-sm font-mono leading-relaxed">
        {description}
      </p>
    </div>

    {/* Features */}
    <div className="px-6 flex-1">
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-3">
            <span className="text-cyan-400 text-lg">✓</span>
            <span className="text-gray-300 text-sm font-mono">{feature}</span>
          </li>
        ))}
      </ul>
    </div>

    {/* Action button */}
    <div className="p-6 mt-auto">
      {isComingSoon ? (
        <RetroButton
          size="lg"
          variant="secondary"
          disabled
          className="w-full opacity-50 cursor-not-allowed"
        >
          {actionLabel}
        </RetroButton>
      ) : (
        <RetroButton
          size="lg"
          variant={isPopular ? "accent" : "primary"}
          className="w-full"
          onClick={() => {
            if (href) {
              window.location.href = href;
            }
          }}
        >
          {actionLabel}
        </RetroButton>
      )}
    </div>

    {/* Pixel corner decorations */}
    <div className="absolute top-1 left-1 w-2 h-2 bg-purple-400 opacity-60" />
    <div className="absolute top-1 right-1 w-2 h-2 bg-cyan-400 opacity-60" />
    <div className="absolute bottom-1 left-1 w-2 h-2 bg-cyan-400 opacity-60" />
    <div className="absolute bottom-1 right-1 w-2 h-2 bg-purple-400 opacity-60" />
  </div>
);

export default function PricingPage() {
  const plans = [
    {
      title: "FREE",
      price: "$0",
      description: "Perfect for getting started with game creation",
      features: [
        "5 AI messages per day",
        "Basic game templates",
        "2D game creation",
        "Community support",
        "Export to HTML"
      ],
      actionLabel: "START FREE",
      isPopular: true,
      isComingSoon: false,
      href: "/builder"
    },
    {
      title: "PRO",
      price: "$9.99/mo",
      description: "For serious game developers and creators",
      features: [
        "Unlimited AI messages",
        "Advanced game templates",
        "3D game creation",
        "Priority support",
        "Export to multiple formats",
        "Commercial license"
      ],
      actionLabel: "COMING SOON",
      isPopular: false,
      isComingSoon: true
    },
    {
      title: "STUDIO",
      price: "$29.99/mo",
      description: "For teams and professional game studios",
      features: [
        "Everything in Pro",
        "Team collaboration",
        "Advanced analytics",
        "Custom integrations",
        "Dedicated support",
        "White-label options"
      ],
      actionLabel: "COMING SOON",
      isPopular: false,
      isComingSoon: true
    }
  ];

  return (
    <div className="min-h-screen relative">
      <PixelBackground />
      <RetroNavbar />
      
      <div className="relative z-10 pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent font-mono tracking-wider drop-shadow-2xl">
              PRICING PLANS
            </h1>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-20 bg-gradient-to-r from-transparent to-purple-300" />
              <span className="text-purple-200 font-mono text-lg tracking-widest font-bold">
                LEVEL UP • CREATE • DOMINATE
              </span>
              <div className="h-px w-20 bg-gradient-to-l from-transparent to-cyan-300" />
            </div>
            <p className="text-gray-300 font-mono text-lg max-w-2xl mx-auto">
              Choose your adventure! Start free or upgrade for unlimited game creation power.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <PricingCard key={plan.title} {...plan} />
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-20 text-center">
            <h2 className="text-3xl font-mono font-bold text-white mb-8">
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="bg-gray-900/60 backdrop-blur-sm border border-purple-400/30 rounded-lg p-6">
                <h3 className="text-cyan-300 font-mono font-bold mb-2">What counts as a message?</h3>
                <p className="text-gray-300 text-sm font-mono">
                  Each interaction with our AI game generator counts as one message. This includes prompts, modifications, and iterations.
                </p>
              </div>
              <div className="bg-gray-900/60 backdrop-blur-sm border border-purple-400/30 rounded-lg p-6">
                <h3 className="text-cyan-300 font-mono font-bold mb-2">Can I upgrade later?</h3>
                <p className="text-gray-300 text-sm font-mono">
                  Absolutely! Start with the free plan and upgrade when you're ready for more features and unlimited creation.
                </p>
              </div>
              <div className="bg-gray-900/60 backdrop-blur-sm border border-purple-400/30 rounded-lg p-6">
                <h3 className="text-cyan-300 font-mono font-bold mb-2">What about commercial use?</h3>
                <p className="text-gray-300 text-sm font-mono">
                  Free plan games are for personal use. Pro and Studio plans include commercial licenses for your creations.
                </p>
              </div>
              <div className="bg-gray-900/60 backdrop-blur-sm border border-purple-400/30 rounded-lg p-6">
                <h3 className="text-cyan-300 font-mono font-bold mb-2">When will Pro/Studio launch?</h3>
                <p className="text-gray-300 text-sm font-mono">
                  We're working hard on these plans! Join the free tier now to be notified when they're ready.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}