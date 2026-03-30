import type { Platform } from '@/types';

const ZERNIO_API_KEY = process.env.ZERNIO_API_KEY;
const ZERNIO_BASE_URL = 'https://zernio.com/api/v1';

// Map our Platform types to Zernio's platform identifiers
const PLATFORM_MAP: Record<Platform, string> = {
  instagram: 'instagram',
  facebook: 'facebook',
  linkedin: 'linkedin',
  youtube: 'youtube',
  x: 'twitter',
};

export interface ZernioPost {
  content: string;
  scheduledFor?: string;
  timezone?: string;
  publishNow?: boolean;
  platforms: {
    platform: string;
    accountId: string;
  }[];
  media?: string[];
}

export interface ZernioPostResult {
  success: boolean;
  postId?: string;
  platform: Platform;
  status: 'published' | 'scheduled' | 'failed';
  error?: string;
}

export interface ZernioProfile {
  _id: string;
  name: string;
}

export interface ZernioAccount {
  _id: string;
  platform: string;
  profileId: string;
}

/**
 * Make an authenticated request to the Zernio API
 */
async function zernioRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  if (!ZERNIO_API_KEY) {
    throw new Error('ZERNIO_API_KEY is not configured');
  }

  const response = await fetch(`${ZERNIO_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${ZERNIO_API_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || `Zernio API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Create a new profile (brand workspace)
 */
export async function createProfile(name: string): Promise<ZernioProfile> {
  const result = await zernioRequest<{ profile: ZernioProfile }>('/profiles', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
  return result.profile;
}

/**
 * List all profiles (brand workspaces)
 */
export async function listProfiles(): Promise<ZernioProfile[]> {
  const result = await zernioRequest<{ profiles: ZernioProfile[] }>('/profiles');
  return result.profiles;
}

/**
 * List all connected social accounts
 */
export async function listAccounts(): Promise<ZernioAccount[]> {
  const result = await zernioRequest<{ accounts: ZernioAccount[] }>('/accounts');
  return result.accounts;
}

/**
 * Get OAuth connect URL for a platform
 */
export function getConnectUrl(platform: Platform, profileId: string): string {
  const zernioPlatform = PLATFORM_MAP[platform];
  return `${ZERNIO_BASE_URL}/connect/${zernioPlatform}?profileId=${profileId}`;
}

/**
 * Publish or schedule a post to multiple platforms
 */
export async function publishPost(
  content: string,
  platforms: Platform[],
  accountIds: Record<Platform, string>,
  options: {
    scheduledFor?: string;
    timezone?: string;
    publishNow?: boolean;
    media?: string[];
  } = {}
): Promise<ZernioPostResult[]> {
  const zernioPlatforms = platforms.map((p) => ({
    platform: PLATFORM_MAP[p],
    accountId: accountIds[p],
  }));

  const body: ZernioPost = {
    content,
    platforms: zernioPlatforms,
    ...(options.scheduledFor && { scheduledFor: options.scheduledFor }),
    ...(options.timezone && { timezone: options.timezone }),
    ...(options.publishNow && { publishNow: true }),
    ...(options.media && { media: options.media }),
  };

  try {
    const result = await zernioRequest<{ post: { _id: string; platforms: Record<string, { status: string }> } }>('/posts', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    return platforms.map((p) => {
      const platformResult = result.post.platforms?.[PLATFORM_MAP[p]];
      return {
        success: platformResult?.status !== 'failed',
        postId: result.post._id,
        platform: p,
        status: platformResult?.status === 'published' ? 'published' : 'scheduled',
      };
    });
  } catch (error) {
    return platforms.map((p) => ({
      success: false,
      platform: p,
      status: 'failed' as const,
      error: error instanceof Error ? error.message : 'Unknown error',
    }));
  }
}

/**
 * Publish a single post to one platform
 */
export async function publishSinglePost(
  content: string,
  platform: Platform,
  accountId: string,
  options: {
    scheduledFor?: string;
    timezone?: string;
    publishNow?: boolean;
    media?: string[];
  } = {}
): Promise<ZernioPostResult> {
  const accountIds = {} as Record<Platform, string>;
  accountIds[platform] = accountId;

  const results = await publishPost(
    content,
    [platform],
    accountIds,
    options
  );
  return results[0];
}

/**
 * Get post status / analytics
 */
export async function getPostStatus(postId: string): Promise<{
  _id: string;
  status: string;
  platforms: Record<string, { status: string; publishedAt?: string }>;
}> {
  return zernioRequest(`/posts/${postId}`);
}

/**
 * Check if Zernio API is configured
 */
export function isZernioConfigured(): boolean {
  return !!ZERNIO_API_KEY;
}

/**
 * Mock publish for demo mode (when no API key is set)
 */
export async function mockPublish(
  content: string,
  platforms: Platform[],
  options: {
    scheduledFor?: string;
    publishNow?: boolean;
  } = {}
): Promise<ZernioPostResult[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000));

  return platforms.map((p) => {
    const success = Math.random() > 0.1; // 90% success rate in mock
    return {
      success,
      postId: success ? `mock_${Date.now()}_${p}` : undefined,
      platform: p,
      status: success
        ? options.publishNow
          ? 'published'
          : 'scheduled'
        : 'failed',
      error: success ? undefined : 'Mock failure for testing',
    };
  });
}
