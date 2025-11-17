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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      accounts: {
        Row: {
          account_code: string
          account_name: string
          account_type: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          parent_account_id: string | null
          updated_at: string
        }
        Insert: {
          account_code: string
          account_name: string
          account_type: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          parent_account_id?: string | null
          updated_at?: string
        }
        Update: {
          account_code?: string
          account_name?: string
          account_type?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          parent_account_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounts_parent_account_id_fkey"
            columns: ["parent_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_log: {
        Row: {
          action: string
          created_at: string
          id: string
          new_value: Json | null
          old_value: Json | null
          ticket_id: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          ticket_id?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          ticket_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      asset_transactions: {
        Row: {
          amount: number
          asset_id: string
          created_at: string
          id: string
          transaction_date: string
          transaction_type: Database["public"]["Enums"]["transaction_type"]
        }
        Insert: {
          amount: number
          asset_id: string
          created_at?: string
          id?: string
          transaction_date: string
          transaction_type: Database["public"]["Enums"]["transaction_type"]
        }
        Update: {
          amount?: number
          asset_id?: string
          created_at?: string
          id?: string
          transaction_date?: string
          transaction_type?: Database["public"]["Enums"]["transaction_type"]
        }
        Relationships: [
          {
            foreignKeyName: "asset_transactions_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      assets: {
        Row: {
          additional_depreciation_eligible: boolean | null
          applicable_law: Database["public"]["Enums"]["applicable_law"]
          asset_category: string
          asset_name: string
          created_at: string
          depreciation_method: Database["public"]["Enums"]["depreciation_method"]
          depreciation_rate: number
          id: string
          multi_shift_use: number | null
          original_cost: number
          purchase_date: string
          residual_value_pct: number | null
          updated_at: string
          useful_life: number
          user_id: string
        }
        Insert: {
          additional_depreciation_eligible?: boolean | null
          applicable_law: Database["public"]["Enums"]["applicable_law"]
          asset_category: string
          asset_name: string
          created_at?: string
          depreciation_method: Database["public"]["Enums"]["depreciation_method"]
          depreciation_rate: number
          id?: string
          multi_shift_use?: number | null
          original_cost: number
          purchase_date: string
          residual_value_pct?: number | null
          updated_at?: string
          useful_life: number
          user_id: string
        }
        Update: {
          additional_depreciation_eligible?: boolean | null
          applicable_law?: Database["public"]["Enums"]["applicable_law"]
          asset_category?: string
          asset_name?: string
          created_at?: string
          depreciation_method?: Database["public"]["Enums"]["depreciation_method"]
          depreciation_rate?: number
          id?: string
          multi_shift_use?: number | null
          original_cost?: number
          purchase_date?: string
          residual_value_pct?: number | null
          updated_at?: string
          useful_life?: number
          user_id?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          entity_id: string | null
          entity_type: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      automation_rules: {
        Row: {
          action: string
          action_value: Json | null
          created_at: string
          execution_order: number | null
          id: string
          is_active: boolean | null
          rule_name: string
          trigger: string
          trigger_value: Json | null
        }
        Insert: {
          action: string
          action_value?: Json | null
          created_at?: string
          execution_order?: number | null
          id?: string
          is_active?: boolean | null
          rule_name: string
          trigger: string
          trigger_value?: Json | null
        }
        Update: {
          action?: string
          action_value?: Json | null
          created_at?: string
          execution_order?: number | null
          id?: string
          is_active?: boolean | null
          rule_name?: string
          trigger?: string
          trigger_value?: Json | null
        }
        Relationships: []
      }
      budgets: {
        Row: {
          account_id: string | null
          allocated_amount: number
          budget_period: string
          created_at: string
          created_by: string
          currency: string | null
          department_id: string | null
          end_date: string
          id: string
          name: string
          notes: string | null
          spent_amount: number | null
          start_date: string
          updated_at: string
        }
        Insert: {
          account_id?: string | null
          allocated_amount: number
          budget_period: string
          created_at?: string
          created_by: string
          currency?: string | null
          department_id?: string | null
          end_date: string
          id?: string
          name: string
          notes?: string | null
          spent_amount?: number | null
          start_date: string
          updated_at?: string
        }
        Update: {
          account_id?: string | null
          allocated_amount?: number
          budget_period?: string
          created_at?: string
          created_by?: string
          currency?: string | null
          department_id?: string | null
          end_date?: string
          id?: string
          name?: string
          notes?: string | null
          spent_amount?: number | null
          start_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "budgets_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budgets_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      channels: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          name: string
          project_id: string | null
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          name: string
          project_id?: string | null
          type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          name?: string
          project_id?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "channels_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          address: Json | null
          annual_revenue: number | null
          company_size: string | null
          created_at: string
          created_by: string
          email: string | null
          id: string
          industry: string | null
          logo_url: string | null
          name: string
          notes: string | null
          phone: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: Json | null
          annual_revenue?: number | null
          company_size?: string | null
          created_at?: string
          created_by: string
          email?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: Json | null
          annual_revenue?: number | null
          company_size?: string | null
          created_at?: string
          created_by?: string
          email?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      contacts: {
        Row: {
          address: Json | null
          avatar_url: string | null
          company_id: string | null
          created_at: string
          created_by: string
          email: string | null
          first_name: string
          id: string
          job_title: string | null
          last_name: string
          mobile: string | null
          notes: string | null
          phone: string | null
          social_links: Json | null
          tags: Json | null
          updated_at: string
        }
        Insert: {
          address?: Json | null
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string
          created_by: string
          email?: string | null
          first_name: string
          id?: string
          job_title?: string | null
          last_name: string
          mobile?: string | null
          notes?: string | null
          phone?: string | null
          social_links?: Json | null
          tags?: Json | null
          updated_at?: string
        }
        Update: {
          address?: Json | null
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string
          created_by?: string
          email?: string | null
          first_name?: string
          id?: string
          job_title?: string | null
          last_name?: string
          mobile?: string | null
          notes?: string | null
          phone?: string | null
          social_links?: Json | null
          tags?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contacts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_activities: {
        Row: {
          activity_type: string
          created_at: string | null
          description: string | null
          id: string
          related_id: string
          related_table: string
          title: string
          user_id: string | null
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          description?: string | null
          id?: string
          related_id: string
          related_table: string
          title: string
          user_id?: string | null
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          description?: string | null
          id?: string
          related_id?: string
          related_table?: string
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      crm_customers: {
        Row: {
          city: string | null
          company: string | null
          country: string | null
          created_at: string | null
          email: string | null
          id: string
          industry: string | null
          name: string
          owner_id: string | null
          phone: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          city?: string | null
          company?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          industry?: string | null
          name: string
          owner_id?: string | null
          phone?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          city?: string | null
          company?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          industry?: string | null
          name?: string
          owner_id?: string | null
          phone?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      crm_opportunities: {
        Row: {
          amount: number | null
          close_date: string | null
          created_at: string | null
          customer_id: string | null
          id: string
          lead_id: string | null
          name: string
          owner_id: string | null
          probability: number | null
          stage: string
          updated_at: string | null
        }
        Insert: {
          amount?: number | null
          close_date?: string | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          lead_id?: string | null
          name: string
          owner_id?: string | null
          probability?: number | null
          stage?: string
          updated_at?: string | null
        }
        Update: {
          amount?: number | null
          close_date?: string | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          lead_id?: string | null
          name?: string
          owner_id?: string | null
          probability?: number | null
          stage?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_opportunities_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "crm_customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_opportunities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_quote_items: {
        Row: {
          amount: number | null
          created_at: string | null
          description: string
          id: string
          quantity: number | null
          quote_id: string
          tax_rate: number | null
          unit_price: number | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          description: string
          id?: string
          quantity?: number | null
          quote_id: string
          tax_rate?: number | null
          unit_price?: number | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          description?: string
          id?: string
          quantity?: number | null
          quote_id?: string
          tax_rate?: number | null
          unit_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_quote_items_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "crm_quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_quotes: {
        Row: {
          amount: number | null
          created_at: string | null
          customer_id: string | null
          id: string
          opportunity_id: string | null
          owner_id: string | null
          quote_number: string
          status: string
          tax_amount: number | null
          updated_at: string | null
          valid_until: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          opportunity_id?: string | null
          owner_id?: string | null
          quote_number: string
          status?: string
          tax_amount?: number | null
          updated_at?: string | null
          valid_until?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          opportunity_id?: string | null
          owner_id?: string | null
          quote_number?: string
          status?: string
          tax_amount?: number | null
          updated_at?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_quotes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "crm_customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_quotes_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "crm_opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      deals: {
        Row: {
          actual_close_date: string | null
          assigned_to: string | null
          company_id: string | null
          contact_id: string | null
          created_at: string
          created_by: string
          currency: string | null
          expected_close_date: string | null
          id: string
          lead_id: string | null
          name: string
          notes: string | null
          probability: number | null
          stage: string
          tags: Json | null
          updated_at: string
          value: number
        }
        Insert: {
          actual_close_date?: string | null
          assigned_to?: string | null
          company_id?: string | null
          contact_id?: string | null
          created_at?: string
          created_by: string
          currency?: string | null
          expected_close_date?: string | null
          id?: string
          lead_id?: string | null
          name: string
          notes?: string | null
          probability?: number | null
          stage?: string
          tags?: Json | null
          updated_at?: string
          value: number
        }
        Update: {
          actual_close_date?: string | null
          assigned_to?: string | null
          company_id?: string | null
          contact_id?: string | null
          created_at?: string
          created_by?: string
          currency?: string | null
          expected_close_date?: string | null
          id?: string
          lead_id?: string | null
          name?: string
          notes?: string | null
          probability?: number | null
          stage?: string
          tags?: Json | null
          updated_at?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "deals_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          created_at: string
          description: string | null
          id: string
          manager_id: string | null
          name: string
          parent_department_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          manager_id?: string | null
          name: string
          parent_department_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          manager_id?: string | null
          name?: string
          parent_department_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "departments_parent_department_id_fkey"
            columns: ["parent_department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      depreciation_schedules: {
        Row: {
          accumulated_depreciation: number
          additional_depreciation: number | null
          additions: number | null
          asset_id: string
          closing_value: number
          created_at: string
          depreciation: number
          disposals: number | null
          financial_year: string
          id: string
          opening_value: number
          year_number: number
        }
        Insert: {
          accumulated_depreciation: number
          additional_depreciation?: number | null
          additions?: number | null
          asset_id: string
          closing_value: number
          created_at?: string
          depreciation: number
          disposals?: number | null
          financial_year: string
          id?: string
          opening_value: number
          year_number: number
        }
        Update: {
          accumulated_depreciation?: number
          additional_depreciation?: number | null
          additions?: number | null
          asset_id?: string
          closing_value?: number
          created_at?: string
          depreciation?: number
          disposals?: number | null
          financial_year?: string
          id?: string
          opening_value?: number
          year_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "depreciation_schedules_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          address: Json | null
          bank_details: Json | null
          created_at: string
          date_of_birth: string | null
          department_id: string | null
          designation: string | null
          documents: Json | null
          email: string
          emergency_contact: Json | null
          employee_code: string
          employment_type: string | null
          first_name: string
          gender: string | null
          id: string
          join_date: string
          last_name: string
          phone: string | null
          salary: number | null
          status: string
          termination_date: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address?: Json | null
          bank_details?: Json | null
          created_at?: string
          date_of_birth?: string | null
          department_id?: string | null
          designation?: string | null
          documents?: Json | null
          email: string
          emergency_contact?: Json | null
          employee_code: string
          employment_type?: string | null
          first_name: string
          gender?: string | null
          id?: string
          join_date: string
          last_name: string
          phone?: string | null
          salary?: number | null
          status?: string
          termination_date?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: Json | null
          bank_details?: Json | null
          created_at?: string
          date_of_birth?: string | null
          department_id?: string | null
          designation?: string | null
          documents?: Json | null
          email?: string
          emergency_contact?: Json | null
          employee_code?: string
          employment_type?: string | null
          first_name?: string
          gender?: string | null
          id?: string
          join_date?: string
          last_name?: string
          phone?: string | null
          salary?: number | null
          status?: string
          termination_date?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          assigned_to: string | null
          company: string | null
          company_id: string | null
          contact_id: string | null
          created_at: string
          created_by: string
          currency: string | null
          email: string | null
          expected_close_date: string | null
          id: string
          notes: string | null
          phone: string | null
          probability: number | null
          score: number | null
          source: string | null
          status: string
          tags: Json | null
          title: string
          updated_at: string
          value: number | null
        }
        Insert: {
          assigned_to?: string | null
          company?: string | null
          company_id?: string | null
          contact_id?: string | null
          created_at?: string
          created_by: string
          currency?: string | null
          email?: string | null
          expected_close_date?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          probability?: number | null
          score?: number | null
          source?: string | null
          status?: string
          tags?: Json | null
          title: string
          updated_at?: string
          value?: number | null
        }
        Update: {
          assigned_to?: string | null
          company?: string | null
          company_id?: string | null
          contact_id?: string | null
          created_at?: string
          created_by?: string
          currency?: string | null
          email?: string | null
          expected_close_date?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          probability?: number | null
          score?: number | null
          source?: string | null
          status?: string
          tags?: Json | null
          title?: string
          updated_at?: string
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_requests: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          days_count: number
          employee_id: string
          end_date: string
          id: string
          leave_type: string
          reason: string
          rejection_reason: string | null
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          days_count: number
          employee_id: string
          end_date: string
          id?: string
          leave_type: string
          reason: string
          rejection_reason?: string | null
          start_date: string
          status?: string
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          days_count?: number
          employee_id?: string
          end_date?: string
          id?: string
          leave_type?: string
          reason?: string
          rejection_reason?: string | null
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leave_requests_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          attachments: Json | null
          channel_id: string | null
          content: string
          created_at: string
          id: string
          is_edited: boolean | null
          mentions: Json | null
          parent_message_id: string | null
          reactions: Json | null
          sender_id: string
          updated_at: string
        }
        Insert: {
          attachments?: Json | null
          channel_id?: string | null
          content: string
          created_at?: string
          id?: string
          is_edited?: boolean | null
          mentions?: Json | null
          parent_message_id?: string | null
          reactions?: Json | null
          sender_id: string
          updated_at?: string
        }
        Update: {
          attachments?: Json | null
          channel_id?: string | null
          content?: string
          created_at?: string
          id?: string
          is_edited?: boolean | null
          mentions?: Json | null
          parent_message_id?: string | null
          reactions?: Json | null
          sender_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_parent_message_id_fkey"
            columns: ["parent_message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          ticket_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          ticket_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          ticket_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          actual_cost: number | null
          budget: number | null
          client_id: string | null
          created_at: string
          created_by: string
          custom_fields: Json | null
          description: string | null
          end_date: string | null
          id: string
          name: string
          priority: string | null
          progress: number | null
          project_manager_id: string | null
          start_date: string | null
          status: string
          tags: Json | null
          updated_at: string
        }
        Insert: {
          actual_cost?: number | null
          budget?: number | null
          client_id?: string | null
          created_at?: string
          created_by: string
          custom_fields?: Json | null
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          priority?: string | null
          progress?: number | null
          project_manager_id?: string | null
          start_date?: string | null
          status?: string
          tags?: Json | null
          updated_at?: string
        }
        Update: {
          actual_cost?: number | null
          budget?: number | null
          client_id?: string | null
          created_at?: string
          created_by?: string
          custom_fields?: Json | null
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          priority?: string | null
          progress?: number | null
          project_manager_id?: string | null
          start_date?: string | null
          status?: string
          tags?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      sla_rules: {
        Row: {
          created_at: string
          escalate_if_breached: boolean | null
          escalate_to_role: string | null
          first_response_time_minutes: number
          id: string
          is_active: boolean | null
          priority: Database["public"]["Enums"]["ticket_priority"]
          resolution_time_minutes: number
          rule_name: string
        }
        Insert: {
          created_at?: string
          escalate_if_breached?: boolean | null
          escalate_to_role?: string | null
          first_response_time_minutes: number
          id?: string
          is_active?: boolean | null
          priority: Database["public"]["Enums"]["ticket_priority"]
          resolution_time_minutes: number
          rule_name: string
        }
        Update: {
          created_at?: string
          escalate_if_breached?: boolean | null
          escalate_to_role?: string | null
          first_response_time_minutes?: number
          id?: string
          is_active?: boolean | null
          priority?: Database["public"]["Enums"]["ticket_priority"]
          resolution_time_minutes?: number
          rule_name?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          account_email: string | null
          auto_renew: boolean | null
          billing_cycle: string | null
          category: string | null
          cost: number | null
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          invoice_email: string | null
          logo_url: string | null
          notes: string | null
          notification_methods: Json | null
          payment_method: string | null
          plan_description: string | null
          plan_tier: string | null
          provider_name: string | null
          reminder_days: number | null
          renewal_date: string | null
          send_reminder: boolean | null
          status: string
          subscription_end_date: string | null
          subscription_name: string | null
          subscription_start_date: string | null
          subscription_url: string | null
          tool_id: string
          trial_days_remaining: number | null
          updated_at: string | null
          user_id: string
          username: string | null
          website_url: string | null
        }
        Insert: {
          account_email?: string | null
          auto_renew?: boolean | null
          billing_cycle?: string | null
          category?: string | null
          cost?: number | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          invoice_email?: string | null
          logo_url?: string | null
          notes?: string | null
          notification_methods?: Json | null
          payment_method?: string | null
          plan_description?: string | null
          plan_tier?: string | null
          provider_name?: string | null
          reminder_days?: number | null
          renewal_date?: string | null
          send_reminder?: boolean | null
          status?: string
          subscription_end_date?: string | null
          subscription_name?: string | null
          subscription_start_date?: string | null
          subscription_url?: string | null
          tool_id: string
          trial_days_remaining?: number | null
          updated_at?: string | null
          user_id: string
          username?: string | null
          website_url?: string | null
        }
        Update: {
          account_email?: string | null
          auto_renew?: boolean | null
          billing_cycle?: string | null
          category?: string | null
          cost?: number | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          invoice_email?: string | null
          logo_url?: string | null
          notes?: string | null
          notification_methods?: Json | null
          payment_method?: string | null
          plan_description?: string | null
          plan_tier?: string | null
          provider_name?: string | null
          reminder_days?: number | null
          renewal_date?: string | null
          send_reminder?: boolean | null
          status?: string
          subscription_end_date?: string | null
          subscription_name?: string | null
          subscription_start_date?: string | null
          subscription_url?: string | null
          tool_id?: string
          trial_days_remaining?: number | null
          updated_at?: string | null
          user_id?: string
          username?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "tools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          actual_hours: number | null
          assigned_to: string | null
          attachments: Json | null
          created_at: string
          created_by: string
          description: string | null
          due_date: string | null
          estimated_hours: number | null
          id: string
          parent_task_id: string | null
          priority: string | null
          progress: number | null
          project_id: string | null
          status: string
          tags: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          actual_hours?: number | null
          assigned_to?: string | null
          attachments?: Json | null
          created_at?: string
          created_by: string
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          parent_task_id?: string | null
          priority?: string | null
          progress?: number | null
          project_id?: string | null
          status?: string
          tags?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          actual_hours?: number | null
          assigned_to?: string | null
          attachments?: Json | null
          created_at?: string
          created_by?: string
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          parent_task_id?: string | null
          priority?: string | null
          progress?: number | null
          project_id?: string | null
          status?: string
          tags?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_parent_task_id_fkey"
            columns: ["parent_task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          color_code: string | null
          created_at: string
          description: string | null
          id: string
          manager_id: string | null
          team_name: string
        }
        Insert: {
          color_code?: string | null
          created_at?: string
          description?: string | null
          id?: string
          manager_id?: string | null
          team_name: string
        }
        Update: {
          color_code?: string | null
          created_at?: string
          description?: string | null
          id?: string
          manager_id?: string | null
          team_name?: string
        }
        Relationships: []
      }
      ticket_comments: {
        Row: {
          author_id: string
          comment_text: string
          created_at: string
          id: string
          is_public: boolean
          mentions: Json | null
          ticket_id: string
          updated_at: string
        }
        Insert: {
          author_id: string
          comment_text: string
          created_at?: string
          id?: string
          is_public?: boolean
          mentions?: Json | null
          ticket_id: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          comment_text?: string
          created_at?: string
          id?: string
          is_public?: boolean
          mentions?: Json | null
          ticket_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_comments_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          assigned_team: string | null
          assigned_to: string | null
          closed_at: string | null
          created_at: string
          created_by: string
          custom_fields: Json | null
          customer_email: string
          customer_name: string
          description: string
          due_date: string | null
          id: string
          issue_type: Database["public"]["Enums"]["issue_type"]
          priority: Database["public"]["Enums"]["ticket_priority"]
          resolved_at: string | null
          status: Database["public"]["Enums"]["ticket_status"]
          tags: Json | null
          ticket_number: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_team?: string | null
          assigned_to?: string | null
          closed_at?: string | null
          created_at?: string
          created_by: string
          custom_fields?: Json | null
          customer_email: string
          customer_name: string
          description: string
          due_date?: string | null
          id?: string
          issue_type?: Database["public"]["Enums"]["issue_type"]
          priority?: Database["public"]["Enums"]["ticket_priority"]
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          tags?: Json | null
          ticket_number: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_team?: string | null
          assigned_to?: string | null
          closed_at?: string | null
          created_at?: string
          created_by?: string
          custom_fields?: Json | null
          customer_email?: string
          customer_name?: string
          description?: string
          due_date?: string | null
          id?: string
          issue_type?: Database["public"]["Enums"]["issue_type"]
          priority?: Database["public"]["Enums"]["ticket_priority"]
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          tags?: Json | null
          ticket_number?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tickets_assigned_team_fkey"
            columns: ["assigned_team"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      time_entries: {
        Row: {
          created_at: string
          description: string | null
          duration_minutes: number | null
          end_time: string | null
          hourly_rate: number | null
          id: string
          is_billable: boolean | null
          project_id: string | null
          start_time: string
          task_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          end_time?: string | null
          hourly_rate?: number | null
          id?: string
          is_billable?: boolean | null
          project_id?: string | null
          start_time: string
          task_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          end_time?: string | null
          hourly_rate?: number | null
          id?: string
          is_billable?: boolean | null
          project_id?: string | null
          start_time?: string
          task_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "time_entries_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tools: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          display_name: string
          id: string
          is_active: boolean | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          display_name: string
          id?: string
          is_active?: boolean | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          display_name?: string
          id?: string
          is_active?: boolean | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          attachments: Json | null
          created_at: string
          created_by: string
          credit_account_id: string
          currency: string | null
          debit_account_id: string
          description: string
          id: string
          reference_number: string | null
          status: string | null
          transaction_date: string
          updated_at: string
        }
        Insert: {
          amount: number
          attachments?: Json | null
          created_at?: string
          created_by: string
          credit_account_id: string
          currency?: string | null
          debit_account_id: string
          description: string
          id?: string
          reference_number?: string | null
          status?: string | null
          transaction_date: string
          updated_at?: string
        }
        Update: {
          amount?: number
          attachments?: Json | null
          created_at?: string
          created_by?: string
          credit_account_id?: string
          currency?: string | null
          debit_account_id?: string
          description?: string
          id?: string
          reference_number?: string | null
          status?: string | null
          transaction_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_credit_account_id_fkey"
            columns: ["credit_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_debit_account_id_fkey"
            columns: ["debit_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string | null
          email_notifications: boolean | null
          id: string
          language: string | null
          marketing_emails: boolean | null
          push_notifications: boolean | null
          theme: string | null
          timezone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          language?: string | null
          marketing_emails?: boolean | null
          push_notifications?: boolean | null
          theme?: string | null
          timezone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          language?: string | null
          marketing_emails?: boolean | null
          push_notifications?: boolean | null
          theme?: string | null
          timezone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          auto_save_interval: number | null
          company_address: string | null
          company_logo_url: string | null
          company_name: string | null
          created_at: string
          currency_symbol: string | null
          default_depreciation_method:
            | Database["public"]["Enums"]["depreciation_method"]
            | null
          default_residual_value_pct: number | null
          enable_additional_depreciation: boolean | null
          enable_multi_shift: boolean | null
          fy_start_day: number | null
          fy_start_month: number | null
          id: string
          theme_mode: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_save_interval?: number | null
          company_address?: string | null
          company_logo_url?: string | null
          company_name?: string | null
          created_at?: string
          currency_symbol?: string | null
          default_depreciation_method?:
            | Database["public"]["Enums"]["depreciation_method"]
            | null
          default_residual_value_pct?: number | null
          enable_additional_depreciation?: boolean | null
          enable_multi_shift?: boolean | null
          fy_start_day?: number | null
          fy_start_month?: number | null
          id?: string
          theme_mode?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_save_interval?: number | null
          company_address?: string | null
          company_logo_url?: string | null
          company_name?: string | null
          created_at?: string
          currency_symbol?: string | null
          default_depreciation_method?:
            | Database["public"]["Enums"]["depreciation_method"]
            | null
          default_residual_value_pct?: number | null
          enable_additional_depreciation?: boolean | null
          enable_multi_shift?: boolean | null
          fy_start_day?: number | null
          fy_start_month?: number | null
          id?: string
          theme_mode?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_ticket_number: { Args: never; Returns: string }
      has_role: { Args: { _role: string; _user_id: string }; Returns: boolean }
    }
    Enums: {
      applicable_law: "Companies Act" | "Income Tax Act" | "Both"
      availability_status: "Available" | "Busy" | "Away" | "Offline"
      depreciation_method: "SLM" | "WDV"
      issue_type: "Bug" | "Feature Request" | "Question" | "Urgent" | "General"
      ticket_priority: "Critical" | "High" | "Medium" | "Low"
      ticket_status: "Open" | "In Progress" | "Pending" | "Resolved" | "Closed"
      transaction_type: "Addition" | "Disposal"
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
      applicable_law: ["Companies Act", "Income Tax Act", "Both"],
      availability_status: ["Available", "Busy", "Away", "Offline"],
      depreciation_method: ["SLM", "WDV"],
      issue_type: ["Bug", "Feature Request", "Question", "Urgent", "General"],
      ticket_priority: ["Critical", "High", "Medium", "Low"],
      ticket_status: ["Open", "In Progress", "Pending", "Resolved", "Closed"],
      transaction_type: ["Addition", "Disposal"],
    },
  },
} as const
