export type Platform = 'instagram' | 'facebook' | 'linkedin' | 'youtube' | 'x';

export type WorkflowStage = 
  | 'input' 
  | 'planning' 
  | 'generation' 
  | 'scheduling' 
  | 'approval' 
  | 'posting';

export type ContentFormat = 'text' | 'image' | 'video' | 'carousel' | 'reel' | 'short' | 'article';

export type ContentTone = 'professional' | 'casual' | 'witty' | 'inspirational';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'needs_edit';

export interface BrandProfile {
  id: string;
  name: string;
  logo?: string;
  tone: ContentTone;
  industry: string;
  targetAudience: string[];
  keyMessages: string[];
  colors: string[];
  voiceModel: number[];
}

export interface CampaignBrief {
  id: string;
  brandName: string;
  campaignObjective: string;
  targetAudience: string;
  contentTone: ContentTone;
  keyMessages: string[];
  platforms: Platform[];
  postingFrequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  campaignDuration: string;
  visualAssets?: string[];
  createdAt: Date;
}

export interface ContentPlan {
  id: string;
  theme: string;
  format: ContentFormat;
  platform: Platform;
  trendAngle: string;
  engagementPrediction: number;
  contentPillar: 'educational' | 'promotional' | 'community';
  scheduledDate?: Date;
}

export interface GeneratedPost {
  id: string;
  planId: string;
  platform: Platform;
  caption: string;
  captionVariants: string[];
  hashtags: {
    niche: string[];
    midTier: string[];
    trending: string[];
  };
  seoDescription?: string;
  imagePrompt?: string;
  imageUrl?: string;
  brandVoiceScore: number;
  engagementScore: number;
  hookScore: number;
  ctaScore: number;
  hashtagScore: number;
  status: ApprovalStatus;
  scheduledTime?: Date;
  approvedBy?: string;
  approvedAt?: Date;
  postId?: string;
}

export interface PostingQueue {
  id: string;
  postId: string;
  platform: Platform;
  scheduledTime: Date;
  status: 'queued' | 'publishing' | 'published' | 'failed';
  postIds?: Record<Platform, string>;
}

export interface EngagementMetrics {
  postId: string;
  likes: number;
  shares: number;
  comments: number;
  reach: number;
  impressions: number;
  engagementRate: number;
  timestamp: Date;
}

export interface PlatformLimits {
  caption: number;
  hashtags: number;
  imageRatios: string[];
  videoMaxDuration?: number;
  rateLimit?: string;
}

export const PLATFORM_LIMITS: Record<Platform, PlatformLimits> = {
  instagram: {
    caption: 2200,
    hashtags: 30,
    imageRatios: ['1:1', '4:5', '16:9'],
    videoMaxDuration: 90,
    rateLimit: '200 calls/hour',
  },
  facebook: {
    caption: 63206,
    hashtags: 30,
    imageRatios: ['1.91:1', '1:1', '16:9'],
    videoMaxDuration: 240 * 60,
    rateLimit: '200 calls/hour',
  },
  linkedin: {
    caption: 3000,
    hashtags: 5,
    imageRatios: ['1.91:1', '1:1'],
    rateLimit: '100 posts/day',
  },
  youtube: {
    caption: 5000,
    hashtags: 500,
    imageRatios: ['16:9'],
    rateLimit: '10,000 quota units/day',
  },
  x: {
    caption: 280,
    hashtags: 30,
    imageRatios: ['16:9', '1:1', '2:1'],
    rateLimit: '1500 posts/month',
  },
};

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  avatar?: string;
}

export * from './api';
