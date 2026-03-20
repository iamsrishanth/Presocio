"use client";

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
} from "lucide-react";
import Link from "next/link";
import { dashboardStats, mockPosts } from "@/lib/mockData";

const statCards = [
  {
    label: "Total Posts",
    value: dashboardStats.totalPosts.toLocaleString(),
    icon: FileText,
    color: "text-[var(--color-primary)]",
    bg: "bg-[var(--color-primary)]/8",
  },
  {
    label: "Avg Likes",
    value: dashboardStats.avgLikes.toLocaleString(),
    icon: Heart,
    color: "text-pink-500",
    bg: "bg-pink-500/8",
  },
  {
    label: "Avg Comments",
    value: dashboardStats.avgComments.toLocaleString(),
    icon: MessageCircle,
    color: "text-blue-500",
    bg: "bg-blue-500/8",
  },
  {
    label: "Engagement Rate",
    value: `${dashboardStats.engagementRate}%`,
    icon: TrendingUp,
    color: "text-emerald-500",
    bg: "bg-emerald-500/8",
  },
];

const postTypeIcon = {
  image: Image,
  video: Film,
  carousel: Layers,
};

const postTypeColor = {
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
  return (
    <div className="space-y-8 animate-in">
      {/* Header */}
      <div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockPosts.map((post) => {
            const TypeIcon = postTypeIcon[post.type];
            return (
              <div key={post.id} className="card">
                {/* Thumbnail placeholder */}
                <div className="w-full h-40 rounded-lg bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-primary)]/5 mb-3 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 opacity-80" />
                  <TypeIcon size={32} className="text-[var(--color-primary)]/40 relative z-10" />
                  <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase z-10 ${postTypeColor[post.type]}`}>
                    {post.type}
                  </span>
                </div>
                <p className="text-sm text-[var(--color-text)] line-clamp-2 mb-3 leading-relaxed">
                  {post.caption}
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
      </div>
    </div>
  );
}
