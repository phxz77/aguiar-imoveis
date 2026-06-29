/**
 * Funções CRUD do painel administrativo — usa Supabase.
 * Fallback para localStorage quando Supabase não estiver configurado.
 */

import { supabase, isSupabaseConfigured, PropertyRow } from "@/lib/supabase";
import { Property } from "@/types";
import {
  getAdminProperties as getLocalProperties,
  createProperty as createLocalProperty,
  updateProperty as updateLocalProperty,
  deleteProperty as deleteLocalProperty,
  duplicateProperty as duplicateLocalProperty,
  archiveProperty as archiveLocalProperty,
  getAdminStats as getLocalStats,
} from "@/lib/adminStore";
import { slugify, generateCode, generateId } from "@/lib/utils";

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

function propertyToInsert(
  data: Omit<Property, "id" | "slug" | "createdAt" | "updatedAt">,
  slug: string
) {
  return {
    slug,
    code: data.code,
    title: data.title,
    description: data.description,
    price: data.price,
    condo_fee: data.condoFee ?? null,
    iptu: data.iptu ?? null,
    type: data.type,
    transaction_type: data.transactionType,
    status: data.status,
    bedrooms: data.bedrooms,
    bathrooms: data.bathrooms,
    parking_spots: data.parkingSpots,
    area: data.area,
    useful_area: data.usefulArea ?? null,
    city: data.city,
    neighborhood: data.neighborhood,
    address: data.address ?? null,
    state: data.state,
    lat: data.lat ?? null,
    lng: data.lng ?? null,
    images: data.images,
    features: data.features,
    is_featured: data.isFeatured,
    is_available: data.isAvailable,
    floor: data.floor ?? null,
    total_floors: data.totalFloors ?? null,
    year_built: data.yearBuilt ?? null,
    sun_position: data.sunPosition ?? null,
    finishing_level: data.finishingLevel ?? null,
  };
}

// ── Read ────────────────────────────────────────────────────────

export async function adminGetProperties(): Promise<Property[]> {
  if (!isSupabaseConfigured || !supabase) {
    return getLocalProperties();
  }
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return getLocalProperties();
  return data.map(rowToProperty);
}

export async function adminGetPropertyById(id: string): Promise<Property | null> {
  if (!isSupabaseConfigured || !supabase) {
    return getLocalProperties().find((p) => p.id === id) ?? null;
  }
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return rowToProperty(data);
}

export async function adminGetStats() {
  if (!isSupabaseConfigured || !supabase) {
    return getLocalStats();
  }
  const { data } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  const all = data?.map(rowToProperty) ?? [];
  return {
    total: all.length,
    available: all.filter((p) => p.status === "disponivel").length,
    sold: all.filter((p) => p.status === "vendido").length,
    rented: all.filter((p) => p.status === "alugado").length,
    featured: all.filter((p) => p.isFeatured).length,
    recent: all.slice(0, 5),
  };
}

// ── Create ──────────────────────────────────────────────────────

export async function adminCreateProperty(
  data: Omit<Property, "id" | "slug" | "createdAt" | "updatedAt">
): Promise<Property | null> {
  const slug = `${slugify(data.title)}-${slugify(data.neighborhood)}`;

  if (!isSupabaseConfigured || !supabase) {
    return createLocalProperty(data);
  }

  const insert = propertyToInsert(data, slug);
  const { data: row, error } = await supabase
    .from("properties")
    .insert(insert)
    .select()
    .single();

  if (error || !row) {
    console.error("Create error:", error);
    return null;
  }
  return rowToProperty(row);
}

// ── Update ──────────────────────────────────────────────────────

export async function adminUpdateProperty(
  id: string,
  data: Partial<Omit<Property, "id" | "createdAt" | "updatedAt">>
): Promise<Property | null> {
  if (!isSupabaseConfigured || !supabase) {
    return updateLocalProperty(id, data);
  }

  const update: Record<string, unknown> = {};
  if (data.title !== undefined) update.title = data.title;
  if (data.description !== undefined) update.description = data.description;
  if (data.price !== undefined) update.price = data.price;
  if (data.condoFee !== undefined) update.condo_fee = data.condoFee;
  if (data.iptu !== undefined) update.iptu = data.iptu;
  if (data.type !== undefined) update.type = data.type;
  if (data.transactionType !== undefined) update.transaction_type = data.transactionType;
  if (data.status !== undefined) update.status = data.status;
  if (data.bedrooms !== undefined) update.bedrooms = data.bedrooms;
  if (data.bathrooms !== undefined) update.bathrooms = data.bathrooms;
  if (data.parkingSpots !== undefined) update.parking_spots = data.parkingSpots;
  if (data.area !== undefined) update.area = data.area;
  if (data.usefulArea !== undefined) update.useful_area = data.usefulArea;
  if (data.city !== undefined) update.city = data.city;
  if (data.neighborhood !== undefined) update.neighborhood = data.neighborhood;
  if (data.address !== undefined) update.address = data.address;
  if (data.state !== undefined) update.state = data.state;
  if (data.images !== undefined) update.images = data.images;
  if (data.features !== undefined) update.features = data.features;
  if (data.isFeatured !== undefined) update.is_featured = data.isFeatured;
  if (data.isAvailable !== undefined) update.is_available = data.isAvailable;
  if (data.floor !== undefined) update.floor = data.floor;
  if (data.totalFloors !== undefined) update.total_floors = data.totalFloors;
  if (data.yearBuilt !== undefined) update.year_built = data.yearBuilt;
  if (data.sunPosition !== undefined) update.sun_position = data.sunPosition;
  if (data.finishingLevel !== undefined) update.finishing_level = data.finishingLevel;
  if (data.code !== undefined) update.code = data.code;

  if (data.title && data.neighborhood) {
    update.slug = `${slugify(data.title)}-${slugify(data.neighborhood)}`;
  }

  const { data: row, error } = await supabase
    .from("properties")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error || !row) {
    console.error("Update error:", error);
    return null;
  }
  return rowToProperty(row);
}

// ── Delete ──────────────────────────────────────────────────────

export async function adminDeleteProperty(id: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) {
    return deleteLocalProperty(id);
  }
  const { error } = await supabase.from("properties").delete().eq("id", id);
  return !error;
}

// ── Duplicate ───────────────────────────────────────────────────

export async function adminDuplicateProperty(id: string): Promise<Property | null> {
  if (!isSupabaseConfigured || !supabase) {
    return duplicateLocalProperty(id);
  }

  const original = await adminGetPropertyById(id);
  if (!original) return null;

  const newCode = `${original.code}-C${Date.now().toString(36).toUpperCase()}`;
  const newTitle = `${original.title} (Cópia)`;
  const newSlug = `${slugify(newTitle)}-${slugify(original.neighborhood)}`;

  const insert = propertyToInsert(
    { ...original, code: newCode, title: newTitle, isFeatured: false, status: "disponivel" },
    newSlug
  );

  const { data: row, error } = await supabase
    .from("properties")
    .insert(insert)
    .select()
    .single();

  if (error || !row) return null;
  return rowToProperty(row);
}

// ── Archive ─────────────────────────────────────────────────────

export async function adminArchiveProperty(id: string): Promise<Property | null> {
  if (!isSupabaseConfigured || !supabase) {
    return archiveLocalProperty(id);
  }
  return adminUpdateProperty(id, { isAvailable: false, status: "vendido" });
}
