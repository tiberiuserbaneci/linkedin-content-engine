export type Category = "founder" | "vc" | "ai_creator" | "operator" | "other";
export type PostType = "text" | "image" | "video" | "article" | "carousel" | "poll" | "other";
export type IdeaStatus = "idea" | "writing" | "done" | "skipped";
export type IdeaFormat = "narrative" | "how_to" | "opinion" | "data_driven";

export interface Profile {
  id: string;
  linkedin_url: string;
  linkedin_handle: string;
  full_name: string;
  headline: string | null;
  about: string | null;
  followers_count: number;
  category: Category;
  avatar_url: string | null;
  scraped_at: string;
  created_at: string;
}

export interface Post {
  id: string;
  profile_id: string;
  linkedin_post_url: string;
  content: string;
  published_at: string | null;
  reactions_count: number;
  comments_count: number;
  shares_count: number;
  post_type: PostType;
  word_count: number;
  raw_json: Record<string, unknown>;
  created_at: string;
}

export interface ContentAnalysis {
  id: string;
  profile_id: string;
  posts_analysed: number;
  overview: string;
  topic_clusters: TopicCluster[];
  structural_dna: Record<string, unknown>;
  hook_formula: Record<string, unknown>;
  emotional_playbook: Record<string, unknown>;
  winning_format: Record<string, unknown>;
  specificity: Record<string, unknown>;
  close_patterns: Record<string, unknown>;
  what_doesnt_work: Record<string, unknown>;
  winning_formula: string;
  winning_checklist: string[];
  model_used: string;
  created_at: string;
}

export interface TopicCluster {
  name: string;
  description: string;
  frequency: number;
  avg_engagement: number;
  examples: string[];
}

export interface ContentIdea {
  id: string;
  analysis_id: string;
  profile_id: string;
  position: number;
  title: string;
  topic: string;
  pattern_matches: PatternMatch[];
  angle: string;
  hook_draft: string;
  format: IdeaFormat;
  emotional_register: string;
  trending_signal: string;
  status: IdeaStatus;
  created_at: string;
}

export interface PatternMatch {
  type: "topic" | "format" | "hook" | "emotion" | "specificity";
  label: string;
}

export type AssetFormat = "infographic" | "cheatsheet" | "carousel" | "poster";
export type AssetTheme = "light" | "dark" | "expressive";

export interface ContentAsset {
  id: string;
  format: AssetFormat;
  theme: AssetTheme;
  title: string;
  html_content: string;
  created_at: string;
}

// Supabase Database type helper
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "id" | "created_at">;
        Update: Partial<Omit<Profile, "id" | "created_at">>;
      };
      posts: {
        Row: Post;
        Insert: Omit<Post, "id" | "created_at">;
        Update: Partial<Omit<Post, "id" | "created_at">>;
      };
      content_analyses: {
        Row: ContentAnalysis;
        Insert: Omit<ContentAnalysis, "id" | "created_at">;
        Update: Partial<Omit<ContentAnalysis, "id" | "created_at">>;
      };
      content_ideas: {
        Row: ContentIdea;
        Insert: Omit<ContentIdea, "id" | "created_at">;
        Update: Partial<Omit<ContentIdea, "id" | "created_at">>;
      };
      content_assets: {
        Row: ContentAsset;
        Insert: Omit<ContentAsset, "id" | "created_at">;
        Update: Partial<Omit<ContentAsset, "id" | "created_at">>;
      };
    };
  };
}

// Extended types for API responses
export interface ProfileWithStats extends Profile {
  posts_count: number;
  last_analysis_at: string | null;
  ideas_count: number;
}

export interface AnalysisWithIdeas {
  analysis: ContentAnalysis;
  ideas: ContentIdea[];
}
