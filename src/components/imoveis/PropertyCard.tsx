"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BedDouble,
  Bath,
  Car,
  Maximize2,
  MapPin,
  Heart,
  ArrowRight,
} from "lucide-react";
import { Property } from "@/types";
import { formatCurrency, formatArea, cn } from "@/lib/utils";

interface PropertyCardProps {
  property: Property;
  index?: number;
  variant?: "default" | "featured" | "list";
}

export function PropertyCard({
  property,
  index = 0,
  variant = "default",
}: PropertyCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const typeLabel: Record<string, string> = {
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

  const statusConfig = {
    disponivel: { label: "Disponível", bg: "bg-[#0B2344]", text: "text-white" },
    vendido: { label: "Vendido", bg: "bg-zinc-600", text: "text-white" },
    alugado: { label: "Alugado", bg: "bg-zinc-600", text: "text-white" },
    reservado: { label: "Reservado", bg: "bg-[#C79A3B]", text: "text-white" },
  };

  const status = statusConfig[property.status] || statusConfig.disponivel;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.25, 0.1, 0.25, 1] }}
      className="group"
    >
      <Link href={`/imoveis/${property.slug}`} className="block">
        <article
          className={cn(
            "relative overflow-hidden rounded-2xl bg-white border border-[#e2e6ed]",
            "shadow-[0_1px_3px_0_rgba(11,35,68,0.04),0_4px_20px_-4px_rgba(11,35,68,0.07)]",
            "transition-all duration-300 ease-out",
            "hover:shadow-[0_4px_6px_-1px_rgba(11,35,68,0.06),0_20px_40px_-8px_rgba(11,35,68,0.14)]",
            "hover:-translate-y-1.5 hover:border-[#C79A3B]/40",
            variant === "list" && "flex flex-col sm:flex-row"
          )}
        >
          {/* Image */}
          <div
            className={cn(
              "relative overflow-hidden bg-[#f7f8fa]",
              variant === "list" ? "sm:w-72 sm:flex-shrink-0 h-52 sm:h-auto" : "h-52"
            )}
          >
            {!imageLoaded && <div className="absolute inset-0 skeleton" />}

            <Image
              src={property.images[0]}
              alt={property.title}
              fill
              className={cn(
                "object-cover transition-all duration-500",
                "group-hover:scale-[1.04]",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              onLoad={() => setImageLoaded(true)}
            />

            {/* Dark gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B2344]/70 via-[#0B2344]/10 to-transparent" />

            {/* Status badge */}
            <div className="absolute top-3 left-3 flex gap-1.5">
              {property.isFeatured && (
                <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wide text-white bg-[#C79A3B] rounded-md px-2.5 py-1">
                  ★ Destaque
                </span>
              )}
              <span className={cn("inline-flex items-center text-[10px] font-bold uppercase tracking-wide rounded-md px-2.5 py-1", status.bg, status.text)}>
                {status.label}
              </span>
            </div>

            {/* Favorite */}
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsLiked(!isLiked); }}
              className={cn(
                "absolute top-3 right-3 h-8 w-8 rounded-full flex items-center justify-center transition-all duration-200",
                isLiked
                  ? "bg-red-500 text-white"
                  : "bg-white/90 text-[#0B2344]/60 hover:bg-white hover:text-red-500"
              )}
              aria-label="Favoritar"
            >
              <Heart className="h-3.5 w-3.5" fill={isLiked ? "currentColor" : "none"} />
            </button>

            {/* Price overlay */}
            <div className="absolute bottom-3 left-3">
              <div className="font-display font-extrabold text-white text-lg leading-none drop-shadow-sm">
                {formatCurrency(property.price)}
                {property.transactionType === "aluguel" && (
                  <span className="text-xs font-normal text-white/70">/mês</span>
                )}
              </div>
            </div>

            {/* Photo count */}
            <div className="absolute bottom-3 right-3 flex items-center gap-1 text-white/70 text-[11px] font-medium">
              <span>{property.images.length} fotos</span>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col flex-1 p-4 sm:p-5">
            {/* Type + Code */}
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-[#C79A3B] uppercase tracking-wider">
                {typeLabel[property.type] || property.type}
              </span>
              <span className="text-[11px] font-mono text-[#0B2344]/40">#{property.code}</span>
            </div>

            {/* Title */}
            <h3 className="font-display font-bold text-[#0B2344] text-base leading-snug mb-2.5 line-clamp-2 group-hover:text-[#0B2344] transition-colors">
              {property.title}
            </h3>

            {/* Location */}
            <div className="flex items-center gap-1.5 text-[#0B2344]/50 text-sm mb-4">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-[#C79A3B]" />
              <span className="truncate">{property.neighborhood}, {property.city}</span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-2 py-3 border-t border-b border-[#e2e6ed] mb-4">
              {[
                { icon: <BedDouble className="h-3.5 w-3.5" />, value: property.bedrooms, label: "dorm", show: property.bedrooms > 0 },
                { icon: <Bath className="h-3.5 w-3.5" />, value: property.bathrooms, label: "banh", show: property.bathrooms > 0 },
                { icon: <Car className="h-3.5 w-3.5" />, value: property.parkingSpots, label: "vagas", show: property.parkingSpots >= 0 },
                { icon: <Maximize2 className="h-3.5 w-3.5" />, value: `${property.area}m²`, label: "área", show: true },
              ].filter(s => s.show).map((stat, i) => (
                <div key={i} className="flex flex-col items-center gap-0.5">
                  <span className="text-[#C79A3B]/70">{stat.icon}</span>
                  <span className="font-bold text-[#0B2344] text-sm leading-none">{stat.value}</span>
                  <span className="text-[#0B2344]/40 text-[10px]">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex items-center justify-between mt-auto">
              <span className="text-xs text-[#0B2344]/40">
                {property.transactionType === "aluguel" ? "Aluguel" : "Venda"}
              </span>
              <span className="flex items-center gap-1.5 text-[#C79A3B] font-semibold text-sm opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
                Ver detalhes
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
