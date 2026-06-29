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
    <section ref={ref} className="py-20 lg:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
            Bairros que atendemos
          </h2>
          <p className="text-[#0B2344]/50 max-w-md text-base">
            Especialistas na Zona Leste de São Paulo. Cada bairro com atenção e conhecimento exclusivo.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {regions.map((region, i) => (
            <motion.div
              key={region.id}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Link href={`/imoveis?neighborhood=${encodeURIComponent(region.name)}`}>
                <div className="group relative overflow-hidden rounded-2xl h-56 sm:h-64 cursor-pointer">
                  <Image
                    src={region.image}
                    alt={region.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  {/* Navy overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B2344]/80 via-[#0B2344]/20 to-transparent group-hover:from-[#0B2344]/85 transition-all duration-300" />

                  {/* Gold top accent */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#C79A3B] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="font-display font-bold text-white text-lg leading-tight">
                          {region.name}
                        </p>
                        <p className="text-white/60 text-xs mt-0.5 flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-[#C79A3B]" />
                          {region.city}
                        </p>
                      </div>
                      <span className="bg-[#C79A3B]/20 text-[#C79A3B] border border-[#C79A3B]/30 text-[10px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-sm">
                        {region.propertyCount} {region.propertyCount === 1 ? "imóvel" : "imóveis"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[#C79A3B] text-xs font-semibold mt-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                      <span>Ver imóveis</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
