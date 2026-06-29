"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
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

function readFromParams(searchParams: URLSearchParams): Filters {
  return {
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
  };
}

/** Atualiza a URL sem disparar navegação do Next.js */
function pushUrl(filters: Filters) {
  const params = new URLSearchParams();
  if (filters.search)        params.set("search", filters.search);
  if (filters.type)          params.set("type", filters.type);
  if (filters.transactionType) params.set("transactionType", filters.transactionType);
  if (filters.city)          params.set("city", filters.city);
  if (filters.neighborhood)  params.set("neighborhood", filters.neighborhood);
  if (filters.bedrooms)      params.set("bedrooms", String(filters.bedrooms));
  if (filters.bathrooms)     params.set("bathrooms", String(filters.bathrooms));
  if (filters.minPrice)      params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice)      params.set("maxPrice", String(filters.maxPrice));
  const qs = params.toString();
  window.history.replaceState(null, "", qs ? `/imoveis?${qs}` : "/imoveis");
}

export function PropertyFilters({ onFiltersChange, totalResults }: PropertyFiltersProps) {
  const searchParams = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [filters, setFilters] = useState<Filters>(() =>
    readFromParams(new URLSearchParams(searchParams.toString()))
  );

  // Debounce timer ref — evita filtrar a cada tecla em campos de texto
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Notifica o pai imediatamente (filtragem client-side é instantânea)
  // Atualiza a URL com debounce para não sobrecarregar o histórico
  const applyFilter = useCallback(
    (updated: Filters, debounceUrl = false) => {
      setFilters(updated);
      onFiltersChange(updated);

      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (debounceUrl) {
        debounceRef.current = setTimeout(() => pushUrl(updated), 400);
      } else {
        pushUrl(updated);
      }
    },
    [onFiltersChange]
  );

  // Filtros imediatos (select, botões)
  const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    applyFilter({ ...filters, [key]: value }, false);
  };

  // Filtros com debounce (texto digitado)
  const updateFilterDebounced = <K extends keyof Filters>(
    key: K,
    value: Filters[K]
  ) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);           // atualiza UI imediatamente
    onFiltersChange(updated);      // filtra imediatamente (client-side = rápido)
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => pushUrl(updated), 400); // URL após pausa
  };

  const clearFilters = () => {
    const empty: Filters = {
      search: "", type: "", transactionType: "",
      city: "", neighborhood: "", bedrooms: "", bathrooms: "",
      minPrice: undefined, maxPrice: undefined,
    };
    applyFilter(empty, false);
  };

  // Emite filtros iniciais (vindo da URL)
  useEffect(() => {
    onFiltersChange(filters);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Limpa debounce ao desmontar
  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);

  const hasActiveFilters = Object.values(filters).some(
    (v) => v !== "" && v !== undefined && v !== null
  );
  const activeCount = Object.values(filters).filter(
    (v) => v !== "" && v !== undefined && v !== null
  ).length;

  // FilterContent como constante (não componente inline) para evitar unmount/remount
  const filterContent = (
    <div className="space-y-4">
      {/* Busca */}
      <Input
        type="text"
        placeholder="Bairro, cidade, código..."
        value={filters.search || ""}
        onChange={(e) => updateFilterDebounced("search", e.target.value)}
        icon={<Search className="h-4 w-4" />}
      />

      <div className="grid grid-cols-2 gap-3">
        {/* Operação */}
        <div>
          <label className="block text-xs font-semibold text-[#0B2344]/50 mb-1.5 uppercase tracking-wide">
            Operação
          </label>
          <div className="grid grid-cols-3 gap-1 bg-[#F7F8FA] p-1 rounded-xl">
            {[
              { value: "", label: "Todos" },
              { value: "venda", label: "Comprar" },
              { value: "aluguel", label: "Alugar" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => updateFilter("transactionType", opt.value as Filters["transactionType"])}
                className={cn(
                  "py-1.5 px-1 rounded-lg text-[11px] font-semibold transition-all duration-150",
                  filters.transactionType === opt.value
                    ? "bg-[#0B2344] text-white shadow-sm"
                    : "text-[#0B2344]/50 hover:text-[#0B2344]"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tipo */}
        <div>
          <label className="block text-xs font-semibold text-[#0B2344]/50 mb-1.5 uppercase tracking-wide">
            Tipo
          </label>
          <div className="relative">
            <select
              value={filters.type || ""}
              onChange={(e) => updateFilter("type", e.target.value as Filters["type"])}
              className="w-full appearance-none bg-white border border-[#e2e6ed] rounded-xl px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-[#C79A3B]/30 focus:border-[#C79A3B] cursor-pointer text-[#0B2344]"
            >
              <option value="">Todos</option>
              {PROPERTY_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#0B2344]/40" />
          </div>
        </div>
      </div>

      {/* Cidade */}
      <div>
        <label className="block text-xs font-semibold text-[#0B2344]/50 mb-1.5 uppercase tracking-wide">
          Cidade
        </label>
        <div className="relative">
          <select
            value={filters.city || ""}
            onChange={(e) => updateFilter("city", e.target.value)}
            className="w-full appearance-none bg-white border border-[#e2e6ed] rounded-xl px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-[#C79A3B]/30 focus:border-[#C79A3B] cursor-pointer text-[#0B2344]"
          >
            <option value="">Todas as cidades</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#0B2344]/40" />
        </div>
      </div>

      {/* Bairro */}
      <div>
        <label className="block text-xs font-semibold text-[#0B2344]/50 mb-1.5 uppercase tracking-wide">
          Bairro
        </label>
        <Input
          type="text"
          placeholder="Ex: Penha, Tatuapé..."
          value={filters.neighborhood || ""}
          onChange={(e) => updateFilterDebounced("neighborhood", e.target.value)}
        />
      </div>

      {/* Dormitórios */}
      <div>
        <label className="block text-xs font-semibold text-[#0B2344]/50 mb-1.5 uppercase tracking-wide">
          Dormitórios (mínimo)
        </label>
        <div className="flex gap-1.5">
          {(["", ...BEDROOMS_OPTIONS.slice(0, 5)] as (number | string)[]).map((n) => (
            <button
              key={String(n)}
              onClick={() =>
                updateFilter("bedrooms", n === "" ? "" : (n as number) as Filters["bedrooms"])
              }
              className={cn(
                "flex-1 py-2 rounded-xl text-sm font-semibold border transition-all duration-150",
                String(filters.bedrooms) === String(n)
                  ? "bg-[#0B2344] text-white border-[#0B2344]"
                  : "bg-white text-[#0B2344]/60 border-[#e2e6ed] hover:border-[#0B2344]/30"
              )}
            >
              {n === "" ? "Todos" : `${n}+`}
            </button>
          ))}
        </div>
      </div>

      {/* Faixa de preço */}
      <div>
        <label className="block text-xs font-semibold text-[#0B2344]/50 mb-1.5 uppercase tracking-wide">
          Faixa de preço (R$)
        </label>
        <div className="grid grid-cols-2 gap-3">
          <Input
            type="number"
            placeholder="Mínimo"
            value={filters.minPrice || ""}
            onChange={(e) =>
              updateFilterDebounced("minPrice", e.target.value ? Number(e.target.value) : undefined)
            }
          />
          <Input
            type="number"
            placeholder="Máximo"
            value={filters.maxPrice || ""}
            onChange={(e) =>
              updateFilterDebounced("maxPrice", e.target.value ? Number(e.target.value) : undefined)
            }
          />
        </div>
      </div>

      {/* Limpar */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="w-full flex items-center justify-center gap-1.5 text-sm text-[#0B2344]/40 hover:text-red-500 transition-colors py-2 border border-dashed border-[#e2e6ed] hover:border-red-200 rounded-xl"
        >
          <X className="h-3.5 w-3.5" />
          Limpar filtros {activeCount > 0 && `(${activeCount})`}
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
        <div className="sticky top-24 bg-white border border-[#e2e6ed] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold text-[#0B2344] flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-[#C79A3B]" />
              Filtros
            </h2>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs font-medium text-[#0B2344]/40 hover:text-red-500 flex items-center gap-1 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
                Limpar
              </button>
            )}
          </div>
          {filterContent}
        </div>
      </div>

      {/* Mobile: botão + busca rápida */}
      <div className="lg:hidden mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowMobileFilters(true)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all",
              hasActiveFilters
                ? "bg-[#0B2344] text-white border-[#0B2344]"
                : "bg-white text-[#0B2344] border-[#e2e6ed]"
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtros
            {activeCount > 0 && (
              <span className="bg-[#C79A3B] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </button>
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Buscar imóveis..."
              value={filters.search || ""}
              onChange={(e) => updateFilterDebounced("search", e.target.value)}
              icon={<Search className="h-4 w-4" />}
            />
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
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
              <div className="flex items-center justify-between p-4 border-b border-[#e2e6ed] sticky top-0 bg-white">
                <h3 className="font-display font-semibold text-[#0B2344]">Filtros</h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="h-8 w-8 rounded-full bg-[#F7F8FA] flex items-center justify-center text-[#0B2344]/50"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="p-4 pb-8">
                {filterContent}
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full mt-4 bg-[#0B2344] text-white font-bold py-3 rounded-xl text-sm"
                >
                  Ver {totalResults} imóvel{totalResults !== 1 ? "is" : ""}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
