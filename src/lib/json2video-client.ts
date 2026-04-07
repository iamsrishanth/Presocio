import type { GeneratedContent } from './ai-services';
import type { Platform } from '@/types';

const JSON2VIDEO_API_URL = 'https://api.json2video.com/v2/movies';

export interface VideoJobResponse {
  success: boolean;
  project: string;
  timestamp?: string;
  message?: string;
}

export interface VideoStatusResponse {
  success: boolean;
  movie?: {
    success: boolean;
    status: 'done' | 'pending' | 'error';
    message?: string;
    project: string;
    url?: string;
    ass?: string;
  };
  remaining_quota?: {
    time: number;
  };
}

export function mapContentToVideoScenes(content: GeneratedContent, platform: Platform) {
  // Map the Zernio generated content into a JSON2VIDEO scene structure.
  // For simplicity, we create a short text-based video using the caption.
  const width = platform === 'instagram' || platform === 'x' ? 1080 : 1920;
  const height = platform === 'instagram' || platform === 'x' ? 1080 : 1080; // or 1920 for reels
  
  return {
    width,
    height,
    fps: 30,
    scenes: [
      {
        duration: 5,
        background: '#1e1e2f',
        elements: [
          {
            type: 'text',
            text: content.caption.substring(0, 100) + '...', // Simplified for now
            style: 'color: white; font-size: 60px; font-family: Arial; text-align: center;',
            x: 100,
            y: height / 2 - 100,
            width: width - 200,
          }
        ]
      }
    ]
  };
}

export async function submitVideoJob(content: GeneratedContent, platform: Platform, apiKey: string): Promise<VideoJobResponse> {
  const payload = mapContentToVideoScenes(content, platform);

  const response = await fetch(JSON2VIDEO_API_URL, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Failed to submit JSON2VIDEO job: ${response.statusText}`);
  }

  return response.json();
}

export async function pollVideoStatus(projectId: string, apiKey: string, maxAttempts = 20): Promise<string> {
  for (let i = 0; i < maxAttempts; i++) {
    const response = await fetch(`${JSON2VIDEO_API_URL}?project=${projectId}`, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to check JSON2VIDEO status: ${response.statusText}`);
    }

    const data: VideoStatusResponse = await response.json();

    if (data.movie) {
      if (data.movie.status === 'done' && data.movie.url) {
        return data.movie.url;
      }
      if (data.movie.status === 'error') {
        throw new Error(`JSON2VIDEO job failed: ${data.movie.message}`);
      }
    }

    // Wait 5 seconds before polling again
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  throw new Error('Video generation timed out');
}
