"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  Clock,
  CheckCircle2,
} from "lucide-react";

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SITE_CONFIG } from "@/lib/constants";

const interests = [
  { value: "compra", label: "Comprar imóvel" },
  { value: "aluguel", label: "Alugar imóvel" },
  { value: "venda", label: "Vender imóvel" },
  { value: "outros", label: "Outros" },
];

export function ContactPageClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    interest: "compra",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(
    "Olá, Ediel! Gostaria de entrar em contato."
  )}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. Envia notificação para o Telegram do corretor (silencioso se não configurado)
    fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    }).catch(() => {/* falha silenciosa */});

    // 2. Abre WhatsApp para o cliente finalizar o contato
    const waMsg = `Olá, Ediel! Meu nome é *${formData.name}*.\n\nInteresse: ${interests.find(i => i.value === formData.interest)?.label}\nE-mail: ${formData.email}\nTelefone: ${formData.phone}\n\nMensagem: ${formData.message}`;
    window.open(`https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(waMsg)}`, "_blank");

    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900 pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-48 h-[300px] w-[300px] rounded-full bg-blue-600/20 blur-[100px]" />
          <div className="absolute bottom-1/4 -right-48 h-[300px] w-[300px] rounded-full bg-blue-400/10 blur-[80px]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/20 mb-6">
              <MessageCircle className="h-3.5 w-3.5" />
              Fale com Ediel Aguiar
            </div>
            <h1 className="font-display font-extrabold text-white text-4xl sm:text-5xl leading-tight mb-4">
              Entre em contato
            </h1>
            <p className="text-slate-400 text-lg max-w-lg mx-auto">
              Tire suas dúvidas, agende uma visita ou receba uma consultoria personalizada.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 30 C360 60 1080 0 1440 30 L1440 60 L0 60 Z" fill="white" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left — contact info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div>
                <h2 className="font-display font-bold text-zinc-900 text-2xl mb-2">
                  Vamos conversar?
                </h2>
                <p className="text-zinc-500 leading-relaxed">
                  Resposta rápida e atendimento personalizado. Ediel está disponível para ajudar você a encontrar o imóvel perfeito.
                </p>
              </div>

              {/* Contact channels */}
              <div className="space-y-3">
                {[
                  {
                    icon: <MessageCircle className="h-5 w-5" />,
                    label: "WhatsApp",
                    value: SITE_CONFIG.whatsappDisplay,
                    sub: "Resposta em até 15 minutos",
                    href: whatsappUrl,
                    external: true,
                    color: "from-[#25D366] to-[#20BD5A]",
                    textColor: "text-[#25D366]",
                  },
                  {
                    icon: <Phone className="h-5 w-5" />,
                    label: "Telefone",
                    value: SITE_CONFIG.whatsappDisplay,
                    sub: "Seg–Sab das 8h às 20h",
                    href: `tel:${SITE_CONFIG.phone}`,
                    external: false,
                    color: "from-blue-500 to-blue-600",
                    textColor: "text-blue-600",
                  },
                  {
                    icon: <Mail className="h-5 w-5" />,
                    label: "E-mail",
                    value: SITE_CONFIG.email,
                    sub: "Resposta em até 24h",
                    href: `mailto:${SITE_CONFIG.email}`,
                    external: false,
                    color: "from-violet-500 to-violet-600",
                    textColor: "text-violet-600",
                  },
                  {
                    icon: <MapPin className="h-5 w-5" />,
                    label: "Área de atuação",
                    value: SITE_CONFIG.region,
                    sub: "Atendimento presencial e remoto",
                    href: "#",
                    external: false,
                    color: "from-emerald-500 to-emerald-600",
                    textColor: "text-emerald-600",
                  },
                ].map((item, i) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    className="flex items-center gap-4 p-4 bg-zinc-50 hover:bg-zinc-100 border border-zinc-100 rounded-2xl transition-all duration-200 group"
                  >
                    <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-zinc-500 mb-0.5">{item.label}</p>
                      <p className="font-semibold text-zinc-900">{item.value}</p>
                      <p className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
                        <Clock className="h-3 w-3" />
                        {item.sub}
                      </p>
                    </div>
                  </motion.a>
                ))}
              </div>

              {/* Social */}
              <div>
                <p className="text-sm font-medium text-zinc-700 mb-3">Siga nas redes sociais</p>
                <div className="flex gap-2">
                  {[
                    { href: SITE_CONFIG.social.instagram, icon: <InstagramIcon />, label: "Instagram" },
                    { href: SITE_CONFIG.social.facebook, icon: <FacebookIcon />, label: "Facebook" },
                  ].map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-10 w-10 rounded-xl border border-zinc-200 flex items-center justify-center text-zinc-600 hover:text-zinc-900 hover:border-zinc-300 hover:bg-zinc-50 transition-all"
                      aria-label={s.label}
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>

              {/* Map */}
              <div className="rounded-2xl overflow-hidden border border-zinc-100 h-48">
                <iframe
                  src="https://maps.google.com/maps?q=S%C3%A3o+Paulo,+SP&t=&z=11&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Área de atuação"
                />
              </div>
            </motion.div>

            {/* Right — form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {submitted ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
                      <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                    </div>
                    <h3 className="font-display font-bold text-zinc-900 text-2xl mb-2">
                      Mensagem enviada!
                    </h3>
                    <p className="text-zinc-500 mb-6">
                      Você será redirecionado ao WhatsApp. Ediel responderá em breve!
                    </p>
                    <Button onClick={() => setSubmitted(false)} variant="outline">
                      Enviar outra mensagem
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-zinc-100 rounded-2xl shadow-sm p-6 sm:p-8">
                  <h3 className="font-display font-semibold text-zinc-900 text-xl mb-5">
                    Enviar mensagem
                  </h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                          Nome completo *
                        </label>
                        <Input
                          type="text"
                          placeholder="Seu nome"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                          Telefone / WhatsApp
                        </label>
                        <Input
                          type="tel"
                          placeholder="(11) 99999-9999"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1.5">E-mail *</label>
                      <Input
                        type="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                        Tenho interesse em
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {interests.map((int) => (
                          <button
                            key={int.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, interest: int.value })}
                            className={`py-2.5 px-4 rounded-xl border text-sm font-medium transition-all ${
                              formData.interest === int.value
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300"
                            }`}
                          >
                            {int.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                        Mensagem *
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Descreva o que você está procurando, orçamento, região preferida..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        className="w-full rounded-[10px] border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all hover:border-zinc-300"
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full gap-2" loading={loading}>
                      <Send className="h-4 w-4" />
                      Enviar mensagem via WhatsApp
                    </Button>

                    <p className="text-xs text-zinc-400 text-center">
                      Ao enviar, você será redirecionado ao WhatsApp para finalizar o contato.
                    </p>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
