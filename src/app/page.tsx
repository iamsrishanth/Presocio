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
  Beaker,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWorkflowStore, useUIStore, useMockDataStore } from '@/store';
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
  const { mockDataEnabled } = useMockDataStore();
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
          <div className="space-y-6 lg:space-y-8">
            <div className="glass-card p-6 lg:p-12 text-center">
              <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-accent2/10 flex items-center justify-center mx-auto mb-4 lg:mb-6">
                <Sparkles className="w-8 h-8 lg:w-10 lg:h-10 text-accent2" />
              </div>
              <h2 className="font-syne font-bold text-xl lg:text-2xl text-text mb-2 lg:mb-3">
                Create New Campaign
              </h2>
              <p className="text-muted max-w-lg mx-auto mb-6 lg:mb-8 text-sm lg:text-base">
                Start your AI-powered content creation workflow. Our 6-stage pipeline 
                will guide you from brief to published posts across all platforms.
              </p>
              <button onClick={handleStartCreate} className="btn-primary inline-flex items-center gap-2 text-base lg:text-lg px-6 lg:px-8 py-3 lg:py-4 min-h-[48px]">
                <Zap className="w-5 h-5" />
                Start Creating
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Responsive grid: 1 column on mobile, 3 on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: 'AI Generation', desc: 'Gemini 2.0 Flash + Llama 3.3', icon: '🤖' },
                { title: 'Brand Voice', desc: 'Consistent tone across posts', icon: '🎯' },
                { title: 'Multi-Platform', desc: '5 social platforms covered', icon: '📱' },
              ].map((feature) => (
                <div key={feature.title} className="glass-card p-4 lg:p-6 text-center">
                  <div className="text-2xl lg:text-3xl mb-2 lg:mb-3">{feature.icon}</div>
                  <h3 className="font-syne font-bold text-sm text-text mb-1">{feature.title}</h3>
                  <p className="text-xs lg:text-sm text-muted">{feature.desc}</p>
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
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - hidden on mobile by default */}
      <aside className={cn(
        'fixed left-0 top-0 h-full glass-dark z-50 transition-all duration-300 flex flex-col',
        // Mobile: hidden by default, slides in when open
        'w-64 -translate-x-full lg:translate-x-0',
        // Desktop: width follows sidebarOpen state
        sidebarOpen ? 'lg:w-56' : 'lg:w-20',
        sidebarOpen && 'translate-x-0'
      )}>
        {/* Logo */}
        <div className={cn(
          'p-4 flex items-center border-b border-border',
          sidebarOpen ? 'justify-between' : 'justify-center'
        )}>
          {sidebarOpen ? (
            <>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent2 to-accent flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-syne font-bold text-lg">P</span>
                </div>
                <div className="font-syne font-bold text-lg gradient-text whitespace-nowrap">Pre<span className="text-accent">socio</span></div>
              </div>
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-surface transition-colors text-muted hover:text-text"
              >
                <X className="w-5 h-5" />
              </button>
            </>
          ) : (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-surface transition-colors text-muted hover:text-text"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className={cn(
          'flex-1 p-2 space-y-1',
          sidebarOpen && 'lg:p-3'
        )}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveNav(item.id);
                if (item.id !== 'create') {
                  setShowWorkflow(false);
                }
                // Close sidebar on mobile after selection
                if (window.innerWidth < 1024) {
                  toggleSidebar();
                }
              }}
              className={cn(
                'w-full rounded-lg transition-all min-h-[48px]',
                sidebarOpen
                  ? 'flex items-center gap-3 px-3 py-3'
                  : 'flex items-center justify-center px-2 py-3',
                activeNav === item.id && !showWorkflow
                  ? 'bg-accent2/10 text-accent2 border border-accent2/20'
                  : 'text-muted hover:text-text hover:bg-surface'
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && (
                <span className="font-syne font-semibold text-sm whitespace-nowrap">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-border">
          <div className={cn(
            'flex items-center',
            sidebarOpen ? 'gap-3' : 'justify-center'
          )}>
            <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-muted" />
            </div>
            {sidebarOpen && (
              <div>
                <div className="font-syne font-semibold text-sm text-text whitespace-nowrap">Demo User</div>
                <div className="text-xs text-muted">Admin</div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className={cn(
        'flex-1 transition-all duration-300 w-full',
        // Mobile: no margin, desktop: margin based on sidebar width
        sidebarOpen ? 'lg:ml-56' : 'lg:ml-20'
      )}>
        {/* Mobile header with hamburger */}
        <header className="sticky top-0 z-30 glass-dark border-b border-border">
          <div className="px-4 lg:px-8 py-3 lg:py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile hamburger - visible only on mobile */}
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-surface transition-colors text-muted hover:text-text lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="font-syne font-bold text-lg lg:text-xl text-text">
                  {showWorkflow ? (
                    <span className="gradient-text">
                      {currentStage.charAt(0).toUpperCase() + currentStage.slice(1)} Stage
                    </span>
                  ) : (
                    navItems.find((n) => n.id === activeNav)?.label || 'Dashboard'
                  )}
                </h1>
                <p className="text-xs lg:text-sm text-muted">
                  {showWorkflow 
                    ? `Step ${stages.indexOf(currentStage) + 1} of ${stages.length}`
                    : 'Manage your social media presence'
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <ThemeToggle />
              <button className="relative p-2 rounded-lg hover:bg-surface transition-colors text-muted hover:text-text min-w-[44px] min-h-[44px] flex items-center justify-center">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent" />
              </button>
            </div>
          </div>
        </header>

        {/* Mock Data Banner */}
        {mockDataEnabled && (
          <div className="px-4 lg:px-8 py-2 bg-accent2/10 border-b border-accent2/20 flex items-center gap-2">
            <Beaker className="w-4 h-4 text-accent2 flex-shrink-0" />
            <span className="text-xs text-accent2 font-semibold">Simulated Data Mode</span>
            <span className="text-xs text-muted">— showing mock data across all views</span>
          </div>
        )}

        {/* Content area with responsive padding */}
        <div className="p-4 lg:p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
