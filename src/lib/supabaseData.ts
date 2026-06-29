/**
 * Funções de leitura de dados — usadas pelo site público.
 * Usa Supabase quando configurado, fallback para dados mock.
 */

import { supabase, isSupabaseConfigured, PropertyRow } from "@/lib/supabase";
import { Property } from "@/types";
import { MOCK_PROPERTIES } from "@/lib/data";

function rowToProperty(row: PropertyRow): Property {
  return {
    id: row.id,
    slug: row.slug,
    code: row.code,
    title: row.title,
    description: row.description,
    price: row.price,
    condoFee: row.condo_fee ?? undefined,
    iptu: row.iptu ?? undefined,
    type: row.type as Property["type"],
    transactionType: row.transaction_type as Property["transactionType"],
    status: row.status as Property["status"],
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    parkingSpots: row.parking_spots,
    area: row.area,
    usefulArea: row.useful_area ?? undefined,
    city: row.city,
    neighborhood: row.neighborhood,
    address: row.address ?? undefined,
    state: row.state,
    lat: row.lat ?? undefined,
    lng: row.lng ?? undefined,
    images: row.images,
    features: row.features,
    isFeatured: row.is_featured,
    isAvailable: row.is_available,
    floor: row.floor ?? undefined,
    totalFloors: row.total_floors ?? undefined,
    yearBuilt: row.year_built ?? undefined,
    sunPosition: row.sun_position ?? undefined,
    finishingLevel: row.finishing_level ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function fetchProperties(): Promise<Property[]> {
  if (!isSupabaseConfigured || !supabase) {
    return MOCK_PROPERTIES;
  }
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Supabase error:", error);
    return MOCK_PROPERTIES;
  }
  return data.map(rowToProperty);
}

export async function fetchAvailableProperties(): Promise<Property[]> {
  if (!isSupabaseConfigured || !supabase) {
    return MOCK_PROPERTIES.filter((p) => p.isAvailable);
  }
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("is_available", true)
    .order("created_at", { ascending: false });

  if (error || !data) return MOCK_PROPERTIES.filter((p) => p.isAvailable);
  return data.map(rowToProperty);
}

export async function fetchFeaturedProperties(): Promise<Property[]> {
  if (!isSupabaseConfigured || !supabase) {
    return MOCK_PROPERTIES.filter((p) => p.isFeatured && p.isAvailable);
  }
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("is_featured", true)
    .eq("is_available", true)
    .order("created_at", { ascending: false });

  if (error || !data) return MOCK_PROPERTIES.filter((p) => p.isFeatured && p.isAvailable);
  return data.map(rowToProperty);
}

export async function fetchPropertyBySlug(slug: string): Promise<Property | null> {
  if (!isSupabaseConfigured || !supabase) {
    return MOCK_PROPERTIES.find((p) => p.slug === slug) ?? null;
  }
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return MOCK_PROPERTIES.find((p) => p.slug === slug) ?? null;
  }
  return rowToProperty(data);
}

export async function fetchSimilarProperties(
  property: Property,
  limit = 3
): Promise<Property[]> {
  if (!isSupabaseConfigured || !supabase) {
    return MOCK_PROPERTIES.filter(
      (p) =>
        p.id !== property.id &&
        p.isAvailable &&
        (p.type === property.type || p.neighborhood === property.neighborhood)
    ).slice(0, limit);
  }
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("is_available", true)
    .neq("id", property.id)
    .or(`type.eq.${property.type},neighborhood.eq.${property.neighborhood}`)
    .limit(limit);

  if (error || !data) return [];
  return data.map(rowToProperty);
}

export async function fetchAllSlugs(): Promise<string[]> {
  if (!isSupabaseConfigured || !supabase) {
    return MOCK_PROPERTIES.map((p) => p.slug);
  }
  const { data } = await supabase
    .from("properties")
    .select("slug")
    .eq("is_available", true);

  if (!data) return MOCK_PROPERTIES.map((p) => p.slug);
  return data.map((r) => r.slug);
}
