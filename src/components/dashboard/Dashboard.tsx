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
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Platform } from '@/types';
import { useAnalyticsStore } from '@/store';

interface PlatformCardProps {
  platform: Platform;
  connected: boolean;
  postsCount: number;
  engagement: number;
}

const platformConfig: Record<Platform, { 
  name: string; 
  icon: React.ElementType;
  bgColor: string;
  features: string[];
  limits: string;
}> = {
  instagram: {
    name: 'Instagram',
    icon: Camera,
    bgColor: 'bg-gradient-to-br from-[#f09433]/20 via-[#e6683c]/20 to-[#dc2743]/20',
    features: ['Feed Posts', 'Reels', 'Carousels', 'Stories'],
    limits: 'Caption: 2,200 chars | 30 hashtags',
  },
  facebook: {
    name: 'Facebook',
    icon: ThumbsUp,
    bgColor: 'bg-[#1877f2]/20',
    features: ['Page Posts', 'Videos', 'Link Previews', 'Scheduled'],
    limits: 'Caption: 63,206 chars | Rate: 200/hr',
  },
  linkedin: {
    name: 'LinkedIn',
    icon: Network,
    bgColor: 'bg-[#0a66c2]/20',
    features: ['Company Posts', 'Articles', 'Documents', 'Video'],
    limits: 'Caption: 3,000 chars | 100 posts/day',
  },
  youtube: {
    name: 'YouTube',
    icon: Play,
    bgColor: 'bg-[#ff0000]/20',
    features: ['Video Upload', 'Shorts', 'Community', 'Thumbnails'],
    limits: 'Title: 100 chars | 5,000 quota/day',
  },
  x: {
    name: 'X (Twitter)',
    icon: X,
    bgColor: 'bg-[#71767b]/20',
    features: ['Tweets', 'Threads', 'Media Upload', 'Polls'],
    limits: 'Caption: 280 chars | 1,500/mo (free)',
  },
};

function PlatformCard({ platform, connected, postsCount, engagement }: PlatformCardProps) {
  const config = platformConfig[platform];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'glass-card p-5 transition-all duration-300 group',
        connected && 'border-accent3/30'
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', config.bgColor)}>
            <Icon className={cn('w-5 h-5 text-white')} />
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

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-surface/50 rounded-lg p-3">
          <div className="text-xs text-muted mb-1">Posts</div>
          <div className="font-syne font-bold text-lg text-text">{postsCount}</div>
        </div>
        <div className="bg-surface/50 rounded-lg p-3">
          <div className="text-xs text-muted mb-1">Engagement</div>
          <div className="font-syne font-bold text-lg text-accent3">{engagement.toFixed(1)}%</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {config.features.slice(0, 3).map((feature) => (
          <span key={feature} className="tag tag-purple text-[10px]">
            {feature}
          </span>
        ))}
      </div>

      <p className="text-[10px] text-dimmed">{config.limits}</p>
    </motion.div>
  );
}

export function Dashboard() {
  const { 
    totalPosts, 
    scheduledPosts, 
    publishedPosts, 
    averageEngagement, 
    platformStats 
  } = useAnalyticsStore();
  const [connectedPlatforms, setConnectedPlatforms] = useState<Set<Platform>>(new Set());
  const [loadingAccounts, setLoadingAccounts] = useState(true);

  // Fetch connected platforms from Zernio
  useEffect(() => {
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
  }, []);

  const stats = [
    { label: 'Total Posts', value: totalPosts, icon: Sparkles, color: 'text-accent2' },
    { label: 'Scheduled', value: scheduledPosts, icon: Calendar, color: 'text-accent4' },
    { label: 'Published', value: publishedPosts, icon: CheckCircle2, color: 'text-accent3' },
    { label: 'Avg. Engagement', value: `${averageEngagement.toFixed(1)}%`, icon: TrendingUp, color: 'text-accent' },
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
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-4"
          >
            <div className="flex items-center gap-3">
              <div className={cn('w-10 h-10 rounded-lg bg-surface flex items-center justify-center', stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-muted">{stat.label}</div>
                <div className="font-syne font-bold text-xl text-text">{stat.value}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-syne font-bold text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent2" />
              Platform Connections
            </h3>
            {loadingAccounts && (
              <Loader2 className="w-4 h-4 text-muted animate-spin" />
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
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

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-5"
        >
          <h3 className="font-syne font-bold text-sm mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-accent" />
            AI Capabilities
          </h3>
          <div className="space-y-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex items-start gap-3 p-3 rounded-lg bg-surface/50 hover:bg-surface transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-accent2/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-4 h-4 text-accent2" />
                </div>
                <div>
                  <div className="font-syne font-semibold text-sm text-text">{feature.title}</div>
                  <div className="text-xs text-muted">{feature.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {totalPosts === 0 && (
            <div className="mt-4 p-4 rounded-lg bg-accent2/5 border border-accent2/20 text-center">
              <p className="text-xs text-muted">
                Create your first campaign to see live stats here
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
