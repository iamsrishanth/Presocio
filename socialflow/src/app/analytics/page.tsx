"use client";

import { useState } from "react";
import {
    BarChart3,
    Search,
    Heart,
    MessageCircle,
    TrendingUp,
    FileText,
    Sparkles,
    Users,
    UserCheck,
    AlertCircle,
    Wifi,
    WifiOff,
} from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

interface ProfileData {
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
    isLive?: boolean;
}

export default function AnalyticsPage() {
    const [username, setUsername] = useState("");
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [aiStrategy, setAiStrategy] = useState("");
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState("");

    const fetchProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim()) return;

        setLoading(true);
        setError("");
        setProfile(null);
        setAiStrategy("");

        try {
            const cleanUsername = username.replace("@", "").trim();
            const res = await fetch(`/api/instagram?username=${encodeURIComponent(cleanUsername)}`);
            if (!res.ok) throw new Error("Failed to fetch profile");
            const data = await res.json();
            setProfile(data);
        } catch {
            setError("Could not fetch profile. Please check the username and try again.");
        } finally {
            setLoading(false);
        }
    };

    const fetchAiStrategy = async () => {
        if (!profile) return;
        setAiLoading(true);
        setAiError("");

        try {
            const res = await fetch("/api/ai/strategy", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: profile.username,
                    totalPosts: profile.totalPosts,
                    totalLikes: profile.totalLikes,
                    totalComments: profile.totalComments,
                    engagementRate: profile.engagementRate,
                    followers: profile.followers,
                }),
            });
            if (!res.ok) throw new Error("AI request failed");
            const data = await res.json();
            setAiStrategy(data.strategy);
        } catch {
            setAiError("Failed to generate AI strategy. Please try again.");
        } finally {
            setAiLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
                        <BarChart3 size={20} className="text-[var(--color-primary)]" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--color-text)]">Instagram Analytics</h1>
                        <p className="text-sm text-[var(--color-text-muted)]">
                            Analyze any Instagram profile with AI insights
                        </p>
                    </div>
                </div>
                {profile && (
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${profile.isLive
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-amber-50 text-amber-600"
                        }`}>
                        {profile.isLive ? <Wifi size={12} /> : <WifiOff size={12} />}
                        {profile.isLive ? "Live Data" : "Mock Data"}
                    </div>
                )}
            </div>

            {/* Search Form */}
            <form onSubmit={fetchProfile} className="card">
                <label className="label">Instagram Username</label>
                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username (e.g. @handle)"
                            className="input-field pl-10"
                        />
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading || !username.trim()}>
                        {loading ? <span className="spinner w-4 h-4 border-2 border-white/30 border-t-white" /> : "Analyze"}
                    </button>
                </div>
            </form>

            {/* Error */}
            {error && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium">
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}

            {/* Loading */}
            {loading && <LoadingSpinner text="Fetching profile data..." />}

            {/* Profile Card */}
            {profile && !loading && (
                <div className="space-y-6 animate-in">
                    <div className="card">
                        <div className="flex flex-col sm:flex-row items-start gap-5">
                            {/* Avatar */}
                            {profile.profilePicture ? (
                                <img
                                    src={profile.profilePicture}
                                    alt={profile.name}
                                    className="w-20 h-20 rounded-2xl object-cover shrink-0"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-purple-400 flex items-center justify-center text-white text-2xl font-bold shrink-0">
                                    {profile.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <h2 className="text-xl font-bold text-[var(--color-text)]">{profile.name}</h2>
                                <p className="text-sm text-[var(--color-primary)] font-medium">@{profile.username}</p>
                                <p className="text-sm text-[var(--color-text-secondary)] mt-2 leading-relaxed">
                                    {profile.bio}
                                </p>
                                <div className="flex items-center gap-4 mt-3">
                                    <span className="flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)]">
                                        <Users size={14} /> <strong className="text-[var(--color-text)]">{profile.followers.toLocaleString()}</strong> followers
                                    </span>
                                    <span className="flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)]">
                                        <UserCheck size={14} /> <strong className="text-[var(--color-text)]">{profile.following.toLocaleString()}</strong> following
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: "Total Posts", value: profile.totalPosts.toLocaleString(), icon: FileText, color: "text-[var(--color-primary)]", bg: "bg-[var(--color-primary)]/8" },
                            { label: "Total Likes", value: profile.totalLikes.toLocaleString(), icon: Heart, color: "text-pink-500", bg: "bg-pink-500/8" },
                            { label: "Total Comments", value: profile.totalComments.toLocaleString(), icon: MessageCircle, color: "text-blue-500", bg: "bg-blue-500/8" },
                            { label: "Engagement Rate", value: `${profile.engagementRate}%`, icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/8" },
                        ].map((stat) => {
                            const Icon = stat.icon;
                            return (
                                <div key={stat.label} className="card text-center">
                                    <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mx-auto mb-2`}>
                                        <Icon size={18} className={stat.color} />
                                    </div>
                                    <p className="text-2xl font-bold text-[var(--color-text)]">{stat.value}</p>
                                    <p className="text-xs text-[var(--color-text-muted)] font-medium mt-1">{stat.label}</p>
                                </div>
                            );
                        })}
                    </div>

                    {/* AI Strategy Button */}
                    <div className="flex justify-center">
                        <button
                            onClick={fetchAiStrategy}
                            disabled={aiLoading}
                            className="btn-primary text-base px-8 py-3"
                        >
                            {aiLoading ? (
                                <>
                                    <span className="spinner w-4 h-4 border-2 border-white/30 border-t-white" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={18} />
                                    AI Content Strategy
                                </>
                            )}
                        </button>
                    </div>

                    {/* AI Error */}
                    {aiError && (
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium">
                            <AlertCircle size={18} />
                            {aiError}
                        </div>
                    )}

                    {/* AI Strategy Result */}
                    {aiStrategy && (
                        <div className="card animate-in border-[var(--color-primary)]/20">
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles size={18} className="text-[var(--color-primary)]" />
                                <h3 className="text-lg font-bold text-[var(--color-text)]">AI Content Strategy</h3>
                            </div>
                            <div className="prose prose-sm max-w-none text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-line">
                                {aiStrategy}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
