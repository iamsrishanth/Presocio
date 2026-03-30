'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Camera,
  ThumbsUp,
  Network,
  Play,
  X,
  CheckCircle2,
  Clock,
  TrendingUp,
  Sparkles,
  Calendar,
  BarChart3,
  Zap,
  Shield,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Platform } from '@/types';
import { useAnalyticsStore, useMockDataStore } from '@/store';
import { getMockDashboardStats } from '@/lib/mock-data';

// ── Platform Config ───────────────────────────────────────────────

const platformConfig: Record<Platform, { 
  name: string; 
  shortName: string;
  icon: React.ElementType;
  bgColor: string;
  features: string[];
  limits: string;
}> = {
  instagram: {
    name: 'Instagram',
    shortName: 'IG',
    icon: Camera,
    bgColor: 'bg-gradient-to-br from-[#f09433]/20 via-[#e6683c]/20 to-[#dc2743]/20',
    features: ['Feed Posts', 'Reels', 'Carousels', 'Stories'],
    limits: 'Caption: 2,200 chars | 30 hashtags',
  },
  facebook: {
    name: 'Facebook',
    shortName: 'FB',
    icon: ThumbsUp,
    bgColor: 'bg-[#1877f2]/20',
    features: ['Page Posts', 'Videos', 'Link Previews', 'Scheduled'],
    limits: 'Caption: 63,206 chars | Rate: 200/hr',
  },
  linkedin: {
    name: 'LinkedIn',
    shortName: 'LI',
    icon: Network,
    bgColor: 'bg-[#0a66c2]/20',
    features: ['Company Posts', 'Articles', 'Documents', 'Video'],
    limits: 'Caption: 3,000 chars | 100 posts/day',
  },
  youtube: {
    name: 'YouTube',
    shortName: 'YT',
    icon: Play,
    bgColor: 'bg-[#ff0000]/20',
    features: ['Video Upload', 'Shorts', 'Community', 'Thumbnails'],
    limits: 'Title: 100 chars | 5,000 quota/day',
  },
  x: {
    name: 'X (Twitter)',
    shortName: 'X',
    icon: X,
    bgColor: 'bg-[#71767b]/20',
    features: ['Tweets', 'Threads', 'Media Upload', 'Polls'],
    limits: 'Caption: 280 chars | 1,500/mo (free)',
  },
};

// ── Stat Card ─────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  index: number;
}

function StatCard({ label, value, icon: Icon, color, index }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="glass-card p-3 sm:p-4"
    >
      {/* Mobile: stacked icon-on-top. Desktop: horizontal */}
      <div className="flex flex-col xs:flex-row sm:items-center gap-2 sm:gap-3">
        <div className={cn(
          'w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-surface flex items-center justify-center flex-shrink-0',
          color
        )}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="min-w-0">
          <div className="text-[10px] sm:text-xs text-muted leading-tight">{label}</div>
          <div className="font-syne font-bold text-lg sm:text-xl text-text leading-tight">{value}</div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Platform Card ─────────────────────────────────────────────────

interface PlatformCardProps {
  platform: Platform;
  connected: boolean;
  postsCount: number;
  engagement: number;
}

function PlatformCard({ platform, connected, postsCount, engagement }: PlatformCardProps) {
  const config = platformConfig[platform];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'glass-card transition-all duration-300 group',
        // Mobile: horizontal compact. Desktop: vertical card
        'p-3 sm:p-5',
        connected && 'border-accent3/30'
      )}
    >
      {/* Mobile layout: horizontal row */}
      <div className="flex sm:hidden items-center gap-3">
        <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0', config.bgColor)}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-syne font-bold text-xs text-text truncate">{config.name}</h3>
            {connected ? (
              <CheckCircle2 className="w-3 h-3 text-accent3 flex-shrink-0" />
            ) : (
              <Clock className="w-3 h-3 text-dimmed flex-shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-[10px] text-muted">{postsCount} posts</span>
            <span className="text-[10px] text-accent3 font-semibold">{engagement.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Desktop layout: vertical card */}
      <div className="hidden sm:block">
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', config.bgColor)}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-syne font-bold text-sm text-text">{config.name}</h3>
              <div className="flex items-center gap-1">
                {connected ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-accent3" />
                    <span className="text-xs text-accent3">Connected</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-3 h-3 text-dimmed" />
                    <span className="text-xs text-dimmed">Not connected</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="bg-surface/50 rounded-lg p-2 sm:p-3">
            <div className="text-[10px] sm:text-xs text-muted mb-0.5 sm:mb-1">Posts</div>
            <div className="font-syne font-bold text-base sm:text-lg text-text">{postsCount}</div>
          </div>
          <div className="bg-surface/50 rounded-lg p-2 sm:p-3">
            <div className="text-[10px] sm:text-xs text-muted mb-0.5 sm:mb-1">Engagement</div>
            <div className="font-syne font-bold text-base sm:text-lg text-accent3">{engagement.toFixed(1)}%</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-2 sm:mb-3">
          {config.features.slice(0, 3).map((feature) => (
            <span key={feature} className="tag tag-purple text-[10px]">
              {feature}
            </span>
          ))}
        </div>

        <p className="text-[10px] text-dimmed hidden md:block">{config.limits}</p>
      </div>
    </motion.div>
  );
}

// ── AI Feature Card ───────────────────────────────────────────────

interface AIFeatureCardProps {
  icon: React.ElementType;
  title: string;
  desc: string;
  index: number;
}

function AIFeatureCard({ icon: Icon, title, desc, index }: AIFeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.06 }}
      className="flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-lg bg-surface/50 hover:bg-surface transition-colors flex-shrink-0"
    >
      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-accent2/10 flex items-center justify-center flex-shrink-0">
        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent2" />
      </div>
      <div className="min-w-0">
        <div className="font-syne font-semibold text-xs sm:text-sm text-text">{title}</div>
        <div className="text-[10px] sm:text-xs text-muted mt-0.5">{desc}</div>
      </div>
    </motion.div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────

