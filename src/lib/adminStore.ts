import { Property } from "@/types";
import { MOCK_PROPERTIES } from "@/lib/data";
import { generateId, slugify } from "@/lib/utils";

const STORAGE_KEY = "ediel_admin_properties";

function loadProperties(): Property[] {
  if (typeof window === "undefined") return MOCK_PROPERTIES;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_PROPERTIES));
    return MOCK_PROPERTIES;
  } catch {
    return MOCK_PROPERTIES;
  }
}

function saveProperties(properties: Property[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
}

export function getAdminProperties(): Property[] {
  return loadProperties();
}

export function createProperty(
  data: Omit<Property, "id" | "slug" | "createdAt" | "updatedAt">
): Property {
  const properties = loadProperties();
  const now = new Date().toISOString();
  const property: Property = {
    ...data,
    id: generateId(),
    slug: `${slugify(data.title)}-${slugify(data.neighborhood)}`,
    createdAt: now,
    updatedAt: now,
  };
  properties.unshift(property);
  saveProperties(properties);
  return property;
}

export function updateProperty(
  id: string,
  data: Partial<Property>
): Property | null {
  const properties = loadProperties();
  const index = properties.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const updated: Property = {
    ...properties[index],
    ...data,
    id,
    slug: data.title
      ? `${slugify(data.title)}-${slugify(data.neighborhood || properties[index].neighborhood)}`
      : properties[index].slug,
    updatedAt: new Date().toISOString(),
  };
  properties[index] = updated;
  saveProperties(properties);
  return updated;
}

export function deleteProperty(id: string): boolean {
  const properties = loadProperties();
  const filtered = properties.filter((p) => p.id !== id);
  if (filtered.length === properties.length) return false;
  saveProperties(filtered);
  return true;
}

export function duplicateProperty(id: string): Property | null {
  const properties = loadProperties();
  const original = properties.find((p) => p.id === id);
  if (!original) return null;

  const now = new Date().toISOString();
  const duplicate: Property = {
    ...original,
    id: generateId(),
    code: `${original.code}-COPY`,
    title: `${original.title} (Cópia)`,
    slug: `${original.slug}-copia`,
    status: "disponivel",
    isFeatured: false,
    createdAt: now,
    updatedAt: now,
  };
  properties.unshift(duplicate);
  saveProperties(properties);
  return duplicate;
}

export function archiveProperty(id: string): Property | null {
  return updateProperty(id, { isAvailable: false, status: "vendido" });
}

export function getAdminStats() {
  const properties = loadProperties();
  return {
    total: properties.length,
    available: properties.filter((p) => p.status === "disponivel").length,
    sold: properties.filter((p) => p.status === "vendido").length,
    rented: properties.filter((p) => p.status === "alugado").length,
    featured: properties.filter((p) => p.isFeatured).length,
    recent: properties.slice(0, 5),
  };
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("admin_auth") === "authenticated";
}

export function getAdminUser() {
  if (typeof window === "undefined") return null;
  try {
    const user = localStorage.getItem("admin_user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

export function logout(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("admin_auth");
  localStorage.removeItem("admin_user");
}
