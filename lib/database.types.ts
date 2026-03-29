// This file represents the shape of your Supabase database.
// Run `npm run db:types` to regenerate from your live schema.
// Or keep this file as-is — it matches the SQL in supabase/schema.sql

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;                  // uuid — matches auth.users.id
          email: string;
          full_name: string | null;
          persona: string;             // "investor" | "founder" | "student" | "analyst"
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
          article_id: string;          // external ID from NewsData.io
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
        Update: never;
      };
      watchlist: {
        Row: {
          id: string;
          user_id: string;
          symbol: string;              // e.g. "HDFCBANK", "RELIANCE"
          display_name: string;        // e.g. "HDFC Bank"
          added_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          symbol: string;
          display_name: string;
          added_at?: string;
        };
        Update: never;
      };
      briefing_history: {
        Row: {
          id: string;
          user_id: string;
          topic: string;
          messages: Json;              // array of {role, content}
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
