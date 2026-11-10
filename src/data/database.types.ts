// The shape of the hosted database, from the Supabase type generator (trimmed to what the
// app uses). Regenerate with the Supabase MCP `generate_typescript_types` tool after a migration.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type EntryKind = 'feed' | 'diaper' | 'sleep' | 'care' | 'note' | 'measurement'

export type Database = {
  // Lets createClient pick the right options for this PostgREST version.
  __InternalSupabase: {
    PostgrestVersion: '14.18'
  }
  public: {
    Tables: {
      babies: {
        Row: {
          birth_at: string
          birth_head_cm: number | null
          birth_length_cm: number | null
          birth_weight_g: number | null
          created_at: string
          day1_date: string
          id: string
          name: string
          tz: string
        }
        Insert: {
          birth_at: string
          birth_head_cm?: number | null
          birth_length_cm?: number | null
          birth_weight_g?: number | null
          created_at?: string
          day1_date: string
          id?: string
          name: string
          tz?: string
        }
        Update: {
          birth_at?: string
          birth_head_cm?: number | null
          birth_length_cm?: number | null
          birth_weight_g?: number | null
          created_at?: string
          day1_date?: string
          id?: string
          name?: string
          tz?: string
        }
        Relationships: []
      }
      entries: {
        Row: {
          baby_id: string
          created_at: string
          data: Json
          deleted_at: string | null
          ended_at: string | null
          id: string
          kind: EntryKind
          logged_by: string | null
          notes: string | null
          occurred_at: string
          source: string
          updated_at: string
          utc_offset_min: number
        }
        Insert: {
          baby_id: string
          created_at?: string
          data?: Json
          deleted_at?: string | null
          ended_at?: string | null
          id?: string
          kind: EntryKind
          logged_by?: string | null
          notes?: string | null
          occurred_at: string
          source?: string
          updated_at?: string
          utc_offset_min: number
        }
        Update: {
          baby_id?: string
          created_at?: string
          data?: Json
          deleted_at?: string | null
          ended_at?: string | null
          id?: string
          kind?: EntryKind
          logged_by?: string | null
          notes?: string | null
          occurred_at?: string
          source?: string
          updated_at?: string
          utc_offset_min?: number
        }
        Relationships: [
          {
            foreignKeyName: 'entries_baby_id_fkey'
            columns: ['baby_id']
            isOneToOne: false
            referencedRelation: 'babies'
            referencedColumns: ['id']
          },
        ]
      }
      members: {
        Row: {
          baby_id: string
          created_at: string
          display_name: string
          initial: string
          user_id: string
        }
        Insert: {
          baby_id: string
          created_at?: string
          display_name: string
          initial: string
          user_id: string
        }
        Update: {
          baby_id?: string
          created_at?: string
          display_name?: string
          initial?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'members_baby_id_fkey'
            columns: ['baby_id']
            isOneToOne: false
            referencedRelation: 'babies'
            referencedColumns: ['id']
          },
        ]
      }
      reference_metrics: {
        Row: {
          baby_id: string
          created_at: string
          day_from: number
          day_to: number | null
          id: string
          max: number | null
          metric: string
          min: number | null
          note: string | null
          source: string
          source_url: string | null
          typical: number | null
        }
        Insert: {
          baby_id: string
          created_at?: string
          day_from: number
          day_to?: number | null
          id?: string
          max?: number | null
          metric: string
          min?: number | null
          note?: string | null
          source: string
          source_url?: string | null
          typical?: number | null
        }
        Update: {
          baby_id?: string
          created_at?: string
          day_from?: number
          day_to?: number | null
          id?: string
          max?: number | null
          metric?: string
          min?: number | null
          note?: string | null
          source?: string
          source_url?: string | null
          typical?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'reference_metrics_baby_id_fkey'
            columns: ['baby_id']
            isOneToOne: false
            referencedRelation: 'babies'
            referencedColumns: ['id']
          },
        ]
      }
      settings: {
        Row: {
          baby_id: string
          feed_interval_min: number
          feed_window_min: number
          updated_at: string
        }
        Insert: {
          baby_id: string
          feed_interval_min?: number
          feed_window_min?: number
          updated_at?: string
        }
        Update: {
          baby_id?: string
          feed_interval_min?: number
          feed_window_min?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'settings_baby_id_fkey'
            columns: ['baby_id']
            isOneToOne: true
            referencedRelation: 'babies'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      entry_kind: EntryKind
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

/** A row of one table: `Row<'entries'>`. */
export type Row<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']
