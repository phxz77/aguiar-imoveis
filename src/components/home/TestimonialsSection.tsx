"use client";

import React, { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Testimonial } from "@/types";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [activeIndex, setActiveIndex] = useState(0);

  const next = () => setActiveIndex((p) => (p + 1) % testimonials.length);
  const prev = () => setActiveIndex((p) => (p - 1 + testimonials.length) % testimonials.length);

  const active = testimonials[activeIndex];

  return (
    <section ref={ref} className="py-20 lg:py-28 bg-[#0B2344] overflow-hidden relative">
      {/* Gold accent lines */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C79A3B]/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C79A3B]/20 to-transparent" />

      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(199,154,59,1) 1px, transparent 1px), linear-gradient(90deg, rgba(199,154,59,1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2.5 justify-center mb-4">
            <div className="h-px w-8 bg-[#C79A3B]" />
            <span className="text-[#C79A3B] text-xs font-bold uppercase tracking-[0.22em]">
              Depoimentos
            </span>
            <div className="h-px w-8 bg-[#C79A3B]" />
          </div>
          <h2 className="font-display font-extrabold text-white text-3xl sm:text-4xl mb-3">
            Clientes que confiam em Ediel
          </h2>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 text-[#C79A3B] fill-[#C79A3B]" />
              ))}
            </div>
            <span className="text-white font-bold">5.0</span>
            <span className="text-white/40 text-sm">— {testimonials.length} avaliações</span>
          </div>
        </motion.div>

        {/* Main testimonial */}
        <div className="max-w-3xl mx-auto mb-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
              className="relative bg-white/[0.05] border border-white/10 rounded-3xl p-8 sm:p-10 text-center"
            >
              {/* Gold quote mark */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 h-8 w-8 rounded-full bg-[#C79A3B] flex items-center justify-center">
                <Quote className="h-4 w-4 text-white" />
              </div>

              <blockquote className="text-white/85 text-lg sm:text-xl font-medium leading-relaxed mb-8 italic">
                &ldquo;{active.content}&rdquo;
              </blockquote>

              <div className="flex flex-col items-center gap-2">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#C79A3B] to-[#a8812a] flex items-center justify-center font-display font-bold text-white text-lg">
                  {active.name.charAt(0)}
                </div>
                <div>
                  <p className="font-display font-bold text-white">{active.name}</p>
                  <p className="text-[#C79A3B]/70 text-sm">{active.role}</p>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(active.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-[#C79A3B] fill-[#C79A3B]" />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={prev}
              className="h-10 w-10 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-[#C79A3B] hover:border-[#C79A3B]/40 transition-all"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-1.5">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === activeIndex
                      ? "bg-[#C79A3B] w-6 h-2"
                      : "bg-white/20 w-2 h-2 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="h-10 w-10 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-[#C79A3B] hover:border-[#C79A3B]/40 transition-all"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mini cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
          {testimonials.slice(0, 3).map((testimonial, i) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.08 }}
              onClick={() => setActiveIndex(i)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 ${
                activeIndex === i
                  ? "border-[#C79A3B]/40 bg-[#C79A3B]/8"
                  : "border-white/8 bg-white/3 hover:bg-white/6"
              }`}
            >
              <div className="flex gap-0.5 mb-2.5">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-3 w-3 text-[#C79A3B] fill-[#C79A3B]" />
                ))}
              </div>
              <p className="text-white/50 text-xs leading-relaxed line-clamp-3 mb-3">
                &ldquo;{testimonial.content}&rdquo;
              </p>
              <div>
                <p className="text-white text-xs font-semibold">{testimonial.name}</p>
                <p className="text-white/35 text-[11px]">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
