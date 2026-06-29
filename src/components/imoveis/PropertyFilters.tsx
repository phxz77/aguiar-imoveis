"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PROPERTY_TYPES, CITIES, BEDROOMS_OPTIONS } from "@/lib/constants";
import { PropertyFilters as Filters } from "@/types";
import { cn } from "@/lib/utils";

interface PropertyFiltersProps {
  onFiltersChange: (filters: Filters) => void;
  totalResults: number;
}

export function PropertyFilters({ onFiltersChange, totalResults }: PropertyFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [filters, setFilters] = useState<Filters>({
    search: searchParams.get("search") || "",
    type: (searchParams.get("type") as Filters["type"]) || "",
    transactionType:
      (searchParams.get("transactionType") as Filters["transactionType"]) || "",
    city: searchParams.get("city") || "",
    neighborhood: searchParams.get("neighborhood") || "",
    bedrooms: (searchParams.get("bedrooms") as Filters["bedrooms"]) || "",
    bathrooms: (searchParams.get("bathrooms") as Filters["bathrooms"]) || "",
    minPrice: searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : undefined,
    maxPrice: searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : undefined,
  });

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, String(value));
    } else {
      params.delete(key);
    }
    router.replace(`/imoveis?${params.toString()}`, { scroll: false });
  };

  const clearFilters = () => {
    const empty: Filters = {
      search: "",
      type: "",
      transactionType: "",
      city: "",
      neighborhood: "",
      bedrooms: "",
      bathrooms: "",
      minPrice: undefined,
      maxPrice: undefined,
    };
    setFilters(empty);
    router.replace("/imoveis", { scroll: false });
  };

  const hasActiveFilters = Object.values(filters).some(
    (v) => v !== "" && v !== undefined && v !== null
  );

  const activeCount = Object.values(filters).filter(
    (v) => v !== "" && v !== undefined && v !== null
  ).length;

  const FilterContent = () => (
    <div className="space-y-4">
      {/* Search */}
      <Input
        type="text"
        placeholder="Buscar por bairro, cidade, código..."
        value={filters.search || ""}
        onChange={(e) => updateFilter("search", e.target.value)}
        icon={<Search className="h-4 w-4" />}
      />

      <div className="grid grid-cols-2 gap-3">
        {/* Transaction type */}
        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-1.5">Operação</label>
          <div className="grid grid-cols-2 gap-1.5 bg-zinc-100 p-1 rounded-xl">
            {[
              { value: "", label: "Todos" },
              { value: "venda", label: "Comprar" },
              { value: "aluguel", label: "Alugar" },
            ].slice(0, 3).map((opt) => (
              <button
                key={opt.value}
                onClick={() => updateFilter("transactionType", opt.value as Filters["transactionType"])}
                className={cn(
                  "py-1.5 px-2 rounded-lg text-xs font-semibold transition-all duration-150",
                  filters.transactionType === opt.value
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-700"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Property type */}
        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-1.5">Tipo</label>
          <div className="relative">
            <select
              value={filters.type || ""}
              onChange={(e) => updateFilter("type", e.target.value as Filters["type"])}
              className="w-full appearance-none bg-white border border-zinc-200 rounded-xl px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer text-zinc-700"
            >
              <option value="">Todos os tipos</option>
              {PROPERTY_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* City */}
        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-1.5">Cidade</label>
          <div className="relative">
            <select
              value={filters.city || ""}
              onChange={(e) => updateFilter("city", e.target.value)}
              className="w-full appearance-none bg-white border border-zinc-200 rounded-xl px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer text-zinc-700"
            >
              <option value="">Todas as cidades</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          </div>
        </div>

        {/* Neighborhood */}
        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-1.5">Bairro</label>
          <Input
            type="text"
            placeholder="Ex: Moema"
            value={filters.neighborhood || ""}
            onChange={(e) => updateFilter("neighborhood", e.target.value)}
          />
        </div>
      </div>

      {/* Bedrooms */}
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Dormitórios (mínimo)</label>
        <div className="flex gap-2">
          {["", ...BEDROOMS_OPTIONS.slice(0, 5)].map((n) => (
            <button
              key={n}
              onClick={() => updateFilter("bedrooms", n === "" ? "" : (n as number) as Filters["bedrooms"])}
              className={cn(
                "flex-1 py-2 rounded-xl text-sm font-semibold border transition-all duration-150",
                String(filters.bedrooms) === String(n)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300"
              )}
            >
              {n === "" ? "Todos" : `${n}+`}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Faixa de preço</label>
        <div className="grid grid-cols-2 gap-3">
          <Input
            type="number"
            placeholder="Mínimo"
            value={filters.minPrice || ""}
            onChange={(e) => updateFilter("minPrice", e.target.value ? Number(e.target.value) : undefined)}
          />
          <Input
            type="number"
            placeholder="Máximo"
            value={filters.maxPrice || ""}
            onChange={(e) => updateFilter("maxPrice", e.target.value ? Number(e.target.value) : undefined)}
          />
        </div>
      </div>

      {/* Clear filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          className="w-full text-zinc-500 hover:text-red-500"
          onClick={clearFilters}
        >
          <X className="h-4 w-4" />
          Limpar filtros {activeCount > 0 && `(${activeCount})`}
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:block w-72 flex-shrink-0">
        <div className="sticky top-20 bg-white border border-zinc-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold text-zinc-900">Filtros</h2>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs font-medium text-zinc-500 hover:text-red-500 flex items-center gap-1 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
                Limpar
              </button>
            )}
          </div>
          <FilterContent />
        </div>
      </div>

      {/* Mobile filter toggle */}
      <div className="lg:hidden mb-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setShowMobileFilters(true)}
            className="gap-2 flex-1 sm:flex-none"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtros
            {activeCount > 0 && (
              <span className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </Button>
          <div className="flex-1 sm:flex-none">
            <Input
              type="text"
              placeholder="Buscar imóveis..."
              value={filters.search || ""}
              onChange={(e) => updateFilter("search", e.target.value)}
              icon={<Search className="h-4 w-4" />}
            />
          </div>
          <span className="text-zinc-500 text-sm whitespace-nowrap hidden sm:inline">
            {totalResults} imóveis
          </span>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={() => setShowMobileFilters(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white z-50 lg:hidden rounded-t-3xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-4 border-b border-zinc-100 sticky top-0 bg-white">
                <h3 className="font-display font-semibold text-zinc-900">Filtros</h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="p-4">
                <FilterContent />
                <Button
                  className="w-full mt-4"
                  onClick={() => setShowMobileFilters(false)}
                >
                  Ver {totalResults} imóveis
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
