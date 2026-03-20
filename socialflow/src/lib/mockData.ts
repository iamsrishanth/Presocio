// Mock data for the Presocio application

export interface InstagramPost {
    id: string;
    thumbnail: string;
    caption: string;
    likes: number;
    comments: number;
    timestamp: string;
    type: "image" | "video" | "carousel";
}

export interface InstagramProfile {
    username: string;
    name: string;
    bio: string;
    profilePicture: string;
    followers: number;
    following: number;
    totalPosts: number;
    totalLikes: number;
    totalComments: number;
    engagementRate: number;
}

export const mockProfile: InstagramProfile = {
    username: "presocio.ai",
    name: "Presocio AI",
    bio: "🚀 AI-powered social media manager | 📊 Analytics & Insights | 🎥 Content Creation Tools",
    profilePicture: "",
    followers: 12_540,
    following: 892,
    totalPosts: 342,
    totalLikes: 48_720,
    totalComments: 5_830,
    engagementRate: 4.35,
};

export const mockPosts: InstagramPost[] = [
    {
        id: "1",
        thumbnail: "",
        caption: "5 AI tools every social media manager needs in 2026 🤖✨ #AIMarketing #SocialMedia",
        likes: 1243,
        comments: 89,
        timestamp: "2026-03-18T10:30:00Z",
        type: "carousel",
    },
    {
        id: "2",
        thumbnail: "",
        caption: "How we grew our engagement by 300% in 30 days 📈 Full breakdown inside!",
        likes: 2105,
        comments: 156,
        timestamp: "2026-03-16T14:00:00Z",
        type: "video",
    },
    {
        id: "3",
        thumbnail: "",
        caption: "Content calendar template for Q2 2026 — download free in bio 📅",
        likes: 892,
        comments: 67,
        timestamp: "2026-03-14T09:15:00Z",
        type: "image",
    },
    {
        id: "4",
        thumbnail: "",
        caption: "Reels vs Stories vs Feed Posts — which performs best? 🤔 Swipe to find out →",
        likes: 1567,
        comments: 134,
        timestamp: "2026-03-12T16:45:00Z",
        type: "carousel",
    },
    {
        id: "5",
        thumbnail: "",
        caption: "Behind the scenes at Presocio HQ 🏢 Building the future of social media management",
        likes: 743,
        comments: 52,
        timestamp: "2026-03-10T11:00:00Z",
        type: "image",
    },
    {
        id: "6",
        thumbnail: "",
        caption: "🔥 New feature alert: AI-powered caption generator is here! Try it now →",
        likes: 1891,
        comments: 201,
        timestamp: "2026-03-08T13:30:00Z",
        type: "video",
    },
];

export const dashboardStats = {
    totalPosts: mockProfile.totalPosts,
    avgLikes: Math.round(mockProfile.totalLikes / mockProfile.totalPosts),
    avgComments: Math.round(mockProfile.totalComments / mockProfile.totalPosts),
    engagementRate: mockProfile.engagementRate,
};
