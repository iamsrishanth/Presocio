'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Bell,
  Palette,
  Key,
  Globe,
  Shield,
  Camera,
  ThumbsUp,
  Network,
  Play,
  X,
  CheckCircle2,
  Clock,
  ExternalLink,
  Save,
  Moon,
  Sun,
  Monitor,
  Loader2,
  AlertCircle,
  RefreshCw,
  Database,
  Beaker,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Platform, ContentTone } from '@/types';
import { useThemeStore, useMockDataStore, type ThemeMode } from '@/store';
import { getMockConnectedAccounts } from '@/lib/mock-data';

const platformIcons: Record<Platform, React.ElementType> = {
  instagram: Camera,
  facebook: ThumbsUp,
  linkedin: Network,
  youtube: Play,
  x: X,
};

const platformColors: Record<Platform, string> = {
  instagram: 'from-[#f09433] to-[#dc2743]',
  facebook: 'from-[#1877f2] to-[#0d5bbf]',
  linkedin: 'from-[#0a66c2] to-[#004182]',
  youtube: 'from-[#ff0000] to-[#cc0000]',
  x: 'from-[#71767b] to-[#536471]',
};

const platformDisplayNames: Record<Platform, string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
  x: 'X (Twitter)',
};

// Map Zernio platform strings back to our Platform type
const ZERNIO_PLATFORM_MAP: Record<string, Platform> = {
  instagram: 'instagram',
  facebook: 'facebook',
  linkedin: 'linkedin',
  youtube: 'youtube',
  twitter: 'x',
};

type SettingsTab = 'profile' | 'platforms' | 'api' | 'notifications' | 'appearance' | 'data';

const tabs: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'platforms', label: 'Platforms', icon: Globe },
  { id: 'api', label: 'API Keys', icon: Key },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'data', label: 'Data', icon: Database },
];

interface ConnectedAccount {
  _id: string;
  platform: Platform;
  accountName: string;
  connectedAt: string;
}

interface ZernioProfile {
  _id: string;
  name: string;
}

