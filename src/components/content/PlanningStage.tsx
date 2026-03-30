'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar,
  Sparkles,
  TrendingUp,
  Lightbulb,
  CheckCircle2,
  Loader2,
  ChevronRight,
} from 'lucide-react';
import { cn, generateId, CONTENT_PILLARS } from '@/lib/utils';
import type { ContentPlan, Platform, ContentFormat } from '@/types';
import { useWorkflowStore } from '@/store';
import { getScoreColor, getScoreBgColor } from '@/lib/utils';

interface PlanningStageProps {
  onNext: () => void;
}

export function PlanningStage({ onNext }: PlanningStageProps) {
  const { campaignBrief, setContentPlans, addGeneratedPost } = useWorkflowStore();
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<ContentPlan[]>([]);
  const [selectedPlans, setSelectedPlans] = useState<Set<string>>(new Set());

  useEffect(() => {
    const generatePlans = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const pillars = CONTENT_PILLARS;
      const formats: ContentFormat[] = ['image', 'carousel', 'reel', 'video', 'text'];
      const themes = [
        'Industry insights and trends',
        'Product spotlight and features',
        'Customer success stories',
        'Behind the scenes',
        'How-to and tutorials',
        'Thought leadership',
        'Community engagement',
        'Team highlights',
      ];
      
      const generatedPlans: ContentPlan[] = [];
      const numPosts = Math.min(parseInt(campaignBrief?.campaignDuration || '2') * 3, 12);
      
      for (let i = 0; i < numPosts; i++) {
        const platform = campaignBrief?.platforms[i % campaignBrief.platforms.length] || 'instagram';
        const pillar = pillars[i % pillars.length];
        
        generatedPlans.push({
          id: generateId(),
          theme: themes[i % themes.length],
          format: formats[Math.floor(Math.random() * formats.length)],
          platform: platform,
          trendAngle: 'Leveraging current industry trends with fresh perspectives',
          engagementPrediction: Math.floor(Math.random() * 25) + 70,
          contentPillar: pillar.id as 'educational' | 'promotional' | 'community',
        });
      }
      
      setPlans(generatedPlans);
      setSelectedPlans(new Set(generatedPlans.map((p) => p.id)));
      setLoading(false);
    };
    
    if (campaignBrief) {
      generatePlans();
    }
  }, [campaignBrief]);

  const togglePlan = (planId: string) => {
    setSelectedPlans((prev) => {
      const next = new Set(prev);
      if (next.has(planId)) {
        next.delete(planId);
      } else {
        next.add(planId);
      }
      return next;
    });
  };

  const handleContinue = () => {
    const selectedPlansList = plans.filter((p) => selectedPlans.has(p.id));
    setContentPlans(selectedPlansList);
    
    selectedPlansList.forEach((plan) => {
      addGeneratedPost({
        id: generateId(),
        planId: plan.id,
        platform: plan.platform,
        caption: '',
        captionVariants: [],
        hashtags: { niche: [], midTier: [], trending: [] },
        brandVoiceScore: 85,
        engagementScore: plan.engagementPrediction,
        hookScore: 75,
        ctaScore: 70,
        hashtagScore: 72,
        status: 'pending',
      });
    });
    
    onNext();
  };

  const formatIcon = (format: ContentFormat) => {
    const icons: Record<ContentFormat, string> = {
      text: '📝',
      image: '🖼️',
      video: '📹',
      carousel: '🎠',
      reel: '🎬',
      short: '⚡',
      article: '📰',
    };
    return icons[format];
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 rounded-full bg-accent2/10 flex items-center justify-center mb-4">
          <Loader2 className="w-8 h-8 text-accent2 animate-spin" />
        </div>
        <h3 className="font-syne font-bold text-lg text-text mb-2">
          Creating Your Content Calendar
        </h3>
        <p className="text-sm text-muted">Analyzing trends and planning content...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-accent4/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-accent4" />
            </div>
            <div>
              <h2 className="font-syne font-bold text-lg text-text">Content Calendar</h2>
              <p className="text-sm text-muted">
                {plans.length} content ideas generated for {campaignBrief?.campaignDuration} weeks
              </p>
            </div>
          </div>
          <div className="tag tag-green">
            {selectedPlans.size} selected
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {CONTENT_PILLARS.map((pillar) => {
            const count = plans.filter((p) => p.contentPillar === pillar.id).length;
            return (
              <div key={pillar.id} className="bg-surface/50 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">{pillar.icon}</div>
                <div className="font-syne font-semibold text-sm text-text">{pillar.label}</div>
                <div className="text-xs text-muted">{count} posts</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {plans.map((plan, index) => {
          const pillar = CONTENT_PILLARS.find((p) => p.id === plan.contentPillar);
          const isSelected = selectedPlans.has(plan.id);
          
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <button
                onClick={() => togglePlan(plan.id)}
                className={cn(
                  'w-full text-left glass-card p-5 transition-all duration-200',
                  isSelected ? 'border-accent2 ring-1 ring-accent2/30' : 'opacity-60 hover:opacity-100'
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{formatIcon(plan.format)}</span>
                    <span className="tag tag-purple text-xs">{plan.platform}</span>
                  </div>
                  <div className={cn(
                    'w-5 h-5 rounded border flex items-center justify-center',
                    isSelected ? 'bg-accent2 border-accent2' : 'border-border'
                  )}>
                    {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>
                </div>
                
                <h4 className="font-syne font-semibold text-sm text-text mb-1">
                  {plan.theme}
                </h4>
                <p className="text-xs text-muted mb-3">{pillar?.label} content</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-dimmed">{plan.format}</span>
                  <div className={cn(
                    'tag text-xs',
                    getScoreBgColor(plan.engagementPrediction)
                  )}>
                    <span className={getScoreColor(plan.engagementPrediction)}>
                      {plan.engagementPrediction}% predicted
                    </span>
                  </div>
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleContinue}
          disabled={selectedPlans.size === 0}
          className={cn(
            'btn-primary flex items-center gap-2',
            selectedPlans.size === 0 && 'opacity-50 cursor-not-allowed'
          )}
        >
          Generate Content for {selectedPlans.size} Posts
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