export function Dashboard() {
  const liveAnalytics = useAnalyticsStore();
  const { mockDataEnabled } = useMockDataStore();

  const mockStats = mockDataEnabled ? getMockDashboardStats() : null;
  const totalPosts = mockStats ? mockStats.totalPosts : liveAnalytics.totalPosts;
  const scheduledPosts = mockStats ? mockStats.scheduledPosts : liveAnalytics.scheduledPosts;
  const publishedPosts = mockStats ? mockStats.publishedPosts : liveAnalytics.publishedPosts;
  const averageEngagement = mockStats ? mockStats.averageEngagement : liveAnalytics.averageEngagement;
  const platformStats = mockStats ? mockStats.platformStats : liveAnalytics.platformStats;

  const [connectedPlatforms, setConnectedPlatforms] = useState<Set<Platform>>(new Set());
  const [loadingAccounts, setLoadingAccounts] = useState(true);

  useEffect(() => {
    if (mockDataEnabled) {
      const mock = getMockDashboardStats();
      setConnectedPlatforms(new Set(mock.connectedPlatforms));
      setLoadingAccounts(false);
      return;
    }

    const fetchAccounts = async () => {
      try {
        const res = await fetch('/api/social?action=accounts');
        const data = await res.json();
        if (data.success && data.accounts) {
          const connected = new Set<Platform>(
            data.accounts
              .filter((a: { connected: boolean; platform: string }) => a.connected)
              .map((a: { platform: string }) => a.platform as Platform)
          );
          setConnectedPlatforms(connected);
        }
      } catch {
        // Silently fail
      } finally {
        setLoadingAccounts(false);
      }
    };
    fetchAccounts();
  }, [mockDataEnabled]);

  const stats = [
    { label: 'Total Posts', value: totalPosts, icon: Sparkles, color: 'text-accent2' },
    { label: 'Scheduled', value: scheduledPosts, icon: Calendar, color: 'text-accent4' },
    { label: 'Published', value: publishedPosts, icon: CheckCircle2, color: 'text-accent3' },
    { label: 'Engagement', value: `${averageEngagement.toFixed(1)}%`, icon: TrendingUp, color: 'text-accent' },
  ];

  const platforms: Platform[] = ['instagram', 'facebook', 'linkedin', 'youtube', 'x'];
  const platformDerivedStats = platforms.map((platform) => {
    const stat = platformStats[platform];
    return { 
      platform, 
      postsCount: stat.posts, 
      engagement: stat.engagement, 
      connected: connectedPlatforms.has(platform) 
    };
  });

  const features = [
    { icon: Zap, title: 'AI-Powered Generation', desc: 'Gemini 2.5 Flash + Llama 3.3' },
    { icon: Sparkles, title: 'Brand Voice Preserved', desc: 'Consistent tone across all posts' },
    { icon: BarChart3, title: 'Engagement Scoring', desc: 'Predictive ML-based analysis' },
    { icon: Shield, title: 'Approval Workflow', desc: 'Team review with audit trail' },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* ── Stats Grid ──────────────────────────────────────────── */}
      {/* Mobile: 2-col grid. Desktop: 4-col grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {stats.map((stat, i) => (
          <StatCard key={stat.label} {...stat} index={i} />
        ))}
      </div>

      {/* ── Main Content ────────────────────────────────────────── */}
      {/* Mobile: stacked. Desktop: 2-col side-by-side */}
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 sm:gap-6">

        {/* ── Platform Connections ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-3 sm:p-5"
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="font-syne font-bold text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent2" />
              Platform Connections
            </h3>
            {loadingAccounts && (
              <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted animate-spin" />
            )}
          </div>

          {/* Mobile: single column list. Tablet: 2-col. Desktop: 2-col */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {platformDerivedStats.map(({ platform, postsCount, engagement, connected }) => (
              <PlatformCard
                key={platform}
                platform={platform}
                connected={connected}
                postsCount={postsCount}
                engagement={engagement}
              />
            ))}
          </div>
        </motion.div>

        {/* ── AI Capabilities ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-3 sm:p-5"
        >
          <h3 className="font-syne font-bold text-xs sm:text-sm mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2">
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent" />
            AI Capabilities
          </h3>

          {/* Mobile: horizontal scroll. Desktop: vertical stack */}
          <div className="flex gap-2.5 overflow-x-auto scrollbar-hidden pb-1 sm:hidden">
            {features.map((feature, i) => (
              <div key={feature.title} className="min-w-[200px] flex-shrink-0">
                <AIFeatureCard {...feature} index={i} />
              </div>
            ))}
          </div>

          <div className="hidden sm:block space-y-2.5 sm:space-y-3">
            {features.map((feature, i) => (
              <AIFeatureCard key={feature.title} {...feature} index={i} />
            ))}
          </div>

          {totalPosts === 0 && (
            <div className="mt-3 sm:mt-4 p-3 sm:p-4 rounded-lg bg-accent2/5 border border-accent2/20 text-center">
              <p className="text-[10px] sm:text-xs text-muted">
                Create your first campaign to see live stats here
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
