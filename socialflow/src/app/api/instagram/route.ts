import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username") || "socialflow.ai";

    // Mock Instagram profile data - in production, this would use the Instagram Graph API
    const profile = {
        username: username,
        name: username.replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        bio: `🚀 Digital creator | 📊 ${username} on Instagram | ✨ Content that inspires`,
        profilePicture: "",
        followers: Math.floor(Math.random() * 50000) + 5000,
        following: Math.floor(Math.random() * 2000) + 200,
        totalPosts: Math.floor(Math.random() * 500) + 50,
        totalLikes: Math.floor(Math.random() * 100000) + 10000,
        totalComments: Math.floor(Math.random() * 15000) + 1000,
        engagementRate: parseFloat((Math.random() * 6 + 1.5).toFixed(2)),
    };

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));

    return NextResponse.json(profile);
}
