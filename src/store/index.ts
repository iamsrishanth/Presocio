import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  WorkflowStage, 
  CampaignBrief, 
  ContentPlan, 
  GeneratedPost,
  PostingQueue,
  BrandProfile,
  Platform
} from '@/types';

interface WorkflowState {
  currentStage: WorkflowStage;
  campaignBrief: CampaignBrief | null;
  contentPlans: ContentPlan[];
  generatedPosts: GeneratedPost[];
  postingQueue: PostingQueue[];
  brandProfile: BrandProfile | null;
  
  setCurrentStage: (stage: WorkflowStage) => void;
  setCampaignBrief: (brief: CampaignBrief) => void;
  addContentPlan: (plan: ContentPlan) => void;
  setContentPlans: (plans: ContentPlan[]) => void;
  addGeneratedPost: (post: GeneratedPost) => void;
  updateGeneratedPost: (postId: string, updates: Partial<GeneratedPost>) => void;
  setGeneratedPosts: (posts: GeneratedPost[]) => void;
  addToPostingQueue: (queue: PostingQueue) => void;
  setBrandProfile: (profile: BrandProfile) => void;
  resetWorkflow: () => void;
}

const initialState = {
  currentStage: 'input' as WorkflowStage,
  campaignBrief: null,
  contentPlans: [],
  generatedPosts: [],
  postingQueue: [],
  brandProfile: null,
};

export const useWorkflowStore = create<WorkflowState>()(
  persist(
    (set) => ({
      ...initialState,

      setCurrentStage: (stage) => set({ currentStage: stage }),

      setCampaignBrief: (brief) => set({ campaignBrief: brief }),

      addContentPlan: (plan) => 
        set((state) => ({ contentPlans: [...state.contentPlans, plan] })),

      setContentPlans: (plans) => set({ contentPlans: plans }),

      addGeneratedPost: (post) =>
        set((state) => ({ generatedPosts: [...state.generatedPosts, post] })),

      updateGeneratedPost: (postId, updates) =>
        set((state) => ({
          generatedPosts: state.generatedPosts.map((post) =>
            post.id === postId ? { ...post, ...updates } : post
          ),
        })),

      setGeneratedPosts: (posts) => set({ generatedPosts: posts }),

      addToPostingQueue: (queue) =>
        set((state) => ({ postingQueue: [...state.postingQueue, queue] })),

      setBrandProfile: (profile) => set({ brandProfile: profile }),

      resetWorkflow: () => set(initialState),
    }),
    {
      name: 'presocio-workflow',
    }
  )
);

interface UIState {
  sidebarOpen: boolean;
  activeModal: string | null;
  selectedPlatforms: Platform[];
  isGenerating: boolean;
  generationProgress: number;

  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setActiveModal: (modal: string | null) => void;
  setSelectedPlatforms: (platforms: Platform[]) => void;
  setIsGenerating: (generating: boolean) => void;
  setGenerationProgress: (progress: number) => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Start with sidebar closed on mobile (default), open on desktop
  sidebarOpen: typeof window !== 'undefined' && window.innerWidth >= 1024,
  activeModal: null,
  selectedPlatforms: ['instagram', 'facebook', 'linkedin', 'youtube', 'x'],
  isGenerating: false,
  generationProgress: 0,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setActiveModal: (modal) => set({ activeModal: modal }),
  setSelectedPlatforms: (platforms) => set({ selectedPlatforms: platforms }),
  setIsGenerating: (generating) => set({ isGenerating: generating }),
  setGenerationProgress: (progress) => set({ generationProgress: progress }),
}));

export type ThemeMode = 'dark' | 'light' | 'system';

interface ThemeState {
  theme: ThemeMode;
  resolvedTheme: 'dark' | 'light';
  setTheme: (theme: ThemeMode) => void;
}

function getSystemTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(resolved: 'dark' | 'light') {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (resolved === 'light') {
    root.classList.add('light');
  } else {
    root.classList.remove('light');
  }
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      resolvedTheme: 'dark',

      setTheme: (theme) => {
        const resolved = theme === 'system' ? getSystemTheme() : theme;
        applyTheme(resolved);
        set({ theme, resolvedTheme: resolved });
      },
    }),
    {
      name: 'presocio-theme',
      onRehydrateStorage: () => (state) => {
        if (state) {
          const resolved = state.theme === 'system' ? getSystemTheme() : state.theme;
          applyTheme(resolved);
          state.resolvedTheme = resolved;
        }
      },
    }
  )
);

// Listen for system theme changes
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const state = useThemeStore.getState();
    if (state.theme === 'system') {
      const resolved = getSystemTheme();
      applyTheme(resolved);
      useThemeStore.setState({ resolvedTheme: resolved });
    }
  });
}

// ── Mock Data Toggle ──────────────────────────────────────────────

interface MockDataState {
  mockDataEnabled: boolean;
  toggleMockData: () => void;
  setMockDataEnabled: (enabled: boolean) => void;
}

export const useMockDataStore = create<MockDataState>()(
  persist(
    (set) => ({
      mockDataEnabled: true,
      toggleMockData: () => set((state) => ({ mockDataEnabled: !state.mockDataEnabled })),
      setMockDataEnabled: (enabled) => set({ mockDataEnabled: enabled }),
    }),
    {
      name: 'presocio-mock-data-v2',
    }
  )
);

// ── Analytics ─────────────────────────────────────────────────────

interface AnalyticsState {
  totalPosts: number;
  scheduledPosts: number;
  publishedPosts: number;
  averageEngagement: number;
  platformStats: Record<Platform, { posts: number; engagement: number }>;

  updateStats: (updates: Partial<AnalyticsState>) => void;
}

export const useAnalyticsStore = create<AnalyticsState>()(
  persist(
    (set) => ({
      totalPosts: 0,
      scheduledPosts: 0,
      publishedPosts: 0,
      averageEngagement: 0,
      platformStats: {
        instagram: { posts: 0, engagement: 0 },
        facebook: { posts: 0, engagement: 0 },
        linkedin: { posts: 0, engagement: 0 },
        youtube: { posts: 0, engagement: 0 },
        x: { posts: 0, engagement: 0 },
      },

      updateStats: (updates) => set((state) => ({ ...state, ...updates })),
    }),
    {
      name: 'presocio-analytics',
    }
  )
);
