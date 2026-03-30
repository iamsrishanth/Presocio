'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock,
  Calendar,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { cn, generateId } from '@/lib/utils';
import type { Platform, PostingQueue } from '@/types';
import { useWorkflowStore } from '@/store';

interface SchedulingStageProps {
  onNext: () => void;
}

const optimalTimes: Record<Platform, { time: string; score: number }[]> = {
  instagram: [
    { time: '11:00 AM', score: 92 },
    { time: '1:00 PM', score: 88 },
    { time: '7:00 PM', score: 95 },
  ],
  facebook: [
    { time: '9:00 AM', score: 85 },
    { time: '1:00 PM', score: 90 },
    { time: '3:00 PM', score: 87 },
  ],
  linkedin: [
    { time: '8:00 AM', score: 92 },
    { time: '12:00 PM', score: 88 },
    { time: '5:00 PM', score: 85 },
  ],
  youtube: [
    { time: '2:00 PM', score: 90 },
    { time: '6:00 PM', score: 95 },
    { time: '8:00 PM', score: 88 },
  ],
  x: [
    { time: '9:00 AM', score: 88 },
    { time: '12:00 PM', score: 92 },
    { time: '5:00 PM', score: 85 },
  ],
};

export function SchedulingStage({ onNext }: SchedulingStageProps) {
  const { generatedPosts, addToPostingQueue } = useWorkflowStore();
  const [loading, setLoading] = useState(true);
  const [queue, setQueue] = useState<PostingQueue[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<Record<string, string>>({});

  useEffect(() => {
    const generateQueue = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const approvedPosts = generatedPosts.filter((p) => p.status === 'approved');
      const newQueue: PostingQueue[] = [];
      const baseDate = new Date();
      
      approvedPosts.forEach((post, index) => {
        const platformTimes = optimalTimes[post.platform];
        const selectedTime = platformTimes[0];
        
        const scheduledDate = new Date(baseDate);
        scheduledDate.setDate(scheduledDate.getDate() + index);
        scheduledDate.setHours(parseInt(selectedTime.time.split(':')[0]));
        
        if (selectedTime.time.includes('PM') && parseInt(selectedTime.time.split(':')[0]) !== 12) {
          scheduledDate.setHours(scheduledDate.getHours() + 12);
        }
        
        const queueItem: PostingQueue = {
          id: generateId(),
          postId: post.id,
          platform: post.platform,
          scheduledTime: scheduledDate,
          status: 'queued',
        };
        
        newQueue.push(queueItem);
        setSelectedTimes((prev) => ({
          ...prev,
          [post.id]: selectedTime.time,
        }));
      });
      
      setQueue(newQueue);
      setLoading(false);
    };
    
    generateQueue();
  }, [generatedPosts]);

  const handleTimeChange = (postId: string, time: string) => {
    setSelectedTimes((prev) => ({ ...prev, [postId]: time }));
  };

  const handlePublish = () => {
    queue.forEach((item) => {
      addToPostingQueue(item);
    });
    onNext();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 rounded-full bg-accent3/10 flex items-center justify-center mb-4">
          <Loader2 className="w-8 h-8 text-accent3 animate-spin" />
        </div>
        <h3 className="font-syne font-bold text-lg text-text mb-2">
          Optimizing Post Schedule
        </h3>
        <p className="text-sm text-muted">Finding the best times for maximum engagement...</p>
      </div>
    );
  }

  const approvedPosts = generatedPosts.filter((p) => p.status === 'approved');

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="glass-card p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-accent3/10 flex items-center justify-center">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-accent3" />
          </div>
          <div>
            <h2 className="font-syne font-bold text-base sm:text-lg text-text">Optimal Posting Times</h2>
            <p className="text-xs sm:text-sm text-muted">
              AI-predicted best times based on your audience activity
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 mb-4 sm:mb-6">
          {(['instagram', 'facebook', 'linkedin', 'youtube', 'x'] as Platform[]).map((platform) => (
            <div key={platform} className="bg-surface/50 rounded-lg p-2 sm:p-3">
              <div className="text-[10px] sm:text-xs text-muted mb-1.5 sm:mb-2 capitalize">{platform}</div>
              <div className="space-y-1">
                {optimalTimes[platform].slice(0, 2).map((slot, i) => (
                  <div key={i} className="flex items-center justify-between text-[10px] sm:text-xs">
                    <span className="text-text">{slot.time}</span>
                    <span className={cn(
                      'tag text-[10px]',
                      slot.score >= 90 ? 'tag-green' : 'tag-yellow'
                    )}>
                      {slot.score}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-4 sm:p-6">
        <h3 className="font-syne font-bold text-base sm:text-lg text-text mb-3 sm:mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-accent4" />
          Publishing Queue
        </h3>

        {queue.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="w-10 h-10 text-accent mx-auto mb-3 opacity-50" />
            <p className="text-muted">No approved posts to schedule</p>
          </div>
        ) : (
          <div className="space-y-3">
            {queue.map((item, index) => {
              const post = generatedPosts.find((p) => p.id === item.postId);
              const times = optimalTimes[item.platform];
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-surface/50 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-8 h-8 rounded-full bg-accent2/10 flex items-center justify-center text-sm font-mono text-accent2 flex-shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <span className="tag tag-purple text-[10px] sm:text-xs">{item.platform}</span>
                      <div className="text-[10px] sm:text-xs text-muted mt-1">
                        {item.scheduledTime.toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 sm:gap-3">
                    <select
                      value={selectedTimes[item.postId] || ''}
                      onChange={(e) => handleTimeChange(item.postId, e.target.value)}
                      className="input-field py-2 sm:py-2 px-2 sm:px-3 text-xs sm:text-sm min-h-[44px] sm:min-h-0 flex-1 sm:flex-none"
                    >
                      {times.map((slot) => (
                        <option key={slot.time} value={slot.time}>
                          {slot.time}
                        </option>
                      ))}
                    </select>
                    <div className={cn(
                      'tag text-[10px] sm:text-xs',
                      item.status === 'queued' && 'tag-yellow',
                      item.status === 'published' && 'tag-green'
                    )}>
                      {item.status}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted">
          <Zap className="w-4 h-4 text-accent3 flex-shrink-0" />
          <span>Posts will be automatically published via Zernio API</span>
        </div>
        <button
          onClick={handlePublish}
          disabled={queue.length === 0}
          className={cn(
            'btn-primary flex items-center gap-2 justify-center',
            queue.length === 0 && 'opacity-50 cursor-not-allowed'
          )}
        >
          <CheckCircle2 className="w-4 h-4" />
          Schedule & Post
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
