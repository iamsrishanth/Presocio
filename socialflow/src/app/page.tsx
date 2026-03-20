"use client";

import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Heart,
  MessageCircle,
  TrendingUp,
  FileText,
  Video,
  Layers,
  Image,
  Film,
  ArrowRight,
  Wifi,
  WifiOff,
} from "lucide-react";
import Link from "next/link";
import LoadingSpinner from "@/components/LoadingSpinner";

interface Post {
  id: string;
  thumbnail: string;
  caption: string;
  likes: number;
  comments: number;
  timestamp: string;
  type: "image" | "video" | "carousel";
  mediaUrl?: string;
}

interface DashboardData {
  totalPosts: number;
  avgLikes: number;
  avgComments: number;
  engagementRate: number;
  posts: Post[];
  isLive: boolean;
  username?: string;
  profilePicture?: string;
}

const postTypeIcon: Record<string, typeof Image> = {
  image: Image,
  video: Film,
  carousel: Layers,
};

const postTypeColor: Record<string, string> = {
  image: "bg-blue-100 text-blue-600",
  video: "bg-red-100 text-red-600",
  carousel: "bg-purple-100 text-purple-600",
};

function timeAgo(dateStr: string) {
  const ms = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(ms / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/instagram");
        const profile = await res.json();

        const posts: Post[] = profile.posts || [];
        const totalLikes = posts.reduce((s: number, p: Post) => s + p.likes, 0);
        const totalComments = posts.reduce((s: number, p: Post) => s + p.comments, 0);
        const count = posts.length || 1;

        setData({
          totalPosts: profile.totalPosts || posts.length,
          avgLikes: Math.round(totalLikes / count),
          avgComments: Math.round(totalComments / count),
          engagementRate: profile.engagementRate || 0,
          posts,
          isLive: profile.isLive || false,
          username: profile.username,
          profilePicture: profile.profilePicture,
        });
      } catch {
        // Fallback to empty state
        setData({
          totalPosts: 0,
          avgLikes: 0,
          avgComments: 0,
          engagementRate: 0,
          posts: [],
          isLive: false,
        });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner text="Loading dashboard..." size="lg" />
      </div>
    );
  }

  if (!data) return null;

  const statCards = [
    {
      label: "Total Posts",
      value: data.totalPosts.toLocaleString(),
      icon: FileText,
      color: "text-[var(--color-primary)]",
      bg: "bg-[var(--color-primary)]/8",
    },
    {
      label: "Avg Likes",
      value: data.avgLikes.toLocaleString(),
      icon: Heart,
      color: "text-pink-500",
      bg: "bg-pink-500/8",
    },
    {
      label: "Avg Comments",
      value: data.avgComments.toLocaleString(),
      icon: MessageCircle,
      color: "text-blue-500",
      bg: "bg-blue-500/8",
    },
    {
      label: "Engagement Rate",
      value: `${data.engagementRate}%`,
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-500/8",
    },
  ];

  return (
    <div className="space-y-8 animate-in">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
              <LayoutDashboard size={20} className="text-[var(--color-primary)]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--color-text)]">Dashboard</h1>
              <p className="text-sm text-[var(--color-text-muted)]">
                Overview of your social media performance
              </p>
            </div>
          </div>
          {/* Live/Mock indicator */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${data.isLive
              ? "bg-emerald-50 text-emerald-600"
              : "bg-amber-50 text-amber-600"
            }`}>
            {data.isLive ? <Wifi size={12} /> : <WifiOff size={12} />}
            {data.isLive ? `Live — @${data.username}` : "Mock Data"}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                  {stat.label}
                </span>
                <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <Icon size={18} className={stat.color} />
                </div>
              </div>
              <p className="text-3xl font-bold text-[var(--color-text)]">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/video-creator" className="card group flex items-center gap-4 hover:border-[var(--color-primary)]/30 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
            <Video size={22} className="text-red-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[var(--color-text)]">Video Creator</h3>
            <p className="text-sm text-[var(--color-text-muted)]">
              Generate AI-powered video scripts
            </p>
          </div>
          <ArrowRight size={18} className="text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] transition-colors shrink-0" />
        </Link>
        <Link href="/carousel-creator" className="card group flex items-center gap-4 hover:border-[var(--color-primary)]/30 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
            <Layers size={22} className="text-purple-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[var(--color-text)]">Carousel Creator</h3>
            <p className="text-sm text-[var(--color-text-muted)]">
              Create slide-by-slide carousel content
            </p>
          </div>
          <ArrowRight size={18} className="text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] transition-colors shrink-0" />
        </Link>
      </div>

      {/* Recent Posts */}
      <div>
        <h2 className="text-lg font-bold text-[var(--color-text)] mb-4">Recent Posts</h2>
        {data.posts.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-sm text-[var(--color-text-muted)]">No posts found. Connect your Instagram account to see live data.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.posts.map((post) => {
              const TypeIcon = postTypeIcon[post.type] || Image;
              return (
                <div key={post.id} className="card">
                  {/* Thumbnail */}
                  <div className="w-full h-40 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
                    {post.thumbnail || post.mediaUrl ? (
                      <img
                        src={post.thumbnail || post.mediaUrl}
                        alt={post.caption?.slice(0, 50) || "Post"}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                          (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                        }}
                      />
                    ) : null}
                    <div className={`${post.thumbnail || post.mediaUrl ? "hidden" : ""} flex items-center justify-center absolute inset-0`}>
                      <TypeIcon size={32} className="text-[var(--color-primary)]/40" />
                    </div>
                    <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase z-10 ${postTypeColor[post.type] || "bg-gray-100 text-gray-600"}`}>
                      {post.type}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-text)] line-clamp-2 mb-3 leading-relaxed">
                    {post.caption || "No caption"}
                  </p>
                  <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)]">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Heart size={12} className="text-pink-400" />{" "}
                        {post.likes.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle size={12} className="text-blue-400" />{" "}
                        {post.comments.toLocaleString()}
                      </span>
                    </div>
                    <span>{timeAgo(post.timestamp)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
