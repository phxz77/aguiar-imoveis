"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  MapPin,
  Award,
  Users,
  TrendingUp,
  Heart,
  ShieldCheck,
  Handshake,
  Star,
  CheckCircle2,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/lib/constants";

const timeline = [
  {
    year: "2014",
    title: "Início da jornada",
    description: "Obteve o registro no CRECI e começou a atuar no mercado imobiliário de São Paulo, focado na Zona Sul.",
  },
  {
    year: "2016",
    title: "100 imóveis negociados",
    description: "Alcançou a marca de 100 negócios realizados, consolidando sua reputação de confiança e entrega.",
  },
  {
    year: "2019",
    title: "Expansão regional",
    description: "Ampliou a área de atuação para toda a Região Metropolitana de São Paulo, atendendo mais cidades e perfis.",
  },
  {
    year: "2022",
    title: "Especialização em alto padrão",
    description: "Passou a atuar também com imóveis de alto padrão nos Jardins, Itaim Bibi e Morumbi.",
  },
  {
    year: "2024",
    title: "500+ imóveis negociados",
    description: "Ultrapassou 500 negócios concluídos e mais de R$500 milhões em transações imobiliárias.",
  },
];

const values = [
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: "Transparência",
    description: "Processos claros, sem letras miúdas. Você sempre sabe exatamente o que está acontecendo.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: <Heart className="h-6 w-6" />,
    title: "Dedicação",
    description: "Cada cliente recebe atenção exclusiva e personalizada. Seu sonho é tratado como prioridade.",
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
  {
    icon: <Handshake className="h-6 w-6" />,
    title: "Confiança",
    description: "Mais de 10 anos construindo relacionamentos sólidos baseados em honestidade e resultados.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    title: "Resultados",
    description: "Foco em entregar o melhor negócio para cada cliente, seja comprando, vendendo ou alugando.",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
];

const expertise = [
  "Análise de mercado imobiliário",
  "Avaliação de imóveis",
  "Negociação de alto nível",
  "Documentação e due diligence",
  "Financiamento imobiliário",
  "Imóveis de alto padrão",
  "Imóveis para investimento",
  "Compra e venda de terrenos",
];

export function AboutPageClient() {
  const heroRef = useRef(null);
  const isInView = useInView(heroRef, { once: true });

  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(
    "Olá, Ediel! Gostaria de saber mais sobre seus serviços."
  )}`;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900 pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-48 h-[400px] w-[400px] rounded-full bg-blue-600/20 blur-[100px]" />
          <div className="absolute bottom-1/4 -right-48 h-[300px] w-[300px] rounded-full bg-blue-400/10 blur-[80px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/20 mb-6">
                <Users className="h-3.5 w-3.5" />
                Conheça Ediel Aguiar
              </div>
              <h1 className="font-display font-extrabold text-white text-4xl sm:text-5xl leading-[1.1] mb-5">
                Mais de 10 anos{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                  transformando
                </span>{" "}
                sonhos em realidade
              </h1>
              <p className="text-slate-400 text-base sm:text-lg leading-relaxed mb-6">
                Nascido e criado em São Paulo, Ediel Aguiar construiu uma carreira sólida no mercado imobiliário, guiado pela paixão de ajudar pessoas a encontrarem não apenas um imóvel, mas um lar.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="whatsapp" className="gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Falar com Ediel
                  </Button>
                </a>
                <Link href="/imoveis">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    Ver imóveis
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { value: "500+", label: "Imóveis negociados", icon: <TrendingUp className="h-5 w-5" /> },
                { value: "98%", label: "Satisfação dos clientes", icon: <Star className="h-5 w-5" /> },
                { value: "10+", label: "Anos de mercado", icon: <Award className="h-5 w-5" /> },
                { value: "12", label: "Cidades atendidas", icon: <MapPin className="h-5 w-5" /> },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="bg-white/[0.06] backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:bg-white/[0.09] transition-colors"
                >
                  <div className="h-9 w-9 rounded-xl bg-blue-500/15 flex items-center justify-center text-blue-400 mb-3">
                    {stat.icon}
                  </div>
                  <div className="font-display font-extrabold text-white text-2xl mb-0.5">{stat.value}</div>
                  <div className="text-slate-500 text-xs">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 30 C360 60 1080 0 1440 30 L1440 60 L0 60 Z" fill="white" />
          </svg>
        </div>
      </div>

      {/* About narrative */}
      <div className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="font-display font-bold text-zinc-900 text-3xl sm:text-4xl mb-6">
                Quem é Ediel Aguiar
              </h2>
              <div className="space-y-4 text-zinc-600 leading-relaxed">
                <p>
                  Com mais de uma década de experiência no mercado imobiliário de São Paulo, Ediel Aguiar se tornou referência em atendimento personalizado e negociações bem-sucedidas na capital e Grande São Paulo.
                </p>
                <p>
                  Especializado em imóveis residenciais e comerciais, Ediel atua com dedicação exclusiva a cada cliente, oferecendo uma consultoria completa desde a busca pelo imóvel ideal até a assinatura do contrato.
                </p>
                <p>
                  Sua abordagem diferenciada combina conhecimento técnico do mercado com uma escuta ativa das necessidades de cada família, investidor ou empresa que busca seus serviços.
                </p>
                <p>
                  Credenciado pelo CRECI-SP e membro ativo das principais associações imobiliárias do estado, Ediel mantém-se sempre atualizado com as tendências e oportunidades do mercado.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3">
                {expertise.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-zinc-700">
                    <CheckCircle2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Visual card */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-8 text-white">
                <div className="h-20 w-20 rounded-2xl bg-white/15 flex items-center justify-center font-display font-extrabold text-white text-3xl mx-auto mb-5">
                  EA
                </div>
                <div className="text-center">
                  <h3 className="font-display font-bold text-2xl mb-1">Ediel Aguiar</h3>
                  <p className="text-blue-100 text-sm mb-4">Corretor de Imóveis · {SITE_CONFIG.creci}</p>
                  <div className="flex justify-center gap-4 text-center">
                    {[
                      { value: "500+", label: "Imóveis" },
                      { value: "10+", label: "Anos" },
                      { value: "5★", label: "Avaliação" },
                    ].map((s) => (
                      <div key={s.label}>
                        <div className="font-display font-bold text-lg">{s.value}</div>
                        <div className="text-blue-200 text-xs">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white border border-zinc-100 rounded-2xl p-5 shadow-sm">
                <h3 className="font-display font-semibold text-zinc-900 mb-3">Área de atuação</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "São Paulo (SP)",
                    "Zona Sul",
                    "Zona Oeste",
                    "Centro Expandido",
                    "Guarulhos",
                    "Osasco",
                    "Santo André",
                    "São Bernardo do Campo",
                    "Cotia",
                    "Barueri",
                  ].map((area) => (
                    <span
                      key={area}
                      className="inline-flex items-center gap-1 text-xs font-medium text-zinc-700 bg-zinc-100 rounded-full px-2.5 py-1"
                    >
                      <MapPin className="h-3 w-3 text-zinc-400" />
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="py-20 bg-zinc-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-zinc-900 text-3xl sm:text-4xl mb-3">
              Uma trajetória de conquistas
            </h2>
            <p className="text-zinc-500">10 anos construindo uma carreira sólida e resultados excepcionais.</p>
          </div>

          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-zinc-200" />
            <div className="space-y-8">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  ref={heroRef}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: i * 0.1 }}
                  className="relative flex gap-6 pl-16"
                >
                  <div className="absolute left-0 h-12 w-12 rounded-2xl bg-white border-2 border-blue-200 flex items-center justify-center shadow-sm">
                    <span className="font-display font-bold text-blue-600 text-xs">{item.year}</span>
                  </div>
                  <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-5 flex-1">
                    <h3 className="font-display font-semibold text-zinc-900 mb-1">{item.title}</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-zinc-900 text-3xl sm:text-4xl mb-3">
              Missão e valores
            </h2>
            <p className="text-zinc-500 max-w-lg mx-auto">
              Os princípios que guiam cada atendimento e cada negociação.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white border border-zinc-100 rounded-2xl p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className={`h-12 w-12 rounded-xl ${value.bg} ${value.color} flex items-center justify-center mb-4`}>
                  {value.icon}
                </div>
                <h3 className="font-display font-semibold text-zinc-900 mb-2">{value.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-16 bg-zinc-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display font-bold text-white text-3xl mb-4">
            Vamos encontrar o seu imóvel?
          </h2>
          <p className="text-zinc-400 mb-8">
            Entre em contato e agende uma consultoria gratuita. Ediel está disponível para atender você.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="whatsapp" size="lg" className="gap-2">
                Falar no WhatsApp
              </Button>
            </a>
            <Link href="/imoveis">
              <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                Ver imóveis disponíveis
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
