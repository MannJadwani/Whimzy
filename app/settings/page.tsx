"use client";

import React, { useState } from 'react';
import { PixelBackground } from '@/components/ui/PixelBackground';
import { RetroNavbar } from '@/components/ui/RetroNavbar';
import { RetroButton } from '@/components/ui/RetroButton';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface SettingsData {
  profile: {
    displayName: string;
    bio: string;
    avatar: string;
    isPublic: boolean;
  };
  preferences: {
    theme: 'dark' | 'neon' | 'classic';
    soundEnabled: boolean;
    animationsEnabled: boolean;
    autoSave: boolean;
    defaultGameType: '2D' | '3D';
  };
  notifications: {
    emailNotifications: boolean;
    gameUpdates: boolean;
    communityUpdates: boolean;
    marketingEmails: boolean;
  };
  privacy: {
    profileVisible: boolean;
    gamesVisible: boolean;
    activityVisible: boolean;
  };
  account: {
    plan: 'free' | 'pro' | 'studio';
    messagesUsed: number;
    messagesLimit: number;
  };
}

const SettingsCard = ({ title, children, icon }: { title: string; children: React.ReactNode; icon: string }) => (
  <div className="bg-gray-900/80 backdrop-blur-sm border-2 border-purple-400/30 hover:border-cyan-400/60 rounded-lg overflow-hidden transition-all duration-300 shadow-lg hover:shadow-purple-500/25">
    <div className="bg-gradient-to-r from-purple-600/20 to-cyan-600/20 p-4 border-b border-purple-400/30">
      <h3 className="text-white font-mono font-bold text-lg flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        {title}
      </h3>
    </div>
    <div className="p-6">
      {children}
    </div>
    
    {/* Pixel corner decorations */}
    <div className="absolute top-1 left-1 w-2 h-2 bg-purple-400 opacity-60" />
    <div className="absolute top-1 right-1 w-2 h-2 bg-cyan-400 opacity-60" />
    <div className="absolute bottom-1 left-1 w-2 h-2 bg-cyan-400 opacity-60" />
    <div className="absolute bottom-1 right-1 w-2 h-2 bg-purple-400 opacity-60" />
  </div>
);

