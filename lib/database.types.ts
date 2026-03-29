export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          persona: string;
          interests: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          persona?: string;
          interests?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string | null;
          persona?: string;
          interests?: string[];
          updated_at?: string;
        };
      };

      bookmarks: {
        Row: {
          id: string;
          user_id: string;
          article_id: string;
          article_title: string;
          article_url: string;
          article_category: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          article_id: string;
          article_title: string;
          article_url: string;
          article_category: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          article_id?: string;
          article_title?: string;
          article_url?: string;
          article_category?: string;
          created_at?: string;
        };
      };

      watchlist: {
        Row: {
          id: string;
          user_id: string;
          symbol: string;
          display_name: string;
          added_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          symbol: string;
          display_name: string;
          added_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          symbol?: string;
          display_name?: string;
          added_at?: string;
        };
      };

      briefing_history: {
        Row: {
          id: string;
          user_id: string;
          topic: string;
          messages: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          topic: string;
          messages: Json;
          created_at?: string;
        };
        Update: {
          messages?: Json;
        };
      };
    };

    Views: {};
    Functions: {};
    Enums: {};
  };
}