export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      clients: {
        Row: {
          created_at: string | null
          created_by: string
          id: string
          name: string
          updated_at: string | null
          updated_by: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          id?: string
          name: string
          updated_at?: string | null
          updated_by: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          id?: string
          name?: string
          updated_at?: string | null
          updated_by?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          body: string
          created_at: string | null
          created_by: string
          finding_id: string
          id: string
          mentions: string[] | null
          updated_at: string | null
          updated_by: string
        }
        Insert: {
          body: string
          created_at?: string | null
          created_by: string
          finding_id: string
          id?: string
          mentions?: string[] | null
          updated_at?: string | null
          updated_by: string
        }
        Update: {
          body?: string
          created_at?: string | null
          created_by?: string
          finding_id?: string
          id?: string
          mentions?: string[] | null
          updated_at?: string | null
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_finding_id_fkey"
            columns: ["finding_id"]
            isOneToOne: false
            referencedRelation: "findings"
            referencedColumns: ["id"]
          },
        ]
      }
      criteria: {
        Row: {
          applicable_media: Database["public"]["Enums"]["scope_type"][] | null
          created_at: string | null
          created_by: string | null
          how_to_test: string
          id: string
          level: Database["public"]["Enums"]["wcag_level"]
          principle: string
          remediation_links: string[] | null
          title: string
          updated_at: string | null
          updated_by: string | null
          wcag_id: string
        }
        Insert: {
          applicable_media?: Database["public"]["Enums"]["scope_type"][] | null
          created_at?: string | null
          created_by?: string | null
          how_to_test: string
          id?: string
          level: Database["public"]["Enums"]["wcag_level"]
          principle: string
          remediation_links?: string[] | null
          title: string
          updated_at?: string | null
          updated_by?: string | null
          wcag_id: string
        }
        Update: {
          applicable_media?: Database["public"]["Enums"]["scope_type"][] | null
          created_at?: string | null
          created_by?: string | null
          how_to_test?: string
          id?: string
          level?: Database["public"]["Enums"]["wcag_level"]
          principle?: string
          remediation_links?: string[] | null
          title?: string
          updated_at?: string | null
          updated_by?: string | null
          wcag_id?: string
        }
        Relationships: []
      }
      evidence: {
        Row: {
          alt_text: string | null
          caption: string
          created_at: string | null
          created_by: string
          file_url: string
          hash: string
          id: string
          redaction_flags: boolean | null
          thumbnail_url: string | null
          transcript: string | null
          type: Database["public"]["Enums"]["evidence_type"]
          updated_at: string | null
          updated_by: string
        }
        Insert: {
          alt_text?: string | null
          caption: string
          created_at?: string | null
          created_by: string
          file_url: string
          hash: string
          id?: string
          redaction_flags?: boolean | null
          thumbnail_url?: string | null
          transcript?: string | null
          type: Database["public"]["Enums"]["evidence_type"]
          updated_at?: string | null
          updated_by: string
        }
        Update: {
          alt_text?: string | null
          caption?: string
          created_at?: string | null
          created_by?: string
          file_url?: string
          hash?: string
          id?: string
          redaction_flags?: boolean | null
          thumbnail_url?: string | null
          transcript?: string | null
          type?: Database["public"]["Enums"]["evidence_type"]
          updated_at?: string | null
          updated_by?: string
        }
        Relationships: []
      }
      findings: {
        Row: {
          assigned_to: string | null
          assistive_tech_used: string[] | null
          created_at: string | null
          created_by: string
          description: string | null
          due_date: string | null
          evidence_ids: string[] | null
          id: string
          labels: string[] | null
          location_selector: string | null
          page_id: string
          reference_links: string[] | null
          report_id: string
          retention_note: string | null
          severity: Database["public"]["Enums"]["finding_severity"] | null
          status: Database["public"]["Enums"]["finding_status"]
          updated_at: string | null
          updated_by: string
          wcag_id: string
        }
        Insert: {
          assigned_to?: string | null
          assistive_tech_used?: string[] | null
          created_at?: string | null
          created_by: string
          description?: string | null
          due_date?: string | null
          evidence_ids?: string[] | null
          id?: string
          labels?: string[] | null
          location_selector?: string | null
          page_id: string
          reference_links?: string[] | null
          report_id: string
          retention_note?: string | null
          severity?: Database["public"]["Enums"]["finding_severity"] | null
          status?: Database["public"]["Enums"]["finding_status"]
          updated_at?: string | null
          updated_by: string
          wcag_id: string
        }
        Update: {
          assigned_to?: string | null
          assistive_tech_used?: string[] | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          due_date?: string | null
          evidence_ids?: string[] | null
          id?: string
          labels?: string[] | null
          location_selector?: string | null
          page_id?: string
          reference_links?: string[] | null
          report_id?: string
          retention_note?: string | null
          severity?: Database["public"]["Enums"]["finding_severity"] | null
          status?: Database["public"]["Enums"]["finding_status"]
          updated_at?: string | null
          updated_by?: string
          wcag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "findings_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "findings_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          coverage_label: Database["public"]["Enums"]["coverage_label"]
          created_at: string | null
          created_by: string
          id: string
          last_tested_at: string | null
          path: string
          report_id: string
          status: Database["public"]["Enums"]["page_status"]
          template_name: string | null
          updated_at: string | null
          updated_by: string
          url: string
        }
        Insert: {
          coverage_label?: Database["public"]["Enums"]["coverage_label"]
          created_at?: string | null
          created_by: string
          id?: string
          last_tested_at?: string | null
          path: string
          report_id: string
          status?: Database["public"]["Enums"]["page_status"]
          template_name?: string | null
          updated_at?: string | null
          updated_by: string
          url: string
        }
        Update: {
          coverage_label?: Database["public"]["Enums"]["coverage_label"]
          created_at?: string | null
          created_by?: string
          id?: string
          last_tested_at?: string | null
          path?: string
          report_id?: string
          status?: Database["public"]["Enums"]["page_status"]
          template_name?: string | null
          updated_at?: string | null
          updated_by?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "pages_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
          role: Database["public"]["Enums"]["app_role"]
          timezone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name: string
          role?: Database["public"]["Enums"]["app_role"]
          timezone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          role?: Database["public"]["Enums"]["app_role"]
          timezone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      queue_assignments: {
        Row: {
          assigned_at: string | null
          assigned_to: string | null
          completed_at: string | null
          created_at: string | null
          created_by: string
          criteria_id: string | null
          due_date: string | null
          id: string
          page_id: string | null
          priority: Database["public"]["Enums"]["priority_level"]
          report_id: string
          started_at: string | null
          status: Database["public"]["Enums"]["queue_status"]
          updated_at: string | null
          updated_by: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by: string
          criteria_id?: string | null
          due_date?: string | null
          id?: string
          page_id?: string | null
          priority?: Database["public"]["Enums"]["priority_level"]
          report_id: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["queue_status"]
          updated_at?: string | null
          updated_by: string
        }
        Update: {
          assigned_at?: string | null
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string
          criteria_id?: string | null
          due_date?: string | null
          id?: string
          page_id?: string | null
          priority?: Database["public"]["Enums"]["priority_level"]
          report_id?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["queue_status"]
          updated_at?: string | null
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "queue_assignments_criteria_id_fkey"
            columns: ["criteria_id"]
            isOneToOne: false
            referencedRelation: "criteria"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "queue_assignments_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "queue_assignments_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          client_id: string
          created_at: string | null
          created_by: string
          domain: string
          due_date: string | null
          id: string
          level: Database["public"]["Enums"]["wcag_level"]
          priority: Database["public"]["Enums"]["priority_level"]
          project: string
          scope_type: Database["public"]["Enums"]["scope_type"]
          sign_off: Json | null
          standards: Database["public"]["Enums"]["wcag_version"][]
          status: Database["public"]["Enums"]["report_status"]
          suggested_pages: string[] | null
          tags: string[] | null
          title: string
          updated_at: string | null
          updated_by: string
          version: number
        }
        Insert: {
          client_id: string
          created_at?: string | null
          created_by: string
          domain: string
          due_date?: string | null
          id?: string
          level?: Database["public"]["Enums"]["wcag_level"]
          priority?: Database["public"]["Enums"]["priority_level"]
          project: string
          scope_type?: Database["public"]["Enums"]["scope_type"]
          sign_off?: Json | null
          standards?: Database["public"]["Enums"]["wcag_version"][]
          status?: Database["public"]["Enums"]["report_status"]
          suggested_pages?: string[] | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          updated_by: string
          version?: number
        }
        Update: {
          client_id?: string
          created_at?: string | null
          created_by?: string
          domain?: string
          due_date?: string | null
          id?: string
          level?: Database["public"]["Enums"]["wcag_level"]
          priority?: Database["public"]["Enums"]["priority_level"]
          project?: string
          scope_type?: Database["public"]["Enums"]["scope_type"]
          sign_off?: Json | null
          standards?: Database["public"]["Enums"]["wcag_version"][]
          status?: Database["public"]["Enums"]["report_status"]
          suggested_pages?: string[] | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          updated_by?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "reports_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
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
      app_role: "Admin" | "Lead" | "Tester" | "Reviewer" | "Viewer"
      coverage_label: "Key" | "Template" | "Sample"
      evidence_type:
        | "Screenshot"
        | "Video"
        | "Audio"
        | "HAR"
        | "CodeSnippet"
        | "File"
      finding_severity: "Critical" | "Major" | "Minor" | "Advisory"
      finding_status: "Pass" | "Fail" | "Needs Review" | "Not Applicable"
      page_status: "Planned" | "In Testing" | "Completed"
      priority_level: "Low" | "Medium" | "High" | "Urgent"
      queue_status: "Available" | "Assigned" | "In Progress" | "Completed"
      report_status: "Draft" | "In Review" | "Approved" | "Released"
      scope_type: "web" | "pdf" | "mobile"
      wcag_level: "A" | "AA" | "AAA"
      wcag_version: "2.1" | "2.2"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["Admin", "Lead", "Tester", "Reviewer", "Viewer"],
      coverage_label: ["Key", "Template", "Sample"],
      evidence_type: [
        "Screenshot",
        "Video",
        "Audio",
        "HAR",
        "CodeSnippet",
        "File",
      ],
      finding_severity: ["Critical", "Major", "Minor", "Advisory"],
      finding_status: ["Pass", "Fail", "Needs Review", "Not Applicable"],
      page_status: ["Planned", "In Testing", "Completed"],
      priority_level: ["Low", "Medium", "High", "Urgent"],
      queue_status: ["Available", "Assigned", "In Progress", "Completed"],
      report_status: ["Draft", "In Review", "Approved", "Released"],
      scope_type: ["web", "pdf", "mobile"],
      wcag_level: ["A", "AA", "AAA"],
      wcag_version: ["2.1", "2.2"],
    },
  },
} as const
