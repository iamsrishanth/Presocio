/**
 * Mock data generators for Presocio's "Simulated Data" mode.
 *
 * When the mock data toggle is enabled in Settings, these generators
 * provide realistic-looking data so the UI feels alive — useful for
 * demos, screenshots, and exploring the app without connecting real
 * accounts or burning API credits.
 */

import type { Platform, GeneratedPost, PostingQueue, ApprovalStatus } from '@/types';

// ── Helpers ───────────────────────────────────────────────────────

const platforms: Platform[] = ['instagram', 'facebook', 'linkedin', 'youtube', 'x'];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ── Dashboard Mock Data ───────────────────────────────────────────

export interface MockDashboardStats {
  totalPosts: number;
  scheduledPosts: number;
  publishedPosts: number;
  averageEngagement: number;
  platformStats: Record<Platform, { posts: number; engagement: number }>;
  connectedPlatforms: Platform[];
}

export function getMockDashboardStats(): MockDashboardStats {
  return {
    totalPosts: 147,
    scheduledPosts: 23,
    publishedPosts: 118,
    averageEngagement: 4.7,
    platformStats: {
      instagram: { posts: 42, engagement: 6.2 },
      facebook: { posts: 31, engagement: 3.8 },
      linkedin: { posts: 28, engagement: 5.1 },
      youtube: { posts: 19, engagement: 7.4 },
      x: { posts: 27, engagement: 3.2 },
    },
    connectedPlatforms: ['instagram', 'facebook', 'linkedin', 'youtube', 'x'],
  };
}

// ── Analytics Mock Data ───────────────────────────────────────────

export interface MockAnalyticsData {
  estimatedReach: number;
  avgEngagement: number;
  totalPosts: number;
  estimatedComments: number;
  avgHook: number;
  avgCta: number;
  avgHashtag: number;
  avgVoice: number;
  weeklyData: { day: string; posts: number; engagement: number; reach: number }[];
  platformStats: { platform: Platform; posts: number; engagement: number; reach: number; growth: number }[];
  topPosts: { id: number; platform: Platform; caption: string; engagement: number; reach: number }[];
}

const mockCaptions: Record<Platform, string[]> = {
  instagram: [
    '5 design trends that will dominate 2026 — swipe to see them all ✨',
    'Behind the scenes of our latest product shoot 📸',
    'Monday motivation: Your brand story matters more than you think',
    'The secret to 10x engagement? Authentic storytelling.',
    'New carousel alert! 7 tips for better content strategy 🚀',
  ],
  facebook: [
    'We just hit 10K followers! Thank you for being part of this journey.',
    'Live Q&A this Friday at 3 PM EST — bring your marketing questions!',
    'Case study: How we increased conversions by 340% in 90 days',
    'The future of social media marketing is here. Are you ready?',
    'Team spotlight: Meet the people behind the brand',
  ],
  linkedin: [
    'After 5 years in B2B marketing, here are the 3 lessons I wish I knew sooner.',
    'We\'re hiring! Join our growing team of content strategists.',
    'The ROI of employee advocacy programs is massively underestimated.',
    'Data-driven content strategy isn\'t optional anymore — it\'s survival.',
    'Hot take: Most LinkedIn content fails because it\'s boring, not because of the algorithm.',
  ],
  youtube: [
    'Full tutorial: Building a content calendar from scratch (2026 edition)',
    'We analyzed 10,000 viral posts. Here\'s what they have in common.',
    'Day in the life of a social media manager — it\'s not what you think!',
    'How to batch-create a month of content in one day',
    'The ultimate guide to cross-platform content repurposing',
  ],
  x: [
    'Content tip: Stop posting and start conversing. The algorithm rewards engagement, not volume.',
    'Just shipped a new feature that auto-generates hashtag sets. Thread below 🧵',
    'Unpopular opinion: Scheduling tools have made social media worse.',
    'The best time to post? When your audience is awake. Revolutionary, I know.',
    'Hot take: AI won\'t replace content creators. Lazy content creators will.',
  ],
};

export function getMockAnalytics(): MockAnalyticsData {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return {
    estimatedReach: 48200,
    avgEngagement: 4.7,
    totalPosts: 147,
    estimatedComments: 312,
    avgHook: 78,
    avgCta: 65,
    avgHashtag: 82,
    avgVoice: 78,
    weeklyData: dayNames.map((day, i) => ({
      day,
      posts: [3, 8, 12, 6, 10, 7, 2][i],
      engagement: [2.1, 4.8, 6.2, 3.9, 5.5, 4.1, 1.8][i],
      reach: [1200, 3800, 5400, 2900, 4200, 3100, 900][i],
    })),
    platformStats: [
      { platform: 'instagram', posts: 42, engagement: 6.2, reach: 18400, growth: 12.4 },
      { platform: 'facebook', posts: 31, engagement: 3.8, reach: 9800, growth: -2.1 },
      { platform: 'linkedin', posts: 28, engagement: 5.1, reach: 7600, growth: 8.7 },
      { platform: 'youtube', posts: 19, engagement: 7.4, reach: 8200, growth: 15.3 },
      { platform: 'x', posts: 27, engagement: 3.2, reach: 4200, growth: 5.6 },
    ],
    topPosts: [
      { id: 1, platform: 'youtube', caption: mockCaptions.youtube[1], engagement: 7.8, reach: 8400 },
      { id: 2, platform: 'instagram', caption: mockCaptions.instagram[0], engagement: 7.2, reach: 6200 },
      { id: 3, platform: 'linkedin', caption: mockCaptions.linkedin[0], engagement: 6.9, reach: 5100 },
      { id: 4, platform: 'instagram', caption: mockCaptions.instagram[3], engagement: 6.4, reach: 4800 },
      { id: 5, platform: 'facebook', caption: mockCaptions.facebook[2], engagement: 5.8, reach: 3900 },
    ],
  };
}

