'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Camera,
  ThumbsUp,
  Network,
  Play,
  X,
  Clock,
  MoreHorizontal,
  Filter,
  Grid3X3,
  List,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWorkflowStore } from '@/store';
import type { Platform, ContentFormat } from '@/types';

const platformIcons: Record<Platform, React.ElementType> = {
  instagram: Camera,
  facebook: ThumbsUp,
  linkedin: Network,
  youtube: Play,
  x: X,
};

const platformColors: Record<Platform, string> = {
  instagram: 'bg-gradient-to-br from-[#f09433] to-[#dc2743]',
  facebook: 'bg-[#1877f2]',
  linkedin: 'bg-[#0a66c2]',
  youtube: 'bg-[#ff0000]',
  x: 'bg-[#71767b]',
};

const platformBorderColors: Record<Platform, string> = {
  instagram: 'border-[#dc2743]/30',
  facebook: 'border-[#1877f2]/30',
  linkedin: 'border-[#0a66c2]/30',
  youtube: 'border-[#ff0000]/30',
  x: 'border-[#71767b]/30',
};

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

interface CalendarPost {
  id: string;
  platform: Platform;
  caption: string;
  scheduledDate: Date;
  status: 'draft' | 'scheduled' | 'published';
}

export function Calendar() {
  const { generatedPosts, postingQueue } = useWorkflowStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'list'>('month');
  const [filterPlatform, setFilterPlatform] = useState<Platform | 'all'>('all');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToday = () => setCurrentDate(new Date());

  // Build calendar posts from real workflow data
  const calendarPosts = useMemo<CalendarPost[]>(() => {
    const posts: CalendarPost[] = [];

    // Add posts from postingQueue (scheduled/published)
    postingQueue.forEach((item) => {
      const generatedPost = generatedPosts.find((p) => p.id === item.postId);
      posts.push({
        id: item.id,
        platform: item.platform,
        caption: generatedPost?.caption || `Post for ${item.platform}`,
        scheduledDate: new Date(item.scheduledTime),
        status: item.status === 'published' ? 'published' : 'scheduled',
      });
    });

    // Add approved but unscheduled posts as drafts
    const scheduledPostIds = new Set(postingQueue.map((q) => q.postId));
    generatedPosts
      .filter((p) => p.status === 'approved' && !scheduledPostIds.has(p.id))
      .forEach((p) => {
        posts.push({
          id: `draft-${p.id}`,
          platform: p.platform,
          caption: p.caption || 'Draft post',
          scheduledDate: new Date(),
          status: 'draft',
        });
      });

    return posts;
  }, [generatedPosts, postingQueue]);

  const filteredPosts = useMemo(() => {
    return calendarPosts.filter((p) => {
      if (filterPlatform !== 'all' && p.platform !== filterPlatform) return false;
      return true;
    });
  }, [calendarPosts, filterPlatform]);

  const getPostsForDay = (day: number) => {
    return filteredPosts.filter((p) => {
      const d = p.scheduledDate;
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
    });
  };

  const scheduledCount = filteredPosts.filter((p) => p.status === 'scheduled').length;
  const draftCount = filteredPosts.filter((p) => p.status === 'draft').length;
  const publishedCount = filteredPosts.filter((p) => p.status === 'published').length;
  const hasData = calendarPosts.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="font-syne font-bold text-xl text-text">
            {MONTHS[month]} {year}
          </h2>
          <div className="flex items-center gap-1">
            <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-surface transition-colors text-muted hover:text-text">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={goToday} className="btn-secondary text-xs py-1.5 px-3">
              Today
            </button>
            <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-surface transition-colors text-muted hover:text-text">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Platform Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted" />
            <select
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value as Platform | 'all')}
              className="bg-surface border border-border rounded-lg px-3 py-1.5 text-xs text-text focus:outline-none focus:ring-1 focus:ring-accent2"
            >
              <option value="all">All Platforms</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="linkedin">LinkedIn</option>
              <option value="youtube">YouTube</option>
              <option value="x">X (Twitter)</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-surface rounded-lg p-1">
            <button
              onClick={() => setViewMode('month')}
              className={cn(
                'p-1.5 rounded transition-colors',
                viewMode === 'month' ? 'bg-accent2/20 text-accent2' : 'text-muted hover:text-text'
              )}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-1.5 rounded transition-colors',
                viewMode === 'list' ? 'bg-accent2/20 text-accent2' : 'text-muted hover:text-text'
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center gap-4">
        <div className="glass-card px-4 py-2 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent2" />
          <span className="text-xs text-muted">{scheduledCount} scheduled</span>
        </div>
        <div className="glass-card px-4 py-2 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent4" />
          <span className="text-xs text-muted">{draftCount} drafts</span>
        </div>
        <div className="glass-card px-4 py-2 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent3" />
          <span className="text-xs text-muted">{publishedCount} published</span>
        </div>
      </div>

      {!hasData ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-12 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-accent4/10 flex items-center justify-center mx-auto mb-4">
            <CalendarIcon className="w-8 h-8 text-accent4" />
          </div>
          <h3 className="font-syne font-bold text-lg text-text mb-2">No Scheduled Posts</h3>
          <p className="text-sm text-muted max-w-md mx-auto">
            Create a campaign and schedule posts to see them on your calendar.
          </p>
        </motion.div>
      ) : viewMode === 'month' ? (
        /* Month Grid */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card overflow-hidden"
        >
          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b border-border">
            {DAYS.map((day) => (
              <div key={day} className="p-3 text-center text-xs font-syne font-semibold text-muted">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7">
            {/* Empty cells before first day */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[120px] p-2 border-b border-r border-border/30 bg-surface/20" />
            ))}

            {/* Day cells */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayPosts = getPostsForDay(day);
              const isToday =
                day === new Date().getDate() &&
                month === new Date().getMonth() &&
                year === new Date().getFullYear();

              return (
                <div
                  key={day}
                  className={cn(
                    'min-h-[120px] p-2 border-b border-r border-border/30 transition-colors hover:bg-surface/30',
                    isToday && 'bg-accent2/5'
                  )}
                >
                  <div className={cn(
                    'text-xs font-semibold mb-1.5 w-6 h-6 rounded-full flex items-center justify-center',
                    isToday ? 'bg-accent2 text-white' : 'text-muted'
                  )}>
                    {day}
                  </div>
                  <div className="space-y-1">
                    {dayPosts.slice(0, 3).map((post) => {
                      const Icon = platformIcons[post.platform];
                      return (
                        <div
                          key={post.id}
                          className={cn(
                            'flex items-center gap-1 px-1.5 py-1 rounded text-[10px] truncate border',
                            platformBorderColors[post.platform],
                            post.status === 'published' && 'opacity-60'
                          )}
                        >
                          <Icon className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate text-text">{post.caption}</span>
                        </div>
                      );
                    })}
                    {dayPosts.length > 3 && (
                      <div className="text-[10px] text-muted px-1.5">+{dayPosts.length - 3} more</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      ) : (
        /* List View */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card divide-y divide-border/30"
        >
          {filteredPosts
            .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime())
            .map((post, i) => {
              const Icon = platformIcons[post.platform];
              const d = post.scheduledDate;
              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center gap-4 p-4 hover:bg-surface/30 transition-colors"
                >
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                    platformColors[post.platform]
                  )}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text truncate">{post.caption}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] text-muted capitalize">{post.platform}</span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    {post.status !== 'draft' ? (
                      <>
                        <div className="text-xs text-text font-semibold">
                          {d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                        <div className="text-[10px] text-muted flex items-center gap-1 justify-end">
                          <Clock className="w-3 h-3" />
                          {d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        </div>
                      </>
                    ) : (
                      <div className="text-xs text-dimmed">Unscheduled</div>
                    )}
                  </div>

                  <span className={cn(
                    'tag text-[10px]',
                    post.status === 'published' && 'tag-green',
                    post.status === 'scheduled' && 'tag-purple',
                    post.status === 'draft' && 'tag-yellow'
                  )}>
                    {post.status}
                  </span>
                </motion.div>
              );
            })}
        </motion.div>
      )}
    </div>
  );
}
