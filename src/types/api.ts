export interface PuterTxt2ImgOptions {
  model?: string;
  quality?: 'low' | 'medium' | 'high' | 'hd' | 'standard';
}

export interface PuterAi {
  txt2img: (prompt: string, options?: PuterTxt2ImgOptions) => Promise<HTMLImageElement>;
}

export interface Puter {
  ai: PuterAi;
}

export interface ZernioProfileCreateRequest {
  name: string;
  description?: string;
}

export interface ZernioProfile {
  _id: string;
  name: string;
  description?: string;
}

export interface ZernioConnectRequest {
  platform: string;
  profileId: string;
}

export interface ZernioConnectResponse {
  authUrl: string;
}

export interface ZernioAccount {
  _id: string;
  platform: string;
}

export interface ZernioMediaItem {
  type: 'image' | 'video';
  url: string;
}

export interface ZernioInstagramPlatformSpecificData {
  contentType?: 'story' | 'reels';
  shareToFeed?: boolean;
  collaborators?: string[];
  userTags?: {
    username: string;
    x: number;
    y: number;
    mediaIndex?: number;
  }[];
  trialParams?: {
    graduationStrategy: 'MANUAL' | 'SS_PERFORMANCE';
  };
  thumbOffset?: number;
  instagramThumbnail?: string;
  audioName?: string;
  firstComment?: string;
}

export interface ZernioPlatformConfig {
  platform: string;
  accountId: string;
  platformSpecificData?: ZernioInstagramPlatformSpecificData | Record<string, any>;
}

export interface ZernioPostCreateRequest {
  content?: string;
  mediaItems?: ZernioMediaItem[];
  scheduledFor?: string;
  timezone?: string;
  publishNow?: boolean;
  platforms: ZernioPlatformConfig[];
}

export interface ZernioPost {
  _id: string;
  [key: string]: any;
}

export interface ZernioAnalyticsRequest {
  platform: string;
  fromDate: string;
  toDate: string;
}

export interface ZernioAnalyticsResponse {
  posts: any[];
  [key: string]: any;
}

export interface Json2VideoElement {
  type: 'image' | 'video' | 'text' | 'component' | 'audio' | 'voice' | 'audiogram' | 'subtitles';
  id?: string;
  condition?: string;
  variables?: Record<string, any>;
  comment?: string;
  duration?: number;
  start?: number;
  'extra-time'?: number;
  'z-index'?: number;
  cache?: boolean;
  'fade-in'?: number;
  'fade-out'?: number;
}

export interface Json2VideoImageElement extends Json2VideoElement {
  type: 'image';
  src?: string;
  model?: string;
  prompt?: string;
  'aspect-ratio'?: 'horizontal' | 'vertical' | 'squared';
  'chroma-key'?: {
    color: string;
    tolerance?: number;
  };
  connection?: string;
  correction?: {
    brightness?: number;
    contrast?: number;
    gamma?: number;
    saturation?: number;
  };
  crop?: {
    height: number;
    width: number;
    x?: number;
    y?: number;
  };
  'flip-horizontal'?: boolean;
  'flip-vertical'?: boolean;
  height?: number;
  mask?: string;
  'model-settings'?: Record<string, any>;
  pan?: 'left' | 'top' | 'right' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  'pan-crop'?: boolean;
  'pan-distance'?: number;
  position?: 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left' | 'center-center' | 'custom';
  resize?: 'cover' | 'fill' | 'fit' | 'contain';
  rotate?: {
    angle: number;
    speed?: number;
  };
  width?: number;
  x?: number;
  y?: number;
  zoom?: number;
}

export interface Json2VideoVideoElement extends Json2VideoElement {
  type: 'video';
  src?: string;
}

export interface Json2VideoScene {
  'background-color'?: string;
  cache?: boolean;
  comment?: string;
  condition?: string;
  duration?: number;
  elements?: (Json2VideoImageElement | Json2VideoVideoElement | Json2VideoElement)[];
  id?: string;
  variables?: Record<string, any>;
}

export interface Json2VideoMovie {
  cache?: boolean;
  'client-data'?: Record<string, any>;
  comment?: string;
  elements?: (Json2VideoImageElement | Json2VideoVideoElement | Json2VideoElement)[];
  exports?: any[];
  height?: number;
  id?: string;
  quality?: 'low' | 'medium' | 'high';
  resolution?: 'sd' | 'hd' | 'full-hd' | 'squared' | 'instagram-story' | 'instagram-feed' | 'twitter-landscape' | 'twitter-portrait' | 'custom';
  scenes: Json2VideoScene[];
  variables?: Record<string, any>;
  width?: number;
}

export interface Json2VideoMovieCreateResponse {
  success: boolean;
  project?: string;
  timestamp?: string;
  message?: string;
}

export interface Json2VideoMovieStatusResponse {
  success: boolean;
  movie: {
    success: boolean;
    status: 'pending' | 'running' | 'done' | 'error';
    message?: string;
    project: string;
    url?: string;
    ass?: string;
    created_at: string;
    ended_at?: string;
    duration?: number;
    size?: number;
    width?: number;
    height?: number;
    rendering_time?: number;
  };
  remaining_quota: {
    time: number;
  };
}