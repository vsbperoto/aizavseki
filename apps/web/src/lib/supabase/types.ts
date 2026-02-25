// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          subscribed_at: string;
          unsubscribed_at: string | null;
          source: string;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          subscribed_at?: string;
          unsubscribed_at?: string | null;
          source?: string;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          subscribed_at?: string;
          unsubscribed_at?: string | null;
          source?: string;
          is_active?: boolean;
        };
        Relationships: [];
      };
      posts: {
        Row: {
          id: string;
          slug: string;
          title: string;
          hook: string | null;
          pillar: string;
          content: Json;
          caption: string | null;
          hashtags: string | null;
          image_urls: string[] | null;
          instagram_post_id: string | null;
          facebook_post_id: string | null;
          published_at: string;
          is_featured: boolean;
          views: number;
          created_at: string;
          meta_title: string | null;
          meta_description: string | null;
          key_takeaway: string | null;
          faq_items: FaqItem[] | null;
          image_alt_text: string | null;
          quality_score: number | null;
          word_count: number | null;
          target_keyword: string | null;
          internal_links_used: string[] | null;
          keywords: string[] | null;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          hook?: string | null;
          pillar: string;
          content: Json;
          caption?: string | null;
          hashtags?: string | null;
          image_urls?: string[] | null;
          instagram_post_id?: string | null;
          facebook_post_id?: string | null;
          published_at?: string;
          is_featured?: boolean;
          views?: number;
          created_at?: string;
          meta_title?: string | null;
          meta_description?: string | null;
          key_takeaway?: string | null;
          faq_items?: Json | null;
          image_alt_text?: string | null;
          quality_score?: number | null;
          word_count?: number | null;
          target_keyword?: string | null;
          internal_links_used?: string[] | null;
          keywords?: string[] | null;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          hook?: string | null;
          pillar?: string;
          content?: PostContent;
          caption?: string | null;
          hashtags?: string | null;
          image_urls?: string[] | null;
          instagram_post_id?: string | null;
          facebook_post_id?: string | null;
          published_at?: string;
          is_featured?: boolean;
          views?: number;
          created_at?: string;
          meta_title?: string | null;
          meta_description?: string | null;
          key_takeaway?: string | null;
          faq_items?: Json | null;
          image_alt_text?: string | null;
          quality_score?: number | null;
          word_count?: number | null;
          target_keyword?: string | null;
          internal_links_used?: string[] | null;
          keywords?: string[] | null;
        };
        Relationships: [];
      };
      contact_submissions: {
        Row: {
          id: string;
          name: string;
          email: string;
          message: string;
          submitted_at: string;
          is_read: boolean;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          message: string;
          submitted_at?: string;
          is_read?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          message?: string;
          submitted_at?: string;
          is_read?: boolean;
        };
        Relationships: [];
      };
      data_deletion_requests: {
        Row: {
          id: string;
          confirmation_code: string;
          facebook_user_id: string | null;
          email: string | null;
          reason: string | null;
          status: string;
          requested_at: string;
          completed_at: string | null;
          source: string;
        };
        Insert: {
          id?: string;
          confirmation_code: string;
          facebook_user_id?: string | null;
          email?: string | null;
          reason?: string | null;
          status?: string;
          requested_at?: string;
          completed_at?: string | null;
          source?: string;
        };
        Update: {
          id?: string;
          confirmation_code?: string;
          facebook_user_id?: string | null;
          email?: string | null;
          reason?: string | null;
          status?: string;
          requested_at?: string;
          completed_at?: string | null;
          source?: string;
        };
        Relationships: [];
      };
      page_views: {
        Row: {
          id: string;
          path: string;
          referrer: string | null;
          user_agent: string | null;
          country: string | null;
          viewed_at: string;
        };
        Insert: {
          id?: string;
          path: string;
          referrer?: string | null;
          user_agent?: string | null;
          country?: string | null;
          viewed_at?: string;
        };
        Update: {
          id?: string;
          path?: string;
          referrer?: string | null;
          user_agent?: string | null;
          country?: string | null;
          viewed_at?: string;
        };
        Relationships: [];
      };
      facebook_tokens: {
        Row: {
          id: string;
          user_id: string;
          user_name: string;
          page_id: string;
          page_name: string;
          page_access_token: string;
          user_access_token: string;
          token_type: string;
          scopes: string;
          expires_at: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          user_name: string;
          page_id: string;
          page_name: string;
          page_access_token: string;
          user_access_token: string;
          token_type?: string;
          scopes?: string;
          expires_at: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          user_name?: string;
          page_id?: string;
          page_name?: string;
          page_access_token?: string;
          user_access_token?: string;
          token_type?: string;
          scopes?: string;
          expires_at?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      resources: {
        Row: {
          id: string;
          slug: string;
          title: string;
          content_type: string;
          category: string;
          content: string;
          meta_title: string | null;
          meta_description: string | null;
          key_takeaway: string | null;
          faq_items: FaqItem[] | null;
          target_keyword: string | null;
          secondary_keywords: string[] | null;
          image_url: string | null;
          image_alt_text: string | null;
          word_count: number;
          quality_score: number | null;
          related_resources: string[] | null;
          published_at: string;
          updated_at: string;
          views: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          content_type: string;
          category: string;
          content: string;
          meta_title?: string | null;
          meta_description?: string | null;
          key_takeaway?: string | null;
          faq_items?: Json | null;
          target_keyword?: string | null;
          secondary_keywords?: string[] | null;
          image_url?: string | null;
          image_alt_text?: string | null;
          word_count?: number;
          quality_score?: number | null;
          related_resources?: string[] | null;
          published_at?: string;
          updated_at?: string;
          views?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          content_type?: string;
          category?: string;
          content?: string;
          meta_title?: string | null;
          meta_description?: string | null;
          key_takeaway?: string | null;
          faq_items?: Json | null;
          target_keyword?: string | null;
          secondary_keywords?: string[] | null;
          image_url?: string | null;
          image_alt_text?: string | null;
          word_count?: number;
          quality_score?: number | null;
          related_resources?: string[] | null;
          published_at?: string;
          updated_at?: string;
          views?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      trending_topics: {
        Row: {
          id: string;
          topic: string;
          topic_en: string | null;
          pillar: string;
          source: string;
          source_url: string | null;
          source_author: string | null;
          deep_context: Json;
          target_keyword: string | null;
          secondary_keywords: string[] | null;
          search_intent: string | null;
          engagement_score: number;
          relevance_score: number | null;
          scan_batch: string | null;
          scouted_at: string;
          used_at: string | null;
        };
        Insert: {
          id?: string;
          topic: string;
          topic_en?: string | null;
          pillar: string;
          source?: string;
          source_url?: string | null;
          source_author?: string | null;
          deep_context?: Json;
          target_keyword?: string | null;
          secondary_keywords?: string[] | null;
          search_intent?: string | null;
          engagement_score?: number;
          relevance_score?: number | null;
          scan_batch?: string | null;
          scouted_at?: string;
          used_at?: string | null;
        };
        Update: {
          id?: string;
          topic?: string;
          topic_en?: string | null;
          pillar?: string;
          source?: string;
          source_url?: string | null;
          source_author?: string | null;
          deep_context?: Json;
          target_keyword?: string | null;
          secondary_keywords?: string[] | null;
          search_intent?: string | null;
          engagement_score?: number;
          relevance_score?: number | null;
          scan_batch?: string | null;
          scouted_at?: string;
          used_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface PostContent {
  slide_titles?: string[];
  slide_texts?: string[];
  image_prompts?: string[];
}

export type Post = Database["public"]["Tables"]["posts"]["Row"];
export type NewsletterSubscriber = Database["public"]["Tables"]["newsletter_subscribers"]["Row"];
export type ContactSubmission = Database["public"]["Tables"]["contact_submissions"]["Row"];
export type DataDeletionRequest = Database["public"]["Tables"]["data_deletion_requests"]["Row"];
export type FacebookToken = Database["public"]["Tables"]["facebook_tokens"]["Row"];
export type TrendingTopic = Database["public"]["Tables"]["trending_topics"]["Row"];
export type Resource = Database["public"]["Tables"]["resources"]["Row"];
