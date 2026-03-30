'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu,
  X,
  Home,
  Sparkles,
  Calendar,
  BarChart3,
  Settings,
  Bell,
  User,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWorkflowStore, useUIStore } from '@/store';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Workflow } from '@/components/workflow/Workflow';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { Analytics } from '@/components/analytics/Analytics';
import { Calendar as CalendarView } from '@/components/calendar/Calendar';
import { Settings as SettingsView } from '@/components/settings/Settings';
import { InputForm } from '@/components/content/InputForm';
import { PlanningStage } from '@/components/content/PlanningStage';
import { ContentGenerator } from '@/components/content/ContentGenerator';
import { ApprovalStage } from '@/components/content/ApprovalStage';
import { SchedulingStage } from '@/components/content/SchedulingStage';
import { PostingStage } from '@/components/content/PostingStage';
import type { WorkflowStage } from '@/types';

const navItems = [
  { id: 'dashboard', icon: Home, label: 'Dashboard' },
  { id: 'create', icon: Sparkles, label: 'Create' },
  { id: 'calendar', icon: Calendar, label: 'Calendar' },
  { id: 'analytics', icon: BarChart3, label: 'Analytics' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

export default function HomePage() {
  const { currentStage, setCurrentStage, resetWorkflow } = useWorkflowStore();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const [activeNav, setActiveNav] = useState('dashboard');
  const [showWorkflow, setShowWorkflow] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-2 border-accent2 border-t-transparent animate-spin" />
      </div>
    );
  }

  const stages: WorkflowStage[] = ['input', 'planning', 'generation', 'approval', 'scheduling', 'posting'];

  const getNextStage = (current: WorkflowStage): WorkflowStage => {
    const currentIndex = stages.indexOf(current);
    return stages[Math.min(currentIndex + 1, stages.length - 1)];
  };

  const handleStartCreate = () => {
    setShowWorkflow(true);
    setCurrentStage('input');
    setActiveNav('create');
  };

  const handleNextStage = () => {
    const next = getNextStage(currentStage);
    setCurrentStage(next);
    if (next === 'posting') {
      setTimeout(() => {
        if (currentStage === 'posting') {
          resetWorkflow();
          setShowWorkflow(false);
          setActiveNav('dashboard');
        }
      }, 5000);
    }
  };

  const handleComplete = () => {
    resetWorkflow();
    setShowWorkflow(false);
    setActiveNav('dashboard');
  };

  const renderContent = () => {
    if (showWorkflow) {
      return (
        <div className="space-y-6">
          <Workflow currentStage={currentStage} onStageChange={setCurrentStage} />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStage === 'input' && <InputForm onNext={handleNextStage} />}
              {currentStage === 'planning' && <PlanningStage onNext={handleNextStage} />}
              {currentStage === 'generation' && <ContentGenerator onNextStage={handleNextStage} />}
              {currentStage === 'approval' && <ApprovalStage onNext={handleNextStage} />}
              {currentStage === 'scheduling' && <SchedulingStage onNext={handleNextStage} />}
              {currentStage === 'posting' && <PostingStage onComplete={handleComplete} />}
            </motion.div>
          </AnimatePresence>
        </div>
      );
    }

    switch (activeNav) {
      case 'create':
        return (
          <div className="space-y-8">
            <div className="glass-card p-12 text-center">
              <div className="w-20 h-20 rounded-2xl bg-accent2/10 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-accent2" />
              </div>
              <h2 className="font-syne font-bold text-2xl text-text mb-3">
                Create New Campaign
              </h2>
              <p className="text-muted max-w-lg mx-auto mb-8">
                Start your AI-powered content creation workflow. Our 6-stage pipeline 
                will guide you from brief to published posts across all platforms.
              </p>
              <button onClick={handleStartCreate} className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4">
                <Zap className="w-5 h-5" />
                Start Creating
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { title: 'AI Generation', desc: 'Gemini 2.0 Flash + Llama 3.3', icon: '🤖' },
                { title: 'Brand Voice', desc: 'Consistent tone across posts', icon: '🎯' },
                { title: 'Multi-Platform', desc: '5 social platforms covered', icon: '📱' },
              ].map((feature) => (
                <div key={feature.title} className="glass-card p-6 text-center">
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <h3 className="font-syne font-bold text-sm text-text mb-1">{feature.title}</h3>
                  <p className="text-xs text-muted">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'analytics':
        return <Analytics />;

      case 'calendar':
        return <CalendarView />;

      case 'settings':
        return <SettingsView />;
      
      case 'dashboard':
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen flex">
      <aside className={cn(
        'fixed left-0 top-0 h-full glass-dark z-40 transition-all duration-300',
        sidebarOpen ? 'w-64' : 'w-20'
      )}>
        <div className="p-4 flex items-center justify-between border-b border-border">
          <div className={cn('flex items-center gap-3', !sidebarOpen && 'justify-center w-full')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent2 to-accent flex items-center justify-center">
              <span className="text-white font-syne font-bold text-lg">P</span>
            </div>
            {sidebarOpen && (
              <div>
                <div className="font-syne font-bold text-lg gradient-text">Pre<span className="text-accent">socio</span></div>
              </div>
            )}
          </div>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-surface transition-colors text-muted hover:text-text"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveNav(item.id);
                if (item.id !== 'create') {
                  setShowWorkflow(false);
                }
              }}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                activeNav === item.id && !showWorkflow
                  ? 'bg-accent2/10 text-accent2 border border-accent2/20'
                  : 'text-muted hover:text-text hover:bg-surface'
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && (
                <span className="font-syne font-semibold text-sm">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <div className={cn('flex items-center gap-3', !sidebarOpen && 'justify-center')}>
            <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center">
              <User className="w-5 h-5 text-muted" />
            </div>
            {sidebarOpen && (
              <div>
                <div className="font-syne font-semibold text-sm text-text">Demo User</div>
                <div className="text-xs text-muted">Admin</div>
              </div>
            )}
          </div>
        </div>
      </aside>

      <main className={cn(
        'flex-1 transition-all duration-300',
        sidebarOpen ? 'ml-64' : 'ml-20'
      )}>
        <header className="sticky top-0 z-30 glass-dark border-b border-border">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="font-syne font-bold text-xl text-text">
                {showWorkflow ? (
                  <span className="gradient-text">
                    {currentStage.charAt(0).toUpperCase() + currentStage.slice(1)} Stage
                  </span>
                ) : (
                  navItems.find((n) => n.id === activeNav)?.label || 'Dashboard'
                )}
              </h1>
              <p className="text-sm text-muted">
                {showWorkflow 
                  ? `Step ${stages.indexOf(currentStage) + 1} of ${stages.length}`
                  : 'Manage your social media presence'
                }
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button className="relative p-2 rounded-lg hover:bg-surface transition-colors text-muted hover:text-text">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent" />
              </button>
            </div>
          </div>
        </header>

        <div className="p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
