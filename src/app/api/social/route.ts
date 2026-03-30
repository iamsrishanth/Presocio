import { NextRequest, NextResponse } from 'next/server';
import {
  publishPost,
  mockPublish,
  isZernioConfigured,
  listAccounts,
  getConnectUrl,
  listProfiles,
  createProfile,
} from '@/lib/social-api';
import type { Platform } from '@/types';

// GET: Fetch accounts and profiles
export async function GET() {
  try {
    if (!isZernioConfigured()) {
      return NextResponse.json({
        success: true,
        mode: 'demo',
        profiles: [],
        accounts: [],
        message: 'Configure ZERNIO_API_KEY to see connected accounts',
      });
    }

    const [profiles, accounts] = await Promise.all([
      listProfiles(),
      listAccounts(),
    ]);

    return NextResponse.json({
      success: true,
      mode: 'live',
      profiles,
      accounts,
    });
  } catch (error) {
    console.error('Social API GET error (falling back to demo):', error);
    return NextResponse.json({
      success: true,
      mode: 'demo',
      profiles: [],
      accounts: [],
      message: 'Failed to connect to Zernio API. Falling back to demo mode.',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      action,
      content,
      platforms,
      accountIds,
      scheduledFor,
      timezone,
      publishNow,
      media,
      profileId,
    } = body;

    // Handle different actions
    switch (action) {
      case 'publish': {
        if (!content || !platforms || !Array.isArray(platforms)) {
          return NextResponse.json(
            { error: 'Missing required fields: content, platforms[]' },
            { status: 400 }
          );
        }

        const configured = isZernioConfigured();
        let results;
        try {
          results = configured
            ? await publishPost(
                content,
                platforms as Platform[],
                accountIds || {},
                { scheduledFor, timezone, publishNow, media }
              )
            : await mockPublish(content, platforms as Platform[], {
                scheduledFor,
                publishNow,
              });
        } catch (e) {
          console.error('Publish API call failed, falling back to mock.', e);
          results = await mockPublish(content, platforms as Platform[], {
            scheduledFor,
            publishNow,
          });
        }

        const successCount = results.filter((r) => r.success).length;

        return NextResponse.json({
          success: successCount > 0,
          data: results,
          mode: configured ? 'live' : 'demo',
          summary: {
            total: results.length,
            succeeded: successCount,
            failed: results.length - successCount,
          },
        });
      }

      case 'accounts': {
        if (!isZernioConfigured()) {
          return NextResponse.json({
            success: true,
            data: [],
            mode: 'demo',
            message: 'Configure ZERNIO_API_KEY to see connected accounts',
          });
        }

        try {
          const accounts = await listAccounts();
          return NextResponse.json({
            success: true,
            data: accounts,
            mode: 'live',
          });
        } catch (e) {
          console.error('Accounts API call failed, falling back to demo mode.', e);
          return NextResponse.json({
            success: true,
            data: [],
            mode: 'demo',
            message: 'Fallback to demo mode due to API error',
          });
        }
      }

      case 'connect': {
        if (!platforms || !profileId) {
          return NextResponse.json(
            { error: 'Missing required fields: platforms[], profileId' },
            { status: 400 }
          );
        }

        const urls = (platforms as Platform[]).reduce(
          (acc, platform) => {
            acc[platform] = getConnectUrl(platform, profileId);
            return acc;
          },
          {} as Record<string, string>
        );

        return NextResponse.json({
          success: true,
          data: urls,
        });
      }

      case 'create-profile': {
        const { name } = body;
        if (!name) {
          return NextResponse.json(
            { error: 'Missing required field: name' },
            { status: 400 }
          );
        }

        const profile = await createProfile(name);
        return NextResponse.json({
          success: true,
          data: profile,
        });
      }

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}. Use 'publish', 'accounts', or 'connect'` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Social API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
