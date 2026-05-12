/**
 * Types generated from Supabase database schema
 * Replace this file's contents with the output from `supabase gen types typescript`
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          phone_number: string | null
          first_name: string | null
          last_name: string | null
          profile_photo_url: string | null
          role: 'BUYER' | 'SELLER' | 'ADMIN' | 'SUPER_ADMIN'
          business_name: string | null
          id_number: string | null
          seller_status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'INACTIVE'
          kyc_notes: string | null
          approved_at: string | null
          approved_by: string | null
          is_active: boolean
          is_email_verified: boolean
          is_phone_verified: boolean
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id: string
          email: string
          phone_number?: string | null
          first_name?: string | null
          last_name?: string | null
          profile_photo_url?: string | null
          role?: 'BUYER' | 'SELLER' | 'ADMIN' | 'SUPER_ADMIN'
          business_name?: string | null
          id_number?: string | null
          seller_status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'INACTIVE'
          kyc_notes?: string | null
          approved_at?: string | null
          approved_by?: string | null
          is_active?: boolean
          is_email_verified?: boolean
          is_phone_verified?: boolean
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          email?: string
          phone_number?: string | null
          first_name?: string | null
          last_name?: string | null
          profile_photo_url?: string | null
          role?: 'BUYER' | 'SELLER' | 'ADMIN' | 'SUPER_ADMIN'
          is_active?: boolean
          is_email_verified?: boolean
          is_phone_verified?: boolean
          updated_at?: string
          deleted_at?: string | null
        }
      }
      products: {
        Row: {
          id: string
          seller_id: string
          category_id: string | null
          title: string
          slug: string
          description: string | null
          price: number
          negotiable: boolean
          condition: 'NEW' | 'LIKE_NEW' | 'GOOD' | 'FAIR' | 'POOR'
          quantity_available: number
          is_available: boolean
          location_id: string | null
          view_count: number
          favorite_count: number
          status: string
          original_price: number | null
          features: Json
          specifications: Json
          delivery_options: Json
          payment_methods: Json
          tags: Json
          warranty: string | null
          brand: string | null
          model: string | null
          year_purchased: string | null
          reason_for_selling: string | null
          free_shipping: boolean
          availability: 'AVAILABLE' | 'SOLD' | 'RESERVED'
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          seller_id: string
          category_id?: string | null
          title: string
          slug: string
          description?: string | null
          price: number
          negotiable?: boolean
          condition: 'NEW' | 'LIKE_NEW' | 'GOOD' | 'FAIR' | 'POOR'
          quantity_available?: number
          is_available?: boolean
          location_id?: string | null
          view_count?: number
          favorite_count?: number
          status?: string
          original_price?: number | null
          features?: Json
          specifications?: Json
          delivery_options?: Json
          payment_methods?: Json
          tags?: Json
          warranty?: string | null
          brand?: string | null
          model?: string | null
          year_purchased?: string | null
          reason_for_selling?: string | null
          free_shipping?: boolean
          availability?: 'AVAILABLE' | 'SOLD' | 'RESERVED'
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          category_id?: string | null
          title?: string
          slug?: string
          description?: string | null
          price?: number
          negotiable?: boolean
          condition?: 'NEW' | 'LIKE_NEW' | 'GOOD' | 'FAIR' | 'POOR'
          quantity_available?: number
          is_available?: boolean
          location_id?: string | null
          view_count?: number
          favorite_count?: number
          status?: string
          original_price?: number | null
          features?: Json
          specifications?: Json
          delivery_options?: Json
          payment_methods?: Json
          tags?: Json
          warranty?: string | null
          brand?: string | null
          model?: string | null
          year_purchased?: string | null
          reason_for_selling?: string | null
          free_shipping?: boolean
          availability?: 'AVAILABLE' | 'SOLD' | 'RESERVED'
          updated_at?: string
          deleted_at?: string | null
        }
      }
      orders: {
        Row: {
          id: string
          buyer_id: string | null
          seller_id: string | null
          product_id: string | null
          order_number: string
          quantity: number
          subtotal_amount: number
          commission_amount: number
          total_amount: number
          escrow_amount: number
          seller_receivable: number
          status: 'PENDING_PAYMENT' | 'PAYMENT_SUCCESS' | 'HELD_IN_ESCROW' | 'PROCESSING_DELIVERY' | 'DELIVERED' | 'PAYOUT_PENDING' | 'PAYOUT_SENT' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'REVERSED' | 'DISPUTED'
          delivery_code: string | null
          delivery_code_expires_at: string | null
          is_delivery_confirmed: boolean
          confirmed_at: string | null
          completed_at: string | null
          cancelled_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          buyer_id?: string | null
          seller_id?: string | null
          product_id?: string | null
          order_number: string
          quantity?: number
          subtotal_amount: number
          commission_amount: number
          total_amount: number
          escrow_amount: number
          seller_receivable: number
          status?: 'PENDING_PAYMENT' | 'PAYMENT_SUCCESS' | 'HELD_IN_ESCROW' | 'PROCESSING_DELIVERY' | 'DELIVERED' | 'PAYOUT_PENDING' | 'PAYOUT_SENT' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'REVERSED' | 'DISPUTED'
          delivery_code?: string | null
          delivery_code_expires_at?: string | null
          is_delivery_confirmed?: boolean
          confirmed_at?: string | null
          completed_at?: string | null
          cancelled_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          status?: 'PENDING_PAYMENT' | 'PAYMENT_SUCCESS' | 'HELD_IN_ESCROW' | 'PROCESSING_DELIVERY' | 'DELIVERED' | 'PAYOUT_PENDING' | 'PAYOUT_SENT' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'REVERSED' | 'DISPUTED'
          delivery_code?: string | null
          delivery_code_expires_at?: string | null
          is_delivery_confirmed?: boolean
          confirmed_at?: string | null
          completed_at?: string | null
          cancelled_at?: string | null
          updated_at?: string
        }
      }
      payment_transactions: {
        Row: {
          id: string
          order_id: string | null
          merchant_request_id: string | null
          checkout_request_id: string | null
          mpesa_receipt_number: string | null
          payer_phone: string | null
          amount: number
          status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REVERSED' | 'TIMEOUT'
          callback_payload: Json | null
          callback_received_at: string | null
          raw_callback: Json | null
          result_code: string | null
          result_description: string | null
          transaction_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id?: string | null
          merchant_request_id?: string | null
          checkout_request_id?: string | null
          mpesa_receipt_number?: string | null
          payer_phone?: string | null
          amount: number
          status?: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REVERSED' | 'TIMEOUT'
          callback_payload?: Json | null
          callback_received_at?: string | null
          raw_callback?: Json | null
          result_code?: string | null
          result_description?: string | null
          transaction_date?: string | null
          created_at?: string
        }
        Update: {
          mpesa_receipt_number?: string | null
          status?: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REVERSED' | 'TIMEOUT'
          callback_payload?: Json | null
          callback_received_at?: string | null
          raw_callback?: Json | null
          result_code?: string | null
          result_description?: string | null
          transaction_date?: string | null
        }
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          image_url: string
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          image_url: string
          display_order?: number
          created_at?: string
        }
        Update: {
          image_url?: string
          display_order?: number
        }
      }
      escrow_transactions: {
        Row: {
          id: string
          order_id: string | null
          held_amount: number
          escrow_status: string
          held_at: string
          released_at: string | null
          reversed_at: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          order_id?: string | null
          held_amount: number
          escrow_status?: string
          held_at?: string
          released_at?: string | null
          reversed_at?: string | null
          notes?: string | null
        }
        Update: {
          escrow_status?: string
          released_at?: string | null
          reversed_at?: string | null
          notes?: string | null
        }
      }
      payouts: {
        Row: {
          id: string
          seller_id: string
          order_id: string | null
          amount: number
          status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
          mpesa_payout_id: string | null
          processed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          seller_id: string
          order_id?: string | null
          amount: number
          status?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
          mpesa_payout_id?: string | null
          processed_at?: string | null
          created_at?: string
        }
        Update: {
          status?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
          mpesa_payout_id?: string | null
          processed_at?: string | null
        }
      }
      categories: {
        Row: {
          id: string
          parent_id: string | null
          name: string
          slug: string
          icon: string | null
          created_at: string
        }
        Insert: {
          id?: string
          parent_id?: string | null
          name: string
          slug: string
          icon?: string | null
          created_at?: string
        }
        Update: {
          parent_id?: string | null
          name?: string
          slug?: string
          icon?: string | null
        }
      }
      locations: {
        Row: {
          id: string
          county: string | null
          city: string | null
          institution_name: string | null
          latitude: number | null
          longitude: number | null
          formatted_address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          county?: string | null
          city?: string | null
          institution_name?: string | null
          latitude?: number | null
          longitude?: number | null
          formatted_address?: string | null
          created_at?: string
        }
        Update: {
          county?: string | null
          city?: string | null
          institution_name?: string | null
          latitude?: number | null
          longitude?: number | null
          formatted_address?: string | null
        }
      }
      // Views
    }
    Views: {
      view_admin_financial_metrics: {
        Row: {
          total_transactions: number
          total_gmv_completed: number
          total_commission_earned: number
          total_currently_in_escrow: number
          gmv_this_month: number
        }
      }
      view_seller_performance: {
        Row: {
          seller_id: string
          total_products_listed: number
          total_product_views: number
          total_completed_sales: number
          total_revenue_earned: number
          pending_revenue_in_escrow: number
        }
      }
      view_platform_activity: {
        Row: {
          metric_date: string
          new_users_today: number
          new_orders_today: number
          active_disputes: number
          pending_kyc_verifications: number
        }
      }
    }
  }
}
