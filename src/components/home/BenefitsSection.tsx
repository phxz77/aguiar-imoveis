"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  ShieldCheck,
  Handshake,
  Clock,
  MapPin,
  BarChart2,
  Headphones,
} from "lucide-react";

const benefits = [
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: "Segurança jurídica",
    description: "Toda documentação verificada e processo transparente do início ao fim. Você compra com total segurança.",
  },
  {
    icon: <Handshake className="h-6 w-6" />,
    title: "Negociação especializada",
    description: "Mais de 10 anos de experiência garantem a melhor negociação para o seu perfil, seja comprando ou vendendo.",
  },
  {
    icon: <MapPin className="h-6 w-6" />,
    title: "Expert na Zona Leste",
    description: "Cada rua, cada bairro, cada oportunidade. Especialista na Penha, Vila Granada e toda a Zona Leste de SP.",
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Resposta imediata",
    description: "Atendimento por WhatsApp com retorno em até 15 minutos. Disponível de segunda a sábado.",
  },
  {
    icon: <BarChart2 className="h-6 w-6" />,
    title: "Avaliação de mercado",
    description: "Análise real do valor do imóvel com base em dados atualizados da região, sem distorções.",
  },
  {
    icon: <Headphones className="h-6 w-6" />,
    title: "Suporte pós-negócio",
    description: "O relacionamento não termina na assinatura. Ediel permanece disponível para qualquer necessidade futura.",
  },
];

const numbers = [
  { value: "10+", label: "Anos de mercado" },
  { value: "98%", label: "Clientes satisfeitos" },
  { value: "Zona Leste", label: "Especialidade" },
  { value: "100%", label: "Transparência" },
];

export function BenefitsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="py-20 lg:py-28 bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Numbers bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="bg-[#0B2344] rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 mb-16 grid grid-cols-2 lg:grid-cols-4 gap-6 relative overflow-hidden"
        >
          {/* Gold accent line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C79A3B] to-transparent" />

          {numbers.map((num, i) => (
            <motion.div
              key={num.label}
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="text-center"
            >
              <div className="font-display font-extrabold text-[#C79A3B] text-2xl sm:text-3xl mb-1">
                {num.value}
              </div>
              <div className="text-white/50 text-xs sm:text-sm">{num.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2.5 mb-4">
            <div className="h-px w-8 bg-[#C79A3B]" />
            <span className="text-[#C79A3B] text-xs font-bold uppercase tracking-[0.22em]">
              Por que Ediel Aguiar?
            </span>
          </div>
          <h2 className="font-display font-extrabold text-[#0B2344] text-3xl sm:text-4xl mb-3">
            Uma experiência diferente
          </h2>
          <p className="text-[#0B2344]/50 max-w-lg text-base">
            Cada detalhe do atendimento foi pensado para tornar sua experiência imobiliária a mais tranquila e eficiente possível.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefits.map((benefit, i) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
              className="group bg-white border border-[#e2e6ed] rounded-2xl p-6 hover:border-[#C79A3B]/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              {/* Icon with gold dot */}
              <div className="flex items-center gap-3 mb-4">
                <div className="h-11 w-11 rounded-xl bg-[#0B2344]/6 flex items-center justify-center text-[#0B2344] group-hover:bg-[#0B2344] group-hover:text-white transition-all duration-300">
                  {benefit.icon}
                </div>
                <div className="h-1.5 w-1.5 rounded-full bg-[#C79A3B]" />
              </div>
              <h3 className="font-display font-bold text-[#0B2344] text-base mb-2">
                {benefit.title}
              </h3>
              <p className="text-[#0B2344]/50 text-sm leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
