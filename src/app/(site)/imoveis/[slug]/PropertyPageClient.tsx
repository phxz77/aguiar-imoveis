"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  BedDouble,
  Bath,
  Car,
  Maximize2,
  MapPin,
  Calendar,
  Heart,
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  CheckCircle2,
  ArrowLeft,
  Sun,
  Building,
  Hash,
  Copy,
  Check,
} from "lucide-react";
import { fetchSimilarProperties } from "@/lib/supabaseData";
import { formatCurrency, formatArea, buildWhatsAppUrl, getPropertyTypeLabel, getRelativeTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/imoveis/PropertyCard";
import { SITE_CONFIG, WHATSAPP_MESSAGES } from "@/lib/constants";
import { Property } from "@/types";

interface PropertyPageClientProps {
  property: Property;
}

export function PropertyPageClient({ property }: PropertyPageClientProps) {
  const [similar, setSimilar] = React.useState<Property[]>([]);

  React.useEffect(() => {
    fetchSimilarProperties(property).then(setSimilar);
  }, [property.id]);

  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  const whatsappUrl = buildWhatsAppUrl(
    WHATSAPP_MESSAGES.property(property.code, property.title),
    SITE_CONFIG.whatsapp
  );

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "";
  };

  const prevLightbox = useCallback(() => {
    setLightboxIndex((p) => (p - 1 + property.images.length) % property.images.length);
  }, [property.images.length]);

  const nextLightbox = useCallback(() => {
    setLightboxIndex((p) => (p + 1) % property.images.length);
  }, [property.images.length]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusVariant =
    property.status === "disponivel"
      ? "available"
      : property.status === "vendido"
        ? "sold"
        : property.status === "alugado"
          ? "rented"
          : "reserved";

  const statusLabel =
    property.status === "disponivel"
      ? "Disponível"
      : property.status === "vendido"
        ? "Vendido"
        : property.status === "alugado"
          ? "Alugado"
          : "Reservado";

  return (
    <div className="min-h-screen bg-zinc-50 pt-16 lg:pt-[72px]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-zinc-100 sticky top-16 lg:top-[72px] z-30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-zinc-500 overflow-hidden min-w-0">
            <Link href="/" className="hover:text-zinc-900 transition-colors shrink-0">Home</Link>
            <span className="shrink-0">/</span>
            <Link href="/imoveis" className="hover:text-zinc-900 transition-colors shrink-0">Imóveis</Link>
            <span className="shrink-0">/</span>
            <span className="text-zinc-900 font-medium truncate">{property.title}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={copyLink}
              className="h-9 w-9 rounded-xl border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:border-zinc-300 transition-all"
              title="Copiar link"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`h-9 w-9 rounded-xl border flex items-center justify-center transition-all ${
                isLiked
                  ? "bg-red-50 border-red-200 text-red-500"
                  : "border-zinc-200 text-zinc-500 hover:border-zinc-300"
              }`}
            >
              <Heart className="h-4 w-4" fill={isLiked ? "currentColor" : "none"} />
            </button>
            <Link href="/imoveis">
              <Button variant="outline" size="sm" className="gap-1.5">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Voltar</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid lg:grid-cols-[1fr_360px] gap-8">
          {/* Main content */}
          <div className="space-y-6">
            {/* Image Gallery */}
            <div className="space-y-2">
              <div
                className="relative h-[300px] sm:h-[420px] rounded-2xl overflow-hidden cursor-zoom-in group"
                onClick={() => openLightbox(activeImage)}
              >
                <Image
                  src={property.images[activeImage]}
                  alt={property.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  priority
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  {property.isFeatured && <Badge variant="featured">⭐ Destaque</Badge>}
                  <Badge variant={statusVariant}>{statusLabel}</Badge>
                </div>
                <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg px-2.5 py-1.5 text-white text-xs font-medium flex items-center gap-1.5">
                  <ZoomIn className="h-3.5 w-3.5" />
                  Tela cheia
                </div>
                <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-2.5 py-1.5 text-white text-xs font-medium">
                  {activeImage + 1} / {property.images.length}
                </div>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {property.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative h-14 sm:h-20 rounded-xl overflow-hidden transition-all duration-200 ${
                      activeImage === i
                        ? "ring-2 ring-blue-500 ring-offset-2"
                        : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Foto ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="100px"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Property details card */}
            <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 text-zinc-500 text-sm mb-2">
                    <span className="uppercase tracking-wide font-medium">
                      {getPropertyTypeLabel(property.type)}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Hash className="h-3.5 w-3.5" />
                      {property.code}
                    </span>
                  </div>
                  <h1 className="font-display font-bold text-zinc-900 text-2xl sm:text-3xl leading-tight">
                    {property.title}
                  </h1>
                  <div className="flex items-center gap-1.5 text-zinc-500 mt-2">
                    <MapPin className="h-4 w-4 flex-shrink-0 text-zinc-400" />
                    <span>{property.neighborhood}, {property.city} — {property.state}</span>
                  </div>
                </div>
                <div className="sm:text-right">
                  <p className="text-xs font-medium text-zinc-400 mb-1">
                    {property.transactionType === "aluguel" ? "Aluguel/mês" : "Valor"}
                  </p>
                  <p className="font-display font-extrabold text-zinc-900 text-2xl sm:text-3xl">
                    {formatCurrency(property.price)}
                    {property.transactionType === "aluguel" && <span className="text-sm font-normal text-zinc-400">/mês</span>}
                  </p>
                  {property.condoFee && (
                    <p className="text-xs text-zinc-400 mt-1">
                      Condomínio: {formatCurrency(property.condoFee)}/mês
                    </p>
                  )}
                  {property.iptu && (
                    <p className="text-xs text-zinc-400">
                      IPTU: {formatCurrency(property.iptu)}/ano
                    </p>
                  )}
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-5 border-y border-zinc-100">
                {[
                  { icon: <BedDouble className="h-5 w-5" />, value: property.bedrooms, label: `Quarto${property.bedrooms > 1 ? "s" : ""}`, show: property.bedrooms > 0 },
                  { icon: <Bath className="h-5 w-5" />, value: property.bathrooms, label: `Banheiro${property.bathrooms > 1 ? "s" : ""}`, show: property.bathrooms > 0 },
                  { icon: <Car className="h-5 w-5" />, value: property.parkingSpots, label: `Vaga${property.parkingSpots > 1 ? "s" : ""}`, show: property.parkingSpots > 0 },
                  { icon: <Maximize2 className="h-5 w-5" />, value: formatArea(property.area), label: "Área total", show: true },
                ].filter((s) => s.show).map((stat, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-zinc-50">
                    <div className="text-blue-600">{stat.icon}</div>
                    <span className="font-display font-bold text-zinc-900 text-lg">{stat.value}</span>
                    <span className="text-xs text-zinc-500">{stat.label}</span>
                  </div>
                ))}
              </div>

              {/* Extra info */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                {property.floor && (
                  <div className="flex items-center gap-2 text-sm text-zinc-600">
                    <Building className="h-4 w-4 text-zinc-400" />
                    <span>Andar {property.floor}/{property.totalFloors}</span>
                  </div>
                )}
                {property.yearBuilt && (
                  <div className="flex items-center gap-2 text-sm text-zinc-600">
                    <Calendar className="h-4 w-4 text-zinc-400" />
                    <span>Construído em {property.yearBuilt}</span>
                  </div>
                )}
                {property.sunPosition && (
                  <div className="flex items-center gap-2 text-sm text-zinc-600">
                    <Sun className="h-4 w-4 text-zinc-400" />
                    <span>Posição {property.sunPosition}</span>
                  </div>
                )}
                {property.finishingLevel && (
                  <div className="flex items-center gap-2 text-sm text-zinc-600">
                    <CheckCircle2 className="h-4 w-4 text-zinc-400" />
                    <span>{property.finishingLevel}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-zinc-600">
                  <Calendar className="h-4 w-4 text-zinc-400" />
                  <span>Publicado {getRelativeTime(property.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
              <h2 className="font-display font-semibold text-zinc-900 text-lg mb-4">Descrição</h2>
              <p className="text-zinc-600 leading-relaxed whitespace-pre-line">{property.description}</p>
            </div>

            {/* Features */}
            {property.features.length > 0 && (
              <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
                <h2 className="font-display font-semibold text-zinc-900 text-lg mb-4">Características e diferenciais</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {property.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm text-zinc-700">
                      <div className="h-5 w-5 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />
                      </div>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
              <h2 className="font-display font-semibold text-zinc-900 text-lg mb-4">Localização</h2>
              <p className="text-zinc-500 text-sm mb-3 flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {property.neighborhood}, {property.city} — {property.state}
              </p>
              <div className="relative h-48 rounded-xl overflow-hidden bg-zinc-100">
                <iframe
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(`${property.neighborhood}, ${property.city}, ${property.state}`)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localização do imóvel"
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="lg:sticky lg:top-28 space-y-4">
              <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-5">
                <div className="text-center mb-5">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center font-display font-bold text-white text-2xl mx-auto mb-3">
                    EA
                  </div>
                  <p className="font-display font-bold text-zinc-900">Ediel Aguiar</p>
                  <p className="text-zinc-500 text-sm">Corretor de Imóveis</p>
                  <p className="text-xs text-zinc-400 mt-1">{SITE_CONFIG.creci}</p>
                  <div className="flex items-center justify-center gap-1.5 mt-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-emerald-600 text-xs font-medium">Disponível agora</span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold py-3 rounded-xl transition-all duration-200 hover:shadow-lg"
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Tenho interesse
                  </a>
                  <a
                    href={`tel:${SITE_CONFIG.phone}`}
                    className="flex items-center justify-center gap-2 w-full bg-white hover:bg-zinc-50 text-zinc-900 font-semibold py-3 rounded-xl border border-zinc-200 transition-all duration-200"
                  >
                    Ligar agora
                  </a>
                  <Link
                    href="/contato"
                    className="flex items-center justify-center gap-2 w-full text-zinc-600 font-medium py-2.5 text-sm hover:text-zinc-900 transition-colors"
                  >
                    Enviar mensagem
                  </Link>
                </div>
              </div>

              {/* Share */}
              <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-4">
                <p className="text-sm font-medium text-zinc-700 mb-3">Compartilhar imóvel</p>
                <div className="flex gap-2">
                  <button
                    onClick={copyLink}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl border border-zinc-200 text-zinc-600 text-sm hover:border-zinc-300 hover:bg-zinc-50 transition-all"
                  >
                    {copied ? (
                      <><Check className="h-4 w-4 text-emerald-500" /> Copiado!</>
                    ) : (
                      <><Copy className="h-4 w-4" /> Copiar link</>
                    )}
                  </button>
                </div>
              </div>

              {/* Simulator teaser */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-100 rounded-2xl p-4">
                <p className="font-display font-semibold text-blue-900 text-sm mb-1">💡 Simulador de financiamento</p>
                <p className="text-blue-700/70 text-xs mb-3">Calcule as parcelas do seu financiamento habitacional</p>
                <Link href="/contato">
                  <Button size="sm" variant="outline" className="w-full text-blue-700 border-blue-200 hover:bg-blue-50">
                    Solicitar simulação
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Similar properties */}
        {similar.length > 0 && (
          <div className="mt-12">
            <h2 className="font-display font-bold text-zinc-900 text-2xl mb-6">
              Imóveis semelhantes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {similar.map((p, i) => (
                <PropertyCard key={p.id} property={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/10 text-white text-sm font-medium px-3 py-1.5 rounded-full">
              {lightboxIndex + 1} / {property.images.length}
            </div>

            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative w-full h-full max-w-5xl max-h-[80vh] mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={property.images[lightboxIndex]}
                alt={`${property.title} - foto ${lightboxIndex + 1}`}
                fill
                className="object-contain"
                sizes="90vw"
                priority
              />
            </motion.div>

            <button
              onClick={(e) => { e.stopPropagation(); prevLightbox(); }}
              className="absolute left-1 sm:left-4 h-9 w-9 sm:h-12 sm:w-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextLightbox(); }}
              className="absolute right-1 sm:right-4 h-9 w-9 sm:h-12 sm:w-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            <div
              className="absolute bottom-2 sm:bottom-4 left-0 right-0 flex gap-2 px-4 overflow-x-auto justify-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              onClick={(e) => e.stopPropagation()}
            >
              {property.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setLightboxIndex(i)}
                  className={`relative h-10 w-14 sm:h-12 sm:w-16 rounded-lg overflow-hidden flex-shrink-0 transition-all ${
                    i === lightboxIndex ? "ring-2 ring-white" : "opacity-50 hover:opacity-75"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" sizes="64px" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
