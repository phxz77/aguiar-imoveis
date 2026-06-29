"use client";

import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useTransition,
  Suspense,
} from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Grid3X3, List, SortDesc, Loader2 } from "lucide-react";
import { PropertyCard } from "@/components/imoveis/PropertyCard";
import { PropertyFilters } from "@/components/imoveis/PropertyFilters";
import { fetchAvailableProperties } from "@/lib/supabaseData";
import { filterProperties } from "@/lib/utils";
import { PropertyFilters as Filters, Property } from "@/types";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { value: "recent",     label: "Mais recentes" },
  { value: "price_asc",  label: "Menor preço" },
  { value: "price_desc", label: "Maior preço" },
  { value: "area_desc",  label: "Maior área" },
  { value: "featured",   label: "Destaques" },
];

function sortProperties(list: Property[], sort: string): Property[] {
  const arr = [...list];
  switch (sort) {
    case "price_asc":  return arr.sort((a, b) => a.price - b.price);
    case "price_desc": return arr.sort((a, b) => b.price - a.price);
    case "area_desc":  return arr.sort((a, b) => b.area - a.area);
    case "featured":   return arr.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
    default:           return arr.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

function ImoveisContent() {
  useSearchParams(); // manter tracking de params sem causar re-fetch

  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({});
  const [sort, setSort] = useState("recent");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isPending, startTransition] = useTransition();

  // Busca uma única vez — filtragem é sempre client-side
  useEffect(() => {
    fetchAvailableProperties().then((data) => {
      setAllProperties(data);
      setInitialLoading(false);
    });
  }, []);

  // useMemo: filtragem e ordenação são instantâneas (sem Supabase)
  const results = useMemo(
    () => sortProperties(filterProperties(allProperties, filters), sort),
    [allProperties, filters, sort]
  );

  const handleFiltersChange = useCallback((newFilters: Filters) => {
    startTransition(() => setFilters(newFilters));
  }, []);

  const handleSort = (value: string) => {
    startTransition(() => setSort(value));
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {/* Header */}
      <div className="bg-white border-b border-[#e2e6ed]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 pt-24">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 text-[#0B2344]/40 text-sm mb-2">
                <a href="/" className="hover:text-[#0B2344] transition-colors">Início</a>
                <span>/</span>
                <span className="text-[#0B2344] font-medium">Imóveis</span>
              </div>
              <h1 className="font-display font-extrabold text-[#0B2344] text-3xl sm:text-4xl">
                Imóveis disponíveis
              </h1>
              {!initialLoading && (
                <p className="text-[#0B2344]/40 mt-1 text-sm flex items-center gap-1.5">
                  {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin text-[#C79A3B]" />}
                  {results.length} imóvel{results.length !== 1 ? "is" : ""} encontrado{results.length !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6 lg:gap-8">

          {/* Filtros — não causam mais re-fetch */}
          <Suspense fallback={null}>
            <PropertyFilters
              onFiltersChange={handleFiltersChange}
              totalResults={results.length}
            />
          </Suspense>

          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-3 mb-6">
              <span className="text-[#0B2344]/40 text-sm hidden lg:inline">
                {results.length} imóvel{results.length !== 1 ? "is" : ""} encontrado{results.length !== 1 ? "s" : ""}
              </span>

              <div className="flex items-center gap-2 ml-auto">
                {/* Sort */}
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => handleSort(e.target.value)}
                    className="appearance-none bg-white border border-[#e2e6ed] rounded-xl pl-3 pr-8 py-2 text-sm text-[#0B2344] focus:outline-none focus:ring-2 focus:ring-[#C79A3B]/30 cursor-pointer"
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  <SortDesc className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0B2344]/40" />
                </div>

                {/* View mode */}
                <div className="flex bg-white border border-[#e2e6ed] rounded-xl overflow-hidden">
                  {([
                    { mode: "grid", icon: <Grid3X3 className="h-4 w-4" /> },
                    { mode: "list", icon: <List className="h-4 w-4" /> },
                  ] as const).map((v) => (
                    <button
                      key={v.mode}
                      onClick={() => setViewMode(v.mode)}
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

            {/* Skeleton de carregamento inicial (apenas na primeira vez) */}
            {initialLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden bg-white border border-[#e2e6ed]">
                    <div className="h-52 skeleton" />
                    <div className="p-4 space-y-3">
                      <div className="h-3 w-1/3 skeleton rounded" />
                      <div className="h-5 w-full skeleton rounded" />
                      <div className="h-3 w-1/2 skeleton rounded" />
                      <div className="h-8 skeleton rounded-xl mt-4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : results.length === 0 ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-24"
                >
                  <div className="h-16 w-16 rounded-2xl bg-[#0B2344]/5 flex items-center justify-center mx-auto mb-4">
                    <Building2 className="h-8 w-8 text-[#0B2344]/25" />
                  </div>
                  <h3 className="font-display font-bold text-[#0B2344] text-lg mb-2">
                    Nenhum imóvel encontrado
                  </h3>
                  <p className="text-[#0B2344]/40 text-sm max-w-sm mx-auto">
                    Tente ajustar os filtros ou fale com Ediel Aguiar.
                  </p>
                  <a
                    href={`https://wa.me/5511975838666?text=${encodeURIComponent("Olá, Ediel! Não encontrei o imóvel que procuro. Pode me ajudar?")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-5 bg-[#25D366] text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#20BD5A] transition-colors"
                  >
                    Falar com Ediel
                  </a>
                </motion.div>
              </AnimatePresence>
            ) : (
              <motion.div
                layout
                className={cn(
                  "grid gap-4 sm:gap-5",
                  isPending && "opacity-70 transition-opacity duration-150",
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                    : "grid-cols-1"
                )}
              >
                <AnimatePresence mode="popLayout">
                  {results.map((property, i) => (
                    <motion.div
                      key={property.id}
                      layout
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.15, delay: Math.min(i * 0.03, 0.2) }}
                    >
                      <PropertyCard
                        property={property}
                        index={i}
                        variant={viewMode === "list" ? "list" : "default"}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
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
