import { NextRequest, NextResponse } from "next/server";

const GRAPH_API_BASE = "https://graph.instagram.com/v21.0";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username") || "";
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

    // If we have a valid access token, use the Instagram Graph API
    if (accessToken) {
        try {
            // Fetch the authenticated user's profile
            const profileRes = await fetch(
                `${GRAPH_API_BASE}/me?fields=id,username,name,biography,followers_count,follows_count,media_count,profile_picture_url&access_token=${accessToken}`
            );

            if (!profileRes.ok) {
                const errData = await profileRes.json().catch(() => ({}));
                console.error("Instagram Graph API profile error:", errData);
                throw new Error(`Instagram API error: ${profileRes.status}`);
            }

            const profileData = await profileRes.json();

            // Fetch recent media to calculate engagement stats
            const mediaRes = await fetch(
                `${GRAPH_API_BASE}/me/media?fields=id,caption,media_type,media_url,thumbnail_url,timestamp,like_count,comments_count,permalink&limit=25&access_token=${accessToken}`
            );

            let totalLikes = 0;
            let totalComments = 0;
            let posts: Array<{
                id: string;
                thumbnail: string;
                caption: string;
                likes: number;
                comments: number;
                timestamp: string;
                type: "image" | "video" | "carousel";
                permalink: string;
                mediaUrl: string;
            }> = [];

            if (mediaRes.ok) {
                const mediaData = await mediaRes.json();
                const mediaItems = mediaData.data || [];

                posts = mediaItems.map((item: {
                    id: string;
                    caption?: string;
                    media_type: string;
                    media_url?: string;
                    thumbnail_url?: string;
                    timestamp: string;
                    like_count?: number;
                    comments_count?: number;
                    permalink?: string;
                }) => {
                    const likes = item.like_count || 0;
                    const comments = item.comments_count || 0;
                    totalLikes += likes;
                    totalComments += comments;

                    let type: "image" | "video" | "carousel" = "image";
                    if (item.media_type === "VIDEO") type = "video";
                    else if (item.media_type === "CAROUSEL_ALBUM") type = "carousel";

                    return {
                        id: item.id,
                        thumbnail: item.thumbnail_url || item.media_url || "",
                        caption: item.caption || "",
                        likes,
                        comments,
                        timestamp: item.timestamp,
                        type,
                        permalink: item.permalink || "",
                        mediaUrl: item.media_url || "",
                    };
                });
            }

            const mediaCount = profileData.media_count || posts.length || 1;
            const followersCount = profileData.followers_count || 0;
            const engagementRate =
                followersCount > 0 && posts.length > 0
                    ? parseFloat(
                        (
                            ((totalLikes + totalComments) / posts.length / followersCount) *
                            100
                        ).toFixed(2)
                    )
                    : 0;

            const profile = {
                username: profileData.username || username,
                name: profileData.name || profileData.username || username,
                bio: profileData.biography || "",
                profilePicture: profileData.profile_picture_url || "",
                followers: followersCount,
                following: profileData.follows_count || 0,
                totalPosts: mediaCount,
                totalLikes,
                totalComments,
                engagementRate,
                posts,
                isLive: true,
            };

            return NextResponse.json(profile);
        } catch (error) {
            console.error("Instagram API error:", error);
            // Fall through to mock data on error
        }
    }

    // Mock fallback when no access token or API error
    const cleanUsername = username || "presocio.ai";

    const mockPosts = [
        {
            id: "1",
            thumbnail: "",
            caption: "5 AI tools every social media manager needs in 2026 🤖✨ #AIMarketing #SocialMedia",
            likes: 1243,
            comments: 89,
            timestamp: "2026-03-18T10:30:00Z",
            type: "carousel" as const,
            permalink: "",
            mediaUrl: "",
        },
        {
            id: "2",
            thumbnail: "",
            caption: "How we grew our engagement by 300% in 30 days 📈 Full breakdown inside!",
            likes: 2105,
            comments: 156,
            timestamp: "2026-03-16T14:00:00Z",
            type: "video" as const,
            permalink: "",
            mediaUrl: "",
        },
        {
            id: "3",
            thumbnail: "",
            caption: "Content calendar template for Q2 2026 — download free in bio 📅",
            likes: 892,
            comments: 67,
            timestamp: "2026-03-14T09:15:00Z",
            type: "image" as const,
            permalink: "",
            mediaUrl: "",
        },
        {
            id: "4",
            thumbnail: "",
            caption: "Reels vs Stories vs Feed Posts — which performs best? 🤔 Swipe to find out →",
            likes: 1567,
            comments: 134,
            timestamp: "2026-03-12T16:45:00Z",
            type: "carousel" as const,
            permalink: "",
            mediaUrl: "",
        },
        {
            id: "5",
            thumbnail: "",
            caption: "Behind the scenes at Presocio HQ 🏢 Building the future of social media management",
            likes: 743,
            comments: 52,
            timestamp: "2026-03-10T11:00:00Z",
            type: "image" as const,
            permalink: "",
            mediaUrl: "",
        },
        {
            id: "6",
            thumbnail: "",
            caption: "🔥 New feature alert: AI-powered caption generator is here! Try it now →",
            likes: 1891,
            comments: 201,
            timestamp: "2026-03-08T13:30:00Z",
            type: "video" as const,
            permalink: "",
            mediaUrl: "",
        },
    ];

    const totalLikes = mockPosts.reduce((sum, p) => sum + p.likes, 0);
    const totalComments = mockPosts.reduce((sum, p) => sum + p.comments, 0);

    const profile = {
        username: cleanUsername,
        name: cleanUsername.replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        bio: `🚀 Digital creator | 📊 ${cleanUsername} on Instagram | ✨ Content that inspires`,
        profilePicture: "",
        followers: 12_540,
        following: 892,
        totalPosts: 342,
        totalLikes,
        totalComments,
        engagementRate: 4.35,
        posts: mockPosts,
        isLive: false,
    };

    // Simulate network delay for mock
    await new Promise((r) => setTimeout(r, 800));

    return NextResponse.json(profile);
}
