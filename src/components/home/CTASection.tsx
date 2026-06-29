"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { MessageCircle, Phone, Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

const points = [
  "Atendimento exclusivo e personalizado",
  "Processo 100% transparente",
  "Resposta em até 15 minutos",
  "Documentação verificada",
];

export function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(
    "Olá, Ediel! Gostaria de uma consultoria sobre imóveis na Zona Leste."
  )}`;

  return (
    <section ref={ref} className="py-20 lg:py-28 bg-[#F7F8FA]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-[#0B2344] p-8 sm:p-12 lg:p-16"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C79A3B] to-transparent" />
          <div className="absolute top-0 right-0 h-96 w-96 -translate-y-1/3 translate-x-1/3 rounded-full bg-[#C79A3B]/8 pointer-events-none" />
          <div className="absolute bottom-0 left-0 h-64 w-64 translate-y-1/2 -translate-x-1/4 rounded-full bg-white/3 pointer-events-none" />

          <div className="relative grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2.5 mb-5">
                <div className="h-px w-8 bg-[#C79A3B]" />
                <span className="text-[#C79A3B] text-xs font-bold uppercase tracking-[0.22em]">
                  Consultoria gratuita
                </span>
              </div>
              <h2 className="font-display font-extrabold text-white text-3xl sm:text-4xl lg:text-5xl leading-tight mb-5">
                Pronto para encontrar o imóvel ideal?
              </h2>
              <p className="text-white/60 text-base leading-relaxed mb-7 max-w-md">
                Entre em contato agora e receba uma consultoria gratuita e personalizada. Ediel está pronto para ajudar.
              </p>

              <ul className="space-y-2.5 mb-8">
                {points.map((point, i) => (
                  <motion.li
                    key={point}
                    initial={{ opacity: 0, x: -12 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.2 + i * 0.06 }}
                    className="flex items-center gap-2.5 text-white/70 text-sm"
                  >
                    <CheckCircle2 className="h-4 w-4 text-[#C79A3B] flex-shrink-0" />
                    {point}
                  </motion.li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-3">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <button className="inline-flex items-center gap-2.5 bg-[#C79A3B] hover:bg-[#b8882d] text-white font-bold px-6 py-3.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-[#C79A3B]/25 w-full sm:w-auto justify-center">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Falar no WhatsApp
                  </button>
                </a>
                <Link href="/contato">
                  <button className="inline-flex items-center gap-2 border border-white/20 text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-white/8 hover:border-white/35 transition-all duration-200 w-full sm:w-auto justify-center">
                    Enviar mensagem
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </div>

            {/* Right — contact card */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="bg-white/6 border border-white/10 rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-6 pb-5 border-b border-white/10">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#C79A3B] to-[#a8812a] flex items-center justify-center font-display font-bold text-white text-xl flex-shrink-0">
                  EA
                </div>
                <div>
                  <p className="font-display font-bold text-white">Ediel Aguiar</p>
                  <p className="text-[#C79A3B]/80 text-xs font-medium">{SITE_CONFIG.creci}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#25D366] animate-pulse" />
                    <span className="text-[#25D366] text-xs font-medium">Disponível</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { icon: <MessageCircle className="h-4 w-4" />, label: "WhatsApp", value: SITE_CONFIG.whatsappDisplay, href: whatsappUrl, external: true },
                  { icon: <Phone className="h-4 w-4" />, label: "Telefone", value: SITE_CONFIG.whatsappDisplay, href: `tel:${SITE_CONFIG.phone}`, external: false },
                  { icon: <Mail className="h-4 w-4" />, label: "E-mail", value: SITE_CONFIG.email, href: `mailto:${SITE_CONFIG.email}`, external: false },
                ].map((contact) => (
                  <a
                    key={contact.label}
                    href={contact.href}
                    target={contact.external ? "_blank" : undefined}
                    rel={contact.external ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/8 hover:bg-[#C79A3B]/10 hover:border-[#C79A3B]/25 transition-all duration-200 group"
                  >
                    <div className="h-8 w-8 rounded-lg bg-white/8 flex items-center justify-center text-[#C79A3B] flex-shrink-0">
                      {contact.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-white/35 uppercase tracking-widest mb-0.5">{contact.label}</p>
                      <p className="text-white text-sm font-medium truncate">{contact.value}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-white/25 group-hover:text-[#C79A3B] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
