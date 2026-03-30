'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Users, 
  Target, 
  MessageSquare, 
  Palette,
  Zap,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ContentTone, Platform } from '@/types';
import { CONTENT_TONES, CONTENT_PILLARS } from '@/lib/utils';
import { useWorkflowStore } from '@/store';
import { generateId } from '@/lib/utils';

interface InputFormProps {
  onNext: () => void;
}

const platforms: { id: Platform; name: string; icon: string }[] = [
  { id: 'instagram', name: 'Instagram', icon: '📷' },
  { id: 'facebook', name: 'Facebook', icon: '📘' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
  { id: 'youtube', name: 'YouTube', icon: '▶️' },
  { id: 'x', name: 'X (Twitter)', icon: '𝕏' },
];

const frequencies = [
  { id: 'daily', label: 'Daily', desc: '1-2 posts per day' },
  { id: 'weekly', label: 'Weekly', desc: '3-5 posts per week' },
  { id: 'biweekly', label: 'Bi-weekly', desc: '1-2 posts per week' },
  { id: 'monthly', label: 'Monthly', desc: '2-4 posts per month' },
] as const;

type PostingFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly';

interface FormData {
  brandName: string;
  campaignObjective: string;
  targetAudience: string;
  contentTone: ContentTone;
  keyMessages: string;
  platforms: Platform[];
  postingFrequency: PostingFrequency;
  campaignDuration: string;
}

export function InputForm({ onNext }: InputFormProps) {
  const { setCampaignBrief, campaignBrief } = useWorkflowStore();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    brandName: campaignBrief?.brandName || '',
    campaignObjective: campaignBrief?.campaignObjective || '',
    targetAudience: campaignBrief?.targetAudience || '',
    contentTone: campaignBrief?.contentTone || 'professional',
    keyMessages: campaignBrief?.keyMessages?.join(', ') || '',
    platforms: campaignBrief?.platforms || ['instagram', 'linkedin'],
    postingFrequency: campaignBrief?.postingFrequency || 'weekly',
    campaignDuration: campaignBrief?.campaignDuration || '2',
  });

  const handleSubmit = async () => {
    if (!formData.brandName || !formData.campaignObjective) return;
    
    setLoading(true);
    
    const brief = {
      id: generateId(),
      brandName: formData.brandName,
      campaignObjective: formData.campaignObjective,
      targetAudience: formData.targetAudience,
      contentTone: formData.contentTone,
      keyMessages: formData.keyMessages.split(',').map((m) => m.trim()).filter(Boolean),
      platforms: formData.platforms,
      postingFrequency: formData.postingFrequency,
      campaignDuration: formData.campaignDuration,
      createdAt: new Date(),
    };
    
    setCampaignBrief(brief);
    
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);
    onNext();
  };

  const togglePlatform = (platform: Platform) => {
    setFormData((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform],
    }));
  };

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-accent2/10 flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-accent2" />
          </div>
          <div>
            <h2 className="font-syne font-bold text-xl text-text">Campaign Brief</h2>
            <p className="text-sm text-muted">Tell us about your campaign</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm text-muted mb-2 flex items-center gap-2">
              <Target className="w-4 h-4 text-accent" />
              Brand Name *
            </label>
            <input
              type="text"
              value={formData.brandName}
              onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
              className="input-field"
              placeholder="Acme Corporation"
            />
          </div>

          <div>
            <label className="block text-sm text-muted mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent4" />
              Campaign Objective *
            </label>
            <input
              type="text"
              value={formData.campaignObjective}
              onChange={(e) => setFormData({ ...formData, campaignObjective: e.target.value })}
              className="input-field"
              placeholder="Increase brand awareness by 50% in Q2"
            />
          </div>

          <div>
            <label className="block text-sm text-muted mb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-accent3" />
              Target Audience
            </label>
            <input
              type="text"
              value={formData.targetAudience}
              onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
              className="input-field"
              placeholder="Marketing professionals, 25-45 years old, interested in AI tools"
            />
          </div>

          <div>
            <label className="block text-sm text-muted mb-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-accent2" />
              Content Tone
            </label>
            <div className="grid grid-cols-4 gap-3">
              {CONTENT_TONES.map((tone) => (
                <button
                  key={tone.id}
                  onClick={() => setFormData({ ...formData, contentTone: tone.id as ContentTone })}
                  className={cn(
                    'p-3 rounded-lg border text-left transition-all',
                    formData.contentTone === tone.id
                      ? 'border-accent2 bg-accent2/10 text-text'
                      : 'border-border bg-surface/50 text-muted hover:border-accent2/30'
                  )}
                >
                  <div className="font-syne font-semibold text-sm">{tone.label}</div>
                  <div className="text-[10px] mt-1 opacity-70">{tone.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-muted mb-2 flex items-center gap-2">
              <Palette className="w-4 h-4 text-accent" />
              Key Messages (comma separated)
            </label>
            <input
              type="text"
              value={formData.keyMessages}
              onChange={(e) => setFormData({ ...formData, keyMessages: e.target.value })}
              className="input-field"
              placeholder="Innovation, Quality, Customer Success"
            />
          </div>

          <div>
            <label className="block text-sm text-muted mb-3">Target Platforms</label>
            <div className="flex flex-wrap gap-3">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => togglePlatform(platform.id)}
                  className={cn(
                    'px-4 py-2 rounded-lg border transition-all flex items-center gap-2',
                    formData.platforms.includes(platform.id)
                      ? 'border-accent2 bg-accent2/10 text-text'
                      : 'border-border bg-surface/50 text-muted hover:border-accent2/30'
                  )}
                >
                  <span>{platform.icon}</span>
                  <span className="text-sm">{platform.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-muted mb-2">Posting Frequency</label>
              <select
                value={formData.postingFrequency}
                onChange={(e) => setFormData({ ...formData, postingFrequency: e.target.value as PostingFrequency })}
                className="input-field"
              >
                {frequencies.map((freq) => (
                  <option key={freq.id} value={freq.id}>{freq.label} - {freq.desc}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-muted mb-2">Campaign Duration (weeks)</label>
              <input
                type="number"
                min="1"
                max="12"
                value={formData.campaignDuration}
                onChange={(e) => setFormData({ ...formData, campaignDuration: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={!formData.brandName || !formData.campaignObjective || loading}
            className={cn(
              'btn-primary flex items-center gap-2',
              (!formData.brandName || !formData.campaignObjective) && 'opacity-50 cursor-not-allowed'
            )}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Generate Content Plan
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
