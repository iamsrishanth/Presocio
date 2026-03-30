'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Image, 
  Calendar, 
  Clock,
  ChevronRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Edit3,
  X,
  Send,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GeneratedPost, WorkflowStage, Platform } from '@/types';
import { useWorkflowStore } from '@/store';
import { getScoreColor, getScoreBgColor } from '@/lib/utils';
import { generateContent } from '@/lib/ai-services';

interface ContentGeneratorProps {
  onNextStage: () => void;
}

export function ContentGenerator({ onNextStage }: ContentGeneratorProps) {
  const { generatedPosts, updateGeneratedPost, campaignBrief } = useWorkflowStore();
  const [generating, setGenerating] = useState(false);
  const [selectedPost, setSelectedPost] = useState<GeneratedPost | null>(null);
  const [editedCaption, setEditedCaption] = useState('');

  const handleGenerate = async () => {
    if (!campaignBrief) return;
    
    setGenerating(true);
    
    try {
      const postsToGenerate = generatedPosts.filter((p) => !p.caption);
      for (const post of postsToGenerate) {
        const content = await generateContent(
          campaignBrief.brandName,
          campaignBrief.campaignObjective,
          campaignBrief.targetAudience,
          campaignBrief.contentTone,
          post.platform,
          campaignBrief.keyMessages
        );
        
        updateGeneratedPost(post.id, {
          caption: content.caption,
          captionVariants: content.captionVariants,
          hashtags: content.hashtags,
          seoDescription: content.seoDescription,
          imagePrompt: content.imagePrompt,
          engagementScore: content.engagementScore,
          hookScore: content.hookScore,
          ctaScore: content.ctaScore,
          hashtagScore: content.hashtagScore,
          brandVoiceScore: content.brandVoiceScore,
          status: 'pending'
        });
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleApprove = (postId: string) => {
    updateGeneratedPost(postId, { status: 'approved', approvedAt: new Date() });
  };

  const handleReject = (postId: string) => {
    updateGeneratedPost(postId, { status: 'rejected' });
  };

  const handleEdit = (post: GeneratedPost) => {
    setSelectedPost(post);
    setEditedCaption(post.caption);
  };

  const handleSaveEdit = () => {
    if (selectedPost) {
      updateGeneratedPost(selectedPost.id, { caption: editedCaption, status: 'pending' });
      setSelectedPost(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-syne font-bold text-lg text-text flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent2" />
              AI Content Generation
            </h2>
            <p className="text-sm text-muted mt-1">
              Generating optimized content for {campaignBrief?.platforms.length || 0} platforms
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="tag tag-green">
              {generatedPosts.length} posts ready
            </span>
          </div>
        </div>

        {generatedPosts.length === 0 || generatedPosts.some(p => !p.caption) ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-accent2/10 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-accent2" />
            </div>
            <h3 className="font-syne font-bold text-lg text-text mb-2">
              Ready to Generate
            </h3>
            <p className="text-sm text-muted max-w-md mx-auto mb-6">
              Our AI will create platform-optimized content with captions, hashtags, 
              image prompts, and engagement predictions.
            </p>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className={cn(
                'btn-primary inline-flex items-center gap-2',
                generating && 'opacity-70 cursor-not-allowed'
              )}
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Content
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {generatedPosts.slice(0, 4).map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  'bg-surface rounded-lg p-4 border',
                  post.status === 'approved' && 'border-accent3/30',
                  post.status === 'rejected' && 'border-accent/30',
                  post.status === 'pending' && 'border-border'
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="tag tag-purple text-xs">{post.platform}</span>
                      <span className={cn(
                        'tag text-xs',
                        post.status === 'approved' && 'tag-green',
                        post.status === 'rejected' && 'tag-red',
                        post.status === 'pending' && 'tag-yellow'
                      )}>
                        {post.status}
                      </span>
                    </div>
                    <p className="text-sm text-text leading-relaxed mb-3">
                      {post.caption.length > 200 
                        ? post.caption.slice(0, 200) + '...' 
                        : post.caption}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {[...post.hashtags.niche, ...post.hashtags.midTier].slice(0, 5).map((tag) => (
                        <span key={tag} className="text-xs text-accent2">#{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className={cn('tag text-xs', getScoreBgColor(post.engagementScore))}>
                      <span className={getScoreColor(post.engagementScore)}>
                        {post.engagementScore}% eng
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                  <button
                    onClick={() => handleEdit(post)}
                    className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" />
                    Edit
                  </button>
                  {post.status !== 'approved' && (
                    <button
                      onClick={() => handleApprove(post.id)}
                      className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      Approve
                    </button>
                  )}
                  {post.status !== 'rejected' && (
                    <button
                      onClick={() => handleReject(post.id)}
                      className="text-xs py-1.5 px-3 rounded border border-accent/30 text-accent hover:bg-accent/10 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
            <div className="flex justify-end pt-4">
              <button onClick={onNextStage} className="btn-primary flex items-center gap-2">
                Proceed to Approval
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'var(--overlay-bg)', backdropFilter: 'blur(4px)' }}
            onClick={() => setSelectedPost(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-6 max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-syne font-bold text-lg text-text">Edit Caption</h3>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="text-muted hover:text-text"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <textarea
                value={editedCaption}
                onChange={(e) => setEditedCaption(e.target.value)}
                className="input-field min-h-[200px] resize-none"
                placeholder="Edit your caption..."
              />
              <div className="flex items-center justify-between mt-4">
                <span className="text-xs text-muted">
                  {editedCaption.length} characters
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="btn-primary flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
