"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import { Region } from "@/types";

interface RegionsSectionProps {
  regions: Region[];
}

export function RegionsSection({ regions }: RegionsSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="py-20 lg:py-28 bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2.5 mb-4">
            <div className="h-px w-8 bg-[#C79A3B]" />
            <span className="text-[#C79A3B] text-xs font-bold uppercase tracking-[0.22em]">
              Área de atuação
            </span>
          </div>
          <h2 className="font-display font-extrabold text-[#0B2344] text-3xl sm:text-4xl mb-3">
            Regiões onde trabalhamos
          </h2>
          <p className="text-[#0B2344]/50 max-w-lg text-base leading-relaxed">
            Especialista em imóveis na Zona Leste de São Paulo. Cada bairro com atenção
            exclusiva e conhecimento aprofundado do mercado local.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {regions.map((region, i) => (
            <RegionCard key={region.id} region={region} index={i} isInView={isInView} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-10 text-center"
        >
          <Link
            href="/imoveis"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B2344]/60 hover:text-[#C79A3B] transition-colors group"
          >
            Ver todos os imóveis disponíveis
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function RegionCard({
  region,
  index,
  isInView,
}: {
  region: Region;
  index: number;
  isInView: boolean;
}) {
  const [imgError, setImgError] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: Math.min(index * 0.07, 0.42) }}
    >
      <Link href={`/imoveis?neighborhood=${encodeURIComponent(region.name)}`}>
        <div className="group relative overflow-hidden rounded-2xl cursor-pointer h-44 sm:h-52 lg:h-60 bg-[#0B2344]">

          {/* Foto real da região */}
          {!imgError ? (
            <Image
              src={region.image}
              alt={`${region.name}, ${region.city}`}
              fill
              loading="lazy"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 will-change-transform"
              onError={() => setImgError(true)}
            />
          ) : (
            /* Fallback elegante se imagem falhar */
            <div className="absolute inset-0 bg-gradient-to-br from-[#0B2344] to-[#163561] flex items-center justify-center">
              <MapPin className="h-10 w-10 text-[#C79A3B]/40" />
            </div>
          )}

          {/* Gradiente base sempre visível */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B2344]/90 via-[#0B2344]/30 to-transparent" />

          {/* Borda dourada no hover */}
          <div className="absolute inset-0 rounded-2xl ring-0 group-hover:ring-2 ring-[#C79A3B]/60 transition-all duration-300" />

          {/* Linha dourada topo */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#C79A3B]/0 via-[#C79A3B] to-[#C79A3B]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Conteúdo */}
          <div className="absolute bottom-0 left-0 right-0 p-3.5 sm:p-4">

            {/* Badge imóveis */}
            {region.propertyCount > 0 && (
              <span className="inline-block bg-[#C79A3B]/20 text-[#C79A3B] border border-[#C79A3B]/30 text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-sm mb-2">
                {region.propertyCount} {region.propertyCount === 1 ? "imóvel" : "imóveis"}
              </span>
            )}

            <p className="font-display font-bold text-white text-base sm:text-lg leading-tight drop-shadow-sm">
              {region.name}
            </p>
            <p className="text-white/60 text-xs mt-0.5 flex items-center gap-1">
              <MapPin className="h-3 w-3 text-[#C79A3B] shrink-0" />
              {region.city}
            </p>

            {/* CTA no hover */}
            <div className="flex items-center gap-1 text-[#C79A3B] text-xs font-semibold mt-2.5 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200">
              <span>Ver imóveis</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Efeito ripple no toque (mobile) */}
          <div className="absolute inset-0 bg-white/0 active:bg-white/10 transition-colors duration-150 lg:hidden" />
        </div>
      </Link>
    </motion.div>
  );
}
