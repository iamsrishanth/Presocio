import type { Platform, ContentTone } from '@/types';
import type { GeneratedContent } from './ai-services';

const ZERNIO_API_KEY = process.env.ZERNIO_API_KEY;
const ZERNIO_API_URL = process.env.ZERNIO_API_URL || 'https://api.zernio.ai/v1/generate';

interface ZernioRequest {
  prompt: string;
  systemPrompt: string;
  responseFormat: 'json';
  parameters?: Record<string, any>;
}

interface ZernioResponse {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * Lightweight HTTP client for Zernio API
 */
export async function fetchFromZernio(request: ZernioRequest): Promise<ZernioResponse> {
  if (!ZERNIO_API_KEY) {
    throw new Error('ZERNIO_API_KEY is not configured');
  }

  try {
    const response = await fetch(ZERNIO_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ZERNIO_API_KEY}`,
        'X-Zernio-Client': 'presocio-app'
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Zernio API rate limit exceeded. Please try again later.');
      }
      const errorText = await response.text();
      throw new Error(`Zernio API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Zernio client error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}

/**
 * Generates content using the Zernio API, falling back to mock structure if needed.
 */
export async function zernioGenerateContent(
  brandName: string,
  campaignObjective: string,
  targetAudience: string,
  tone: ContentTone,
  platform: Platform,
  keyMessages: string[]
): Promise<GeneratedContent | null> {
  const systemPrompt = `You are an expert social media content creator for ${brandName}. 
Create engaging content that resonates with ${targetAudience}.
Tone: ${tone}
Platform: ${platform}
Key messages to include: ${keyMessages.join(', ')}
Campaign objective: ${campaignObjective}`;

  const userPrompt = `Generate a compelling social media post for ${platform} with:
1. A primary caption (optimized for ${platform}'s character limits and audience)
2. 3 caption variants with different angles
3. Hashtags split into niche (high relevance), mid-tier (10K-500K posts), and trending
4. An image generation prompt for AI image creation
5. An SEO description (for YouTube/LinkedIn)

Return ONLY valid JSON matching this exact structure:
{
  "caption": "string",
  "captionVariants": ["string", "string", "string"],
  "hashtags": {
    "niche": ["string"],
    "midTier": ["string"],
    "trending": ["string"]
  },
  "seoDescription": "string or null",
  "imagePrompt": "string or null",
  "engagementScore": 0-100,
  "hookScore": 0-100,
  "ctaScore": 0-100,
  "hashtagScore": 0-100,
  "brandVoiceScore": 0-100
}`;

  const response = await fetchFromZernio({
    prompt: userPrompt,
    systemPrompt: systemPrompt,
    responseFormat: 'json',
    parameters: {
      temperature: 0.7,
      maxTokens: 2048
    }
  });

  if (response.success && response.data) {
    const content = response.data.content || response.data.text || response.data;
    
    let parsedContent: Partial<GeneratedContent> = {};
    if (typeof content === 'string') {
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedContent = JSON.parse(jsonMatch[0]);
        } else {
          parsedContent = JSON.parse(content);
        }
      } catch (e) {
        console.error('Failed to parse Zernio JSON response', e);
        return null;
      }
    } else {
      parsedContent = content;
    }

    if (parsedContent && typeof parsedContent.caption === 'string') {
      return parsedContent as GeneratedContent;
    }
  }

  return null;
}
