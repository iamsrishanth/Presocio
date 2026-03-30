'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2,
  Clock,
  AlertCircle,
  Edit3,
  RefreshCw,
  ChevronRight,
  Loader2,
  X,
} from 'lucide-react';
import { cn, getScoreColor, getScoreBgColor } from '@/lib/utils';
import type { GeneratedPost } from '@/types';
import { useWorkflowStore } from '@/store';

interface ApprovalStageProps {
  onNext: () => void;
}

export function ApprovalStage({ onNext }: ApprovalStageProps) {
  const { generatedPosts, updateGeneratedPost } = useWorkflowStore();
  const [selectedPost, setSelectedPost] = useState<GeneratedPost | null>(null);
  const [editedCaption, setEditedCaption] = useState('');

  const pendingPosts = generatedPosts.filter((p) => p.status === 'pending');
  const approvedCount = generatedPosts.filter((p) => p.status === 'approved').length;
  const rejectedCount = generatedPosts.filter((p) => p.status === 'rejected').length;

  const handleApprove = (postId: string) => {
    updateGeneratedPost(postId, { 
      status: 'approved', 
      approvedAt: new Date() 
    });
  };

  const handleReject = (postId: string) => {
    updateGeneratedPost(postId, { status: 'rejected' });
  };

  const handleRegenerate = (postId: string) => {
    updateGeneratedPost(postId, { 
      caption: `Regenerated content for ${postId.slice(0, 8)}...`,
      captionVariants: [
        `Variant A: Fresh take on the content`,
        `Variant B: Different angle approach`,
        `Variant C: More direct style`,
      ],
      status: 'pending',
    });
  };

  const handleEdit = (post: GeneratedPost) => {
    setSelectedPost(post);
    setEditedCaption(post.caption);
  };

  const handleSaveEdit = () => {
    if (selectedPost) {
      updateGeneratedPost(selectedPost.id, { 
        caption: editedCaption,
        status: 'pending',
      });
      setSelectedPost(null);
    }
  };

  const handleContinue = () => {
    const approved = generatedPosts.filter((p) => p.status === 'approved');
    if (approved.length > 0) {
      onNext();
    }
  };

  if (generatedPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 rounded-full bg-accent4/10 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-accent4" />
        </div>
        <h3 className="font-syne font-bold text-lg text-text mb-2">
          No Content to Review
        </h3>
        <p className="text-sm text-muted">
          Generate some content first
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="glass-card p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-accent4/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-accent4" />
            </div>
            <div>
              <h2 className="font-syne font-bold text-base sm:text-lg text-text">Approval Queue</h2>
              <p className="text-xs sm:text-sm text-muted">
                Review and approve content before scheduling
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="tag tag-yellow text-[10px] sm:text-xs">{pendingPosts.length} pending</span>
            <span className="tag tag-green text-[10px] sm:text-xs">{approvedCount} approved</span>
            {rejectedCount > 0 && (
              <span className="tag tag-red text-[10px] sm:text-xs">{rejectedCount} rejected</span>
            )}
          </div>
        </div>

        {pendingPosts.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle2 className="w-12 h-12 text-accent3 mx-auto mb-3" />
            <h3 className="font-syne font-bold text-lg text-text mb-2">
              All Content Reviewed
            </h3>
            <p className="text-sm text-muted mb-6">
              {approvedCount > 0 
                ? `${approvedCount} posts ready for scheduling`
                : 'No posts approved yet'}
            </p>
            {approvedCount > 0 && (
              <button onClick={handleContinue} className="btn-primary">
                Proceed to Scheduling
                <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {pendingPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-surface rounded-lg p-5 border border-border"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="tag tag-purple">{post.platform}</span>
                    <span className="tag tag-yellow text-xs">needs review</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={cn('tag text-xs', getScoreBgColor(post.engagementScore))}>
                      <span className={getScoreColor(post.engagementScore)}>
                        {post.engagementScore}% engagement
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-text leading-relaxed mb-4">
                  {post.caption || 'Content will be generated by AI...'}
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {post.hashtags.niche.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-xs text-accent2">#{tag}</span>
                  ))}
                  {post.hashtags.midTier.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-xs text-accent4">#{tag}</span>
                  ))}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 p-2 sm:p-3 bg-card rounded-lg">
                  <div className="text-center">
                    <div className={cn('font-syne font-bold', getScoreColor(post.hookScore))}>
                      {post.hookScore}%
                    </div>
                    <div className="text-[10px] text-muted">Hook</div>
                  </div>
                  <div className="text-center">
                    <div className={cn('font-syne font-bold', getScoreColor(post.ctaScore))}>
                      {post.ctaScore}%
                    </div>
                    <div className="text-[10px] text-muted">CTA</div>
                  </div>
                  <div className="text-center">
                    <div className={cn('font-syne font-bold', getScoreColor(post.hashtagScore))}>
                      {post.hashtagScore}%
                    </div>
                    <div className="text-[10px] text-muted">Hashtags</div>
                  </div>
                  <div className="text-center">
                    <div className={cn('font-syne font-bold', getScoreColor(post.brandVoiceScore))}>
                      {post.brandVoiceScore}%
                    </div>
                    <div className="text-[10px] text-muted">Brand Voice</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-border">
                  <button
                    onClick={() => handleEdit(post)}
                    className="btn-secondary text-xs py-2 px-3 flex items-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleRegenerate(post.id)}
                    className="btn-secondary text-xs py-2 px-3 flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Regenerate
                  </button>
                  <button
                    onClick={() => handleReject(post.id)}
                    className="text-xs py-2 px-3 rounded border border-accent/30 text-accent hover:bg-accent/10 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <div className="flex-1" />
                  <button
                    onClick={() => handleApprove(post.id)}
                    className="btn-primary text-xs py-2 px-4 flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    Approve
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {approvedCount > 0 && (
        <div className="flex justify-end">
          <button onClick={handleContinue} className="btn-primary flex items-center gap-2">
            Schedule {approvedCount} Approved Posts
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {selectedPost && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'var(--overlay-bg)', backdropFilter: 'blur(4px)' }}
          onClick={() => setSelectedPost(null)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="glass-card p-6 max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-syne font-bold text-lg text-text">Edit Caption</h3>
              <button onClick={() => setSelectedPost(null)} className="text-muted hover:text-text">
                <X className="w-5 h-5" />
              </button>
            </div>
            <textarea
              value={editedCaption}
              onChange={(e) => setEditedCaption(e.target.value)}
              className="input-field min-h-[200px] resize-none"
            />
            <div className="flex justify-between items-center mt-4">
              <span className="text-xs text-muted">{editedCaption.length} characters</span>
              <div className="flex gap-2">
                <button onClick={() => setSelectedPost(null)} className="btn-secondary">
                  Cancel
                </button>
                <button onClick={handleSaveEdit} className="btn-primary">
                  Save Changes
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
