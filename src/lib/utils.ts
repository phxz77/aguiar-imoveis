import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Property, PropertyFilters } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatArea(area: number): string {
  return `${area} m²`;
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function generateCode(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `EA${timestamp}${random}`;
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function filterProperties(
  properties: Property[],
  filters: PropertyFilters
): Property[] {
  return properties.filter((property) => {
    if (filters.search) {
      const search = filters.search.toLowerCase();
      const searchable = `${property.title} ${property.description} ${property.neighborhood} ${property.city} ${property.code}`.toLowerCase();
      if (!searchable.includes(search)) return false;
    }

    if (filters.type && property.type !== filters.type) return false;

    if (
      filters.transactionType &&
      property.transactionType !== filters.transactionType &&
      property.transactionType !== "ambos"
    )
      return false;

    if (filters.city && property.city !== filters.city) return false;

    if (
      filters.neighborhood &&
      !property.neighborhood
        .toLowerCase()
        .includes(filters.neighborhood.toLowerCase())
    )
      return false;

    if (filters.minPrice && property.price < filters.minPrice) return false;
    if (filters.maxPrice && property.price > filters.maxPrice) return false;

    if (filters.bedrooms && property.bedrooms < Number(filters.bedrooms))
      return false;

    if (filters.bathrooms && property.bathrooms < Number(filters.bathrooms))
      return false;

    if (
      filters.parkingSpots !== undefined &&
      filters.parkingSpots !== "" &&
      property.parkingSpots < Number(filters.parkingSpots)
    )
      return false;

    if (filters.minArea && property.area < filters.minArea) return false;
    if (filters.maxArea && property.area > filters.maxArea) return false;

    if (filters.status && property.status !== filters.status) return false;

    if (filters.isFeatured && !property.isFeatured) return false;

    return true;
  });
}

export function buildWhatsAppUrl(message: string, phone: string): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encodedMessage}`;
}

export function getPropertyTypeLabel(type: string): string {
  const types: Record<string, string> = {
    apartamento: "Apartamento",
    casa: "Casa",
    terreno: "Terreno",
    comercial: "Comercial",
    cobertura: "Cobertura",
    studio: "Studio",
    kitnet: "Kitnet",
    sobrado: "Sobrado",
    chacara: "Chácara",
    flat: "Flat",
  };
  return types[type] || type;
}

export function getStatusLabel(status: string): string {
  const statuses: Record<string, string> = {
    disponivel: "Disponível",
    vendido: "Vendido",
    alugado: "Alugado",
    reservado: "Reservado",
  };
  return statuses[status] || status;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Hoje";
  if (diffInDays === 1) return "Ontem";
  if (diffInDays < 7) return `${diffInDays} dias atrás`;
  if (diffInDays < 30)
    return `${Math.floor(diffInDays / 7)} semana${Math.floor(diffInDays / 7) > 1 ? "s" : ""} atrás`;
  if (diffInDays < 365)
    return `${Math.floor(diffInDays / 30)} mês${Math.floor(diffInDays / 30) > 1 ? "es" : ""} atrás`;
  return `${Math.floor(diffInDays / 365)} ano${Math.floor(diffInDays / 365) > 1 ? "s" : ""} atrás`;
}
