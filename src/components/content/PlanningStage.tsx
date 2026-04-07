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

import { toast } from 'react-hot-toast';

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
      try {
        const response = await fetch('/api/plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(campaignBrief),
        });
        
        const data = await response.json();
        
        if (data.success && data.plans) {
          const generatedPlans: ContentPlan[] = data.plans.map((p: any) => ({
            ...p,
            id: generateId(),
            scheduledDate: new Date(),
          }));
          setPlans(generatedPlans);
          setSelectedPlans(new Set(generatedPlans.map((p) => p.id)));
        } else {
          throw new Error(data.error || 'Failed to generate plans');
        }
      } catch (error) {
        console.error('Plan generation failed:', error);
        toast.error('Failed to generate content plan. Using fallback data.');
        // Fallback to minimal static plan if API fails
        const fallbackPlans: ContentPlan[] = [
          {
            id: generateId(),
            theme: 'Industry insights and trends',
            format: 'text',
            platform: campaignBrief?.platforms[0] || 'linkedin',
            trendAngle: 'Leveraging current industry trends',
            engagementPrediction: 75,
            contentPillar: 'educational',
            scheduledDate: new Date()
          }
        ];
        setPlans(fallbackPlans);
        setSelectedPlans(new Set([fallbackPlans[0].id]));
      } finally {
        setLoading(false);
      }
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
    <div className="space-y-4 sm:space-y-6">
      <div className="glass-card p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-accent4/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-accent4" />
            </div>
            <div>
              <h2 className="font-syne font-bold text-base sm:text-lg text-text">Content Calendar</h2>
              <p className="text-xs sm:text-sm text-muted">
                {plans.length} content ideas generated for {campaignBrief?.campaignDuration} weeks
              </p>
            </div>
          </div>
          <div className="tag tag-green text-[10px] sm:text-xs self-start sm:self-auto">
            {selectedPlans.size} selected
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
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
