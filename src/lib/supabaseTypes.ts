// Generated Supabase types
// This file provides type definitions for your Supabase database

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
      activity_logs: {
        Row: {
          action_type: string | null;
          created_at: string;
          details: Json | null;
          entity_id: string | null;
          entity_type: string | null;
          id: string;
          status: string | null;
          user_email: string | null;
          user_id: string | null;
          username: string | null;
        };
        Insert: {
          action_type?: string | null;
          created_at?: string;
          details?: Json | null;
          entity_id?: string | null;
          entity_type?: string | null;
          id?: string;
          status?: string | null;
          user_email?: string | null;
          user_id?: string | null;
          username?: string | null;
        };
        Update: {
          action_type?: string | null;
          created_at?: string;
          details?: Json | null;
          entity_id?: string | null;
          entity_type?: string | null;
          id?: string;
          status?: string | null;
          user_email?: string | null;
          user_id?: string | null;
          username?: string | null;
        };
        Relationships: [];
      };
      audit_logs: {
        Row: {
          action: string;
          created_at: string;
          entity_id: string | null;
          entity_type: string | null;
          id: string;
          new_data: Json | null;
          old_data: Json | null;
          user_id: string | null;
        };
        Insert: {
          action: string;
          created_at?: string;
          entity_id?: string | null;
          entity_type?: string | null;
          id?: string;
          new_data?: Json | null;
          old_data?: Json | null;
          user_id?: string | null;
        };
        Update: {
          action?: string;
          created_at?: string;
          entity_id?: string | null;
          entity_type?: string | null;
          id?: string;
          new_data?: Json | null;
          old_data?: Json | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      compliance_settings: {
        Row: {
          created_at: string;
          id: string;
          organization_id: string;
          settings: Json;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          organization_id: string;
          settings: Json;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          organization_id?: string;
          settings?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
      documents: {
        Row: {
          created_at: string;
          description: string | null;
          document_type: string;
          entity_id: string;
          entity_type: string;
          file_name: string;
          file_size: number;
          file_type: string;
          id: string;
          status: string;
          storage_path: string;
          updated_at: string;
          uploaded_by: string | null;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          document_type: string;
          entity_id: string;
          entity_type: string;
          file_name: string;
          file_size: number;
          file_type: string;
          id?: string;
          status?: string;
          storage_path: string;
          updated_at?: string;
          uploaded_by?: string | null;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          document_type?: string;
          entity_id?: string;
          entity_type?: string;
          file_name?: string;
          file_size?: number;
          file_type?: string;
          id?: string;
          status?: string;
          storage_path?: string;
          updated_at?: string;
          uploaded_by?: string | null;
        };
        Relationships: [];
      };
      investor_group_members: {
        Row: {
          created_at: string;
          group_id: string;
          id: string;
          investor_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          group_id: string;
          id?: string;
          investor_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          group_id?: string;
          id?: string;
          investor_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "investor_group_members_group_id_fkey";
            columns: ["group_id"];
            isOneToOne: false;
            referencedRelation: "investor_groups";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "investor_group_members_investor_id_fkey";
            columns: ["investor_id"];
            isOneToOne: false;
            referencedRelation: "investors";
            referencedColumns: ["investor_id"];
          },
        ];
      };
      investor_groups: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          name: string;
          organization_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name: string;
          organization_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name?: string;
          organization_id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      investors: {
        Row: {
          accredited_investor_status: string | null;
          address: Json | null;
          contact_email: string | null;
          contact_phone: string | null;
          created_at: string;
          entity_name: string | null;
          entity_type: string | null;
          first_name: string | null;
          investor_id: string;
          investor_type: string | null;
          jurisdiction: string | null;
          kyc_expiry_date: string | null;
          kyc_status: string | null;
          last_name: string | null;
          organization_id: string | null;
          project_id: string | null;
          risk_profile: string | null;
          status: string | null;
          tax_id: string | null;
          updated_at: string;
          verification_details: Json | null;
          wallet_address: string | null;
        };
        Insert: {
          accredited_investor_status?: string | null;
          address?: Json | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          created_at?: string;
          entity_name?: string | null;
          entity_type?: string | null;
          first_name?: string | null;
          investor_id?: string;
          investor_type?: string | null;
          jurisdiction?: string | null;
          kyc_expiry_date?: string | null;
          kyc_status?: string | null;
          last_name?: string | null;
          organization_id?: string | null;
          project_id?: string | null;
          risk_profile?: string | null;
          status?: string | null;
          tax_id?: string | null;
          updated_at?: string;
          verification_details?: Json | null;
          wallet_address?: string | null;
        };
        Update: {
          accredited_investor_status?: string | null;
          address?: Json | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          created_at?: string;
          entity_name?: string | null;
          entity_type?: string | null;
          first_name?: string | null;
          investor_id?: string;
          investor_type?: string | null;
          jurisdiction?: string | null;
          kyc_expiry_date?: string | null;
          kyc_status?: string | null;
          last_name?: string | null;
          organization_id?: string | null;
          project_id?: string | null;
          risk_profile?: string | null;
          status?: string | null;
          tax_id?: string | null;
          updated_at?: string;
          verification_details?: Json | null;
          wallet_address?: string | null;
        };
        Relationships: [];
      };
      mfa_settings: {
        Row: {
          created_at: string;
          id: string;
          organization_id: string;
          required_for_roles: string[] | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          organization_id: string;
          required_for_roles?: string[] | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          organization_id?: string;
          required_for_roles?: string[] | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      multi_sig_confirmations: {
        Row: {
          confirmed: boolean;
          created_at: string;
          id: string;
          signature: string | null;
          signer: string;
          timestamp: string;
          transaction_id: string;
        };
        Insert: {
          confirmed?: boolean;
          created_at?: string;
          id?: string;
          signature?: string | null;
          signer: string;
          timestamp?: string;
          transaction_id: string;
        };
        Update: {
          confirmed?: boolean;
          created_at?: string;
          id?: string;
          signature?: string | null;
          signer?: string;
          timestamp?: string;
          transaction_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "multi_sig_confirmations_transaction_id_fkey";
            columns: ["transaction_id"];
            isOneToOne: false;
            referencedRelation: "multi_sig_transactions";
            referencedColumns: ["id"];
          },
        ];
      };
      multi_sig_transactions: {
        Row: {
          chain_id: number | null;
          confirmations: number;
          created_at: string;
          created_by: string | null;
          data: string;
          description: string | null;
          executed: boolean;
          id: string;
          required: number;
          to: string;
          tx_hash: string | null;
          updated_at: string | null;
          value: string;
          wallet_address: string;
        };
        Insert: {
          chain_id?: number | null;
          confirmations?: number;
          created_at?: string;
          created_by?: string | null;
          data: string;
          description?: string | null;
          executed?: boolean;
          id?: string;
          required?: number;
          to: string;
          tx_hash?: string | null;
          updated_at?: string | null;
          value: string;
          wallet_address: string;
        };
        Update: {
          chain_id?: number | null;
          confirmations?: number;
          created_at?: string;
          created_by?: string | null;
          data?: string;
          description?: string | null;
          executed?: boolean;
          id?: string;
          required?: number;
          to?: string;
          tx_hash?: string | null;
          updated_at?: string | null;
          value?: string;
          wallet_address?: string;
        };
        Relationships: [];
      };
      multi_sig_wallets: {
        Row: {
          activated_at: string | null;
          address: string;
          block_reason: string | null;
          blocked_at: string | null;
          chain_id: number | null;
          contract_address: string | null;
          created_at: string;
          created_by: string | null;
          encrypted_private_key: string | null;
          id: string;
          is_default: boolean | null;
          name: string | null;
          owners: string[] | null;
          required_confirmations: number | null;
          signers: string[] | null;
          status: string;
          type: string | null;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          activated_at?: string | null;
          address: string;
          block_reason?: string | null;
          blocked_at?: string | null;
          chain_id?: number | null;
          contract_address?: string | null;
          created_at?: string;
          created_by?: string | null;
          encrypted_private_key?: string | null;
          id?: string;
          is_default?: boolean | null;
          name?: string | null;
          owners?: string[] | null;
          required_confirmations?: number | null;
          signers?: string[] | null;
          status?: string;
          type?: string | null;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          activated_at?: string | null;
          address?: string;
          block_reason?: string | null;
          blocked_at?: string | null;
          chain_id?: number | null;
          contract_address?: string | null;
          created_at?: string;
          created_by?: string | null;
          encrypted_private_key?: string | null;
          id?: string;
          is_default?: boolean | null;
          name?: string | null;
          owners?: string[] | null;
          required_confirmations?: number | null;
          signers?: string[] | null;
          status?: string;
          type?: string | null;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          action: string | null;
          created_at: string;
          entity_id: string | null;
          entity_type: string | null;
          id: string;
          message: string;
          read: boolean;
          recipient_id: string;
          title: string;
          type: string;
        };
        Insert: {
          action?: string | null;
          created_at?: string;
          entity_id?: string | null;
          entity_type?: string | null;
          id?: string;
          message: string;
          read?: boolean;
          recipient_id: string;
          title: string;
          type: string;
        };
        Update: {
          action?: string | null;
          created_at?: string;
          entity_id?: string | null;
          entity_type?: string | null;
          id?: string;
          message?: string;
          read?: boolean;
          recipient_id?: string;
          title?: string;
          type?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          name: string;
          organization_id: string;
          status: string;
          token_symbol: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name: string;
          organization_id: string;
          status?: string;
          token_symbol?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name?: string;
          organization_id?: string;
          status?: string;
          token_symbol?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      redemption_approvals: {
        Row: {
          approved: boolean;
          approver_id: string;
          approver_name: string | null;
          approver_role: string | null;
          comments: string | null;
          created_at: string;
          id: string;
          redemption_id: string;
          signature: string | null;
          updated_at: string;
        };
        Insert: {
          approved: boolean;
          approver_id: string;
          approver_name?: string | null;
          approver_role?: string | null;
          comments?: string | null;
          created_at?: string;
          id?: string;
          redemption_id: string;
          signature?: string | null;
          updated_at?: string;
        };
        Update: {
          approved?: boolean;
          approver_id?: string;
          approver_name?: string | null;
          approver_role?: string | null;
          comments?: string | null;
          created_at?: string;
          id?: string;
          redemption_id?: string;
          signature?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "redemption_approvals_redemption_id_fkey";
            columns: ["redemption_id"];
            isOneToOne: false;
            referencedRelation: "redemption_requests";
            referencedColumns: ["id"];
          },
        ];
      };
      redemption_requests: {
        Row: {
          amount_received: number | null;
          conversion_rate: number;
          created_at: string;
          destination_wallet_address: string;
          id: string;
          investor_id: string | null;
          investor_name: string | null;
          project_id: string | null;
          redemption_date: string | null;
          redemption_type: string;
          request_date: string;
          required_approvals: number;
          source_wallet_address: string;
          status: string;
          token_amount: number;
          token_type: string;
          transaction_hash: string | null;
          updated_at: string;
        };
        Insert: {
          amount_received?: number | null;
          conversion_rate: number;
          created_at?: string;
          destination_wallet_address: string;
          id?: string;
          investor_id?: string | null;
          investor_name?: string | null;
          project_id?: string | null;
          redemption_date?: string | null;
          redemption_type: string;
          request_date?: string;
          required_approvals?: number;
          source_wallet_address: string;
          status?: string;
          token_amount: number;
          token_type: string;
          transaction_hash?: string | null;
          updated_at?: string;
        };
        Update: {
          amount_received?: number | null;
          conversion_rate?: number;
          created_at?: string;
          destination_wallet_address?: string;
          id?: string;
          investor_id?: string | null;
          investor_name?: string | null;
          project_id?: string | null;
          redemption_date?: string | null;
          redemption_type?: string;
          request_date?: string;
          required_approvals?: number;
          source_wallet_address?: string;
          status?: string;
          token_amount?: number;
          token_type?: string;
          transaction_hash?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      stage_requirements: {
        Row: {
          completed_at: string | null;
          created_at: string;
          description: string | null;
          failure_reason: string | null;
          id: string;
          name: string;
          order: number;
          stage_id: string;
          status: string;
          updated_at: string;
        };
        Insert: {
          completed_at?: string | null;
          created_at?: string;
          description?: string | null;
          failure_reason?: string | null;
          id?: string;
          name: string;
          order?: number;
          stage_id: string;
          status?: string;
          updated_at?: string;
        };
        Update: {
          completed_at?: string | null;
          created_at?: string;
          description?: string | null;
          failure_reason?: string | null;
          id?: string;
          name?: string;
          order?: number;
          stage_id?: string;
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "stage_requirements_stage_id_fkey";
            columns: ["stage_id"];
            isOneToOne: false;
            referencedRelation: "workflow_stages";
            referencedColumns: ["id"];
          },
        ];
      };
      subscriptions: {
        Row: {
          amount: number;
          created_at: string;
          currency: string;
          id: string;
          investor_id: string;
          payment_date: string | null;
          payment_method: string | null;
          payment_status: string;
          project_id: string;
          status: string;
          subscription_date: string;
          token_amount: number | null;
          token_price: number | null;
          updated_at: string;
        };
        Insert: {
          amount: number;
          created_at?: string;
          currency: string;
          id?: string;
          investor_id: string;
          payment_date?: string | null;
          payment_method?: string | null;
          payment_status?: string;
          project_id: string;
          status?: string;
          subscription_date?: string;
          token_amount?: number | null;
          token_price?: number | null;
          updated_at?: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          currency?: string;
          id?: string;
          investor_id?: string;
          payment_date?: string | null;
          payment_method?: string | null;
          payment_status?: string;
          project_id?: string;
          status?: string;
          subscription_date?: string;
          token_amount?: number | null;
          token_price?: number | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "subscriptions_investor_id_fkey";
            columns: ["investor_id"];
            isOneToOne: false;
            referencedRelation: "investors";
            referencedColumns: ["investor_id"];
          },
          {
            foreignKeyName: "subscriptions_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      token_allocations: {
        Row: {
          allocation_date: string;
          amount: number;
          created_at: string;
          distributed: boolean;
          distribution_date: string | null;
          distribution_transaction_hash: string | null;
          id: string;
          investor_id: string;
          minting_status: string | null;
          minting_transaction_hash: string | null;
          project_id: string;
          token_id: string | null;
          token_price: number | null;
          token_type: string | null;
          updated_at: string;
          wallet_address: string | null;
        };
        Insert: {
          allocation_date?: string;
          amount: number;
          created_at?: string;
          distributed?: boolean;
          distribution_date?: string | null;
          distribution_transaction_hash?: string | null;
          id?: string;
          investor_id: string;
          minting_status?: string | null;
          minting_transaction_hash?: string | null;
          project_id: string;
          token_id?: string | null;
          token_price?: number | null;
          token_type?: string | null;
          updated_at?: string;
          wallet_address?: string | null;
        };
        Update: {
          allocation_date?: string;
          amount?: number;
          created_at?: string;
          distributed?: boolean;
          distribution_date?: string | null;
          distribution_transaction_hash?: string | null;
          id?: string;
          investor_id?: string;
          minting_status?: string | null;
          minting_transaction_hash?: string | null;
          project_id?: string;
          token_id?: string | null;
          token_price?: number | null;
          token_type?: string | null;
          updated_at?: string;
          wallet_address?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "token_allocations_investor_id_fkey";
            columns: ["investor_id"];
            isOneToOne: false;
            referencedRelation: "investors";
            referencedColumns: ["investor_id"];
          },
          {
            foreignKeyName: "token_allocations_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      token_contracts: {
        Row: {
          abi: Json | null;
          address: string;
          blockchain: string;
          created_at: string;
          deployment_block: number | null;
          deployment_transaction: string | null;
          id: string;
          metadata: Json | null;
          name: string;
          project_id: string;
          standard: string;
          symbol: string;
          updated_at: string;
        };
        Insert: {
          abi?: Json | null;
          address: string;
          blockchain: string;
          created_at?: string;
          deployment_block?: number | null;
          deployment_transaction?: string | null;
          id?: string;
          metadata?: Json | null;
          name: string;
          project_id: string;
          standard: string;
          symbol: string;
          updated_at?: string;
        };
        Update: {
          abi?: Json | null;
          address?: string;
          blockchain?: string;
          created_at?: string;
          deployment_block?: number | null;
          deployment_transaction?: string | null;
          id?: string;
          metadata?: Json | null;
          name?: string;
          project_id?: string;
          standard?: string;
          symbol?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "token_contracts_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      transaction_events: {
        Row: {
          amount: string | null;
          blockchain: string | null;
          created_at: string;
          event_data: Json | null;
          event_type: string;
          id: string;
          status: string;
          token_address: string | null;
          transaction_hash: string | null;
          updated_at: string;
          wallet_address: string | null;
        };
        Insert: {
          amount?: string | null;
          blockchain?: string | null;
          created_at?: string;
          event_data?: Json | null;
          event_type: string;
          id?: string;
          status?: string;
          token_address?: string | null;
          transaction_hash?: string | null;
          updated_at?: string;
          wallet_address?: string | null;
        };
        Update: {
          amount?: string | null;
          blockchain?: string | null;
          created_at?: string;
          event_data?: Json | null;
          event_type?: string;
          id?: string;
          status?: string;
          token_address?: string | null;
          transaction_hash?: string | null;
          updated_at?: string;
          wallet_address?: string | null;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          created_at: string;
          email: string;
          encrypted_private_key: string | null;
          id: string;
          mfa_enabled: boolean | null;
          name: string;
          public_key: string | null;
          role: string;
          status: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          encrypted_private_key?: string | null;
          id?: string;
          mfa_enabled?: boolean | null;
          name: string;
          public_key?: string | null;
          role: string;
          status?: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          encrypted_private_key?: string | null;
          id?: string;
          mfa_enabled?: boolean | null;
          name?: string;
          public_key?: string | null;
          role?: string;
          status?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      wallet_transactions: {
        Row: {
          block_number: number | null;
          chain_id: number;
          created_at: string;
          data: string | null;
          description: string | null;
          from_address: string;
          gas_limit: string | null;
          gas_price: string | null;
          hash: string | null;
          id: string;
          nonce: number | null;
          status: string | null;
          timestamp: string | null;
          to_address: string;
          user_id: string | null;
          value: string;
          wallet_id: string;
        };
        Insert: {
          block_number?: number | null;
          chain_id: number;
          created_at?: string;
          data?: string | null;
          description?: string | null;
          from_address: string;
          gas_limit?: string | null;
          gas_price?: string | null;
          hash?: string | null;
          id?: string;
          nonce?: number | null;
          status?: string | null;
          timestamp?: string | null;
          to_address: string;
          user_id?: string | null;
          value: string;
          wallet_id: string;
        };
        Update: {
          block_number?: number | null;
          chain_id?: number;
          created_at?: string;
          data?: string | null;
          description?: string | null;
          from_address?: string;
          gas_limit?: string | null;
          gas_price?: string | null;
          hash?: string | null;
          id?: string;
          nonce?: number | null;
          status?: string | null;
          timestamp?: string | null;
          to_address?: string;
          user_id?: string | null;
          value?: string;
          wallet_id?: string;
        };
        Relationships: [];
      };
      whitelist_entries: {
        Row: {
          active: boolean;
          added_at: string;
          added_by: string | null;
          address: string;
          id: string;
          label: string | null;
          organization_id: string;
          removed_at: string | null;
        };
        Insert: {
          active?: boolean;
          added_at?: string;
          added_by?: string | null;
          address: string;
          id?: string;
          label?: string | null;
          organization_id: string;
          removed_at?: string | null;
        };
        Update: {
          active?: boolean;
          added_at?: string;
          added_by?: string | null;
          address?: string;
          id?: string;
          label?: string | null;
          organization_id?: string;
          removed_at?: string | null;
        };
        Relationships: [];
      };
      whitelist_settings: {
        Row: {
          address_labels: Json | null;
          addresses: string[] | null;
          created_at: string;
          id: string;
          organization_id: string;
          updated_at: string;
        };
        Insert: {
          address_labels?: Json | null;
          addresses?: string[] | null;
          created_at?: string;
          id?: string;
          organization_id: string;
          updated_at?: string;
        };
        Update: {
          address_labels?: Json | null;
          addresses?: string[] | null;
          created_at?: string;
          id?: string;
          organization_id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      workflow_stages: {
        Row: {
          completion_percentage: number | null;
          created_at: string;
          description: string | null;
          id: string;
          name: string;
          order: number;
          organization_id: string;
          status: string;
          updated_at: string;
        };
        Insert: {
          completion_percentage?: number | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          name: string;
          order?: number;
          organization_id: string;
          status?: string;
          updated_at?: string;
        };
        Update: {
          completion_percentage?: number | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          name?: string;
          order?: number;
          organization_id?: string;
          status?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// Helper types for Supabase
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
