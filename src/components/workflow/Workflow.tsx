'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { WorkflowStage } from '@/types';

interface WorkflowProps {
  currentStage: WorkflowStage;
  onStageChange: (stage: WorkflowStage) => void;
}

const stages: { id: WorkflowStage; name: string; sub: string }[] = [
  { id: 'input', name: 'Input', sub: 'Brand brief & goals' },
  { id: 'planning', name: 'Planning', sub: 'Content calendar' },
  { id: 'generation', name: 'Generation', sub: 'AI content creation' },
  { id: 'approval', name: 'Approval', sub: 'Team review' },
  { id: 'scheduling', name: 'Scheduling', sub: 'Optimal times' },
  { id: 'posting', name: 'Posting', sub: 'Cross-platform publish' },
];

export function Workflow({ currentStage, onStageChange }: WorkflowProps) {
  const currentIndex = stages.findIndex((s) => s.id === currentStage);

  return (
    <div className="relative overflow-x-auto pb-2">
      <div className="flex gap-0 min-w-max">
        {stages.map((stage, index) => {
          const isActive = stage.id === currentStage;
          const isPast = index < currentIndex;
          const isFuture = index > currentIndex;

          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex-1 min-w-[140px]"
            >
              <button
                onClick={() => onStageChange(stage.id)}
                className={cn(
                  'w-full relative transition-all duration-300',
                  isFuture && 'opacity-50'
                )}
              >
                <div
                  className={cn(
                    'glass-card p-5 h-full transition-all duration-300 relative',
                    isActive && 'ring-2 ring-accent2/50 shadow-glow',
                    isPast && 'border-accent3/30',
                    !isActive && !isPast && 'hover:border-accent2/30'
                  )}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={cn(
                        'text-xs font-mono tracking-widest',
                        isActive ? 'text-accent' : isPast ? 'text-accent3' : 'text-dimmed'
                      )}
                    >
                      0{index + 1}
                    </span>
                    {isPast && (
                      <span className="text-accent3 text-xs">✓</span>
                    )}
                  </div>
                  <h3
                    className={cn(
                      'font-syne font-bold text-sm mb-1',
                      isActive ? 'text-accent2' : 'text-text'
                    )}
                  >
                    {stage.name}
                  </h3>
                  <p className="text-xs text-muted leading-tight">
                    {stage.sub}
                  </p>
                </div>

                {index < stages.length - 1 && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10">
                    <div
                      className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center text-sm',
                        isPast ? 'bg-accent3 text-bg' : 'bg-surface border border-border text-dimmed'
                      )}
                    >
                      →
                    </div>
                  </div>
                )}
              </button>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 h-1 bg-surface rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-accent2 to-accent"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentIndex + 1) / stages.length) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
