import { NextResponse } from 'next/server';
import { submitVideoJob, pollVideoStatus } from '@/lib/json2video-client';

const JSON2VIDEO_API_KEY = process.env.JSON2VIDEO_API_KEY;

export async function POST(req: Request) {
  try {
    if (!JSON2VIDEO_API_KEY) {
      return NextResponse.json({ success: false, error: 'JSON2VIDEO API key is not configured' }, { status: 500 });
    }

    const { content, platform } = await req.json();

    if (!content || !platform) {
      return NextResponse.json({ success: false, error: 'Missing content or platform in request' }, { status: 400 });
    }

    // Rate limiting can be implemented here using a KV store or Redis

    const jobResponse = await submitVideoJob(content, platform, JSON2VIDEO_API_KEY);

    if (!jobResponse.success || !jobResponse.project) {
      return NextResponse.json({ success: false, error: jobResponse.message || 'Failed to submit job' }, { status: 500 });
    }

    const videoUrl = await pollVideoStatus(jobResponse.project, JSON2VIDEO_API_KEY);

    return NextResponse.json({ success: true, url: videoUrl });

  } catch (error: any) {
    console.error('Video generation error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
