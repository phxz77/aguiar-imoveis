"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, MapPin, Home, ChevronDown } from "lucide-react";
import { PROPERTY_TYPES, NEIGHBORHOODS_ZONA_LESTE, SITE_CONFIG } from "@/lib/constants";

const highlights = [
  { value: "5", label: "Imóveis disponíveis" },
  { value: "Zona Leste", label: "Especialidade" },
  { value: "10+", label: "Anos de mercado" },
];

export function HeroSection() {
  const router = useRouter();
  const [transactionType, setTransactionType] = useState<"venda" | "aluguel">("venda");
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (transactionType) params.set("transactionType", transactionType);
    if (searchQuery) params.set("search", searchQuery);
    if (propertyType) params.set("type", propertyType);
    router.push(`/imoveis?${params.toString()}`);
  };

  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(
    "Olá, Ediel! Vi o site da Aguiar Imóveis e gostaria de mais informações sobre os imóveis disponíveis."
  )}`;

  return (
    <section className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden bg-[#0B2344]">
      {/* Subtle background texture */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gold geometric lines */}
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-[#C79A3B]/20 to-transparent" />
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/4 to-transparent" />

        {/* Radial glow */}
        <div className="absolute top-1/3 right-1/4 h-[500px] w-[500px] rounded-full bg-[#C79A3B]/8 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-white/3 blur-[100px]" />

        {/* Fine grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(rgba(199,154,59,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(199,154,59,0.8) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* Left — headline + search */}
          <div>
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 mb-6"
            >
              <div className="h-px w-8 bg-[#C79A3B]" />
              <span className="text-[#C79A3B] text-xs font-bold uppercase tracking-[0.25em]">
                Especialista em Zona Leste
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="font-display font-extrabold text-white leading-[1.06] tracking-tight mb-6"
              style={{ fontSize: "clamp(2.2rem, 5vw, 3.75rem)" }}
            >
              O imóvel certo{" "}
              <span className="block text-[#C79A3B]">está mais perto</span>
              do que você imagina.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="text-white/60 text-base sm:text-lg leading-relaxed mb-10 max-w-md"
            >
              Ediel Aguiar — corretor especializado em sobrados e casas na Penha, Vila Granada e Zona Leste de São Paulo. Mais de 10 anos conectando famílias ao imóvel ideal.
            </motion.p>

            {/* Search block */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.22 }}
              className="bg-white/[0.07] backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-5"
            >
              {/* Tabs */}
              <div className="flex gap-1 mb-4 bg-white/5 p-1 rounded-xl">
                {(["venda", "aluguel"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setTransactionType(type)}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      transactionType === type
                        ? "bg-[#C79A3B] text-white"
                        : "text-white/50 hover:text-white"
                    }`}
                  >
                    {type === "venda" ? "Comprar" : "Alugar"}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSearch} className="space-y-3">
                {/* Main search */}
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Buscar por bairro, tipo ou código..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/8 border border-white/12 text-white placeholder:text-white/40 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#C79A3B]/60 focus:border-[#C79A3B]/40 transition-all"
                  />
                </div>

                {/* Type select */}
                <div className="relative">
                  <Home className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none" />
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full appearance-none bg-white/8 border border-white/12 text-white/70 rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#C79A3B]/60 transition-all cursor-pointer"
                  >
                    <option value="" className="bg-[#0B2344] text-white">Tipo de imóvel</option>
                    {PROPERTY_TYPES.map((t) => (
                      <option key={t.value} value={t.value} className="bg-[#0B2344] text-white">
                        {t.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#C79A3B] hover:bg-[#b8882d] text-white font-bold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#C79A3B]/20"
                >
                  <Search className="h-4 w-4" />
                  Buscar imóveis
                </button>
              </form>

              {/* Quick tags */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {NEIGHBORHOODS_ZONA_LESTE.slice(0, 4).map((n) => (
                  <button
                    key={n}
                    onClick={() => setSearchQuery(n)}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-white/50 hover:text-[#C79A3B] bg-white/5 hover:bg-[#C79A3B]/10 border border-white/8 hover:border-[#C79A3B]/30 rounded-full px-2.5 py-1 transition-all duration-150"
                  >
                    <MapPin className="h-2.5 w-2.5" />
                    {n}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right — stats + CTA card */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:flex flex-col gap-5"
          >
            {/* Highlight numbers */}
            <div className="grid grid-cols-3 gap-4">
              {highlights.map((h, i) => (
                <motion.div
                  key={h.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                  className="bg-white/[0.06] border border-white/8 rounded-2xl p-5 text-center hover:bg-white/[0.09] transition-colors"
                >
                  <div className="font-display font-extrabold text-[#C79A3B] text-2xl mb-1">
                    {h.value}
                  </div>
                  <div className="text-white/50 text-xs leading-snug">{h.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Property preview card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/[0.06] border border-white/8 rounded-2xl overflow-hidden"
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-[#C79A3B] text-[10px] font-bold uppercase tracking-widest block mb-1">
                      Destaque
                    </span>
                    <h3 className="font-display font-bold text-white text-base leading-snug">
                      Sobrado Alto Padrão<br />Vila Granada
                    </h3>
                  </div>
                  <span className="bg-[#C79A3B]/15 text-[#C79A3B] border border-[#C79A3B]/30 text-xs font-bold px-2.5 py-1 rounded-lg">
                    AGI003
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { label: "Área", value: "180 m²" },
                    { label: "Suítes", value: "3" },
                    { label: "Vagas", value: "2" },
                  ].map((s) => (
                    <div key={s.label} className="bg-white/5 rounded-xl p-2.5 text-center">
                      <div className="font-bold text-white text-sm">{s.value}</div>
                      <div className="text-white/40 text-[10px]">{s.label}</div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-medium text-white/40 mb-0.5">Valor</div>
                    <div className="font-display font-extrabold text-white text-xl">R$ 899.000</div>
                  </div>
                  <a
                    href="/imoveis/sobrado-alto-padrao-vila-granada"
                    className="bg-[#C79A3B] hover:bg-[#b8882d] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all duration-150"
                  >
                    Ver imóvel
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Trust badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-3 bg-white/[0.04] border border-white/8 rounded-2xl px-4 py-3"
            >
              <div className="h-10 w-10 rounded-xl bg-[#C79A3B]/15 border border-[#C79A3B]/30 flex items-center justify-center flex-shrink-0">
                <span className="text-[#C79A3B] text-xs font-bold">✓</span>
              </div>
              <div>
                <p className="text-white text-sm font-semibold">CRECI-SP Registrado</p>
                <p className="text-white/40 text-xs">Corretor certificado e habilitado pelo CRECI</p>
              </div>
            </motion.div>

            {/* WhatsApp CTA */}
            <motion.a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold py-3.5 rounded-2xl transition-all duration-200 hover:shadow-lg hover:shadow-[#25D366]/30"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Consultar disponibilidade
            </motion.a>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
          <path d="M0 48 C480 72 960 24 1440 48 L1440 72 L0 72 Z" fill="#ffffff" />
        </svg>
      </div>
    </section>
  );
}
