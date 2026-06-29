"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Home, Building2, Layers, Store, TreePine, Hotel, ArrowRight } from "lucide-react";

const categories = [
  { label: "Sobrados", type: "sobrado", icon: <Home className="h-6 w-6" />, count: 5, desc: "Casas em 2+ andares" },
  { label: "Apartamentos", type: "apartamento", icon: <Building2 className="h-6 w-6" />, count: 0, desc: "Studios a coberturas" },
  { label: "Coberturas", type: "cobertura", icon: <Layers className="h-6 w-6" />, count: 0, desc: "Exclusividade e vistas" },
  { label: "Comercial", type: "comercial", icon: <Store className="h-6 w-6" />, count: 0, desc: "Salas e escritórios" },
  { label: "Terrenos", type: "terreno", icon: <TreePine className="h-6 w-6" />, count: 0, desc: "Para seu projeto" },
  { label: "Studios", type: "studio", icon: <Hotel className="h-6 w-6" />, count: 0, desc: "Compactos e modernos" },
];

export function CategorySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="py-20 lg:py-24 bg-[#F7F8FA]">
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
              Categorias
            </span>
          </div>
          <h2 className="font-display font-extrabold text-[#0B2344] text-3xl sm:text-4xl">
            O que você está procurando?
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.type}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <Link href={`/imoveis?type=${cat.type}`}>
                <div className="group relative bg-white border border-[#e2e6ed] rounded-2xl p-4 sm:p-5 flex flex-col items-center text-center gap-3 hover:border-[#C79A3B]/50 hover:shadow-md transition-all duration-200 cursor-pointer">
                  {/* Icon */}
                  <div className="h-12 w-12 rounded-xl bg-[#0B2344] text-white flex items-center justify-center group-hover:bg-[#C79A3B] transition-colors duration-300 shadow-sm">
                    {cat.icon}
                  </div>
                  <div>
                    <p className="font-display font-bold text-[#0B2344] text-sm">{cat.label}</p>
                    <p className="text-[#0B2344]/45 text-[11px] mt-0.5 leading-snug hidden sm:block">{cat.desc}</p>
                    <div className="flex items-center justify-center gap-1 mt-1.5 text-xs font-medium text-[#C79A3B]">
                      <span>{cat.count > 0 ? `${cat.count} imóveis` : "Ver todos"}</span>
                      <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
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