// ── Calendar Mock Data ────────────────────────────────────────────

export interface MockCalendarPost {
  id: string;
  platform: Platform;
  caption: string;
  scheduledDate: Date;
  status: 'draft' | 'scheduled' | 'published';
}

export function getMockCalendarPosts(): MockCalendarPost[] {
  const rng = seededRandom(42);
  const posts: MockCalendarPost[] = [];
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  // Published posts (past 2 weeks)
  for (let d = 1; d <= 14; d++) {
    const numPosts = Math.floor(rng() * 3) + 1;
    for (let j = 0; j < numPosts; j++) {
      const platform = platforms[Math.floor(rng() * platforms.length)];
      const date = new Date(year, month - 1, d, Math.floor(rng() * 12) + 8, [0, 15, 30, 45][Math.floor(rng() * 4)]);
      posts.push({
        id: `mock-pub-${d}-${j}`,
        platform,
        caption: pick(mockCaptions[platform]),
        scheduledDate: date,
        status: 'published',
      });
    }
  }

  // Scheduled posts (next 2 weeks)
  for (let d = 1; d <= 14; d++) {
    const numPosts = Math.floor(rng() * 2) + 1;
    for (let j = 0; j < numPosts; j++) {
      const platform = platforms[Math.floor(rng() * platforms.length)];
      const date = new Date(year, month + 1, d, Math.floor(rng() * 12) + 8, [0, 15, 30, 45][Math.floor(rng() * 4)]);
      posts.push({
        id: `mock-sched-${d}-${j}`,
        platform,
        caption: pick(mockCaptions[platform]),
        scheduledDate: date,
        status: 'scheduled',
      });
    }
  }

  // A few drafts
  for (let i = 0; i < 4; i++) {
    const platform = platforms[Math.floor(rng() * platforms.length)];
    posts.push({
      id: `mock-draft-${i}`,
      platform,
      caption: pick(mockCaptions[platform]),
      scheduledDate: new Date(year, month, now.getDate()),
      status: 'draft',
    });
  }

  return posts;
}

// ── Connected Accounts Mock Data ──────────────────────────────────

export interface MockConnectedAccount {
  _id: string;
  platform: Platform;
  accountName: string;
  connectedAt: string;
}

export function getMockConnectedAccounts(): MockConnectedAccount[] {
  return [
    { _id: 'mock-ig', platform: 'instagram', accountName: '@presocio_official', connectedAt: '2025-11-15' },
    { _id: 'mock-fb', platform: 'facebook', accountName: 'Presocio Marketing', connectedAt: '2025-12-01' },
    { _id: 'mock-li', platform: 'linkedin', accountName: 'Presocio Inc.', connectedAt: '2026-01-10' },
    { _id: 'mock-yt', platform: 'youtube', accountName: 'Presocio Channel', connectedAt: '2026-02-05' },
    { _id: 'mock-x', platform: 'x', accountName: '@presocio', connectedAt: '2026-03-01' },
  ];
}

// ── Generated Posts Mock Data ─────────────────────────────────────

export function getMockGeneratedPosts(): GeneratedPost[] {
  const rng = seededRandom(99);
  const posts: GeneratedPost[] = [];
  const statuses: ApprovalStatus[] = ['approved', 'approved', 'approved', 'pending', 'needs_edit'];

  for (let i = 0; i < 20; i++) {
    const platform = platforms[i % platforms.length];
    const caption = pick(mockCaptions[platform]);
    posts.push({
      id: `mock-post-${i}`,
      planId: `mock-plan-${i}`,
      platform,
      caption,
      captionVariants: [caption],
      hashtags: {
        niche: ['#contentstrategy', '#socialmediamarketing'],
        midTier: ['#marketing', '#digitalmarketing', '#branding'],
        trending: ['#AI', '#2026trends'],
      },
      brandVoiceScore: Math.floor(rng() * 36) + 60,
      engagementScore: Math.floor(rng() * 56) + 40,
      hookScore: Math.floor(rng() * 46) + 50,
      ctaScore: Math.floor(rng() * 51) + 40,
      hashtagScore: Math.floor(rng() * 36) + 60,
      status: pick(statuses),
    });
  }

  return posts;
}

// ── Posting Queue Mock Data ───────────────────────────────────────

export function getMockPostingQueue(): PostingQueue[] {
  const rng = seededRandom(77);
  const queue: PostingQueue[] = [];
  const now = new Date();

  for (let i = 0; i < 15; i++) {
    const platform = platforms[i % platforms.length];
    const daysOffset = Math.floor(rng() * 21) - 10;
    const scheduledTime = new Date(now);
    scheduledTime.setDate(scheduledTime.getDate() + daysOffset);
    scheduledTime.setHours(Math.floor(rng() * 12) + 8, [0, 15, 30, 45][Math.floor(rng() * 4)]);

    const status = daysOffset < -2 ? 'published' : daysOffset < 0 ? 'publishing' : 'queued';

    queue.push({
      id: `mock-q-${i}`,
      postId: `mock-post-${i}`,
      platform,
      scheduledTime,
      status: status as PostingQueue['status'],
    });
  }

  return queue;
}