const ToggleSwitch = ({ enabled, onToggle, label }: { enabled: boolean; onToggle: () => void; label: string }) => (
  <div className="flex items-center justify-between py-2">
    <span className="text-gray-300 font-mono text-sm">{label}</span>
    <button
      onClick={onToggle}
      className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
        enabled ? 'bg-gradient-to-r from-purple-500 to-cyan-500' : 'bg-gray-600'
      }`}
    >
      <div
        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
          enabled ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
    </button>
  </div>
);

export default function SettingsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [settings, setSettings] = useState<SettingsData>({
    profile: {
      displayName: session?.user?.name || 'Anonymous Player',
      bio: 'Game creator and digital artist',
      avatar: session?.user?.image || '',
      isPublic: true,
    },
    preferences: {
      theme: 'dark',
      soundEnabled: true,
      animationsEnabled: true,
      autoSave: true,
      defaultGameType: '2D',
    },
    notifications: {
      emailNotifications: true,
      gameUpdates: true,
      communityUpdates: false,
      marketingEmails: false,
    },
    privacy: {
      profileVisible: true,
      gamesVisible: true,
      activityVisible: false,
    },
    account: {
      plan: 'free',
      messagesUsed: 3,
      messagesLimit: 5,
    },
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const updateSettings = (section: keyof SettingsData, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
    setHasUnsavedChanges(true);
  };

  const handleSaveSettings = () => {
    // Here you would save to your backend
    console.log('Saving settings:', settings);
    setHasUnsavedChanges(false);
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your games and data.')) {
      // Handle account deletion
      signOut({ callbackUrl: '/' });
    }
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen relative">
      <PixelBackground />
      <RetroNavbar />
      
      <div className="relative z-10 pt-20 pb-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent font-mono tracking-wider drop-shadow-2xl">
              SETTINGS
            </h1>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-20 bg-gradient-to-r from-transparent to-purple-300" />
              <span className="text-purple-200 font-mono text-lg tracking-widest font-bold">
                CONFIGURE • CUSTOMIZE • CONTROL
              </span>
              <div className="h-px w-20 bg-gradient-to-l from-transparent to-cyan-300" />
            </div>
            <p className="text-gray-300 font-mono text-lg max-w-2xl mx-auto">
              Customize your gaming experience and manage your account preferences
            </p>
          </div>

          {/* Save Button */}
          {hasUnsavedChanges && (
            <div className="fixed bottom-6 right-6 z-50">
              <RetroButton
                size="lg"
                variant="accent"
                onClick={handleSaveSettings}
                className="shadow-lg shadow-cyan-500/25"
              >
                💾 SAVE CHANGES
              </RetroButton>
            </div>
          )}

          {/* Settings Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Profile Settings */}
            <SettingsCard title="PROFILE" icon="👤">
              <div className="space-y-4">
                <div>
                  <label className="block text-cyan-300 font-mono text-sm mb-2">Display Name</label>
                  <input
                    type="text"
                    value={settings.profile.displayName}
                    onChange={(e) => updateSettings('profile', 'displayName', e.target.value)}
                    className="w-full bg-gray-800/50 border border-purple-400/30 rounded px-3 py-2 text-white font-mono text-sm focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-cyan-300 font-mono text-sm mb-2">Bio</label>
                  <textarea
                    value={settings.profile.bio}
                    onChange={(e) => updateSettings('profile', 'bio', e.target.value)}
                    rows={3}
                    className="w-full bg-gray-800/50 border border-purple-400/30 rounded px-3 py-2 text-white font-mono text-sm focus:border-cyan-400 focus:outline-none resize-none"
                  />
                </div>
                <ToggleSwitch
                  enabled={settings.profile.isPublic}
                  onToggle={() => updateSettings('profile', 'isPublic', !settings.profile.isPublic)}
                  label="Public Profile"
                />
              </div>
            </SettingsCard>

            {/* Account Info */}
            <SettingsCard title="ACCOUNT" icon="🎮">
              <div className="space-y-4">
                <div className="bg-gray-800/30 rounded p-4 border border-purple-400/20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300 font-mono text-sm">Current Plan</span>
                    <span className="text-cyan-300 font-mono font-bold uppercase">{settings.account.plan}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300 font-mono text-sm">Messages Used</span>
                    <span className="text-purple-300 font-mono">
                      {settings.account.messagesUsed}/{settings.account.messagesLimit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full"
                      style={{ width: `${(settings.account.messagesUsed / settings.account.messagesLimit) * 100}%` }}
                    />
                  </div>
                  <RetroButton
                    size="sm"
                    variant="primary"
                    onClick={() => router.push('/pricing')}
                    className="w-full"
                  >
                    UPGRADE PLAN
                  </RetroButton>
                </div>
                
                {session?.user && (
                  <div className="space-y-3">
                    <RetroButton
                      size="sm"
                      variant="secondary"
                      onClick={handleSignOut}
                      className="w-full"
                    >
                      SIGN OUT
                    </RetroButton>
                    <RetroButton
                      size="sm"
                      variant="accent"
                      onClick={handleDeleteAccount}
                      className="w-full"
                    >
                      DELETE ACCOUNT
                    </RetroButton>
                  </div>
                )}
              </div>
            </SettingsCard>

            {/* Game Preferences */}
            <SettingsCard title="GAME PREFERENCES" icon="🎯">
              <div className="space-y-4">
                <div>
                  <label className="block text-cyan-300 font-mono text-sm mb-2">Theme</label>
                  <select
                    value={settings.preferences.theme}
                    onChange={(e) => updateSettings('preferences', 'theme', e.target.value)}
                    className="w-full bg-gray-800/50 border border-purple-400/30 rounded px-3 py-2 text-white font-mono text-sm focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="dark">Dark Mode</option>
                    <option value="neon">Neon Mode</option>
                    <option value="classic">Classic Mode</option>
                  </select>
                </div>
                <div>
                  <label className="block text-cyan-300 font-mono text-sm mb-2">Default Game Type</label>
                  <select
                    value={settings.preferences.defaultGameType}
                    onChange={(e) => updateSettings('preferences', 'defaultGameType', e.target.value)}
                    className="w-full bg-gray-800/50 border border-purple-400/30 rounded px-3 py-2 text-white font-mono text-sm focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="2D">2D Games</option>
                    <option value="3D">3D Games</option>
                  </select>
                </div>
                <ToggleSwitch
                  enabled={settings.preferences.soundEnabled}
                  onToggle={() => updateSettings('preferences', 'soundEnabled', !settings.preferences.soundEnabled)}
                  label="Sound Effects"
                />
                <ToggleSwitch
                  enabled={settings.preferences.animationsEnabled}
                  onToggle={() => updateSettings('preferences', 'animationsEnabled', !settings.preferences.animationsEnabled)}
                  label="Animations"
                />
                <ToggleSwitch
                  enabled={settings.preferences.autoSave}
                  onToggle={() => updateSettings('preferences', 'autoSave', !settings.preferences.autoSave)}
                  label="Auto-Save Projects"
                />
              </div>
            </SettingsCard>

            {/* Notifications */}
            <SettingsCard title="NOTIFICATIONS" icon="🔔">
              <div className="space-y-4">
                <ToggleSwitch
                  enabled={settings.notifications.emailNotifications}
                  onToggle={() => updateSettings('notifications', 'emailNotifications', !settings.notifications.emailNotifications)}
                  label="Email Notifications"
                />
                <ToggleSwitch
                  enabled={settings.notifications.gameUpdates}
                  onToggle={() => updateSettings('notifications', 'gameUpdates', !settings.notifications.gameUpdates)}
                  label="Game Updates"
                />
                <ToggleSwitch
                  enabled={settings.notifications.communityUpdates}
                  onToggle={() => updateSettings('notifications', 'communityUpdates', !settings.notifications.communityUpdates)}
                  label="Community Updates"
                />
                <ToggleSwitch
                  enabled={settings.notifications.marketingEmails}
                  onToggle={() => updateSettings('notifications', 'marketingEmails', !settings.notifications.marketingEmails)}
                  label="Marketing Emails"
                />
              </div>
            </SettingsCard>

            {/* Privacy Settings */}
            <SettingsCard title="PRIVACY" icon="🔒">
              <div className="space-y-4">
                <ToggleSwitch
                  enabled={settings.privacy.profileVisible}
                  onToggle={() => updateSettings('privacy', 'profileVisible', !settings.privacy.profileVisible)}
                  label="Profile Visible to Others"
                />
                <ToggleSwitch
                  enabled={settings.privacy.gamesVisible}
                  onToggle={() => updateSettings('privacy', 'gamesVisible', !settings.privacy.gamesVisible)}
                  label="Games Visible in Gallery"
                />
                <ToggleSwitch
                  enabled={settings.privacy.activityVisible}
                  onToggle={() => updateSettings('privacy', 'activityVisible', !settings.privacy.activityVisible)}
                  label="Activity Status Visible"
                />
                <div className="mt-6 p-4 bg-gray-800/30 rounded border border-yellow-400/30">
                  <p className="text-yellow-300 font-mono text-xs">
                    ⚠️ Privacy settings control how others can discover and interact with your content
                  </p>
                </div>
              </div>
            </SettingsCard>

            {/* Data & Storage */}
            <SettingsCard title="DATA & STORAGE" icon="💾">
              <div className="space-y-4">
                <div className="bg-gray-800/30 rounded p-4 border border-purple-400/20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300 font-mono text-sm">Games Created</span>
                    <span className="text-cyan-300 font-mono">3</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300 font-mono text-sm">Storage Used</span>
                    <span className="text-purple-300 font-mono">2.5 MB</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 font-mono text-sm">Backup Date</span>
                    <span className="text-green-300 font-mono">Today</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <RetroButton
                    size="sm"
                    variant="secondary"
                    className="w-full"
                  >
                    📤 EXPORT ALL DATA
                  </RetroButton>
                  <RetroButton
                    size="sm"
                    variant="primary"
                    className="w-full"
                  >
                    🔄 BACKUP GAMES
                  </RetroButton>
                  <RetroButton
                    size="sm"
                    variant="accent"
                    className="w-full"
                  >
                    🗑️ CLEAR CACHE
                  </RetroButton>
                </div>
              </div>
            </SettingsCard>

          </div>

          {/* Help Section */}
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-mono font-bold text-white mb-6">NEED HELP?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <RetroButton
                size="lg"
                variant="secondary"
                onClick={() => router.push('/docs')}
                className="flex items-center justify-center gap-2"
              >
                📚 DOCUMENTATION
              </RetroButton>
              <RetroButton
                size="lg"
                variant="primary"
                onClick={() => router.push('/support')}
                className="flex items-center justify-center gap-2"
              >
                🎧 SUPPORT
              </RetroButton>
              <RetroButton
                size="lg"
                variant="accent"
                onClick={() => router.push('/feedback')}
                className="flex items-center justify-center gap-2"
              >
                💭 FEEDBACK
              </RetroButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}