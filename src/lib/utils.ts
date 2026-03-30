import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Platform, PLATFORM_LIMITS } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

export function getPlatformLimit(platform: Platform, limitType: 'caption' | 'hashtags'): number {
  return PLATFORM_LIMITS[platform][limitType];
}

export function validateCaption(caption: string, platform: Platform): { valid: boolean; message: string } {
  const limit = PLATFORM_LIMITS[platform].caption;
  if (caption.length > limit) {
    return {
      valid: false,
      message: `Caption exceeds ${limit} characters for ${platform}. Please shorten.`,
    };
  }
  return { valid: true, message: 'Valid' };
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function getPlatformIcon(platform: Platform): string {
  const icons: Record<Platform, string> = {
    instagram: '📷',
    facebook: '📘',
    linkedin: '💼',
    youtube: '▶️',
    x: '𝕏',
  };
  return icons[platform];
}

export function getPlatformColor(platform: Platform): string {
  const colors: Record<Platform, string> = {
    instagram: 'from-[#f09433] via-[#e6683c] to-[#bc1888]',
    facebook: 'bg-[#1877f2]',
    linkedin: 'bg-[#0a66c2]',
    youtube: 'bg-[#ff0000]',
    x: 'bg-black border-[#333]',
  };
  return colors[platform];
}

export function calculateEngagementRate(likes: number, shares: number, comments: number, reach: number): number {
  if (reach === 0) return 0;
  return ((likes + shares + comments) / reach) * 100;
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-accent3';
  if (score >= 60) return 'text-accent4';
  if (score >= 40) return 'text-accent2';
  return 'text-accent';
}

export function getScoreBgColor(score: number): string {
  if (score >= 80) return 'bg-accent3/20';
  if (score >= 60) return 'bg-accent4/20';
  if (score >= 40) return 'bg-accent2/20';
  return 'bg-accent/20';
}

export const CONTENT_PILLARS = [
  { id: 'educational', label: 'Educational', icon: '📚', description: 'Teach and inform your audience' },
  { id: 'promotional', label: 'Promotional', icon: '🎯', description: 'Showcase products and services' },
  { id: 'community', label: 'Community', icon: '💬', description: 'Engage and build relationships' },
] as const;

export const CONTENT_TONES = [
  { id: 'professional', label: 'Professional', description: 'Formal and business-oriented' },
  { id: 'casual', label: 'Casual', description: 'Relaxed and conversational' },
  { id: 'witty', label: 'Witty', description: 'Clever and humorous' },
  { id: 'inspirational', label: 'Inspirational', description: 'Motivating and uplifting' },
] as const;

export const CONTENT_FORMATS = [
  { id: 'text', label: 'Text Post', icon: '📝', platforms: ['facebook', 'linkedin', 'x'] },
  { id: 'image', label: 'Image', icon: '🖼️', platforms: ['instagram', 'facebook', 'linkedin', 'x'] },
  { id: 'carousel', label: 'Carousel', icon: '🎠', platforms: ['instagram', 'facebook', 'linkedin'] },
  { id: 'reel', label: 'Reel/Short', icon: '🎬', platforms: ['instagram', 'youtube'] },
  { id: 'video', label: 'Video', icon: '📹', platforms: ['facebook', 'linkedin', 'youtube'] },
  { id: 'article', label: 'Article', icon: '📰', platforms: ['linkedin'] },
] as const;
