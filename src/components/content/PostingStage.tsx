'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Send,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { cn, formatDate, formatTime } from '@/lib/utils';
import type { Platform, PostingQueue } from '@/types';
import { useWorkflowStore, useAnalyticsStore } from '@/store';

interface PostingStageProps {
  onComplete: () => void;
}

export function PostingStage({ onComplete }: PostingStageProps) {
  const { postingQueue, generatedPosts, updateGeneratedPost } = useWorkflowStore();
  const [statuses, setStatuses] = useState<Record<string, 'queued' | 'publishing' | 'published' | 'failed'>>({});
  const [apiMode, setApiMode] = useState<'live' | 'demo'>('demo');
  const updateStats = useAnalyticsStore((state) => state.updateStats);

  const publishItem = useCallback(async (item: PostingQueue) => {
    setStatuses((prev) => ({ ...prev, [item.id]: 'publishing' }));

    try {
      const res = await fetch('/api/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'publish',
          content: `Post for ${item.platform}`,
          platforms: [item.platform],
          scheduledFor: item.scheduledTime,
          publishNow: true,
        }),
      });

      const data = await res.json();
      setApiMode(data.mode || 'demo');

      const result = data.data?.[0];
      const success = result?.success ?? false;

      setStatuses((prev) => ({
        ...prev,
        [item.id]: success ? 'published' : 'failed',
      }));

      if (success) {
        updateGeneratedPost(item.postId, {
          status: 'approved',
          postId: result.postId || `post_${Date.now()}`,
        });

        const post = generatedPosts.find((p) => p.id === item.postId);
        if (post) {
          const { platformStats, totalPosts, publishedPosts, averageEngagement } = useAnalyticsStore.getState();
          const newPlatformStats = { ...platformStats };
          const pStat = newPlatformStats[item.platform];
          
          pStat.engagement = (pStat.engagement * pStat.posts + post.engagementScore) / (pStat.posts + 1);
          pStat.posts += 1;

          const newTotal = totalPosts + 1;
          const newAvgEng = (averageEngagement * totalPosts + post.engagementScore) / newTotal;

          updateStats({
            totalPosts: newTotal,
            publishedPosts: publishedPosts + 1,
            averageEngagement: newAvgEng,
            platformStats: newPlatformStats,
          });
        }
      }
    } catch {
      setStatuses((prev) => ({ ...prev, [item.id]: 'failed' }));
    }
  }, [updateGeneratedPost]);

  useEffect(() => {
    if (postingQueue.length === 0) return;

    const runQueue = async () => {
      for (let i = 0; i < postingQueue.length; i++) {
        await publishItem(postingQueue[i]);
        // Small delay between posts to respect rate limits
        if (i < postingQueue.length - 1) {
          await new Promise((r) => setTimeout(r, 1500));
        }
      }
      onComplete();
    };

    const timer = setTimeout(runQueue, 1000);
    return () => clearTimeout(timer);
  }, [postingQueue, publishItem, onComplete]);

  const retryFailed = async (queueId: string) => {
    const item = postingQueue.find((q) => q.id === queueId);
    if (!item) return;
    setStatuses((prev) => ({ ...prev, [queueId]: 'queued' }));
    await publishItem(item);
  };

  if (postingQueue.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 rounded-full bg-accent4/10 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-accent4" />
        </div>
        <h3 className="font-syne font-bold text-lg text-text mb-2">
          No Posts to Publish
        </h3>
        <p className="text-sm text-muted mb-6">
          Schedule some posts first to see them here
        </p>
        <button onClick={onComplete} className="btn-secondary">
          Return to Dashboard
        </button>
      </div>
    );
  }

  const publishedCount = Object.values(statuses).filter((s) => s === 'published').length;
  const failedCount = Object.values(statuses).filter((s) => s === 'failed').length;

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <Send className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h2 className="font-syne font-bold text-lg text-text">Cross-Platform Publishing</h2>
              <p className="text-sm text-muted">
                Publishing via Zernio unified API {apiMode === 'demo' && '(demo mode)'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="tag tag-green">{publishedCount} published</span>
            {failedCount > 0 && (
              <span className="tag tag-red">{failedCount} failed</span>
            )}
          </div>
        </div>

        <div className="h-2 bg-surface rounded-full overflow-hidden mb-8">
          <motion.div
            className="h-full bg-gradient-to-r from-accent2 to-accent"
            initial={{ width: 0 }}
            animate={{ width: `${(publishedCount / postingQueue.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="space-y-3">
          {postingQueue.map((item, index) => {
            const status = statuses[item.id] || 'queued';
            const post = postingQueue.find((p) => p.postId === item.postId);
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  'bg-surface/50 rounded-lg p-4 flex items-center justify-between',
                  status === 'publishing' && 'ring-2 ring-accent2/30',
                  status === 'published' && 'border-l-4 border-accent3',
                  status === 'failed' && 'border-l-4 border-accent'
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center',
                    status === 'queued' && 'bg-surface',
                    status === 'publishing' && 'bg-accent2/10',
                    status === 'published' && 'bg-accent3/10',
                    status === 'failed' && 'bg-accent/10'
                  )}>
                    {status === 'queued' && <Clock className="w-5 h-5 text-dimmed" />}
                    {status === 'publishing' && (
                      <Loader2 className="w-5 h-5 text-accent2 animate-spin" />
                    )}
                    {status === 'published' && (
                      <CheckCircle2 className="w-5 h-5 text-accent3" />
                    )}
                    {status === 'failed' && (
                      <XCircle className="w-5 h-5 text-accent" />
                    )}
                  </div>
                  
                  <div>
                    <span className="tag tag-purple text-xs">{item.platform}</span>
                    <div className="text-xs text-muted mt-1">
                      {formatDate(item.scheduledTime)} at {formatTime(item.scheduledTime)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {status === 'failed' && (
                    <button
                      onClick={() => retryFailed(item.id)}
                      className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Retry
                    </button>
                  )}
                  
                  <span className={cn(
                    'tag text-xs',
                    status === 'queued' && 'tag-yellow',
                    status === 'publishing' && 'tag-purple',
                    status === 'published' && 'tag-green',
                    status === 'failed' && 'tag-red'
                  )}>
                    {status}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="glass-card p-4 bg-accent2/5 border-accent2/20">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent2/10 flex items-center justify-center flex-shrink-0">
            <Send className="w-4 h-4 text-accent2" />
          </div>
          <div>
            <div className="font-syne font-semibold text-sm text-text mb-1">
              Zernio Integration {apiMode === 'live' ? 'Active' : '(Demo Mode)'}
            </div>
            <p className="text-xs text-muted">
              {apiMode === 'live'
                ? 'Posts are being published through Zernio unified API with automatic rate limiting, error handling, and retry logic.'
                : 'Set ZERNIO_API_KEY in .env.local to publish for real. Currently running in demo mode with simulated publishing.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
