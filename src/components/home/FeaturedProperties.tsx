"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PropertyCard } from "@/components/imoveis/PropertyCard";
import { Property } from "@/types";

interface FeaturedPropertiesProps {
  properties: Property[];
}

export function FeaturedProperties({ properties }: FeaturedPropertiesProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-20 lg:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12"
        >
          <div>
            <div className="inline-flex items-center gap-2.5 mb-4">
              <div className="h-px w-8 bg-[#C79A3B]" />
              <span className="text-[#C79A3B] text-xs font-bold uppercase tracking-[0.22em]">
                Portfólio
              </span>
            </div>
            <h2 className="font-display font-extrabold text-[#0B2344] text-3xl sm:text-4xl leading-tight">
              Imóveis selecionados
            </h2>
            <p className="text-[#0B2344]/50 mt-2.5 max-w-md text-base">
              Imóveis com curadoria exclusiva de Ediel Aguiar na Zona Leste de São Paulo.
            </p>
          </div>
          <Link
            href="/imoveis"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B2344] hover:text-[#C79A3B] transition-colors group shrink-0"
          >
            Ver todos os imóveis
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {properties.map((property, i) => (
            <PropertyCard key={property.id} property={property} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 flex justify-center"
        >
          <Link
            href="/imoveis"
            className="inline-flex items-center gap-2 bg-[#0B2344] hover:bg-[#0b2344]/90 text-white font-bold px-8 py-3.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-[#0B2344]/20"
          >
            Ver portfólio completo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
