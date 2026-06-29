import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured =
  typeof supabaseUrl === "string" &&
  supabaseUrl.startsWith("https://") &&
  typeof supabaseAnonKey === "string" &&
  supabaseAnonKey.length > 0;

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

export type Database = {
  public: {
    Tables: {
      properties: {
        Row: PropertyRow;
        Insert: PropertyInsert;
        Update: Partial<PropertyInsert>;
      };
    };
  };
};

export interface PropertyRow {
  id: string;
  slug: string;
  code: string;
  title: string;
  description: string;
  price: number;
  condo_fee: number | null;
  iptu: number | null;
  type: string;
  transaction_type: string;
  status: string;
  bedrooms: number;
  bathrooms: number;
  parking_spots: number;
  area: number;
  useful_area: number | null;
  city: string;
  neighborhood: string;
  address: string | null;
  state: string;
  lat: number | null;
  lng: number | null;
  images: string[];
  features: string[];
  is_featured: boolean;
  is_available: boolean;
  floor: number | null;
  total_floors: number | null;
  year_built: number | null;
  sun_position: string | null;
  finishing_level: string | null;
  created_at: string;
  updated_at: string;
}

export type PropertyInsert = Omit<PropertyRow, "id" | "created_at" | "updated_at">;
