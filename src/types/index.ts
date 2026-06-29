export type PropertyType =
  | "apartamento"
  | "casa"
  | "terreno"
  | "comercial"
  | "cobertura"
  | "studio"
  | "kitnet"
  | "sobrado"
  | "chacara"
  | "flat";

export type PropertyStatus = "disponivel" | "vendido" | "alugado" | "reservado";

export type TransactionType = "venda" | "aluguel" | "ambos";

export interface Property {
  id: string;
  slug: string;
  code: string;
  title: string;
  description: string;
  price: number;
  condoFee?: number;
  iptu?: number;
  type: PropertyType;
  transactionType: TransactionType;
  status: PropertyStatus;
  bedrooms: number;
  bathrooms: number;
  parkingSpots: number;
  area: number;
  usefulArea?: number;
  city: string;
  neighborhood: string;
  address?: string;
  zipCode?: string;
  state: string;
  lat?: number;
  lng?: number;
  images: string[];
  features: string[];
  isFeatured: boolean;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  floor?: number;
  totalFloors?: number;
  yearBuilt?: number;
  sunPosition?: string;
  finishingLevel?: string;
}

export interface PropertyFilters {
  search?: string;
  type?: PropertyType | "";
  transactionType?: TransactionType | "";
  city?: string;
  neighborhood?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number | "";
  bathrooms?: number | "";
  parkingSpots?: number | "";
  minArea?: number;
  maxArea?: number;
  status?: PropertyStatus | "";
  isFeatured?: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor";
}

export interface DashboardStats {
  totalProperties: number;
  availableProperties: number;
  soldProperties: number;
  rentedProperties: number;
  featuredProperties: number;
  recentProperties: Property[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar?: string;
  date: string;
}

export interface Region {
  id: string;
  name: string;
  city: string;
  propertyCount: number;
  image: string;
}

export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  message: string;
  propertyCode?: string;
  interest?: "compra" | "aluguel" | "venda" | "outros";
}
