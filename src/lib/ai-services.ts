import type { Platform, ContentTone, ContentFormat, CampaignBrief } from '@/types';
import { zernioGenerateContent } from './zernio-client';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
const ZERNIO_API_KEY = process.env.ZERNIO_API_KEY;

export interface GeneratedContent {
  caption: string;
  captionVariants: string[];
  hashtags: {
    niche: string[];
    midTier: string[];
    trending: string[];
  };
  seoDescription?: string;
  imagePrompt?: string;
  engagementScore: number;
  hookScore: number;
  ctaScore: number;
  hashtagScore: number;
  brandVoiceScore: number;
}

export interface ContentPlanItem {
  theme: string;
  format: ContentFormat;
  platform: Platform;
  trendAngle: string;
  engagementPrediction: number;
  contentPillar: 'educational' | 'promotional' | 'community';
}

export interface EngagementPrediction {
  engagementScore: number;
  hookScore: number;
  ctaScore: number;
  hashtagScore: number;
  voiceScore: number;
  topImprovement: string;
}

export async function generateContent(
  brandName: string,
  campaignObjective: string,
  targetAudience: string,
  tone: ContentTone,
  platform: Platform,
  keyMessages: string[]
): Promise<GeneratedContent> {
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

  try {
    if (ZERNIO_API_KEY) {
      const zernioContent = await zernioGenerateContent(
        brandName,
        campaignObjective,
        targetAudience,
        tone,
        platform,
        keyMessages
      );
      if (zernioContent) {
        return zernioContent;
      }
    } else if (GEMINI_API_KEY) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 2048,
            },
          }),
        }
      );

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (generatedText) {
        const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      }
    }
  } catch (error) {
    console.error('Gemini API error:', error);
  }

  return generateMockContent(platform, tone);
}

export async function generateCampaignPlan(brief: CampaignBrief): Promise<ContentPlanItem[]> {
  const systemPrompt = `You are an expert social media strategist for ${brief.brandName}.
Create an optimal content plan for the next ${brief.campaignDuration}.
Target Audience: ${brief.targetAudience}
Tone: ${brief.contentTone}
Platforms: ${brief.platforms.join(', ')}
Posting frequency: ${brief.postingFrequency}
Key messages: ${brief.keyMessages.join(', ')}
Campaign objective: ${brief.campaignObjective}`;

  const userPrompt = `Generate a compelling content plan representing an optimal mix of content pillars (educational, promotional, community), formats (text, image, video, carousel, reel, short, article), themes, and trend angles.

Return ONLY a valid JSON array of objects matching this exact structure:
[
  {
    "theme": "string",
    "format": "string (text|image|video|carousel|reel|short|article)",
    "platform": "string (${brief.platforms.join('|')})",
    "trendAngle": "string",
    "engagementPrediction": number (0-100),
    "contentPillar": "string (educational|promotional|community)"
  }
]

Generate approximately 3-12 posts based on the duration and frequency. Ensure the output strictly conforms to JSON format without any markdown blocks wrapping it (if you must, just standard JSON array).`;

  try {
    if (GEMINI_API_KEY) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 2048,
            },
          }),
        }
      );

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (generatedText) {
        const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      }
    }
  } catch (error) {
    console.error('Gemini API plan generation error:', error);
  }

  // Fallback to mock generator if API fails
  return generateMockContentPlan(brief.brandName, brief.campaignObjective, brief.platforms, brief.campaignDuration);
}

export async function generateMockContentPlan(
  brandName: string,
  campaignObjective: string,
  platforms: Platform[],
  duration: string
): Promise<ContentPlanItem[]> {
  const pillars = ['educational', 'promotional', 'community'] as const;
  const formats: ContentFormat[] = ['image', 'carousel', 'reel', 'video', 'text'];
  
  const plans: ContentPlanItem[] = [];
  const numWeeks = Math.min(parseInt(duration) || 2, 4);
  const postsPerWeek = 3;
  
  for (let week = 1; week <= numWeeks; week++) {
    for (let post = 0; post < postsPerWeek; post++) {
      const pillar = pillars[Math.floor(Math.random() * pillars.length)];
      const platform = platforms[Math.floor(Math.random() * platforms.length)];
      const format = formats[Math.floor(Math.random() * formats.length)];
      
      const themes = {
        educational: ['How-to guide', 'Industry tips', 'Expert insights', 'Tutorial', 'FAQ breakdown'],
        promotional: ['Product spotlight', 'Behind the scenes', 'Customer success', 'New launch', 'Special offer'],
        community: ['Poll & engage', 'User spotlight', 'Team introduction', 'Q&A session', 'Discussion starter'],
      };
      
      const trendAngles = [
        'Leveraging current industry trends',
        'Addressing common pain points',
        'Showcasing unique value proposition',
        'Building trust through transparency',
        'Creating shareable moments',
      ];
      
      plans.push({
        theme: themes[pillar][Math.floor(Math.random() * themes[pillar].length)],
        format,
        platform,
        trendAngle: trendAngles[Math.floor(Math.random() * trendAngles.length)],
        engagementPrediction: Math.floor(Math.random() * 30) + 70,
        contentPillar: pillar,
      });
    }
  }
  
  return plans.slice(0, 12);
}

