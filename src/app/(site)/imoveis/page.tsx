"use client";

import React, { useState, useCallback, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Building2, Grid3X3, List, SortDesc } from "lucide-react";
import { PropertyCard } from "@/components/imoveis/PropertyCard";
import { PropertyFilters } from "@/components/imoveis/PropertyFilters";
import { fetchAvailableProperties } from "@/lib/supabaseData";
import { filterProperties } from "@/lib/utils";
import { PropertyFilters as Filters, Property } from "@/types";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { value: "recent", label: "Mais recentes" },
  { value: "price_asc", label: "Menor preço" },
  { value: "price_desc", label: "Maior preço" },
  { value: "area_desc", label: "Maior área" },
  { value: "featured", label: "Destaques" },
];

function sortProperties(properties: Property[], sort: string): Property[] {
  switch (sort) {
    case "price_asc":  return [...properties].sort((a, b) => a.price - b.price);
    case "price_desc": return [...properties].sort((a, b) => b.price - a.price);
    case "area_desc":  return [...properties].sort((a, b) => b.area - a.area);
    case "featured":   return [...properties].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    default:           return [...properties].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

function ImoveisContent() {
  const searchParams = useSearchParams();
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({});
  const [sort, setSort] = useState("recent");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    fetchAvailableProperties().then((data) => {
      setAllProperties(data);
      setLoading(false);
    });
  }, []);

  const handleFiltersChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
  }, []);

  const filtered = filterProperties(allProperties, filters);
  const sorted = sortProperties(filtered, sort);

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {/* Header */}
      <div className="bg-white border-b border-[#e2e6ed]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 pt-24">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[#0B2344]/45 text-sm mb-2">
                <a href="/" className="hover:text-[#0B2344] transition-colors">Início</a>
                <span>/</span>
                <span className="text-[#0B2344] font-medium">Imóveis</span>
              </div>
              <h1 className="font-display font-extrabold text-[#0B2344] text-3xl sm:text-4xl">
                Imóveis disponíveis
              </h1>
              {!loading && (
                <p className="text-[#0B2344]/45 mt-1 text-sm">
                  {sorted.length} imóvel{sorted.length !== 1 ? "is" : ""} encontrado{sorted.length !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6 lg:gap-8">
          <Suspense fallback={null}>
            <PropertyFilters
              onFiltersChange={handleFiltersChange}
              totalResults={sorted.length}
            />
          </Suspense>

          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-3 mb-6">
              <span className="text-[#0B2344]/45 text-sm hidden lg:inline">
                {sorted.length} imóvel{sorted.length !== 1 ? "is" : ""} encontrado{sorted.length !== 1 ? "s" : ""}
              </span>
              <div className="flex items-center gap-2 ml-auto">
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="appearance-none bg-white border border-[#e2e6ed] rounded-xl pl-3 pr-8 py-2 text-sm text-[#0B2344] focus:outline-none focus:ring-2 focus:ring-[#C79A3B]/30 cursor-pointer"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <SortDesc className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0B2344]/40" />
                </div>

                <div className="flex bg-white border border-[#e2e6ed] rounded-xl overflow-hidden">
                  {[
                    { mode: "grid", icon: <Grid3X3 className="h-4 w-4" /> },
                    { mode: "list", icon: <List className="h-4 w-4" /> },
                  ].map((v) => (
                    <button
                      key={v.mode}
                      onClick={() => setViewMode(v.mode as "grid" | "list")}
                      className={cn(
                        "p-2 transition-colors",
                        viewMode === v.mode
                          ? "bg-[#0B2344] text-white"
                          : "text-[#0B2344]/40 hover:text-[#0B2344]"
                      )}
                    >
                      {v.icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Loading skeleton */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden bg-white border border-[#e2e6ed]">
                    <div className="h-52 skeleton" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 w-2/3 skeleton rounded" />
                      <div className="h-5 w-full skeleton rounded" />
                      <div className="h-3 w-1/2 skeleton rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : sorted.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <div className="h-16 w-16 rounded-2xl bg-[#0B2344]/6 flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-8 w-8 text-[#0B2344]/30" />
                </div>
                <h3 className="font-display font-bold text-[#0B2344] text-lg mb-2">
                  Nenhum imóvel encontrado
                </h3>
                <p className="text-[#0B2344]/45 text-sm max-w-sm mx-auto">
                  Tente ajustar os filtros ou entre em contato com Ediel Aguiar.
                </p>
                <a
                  href={`https://wa.me/5511975838666?text=${encodeURIComponent("Olá, Ediel! Não encontrei o imóvel que procuro. Pode me ajudar?")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-5 bg-[#25D366] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#20BD5A] transition-colors"
                >
                  Falar com Ediel
                </a>
              </motion.div>
            ) : (
              <div className={cn(
                "grid gap-4 sm:gap-5",
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                  : "grid-cols-1"
              )}>
                {sorted.map((property, i) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    index={i}
                    variant={viewMode === "list" ? "list" : "default"}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ImoveisPage() {
  return (
    <Suspense>
      <ImoveisContent />
    </Suspense>
  );
}
