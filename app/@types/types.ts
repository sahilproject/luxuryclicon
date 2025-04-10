
export type Product = {
    id: number;
    name: string;
    price: number;
    image_url: string;
    category_id: number;
  };
  
  export type CartItem = Product & {
    quantity?: number;
  };


  export type CartItemType = {
    id: string;          
    name: string;
    price: number;
    image_url: string;
    quantity?: number;
    oldPrice?: number;
  };
  




// src/types/supabase.ts
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];


export type Database = {
  public: {
    Tables: {
      allproducts: {
        Row: {
          id: number;
          name: string;
          price: number;
          description: string;
          image: string;
          admin_id: string;
        };
        Insert: Partial<{
          name: string;
          price: number;
          description: string;
          image: string;
          admin_id: string;
        }>;
        Update: Partial<{
          name: string;
          price: number;
          description: string;
          image: string;
          admin_id: string;
        }>;
      };
      categories: {
        Row: {
          id: number;
          name: string;
          admin_id: string;
        };
        Insert: Partial<{
          name: string;
          admin_id: string;
        }>;
        Update: Partial<{
          name: string;
          admin_id: string;
        }>;
      };
      orders: {
        Row: {
          id: number;
          user_id: string;
          product_id: number;
          quantity: number;
          total_price: number;
          status: string;
          admin_id: string;
        };
        Insert: Partial<{
          user_id: string;
          product_id: number;
          quantity: number;
          total_price: number;
          status: string;
          admin_id: string;
        }>;
        Update: Partial<{
          user_id: string;
          product_id: number;
          quantity: number;
          total_price: number;
          status: string;
          admin_id: string;
        }>;
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
};

  