export async function predictEngagement(
  caption: string,
  platform: Platform,
  audienceSegment: string,
  brandVoiceProfile: number[]
): Promise<EngagementPrediction> {
  const hookRegex = /^[A-Z].{10,50}/;
  const hasCta = /\b(click|learn|join|follow|check|discover|download|sign up|subscribe)\b/i.test(caption);
  const hashtagCount = (caption.match(/#\w+/g) || []).length;
  const wordCount = caption.split(/\s+/).length;
  
  const hookScore = hookRegex.test(caption) ? 85 : 60;
  const ctaScore = hasCta ? 80 : 50;
  const hashtagScore = Math.min(hashtagCount * 15, 90);
  
  const hookWeight = 0.3;
  const ctaWeight = 0.25;
  const hashtagWeight = 0.2;
  const lengthWeight = 0.15;
  const voiceWeight = 0.1;
  
  const lengthScore = wordCount >= 20 && wordCount <= 50 ? 85 : wordCount < 10 ? 50 : 70;
  
  const engagementScore = Math.round(
    hookScore * hookWeight +
    ctaScore * ctaWeight +
    hashtagScore * hashtagWeight +
    lengthScore * lengthWeight +
    (brandVoiceProfile[0] || 80) * voiceWeight
  );
  
  const voiceScore = Math.round(
    brandVoiceProfile.reduce((a, b) => a + b, 0) / brandVoiceProfile.length
  );
  
  let topImprovement = 'Consider adding a stronger call-to-action';
  if (hookScore < 70) topImprovement = 'Start with a more compelling hook in the first 125 characters';
  if (hashtagCount < 5) topImprovement = 'Add more relevant hashtags to increase discoverability';
  
  return {
    engagementScore,
    hookScore,
    ctaScore,
    hashtagScore,
    voiceScore,
    topImprovement,
  };
}

export async function optimizePostingTime(
  platform: Platform,
  timezone: string
): Promise<{ time: string; score: number }[]> {
  const optimalTimes: Record<Platform, { hour: number; score: number }[]> = {
    instagram: [
      { hour: 11, score: 92 },
      { hour: 13, score: 88 },
      { hour: 19, score: 95 },
    ],
    facebook: [
      { hour: 9, score: 85 },
      { hour: 13, score: 90 },
      { hour: 15, score: 87 },
    ],
    linkedin: [
      { hour: 8, score: 92 },
      { hour: 12, score: 88 },
      { hour: 17, score: 85 },
    ],
    youtube: [
      { hour: 14, score: 90 },
      { hour: 18, score: 95 },
      { hour: 20, score: 88 },
    ],
    x: [
      { hour: 9, score: 88 },
      { hour: 12, score: 92 },
      { hour: 17, score: 85 },
    ],
  };
  
  const times = optimalTimes[platform] || optimalTimes.instagram;
  
  return times.map(({ hour, score }) => ({
    time: `${hour}:00 ${timezone.includes('PM') ? 'PM' : 'AM'}`,
    score,
  }));
}

function generateMockContent(platform: Platform, tone: ContentTone): GeneratedContent {
  const tonePrefixes = {
    professional: 'Elevate your strategy with',
    casual: 'Hey! Check out',
    witty: 'Plot twist:',
    inspirational: 'Dream bigger with',
  };
  
  const templates = {
    instagram: `${tonePrefixes[tone]} our latest insights on driving meaningful engagement. Success isn't accidental—it's designed. 💡\n\nWhat strategy will you implement first? 👇`,
    facebook: `${tonePrefixes[tone]} groundbreaking approach that is reshaping how teams operate. This isn't just another trend—it is a fundamental shift in strategy.\n\nJoin the conversation and share your thoughts below.`,
    linkedin: `${tonePrefixes[tone]} strategic initiative that is delivering measurable results. After analyzing 1000+ campaigns, one pattern emerges consistently.\n\nThe most successful teams share one characteristic: intentionality in every action.`,
    youtube: `${tonePrefixes[tone]} complete breakdown of the strategies top performers use to stay ahead. In this video, we cover:\n\n✓ Core principles\n✓ Practical applications\n✓ Common pitfalls to avoid`,
    x: `${tonePrefixes[tone]} 1 change that transformed everything. Short thread 🧵`,
  };
  
  return {
    caption: templates[platform],
    captionVariants: [
      templates[platform],
      `${tonePrefixes[tone]} the future of engagement. Thread below. 👇`,
      `Stop scrolling. This changes everything for ${tone === 'professional' ? 'professionals' : 'anyone'} like you.`,
    ],
    hashtags: {
      niche: ['#socialmediastrategy', '#contentcreation', '#digitalmarketing'],
      midTier: ['#marketingtips', '#growthhacking', '#businesstips', '#entrepreneur'],
      trending: ['#trending', '#viral', '#fyp', '#explorepage'],
    },
    seoDescription: platform === 'youtube' || platform === 'linkedin'
      ? `Learn how to maximize your social media impact with proven strategies. ${tonePrefixes[tone]} actionable insights for sustainable growth.`
      : undefined,
    imagePrompt: `Professional ${tone} social media visual with ${platform === 'instagram' ? 'lifestyle' : 'corporate'} aesthetic, modern design elements, brand-consistent colors, high engagement potential`,
    engagementScore: Math.floor(Math.random() * 20) + 75,
    hookScore: Math.floor(Math.random() * 20) + 70,
    ctaScore: Math.floor(Math.random() * 20) + 65,
    hashtagScore: Math.floor(Math.random() * 20) + 70,
    brandVoiceScore: Math.floor(Math.random() * 15) + 80,
  };
}