export function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [saved, setSaved] = useState(false);

  // Profile state
  const [brandName, setBrandName] = useState('Presocio');
  const [defaultTone, setDefaultTone] = useState<ContentTone>('professional');
  const [timezone, setTimezone] = useState('America/New_York');
  const [email, setEmail] = useState('demo@presocio.com');

  // Notification state
  const [notifyOnPublish, setNotifyOnPublish] = useState(true);
  const [notifyOnEngagement, setNotifyOnEngagement] = useState(true);
  const [notifyOnFailure, setNotifyOnFailure] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  // Appearance state — uses global theme store
  const { theme, setTheme } = useThemeStore();

  // Mock data toggle
  const { mockDataEnabled, toggleMockData } = useMockDataStore();

  // Platform connections state
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([]);
  const [zernioProfile, setZernioProfile] = useState<ZernioProfile | null>(null);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const [isConnecting, setIsConnecting] = useState<Platform | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [accountsError, setAccountsError] = useState<string | null>(null);

  // Fetch connected accounts and profiles from Zernio
  const fetchAccounts = useCallback(async () => {
    setIsLoadingAccounts(true);
    setAccountsError(null);
    try {
      const res = await fetch('/api/social', { method: 'GET' });
      const data = await res.json();

      if (data.mode === 'demo') {
        setIsDemoMode(true);
        setConnectedAccounts([]);
        setZernioProfile(null);
        return;
      }

      setIsDemoMode(false);

      // Map accounts to our format
      if (data.accounts && Array.isArray(data.accounts)) {
        const mapped: ConnectedAccount[] = data.accounts.map((acc: { _id: string; platform: string; name?: string; username?: string; connectedAt?: string }) => ({
          _id: acc._id,
          platform: ZERNIO_PLATFORM_MAP[acc.platform] || acc.platform,
          accountName: acc.name || acc.username || acc.platform,
          connectedAt: acc.connectedAt ? new Date(acc.connectedAt).toISOString().split('T')[0] : 'Unknown',
        }));
        setConnectedAccounts(mapped);
      }

      // Store the first profile for connect URLs
      if (data.profiles && data.profiles.length > 0) {
        setZernioProfile(data.profiles[0]);
      }
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
      setAccountsError('Failed to load connected accounts');
      setIsDemoMode(true);
    } finally {
      setIsLoadingAccounts(false);
    }
  }, []);

  // Load accounts on mount and when platforms tab is active
  useEffect(() => {
    if (activeTab === 'platforms') {
      fetchAccounts();
    }
  }, [activeTab, fetchAccounts]);

  // Create a Zernio profile if none exists
  const ensureProfile = async (): Promise<string | null> => {
    if (zernioProfile) return zernioProfile._id;

    try {
      const res = await fetch('/api/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create-profile', name: brandName || 'Presocio' }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        const profile = { _id: data.data._id, name: data.data.name };
        setZernioProfile(profile);
        return profile._id;
      }
    } catch (error) {
      console.error('Failed to create profile:', error);
    }
    return null;
  };

  // Connect a platform via Zernio OAuth
  const handleConnect = async (platform: Platform) => {
    setIsConnecting(platform);
    try {
      // Ensure we have a profile
      const profileId = await ensureProfile();
      if (!profileId) {
        alert('Failed to create Zernio profile. Please check your API key.');
        return;
      }

      // Get the OAuth connect URL
      const res = await fetch('/api/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'connect',
          platforms: [platform],
          profileId,
        }),
      });
      const data = await res.json();

      if (data.success && data.data && data.data[platform]) {
        // Redirect to Zernio's OAuth page
        window.location.href = data.data[platform];
      } else {
        alert(`Failed to get connect URL for ${platformDisplayNames[platform]}`);
      }
    } catch (error) {
      console.error('Connect error:', error);
      alert(`Failed to connect ${platformDisplayNames[platform]}`);
    } finally {
      setIsConnecting(null);
    }
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Build the full list of platforms with connection status
  const allPlatforms: Platform[] = ['instagram', 'facebook', 'linkedin', 'youtube', 'x'];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-syne font-bold text-sm text-text mb-4">Brand Profile</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted mb-1.5 block">Brand Name</label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-1 focus:ring-accent2"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted mb-1.5 block">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-1 focus:ring-accent2"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted mb-1.5 block">Default Content Tone</label>
                  <select
                    value={defaultTone}
                    onChange={(e) => setDefaultTone(e.target.value as ContentTone)}
                    className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-1 focus:ring-accent2"
                  >
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="witty">Witty</option>
                    <option value="inspirational">Inspirational</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted mb-1.5 block">Timezone</label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-1 focus:ring-accent2"
                  >
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="Europe/London">London (GMT)</option>
                    <option value="Europe/Berlin">Berlin (CET)</option>
                    <option value="Asia/Tokyo">Tokyo (JST)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t border-border/50 pt-6">
              <h3 className="font-syne font-bold text-sm text-text mb-4">Default Platforms</h3>
              <p className="text-xs text-muted mb-3">Platforms auto-selected when creating new campaigns</p>
              <div className="flex flex-wrap gap-2">
                {allPlatforms.map((p) => {
                  const Icon = platformIcons[p];
                  const isConnected = connectedAccounts.some((a) => a.platform === p);
                  return (
                    <button
                      key={p}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:border-accent2/50 transition-colors',
                        isConnected ? 'bg-surface/50' : 'bg-surface/20 opacity-50'
                      )}
                    >
                      <div className={cn('w-6 h-6 rounded-md flex items-center justify-center bg-gradient-to-br', platformColors[p])}>
                        <Icon className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="text-xs text-text capitalize">{p === 'x' ? 'X' : p}</span>
                      {isConnected && <CheckCircle2 className="w-3.5 h-3.5 text-accent3" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'platforms':
        // Use mock connected accounts when mock data is enabled
        const displayAccounts = mockDataEnabled ? getMockConnectedAccounts() : connectedAccounts;
        const displayDemoMode = mockDataEnabled ? false : isDemoMode;
        const displayLoading = mockDataEnabled ? false : isLoadingAccounts;

        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-syne font-bold text-sm text-text mb-1">Connected Platforms</h3>
                <p className="text-xs text-muted">
                  {mockDataEnabled
                    ? 'Showing simulated connected accounts'
                    : displayDemoMode
                    ? 'Configure ZERNIO_API_KEY in .env.local to connect your social accounts'
                    : 'Manage your social media account connections via Zernio'}
                </p>
              </div>
              {!displayDemoMode && !mockDataEnabled && (
                <button
                  onClick={fetchAccounts}
                  disabled={isLoadingAccounts}
                  className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
                >
                  <RefreshCw className={cn('w-3.5 h-3.5', isLoadingAccounts && 'animate-spin')} />
                  Refresh
                </button>
              )}
            </div>

            {mockDataEnabled && (
              <div className="glass-card p-4 flex items-start gap-3 border border-accent2/20 bg-accent2/5">
                <Beaker className="w-5 h-5 text-accent2 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-syne font-semibold text-sm text-text">Simulated Data Mode</h4>
                  <p className="text-xs text-muted mt-1">
                    These are mock connected accounts for demo purposes. Toggle off in{' '}
                    <span className="text-accent2 font-semibold">Settings → Data</span> to use real accounts.
                  </p>
                </div>
              </div>
            )}

            {displayDemoMode && (
              <div className="glass-card p-4 flex items-start gap-3 border border-yellow-500/20 bg-yellow-500/5">
                <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-syne font-semibold text-sm text-text">Demo Mode</h4>
                  <p className="text-xs text-muted mt-1">
                    Add your Zernio API key to <code className="bg-surface px-1.5 py-0.5 rounded text-accent2">.env.local</code> to connect real social accounts.
                    <br />
                    Get your free API key at{' '}
                    <a href="https://zernio.com" target="_blank" rel="noopener noreferrer" className="text-accent2 hover:underline">
                      zernio.com
                    </a>
                  </p>
                </div>
              </div>
            )}

            {accountsError && !mockDataEnabled && (
              <div className="glass-card p-4 flex items-start gap-3 border border-red-500/20 bg-red-500/5">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-syne font-semibold text-sm text-text">Error</h4>
                  <p className="text-xs text-muted mt-1">{accountsError}</p>
                </div>
              </div>
            )}

            {displayLoading ? (
              <div className="glass-card p-8 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-accent2 animate-spin" />
                <span className="ml-3 text-sm text-muted">Loading accounts...</span>
              </div>
            ) : (
              allPlatforms.map((platform) => {
                const Icon = platformIcons[platform];
                const connection = displayAccounts.find((a) => a.platform === platform);
                const isConnected = !!connection;
                const connecting = isConnecting === platform;

                return (
                  <motion.div
                    key={platform}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br',
                        platformColors[platform]
                      )}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-syne font-semibold text-sm text-text">
                          {platformDisplayNames[platform]}
                        </h4>
                        {isConnected ? (
                          <div className="flex items-center gap-2 mt-0.5">
                            <CheckCircle2 className="w-3 h-3 text-accent3" />
                            <span className="text-xs text-accent3">{connection.accountName}</span>
                            <span className="text-[10px] text-dimmed">· Connected {connection.connectedAt}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 mt-0.5">
                            <Clock className="w-3 h-3 text-dimmed" />
                            <span className="text-xs text-dimmed">Not connected</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleConnect(platform)}
                      disabled={connecting || displayDemoMode || mockDataEnabled}
                      className={cn(
                        'btn-secondary text-xs py-2 px-4 flex items-center gap-1.5',
                        !isConnected && !displayDemoMode && !mockDataEnabled && 'btn-primary',
                        (connecting || displayDemoMode || mockDataEnabled) && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      {connecting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Connecting...
                        </>
                      ) : isConnected ? (
                        <>
                          <Shield className="w-3.5 h-3.5" />
                          Reconnect
                        </>
                      ) : (
                        <>
                          <ExternalLink className="w-3.5 h-3.5" />
                          Connect
                        </>
                      )}
                    </button>
                  </motion.div>
                );
              })
            )}
          </div>
        );

      case 'api':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-syne font-bold text-sm text-text mb-1">API Configuration</h3>
              <p className="text-xs text-muted mb-4">Manage your API keys for AI and social publishing</p>
            </div>

            <div className="glass-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-syne font-semibold text-sm text-text">Zernio API Key</h4>
                  <p className="text-xs text-muted mt-0.5">Social media publishing via Zernio unified API</p>
                </div>
                <span className="tag tag-green text-[10px]">Configured</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="password"
                  value="sk_••••••••••••••••••••"
                  readOnly
                  className="flex-1 bg-surface border border-border rounded-lg px-4 py-2.5 text-sm text-text font-mono focus:outline-none"
                />
                <button className="btn-secondary text-xs py-2.5 px-4">Reveal</button>
              </div>
              <p className="text-[10px] text-dimmed">Free tier: 20 posts/month · 14 platforms · getlate.dev</p>
            </div>

            <div className="glass-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-syne font-semibold text-sm text-text">Gemini API Key</h4>
                  <p className="text-xs text-muted mt-0.5">AI content generation via Google Gemini</p>
                </div>
                <span className="tag tag-green text-[10px]">Connected</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="password"
                  value="AIza••••••••••••••••••••••••••••"
                  readOnly
                  className="flex-1 bg-surface border border-border rounded-lg px-4 py-2.5 text-sm text-text font-mono focus:outline-none"
                />
                <button className="btn-secondary text-xs py-2.5 px-4">Reveal</button>
              </div>
              <p className="text-[10px] text-dimmed">Model: gemini-3-flash-preview · aistudio.google.com</p>
            </div>

            <div className="glass-card p-5 space-y-4">
              <h4 className="font-syne font-semibold text-sm text-text">Environment Variables</h4>
              <p className="text-xs text-muted">Add these to your <code className="bg-surface px-1.5 py-0.5 rounded text-accent2">.env.local</code> file:</p>
              <pre className="bg-surface rounded-lg p-4 text-xs text-text font-mono overflow-x-auto">
{`ZERNIO_API_KEY=sk_your_key_here
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-3-flash-preview`}
              </pre>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-syne font-bold text-sm text-text mb-1">Notification Preferences</h3>
              <p className="text-xs text-muted mb-4">Choose which notifications you want to receive</p>
            </div>

            {[
              { label: 'Post Published', desc: 'Get notified when a post is successfully published', state: notifyOnPublish, setter: setNotifyOnPublish },
              { label: 'Engagement Alerts', desc: 'Notifications for significant engagement milestones', state: notifyOnEngagement, setter: setNotifyOnEngagement },
              { label: 'Publishing Failures', desc: 'Immediate alerts when a post fails to publish', state: notifyOnFailure, setter: setNotifyOnFailure },
              { label: 'Weekly Digest', desc: 'Summary of your social media performance every Monday', state: weeklyDigest, setter: setWeeklyDigest },
            ].map((item) => (
              <div key={item.label} className="glass-card p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-syne font-semibold text-sm text-text">{item.label}</h4>
                  <p className="text-xs text-muted mt-0.5">{item.desc}</p>
                </div>
                <button
                  onClick={() => item.setter(!item.state)}
                  className={cn(
                    'w-11 h-6 rounded-full transition-colors relative',
                    item.state ? 'bg-accent2' : 'bg-surface'
                  )}
                >
                  <div className={cn(
                    'w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform shadow',
                    item.state ? 'translate-x-[22px]' : 'translate-x-0.5'
                  )} />
                </button>
              </div>
            ))}
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-syne font-bold text-sm text-text mb-1">Appearance</h3>
              <p className="text-xs text-muted mb-4">Customize how Presocio looks</p>
            </div>

            <div>
              <label className="text-xs text-muted mb-3 block">Theme</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'dark' as const, label: 'Dark', icon: Moon },
                  { id: 'light' as const, label: 'Light', icon: Sun },
                  { id: 'system' as const, label: 'System', icon: Monitor },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id as ThemeMode)}
                    className={cn(
                      'glass-card p-4 flex flex-col items-center gap-2 transition-all',
                      theme === t.id && 'ring-2 ring-accent2/50 bg-accent2/5'
                    )}
                  >
                    <t.icon className={cn('w-6 h-6', theme === t.id ? 'text-accent2' : 'text-muted')} />
                    <span className={cn('text-xs font-semibold', theme === t.id ? 'text-accent2' : 'text-muted')}>
                      {t.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'data':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-syne font-bold text-sm text-text mb-1">Data Settings</h3>
              <p className="text-xs text-muted mb-4">Control how data is displayed across the app</p>
            </div>

            {/* Mock Data Toggle */}
            <div className="glass-card p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    mockDataEnabled ? 'bg-accent2/10' : 'bg-surface'
                  )}>
                    <Beaker className={cn('w-5 h-5', mockDataEnabled ? 'text-accent2' : 'text-muted')} />
                  </div>
                  <div>
                    <h4 className="font-syne font-semibold text-sm text-text">Simulated Data Mode</h4>
                    <p className="text-xs text-muted mt-0.5">
                      Show realistic mock data instead of live data across all views
                    </p>
                  </div>
                </div>
                <button
                  onClick={toggleMockData}
                  className={cn(
                    'w-11 h-6 rounded-full transition-colors relative',
                    mockDataEnabled ? 'bg-accent2' : 'bg-surface'
                  )}
                >
                  <div className={cn(
                    'w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform shadow',
                    mockDataEnabled ? 'translate-x-[22px]' : 'translate-x-0.5'
                  )} />
                </button>
              </div>

              {mockDataEnabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 p-3 rounded-lg bg-accent2/5 border border-accent2/20"
                >
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-accent2 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-muted space-y-1">
                      <p>Simulated data is currently <span className="text-accent2 font-semibold">active</span>. The following views show mock data:</p>
                      <ul className="list-disc list-inside ml-1 space-y-0.5">
                        <li>Dashboard — stats, platform cards, connections</li>
                        <li>Analytics — engagement charts, top posts, scores</li>
                        <li>Calendar — scheduled and published posts</li>
                        <li>Settings → Platforms — connected accounts</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Info Card */}
            <div className="glass-card p-5 space-y-3">
              <h4 className="font-syne font-semibold text-sm text-text">About Simulated Data</h4>
              <p className="text-xs text-muted">
                When enabled, Presocio displays realistic simulated data throughout the app. This is useful for:
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { title: 'Demos', desc: 'Show a fully populated dashboard to clients or stakeholders' },
                  { title: 'Testing', desc: 'Explore all features without connecting real social accounts' },
                  { title: 'Screenshots', desc: 'Capture marketing materials with realistic content' },
                  { title: 'Onboarding', desc: 'Let new users see what a mature account looks like' },
                ].map((item) => (
                  <div key={item.title} className="p-3 rounded-lg bg-surface/50">
                    <div className="font-syne font-semibold text-xs text-text">{item.title}</div>
                    <div className="text-[10px] text-muted mt-1">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reset Warning */}
            {mockDataEnabled && (
              <div className="glass-card p-4 flex items-start gap-3 border border-yellow-500/20 bg-yellow-500/5">
                <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-syne font-semibold text-sm text-text">Note</h4>
                  <p className="text-xs text-muted mt-1">
                    Toggling off simulated data will restore your real workflow data, analytics, and connected accounts.
                    No data is lost — the toggle only controls what is <em>displayed</em>.
                  </p>
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="flex gap-6">
      {/* Sidebar Tabs */}
      <div className="w-48 flex-shrink-0">
        <div className="glass-card p-2 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left',
                activeTab === tab.id
                  ? 'bg-accent2/10 text-accent2 border border-accent2/20'
                  : 'text-muted hover:text-text hover:bg-surface'
              )}
            >
              <tab.icon className="w-4 h-4 flex-shrink-0" />
              <span className="text-xs font-syne font-semibold">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {renderContent()}
        </motion.div>

        {/* Save Button */}
        <div className="mt-6 flex items-center gap-3">
          <button onClick={handleSave} className="btn-primary text-sm py-2.5 px-6 flex items-center gap-2">
            <Save className="w-4 h-4" />
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
          {saved && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xs text-accent3 flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Changes saved successfully
            </motion.span>
          )}
        </div>
      </div>
    </div>
  );
}
