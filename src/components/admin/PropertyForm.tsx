"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Save, X, CheckCircle2, ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ImageUploadZone } from "@/components/admin/ImageUploadZone";
import { Property, PropertyType, PropertyStatus, TransactionType } from "@/types";
import { adminCreateProperty, adminUpdateProperty } from "@/lib/supabaseAdmin";
import { PROPERTY_TYPES, CITIES, FEATURES_CATEGORIES } from "@/lib/constants";
import { generateCode } from "@/lib/utils";
import { generatePropertyId } from "@/lib/supabaseStorage";
import { cn } from "@/lib/utils";

// ── Componentes auxiliares fora do PropertyForm ─────────────────
// CRÍTICO: definir esses componentes FORA evita que React os trate como
// novos tipos a cada re-render, o que causava unmount/remount do
// ImageUploadZone no meio do upload, perdendo o estado das fotos.

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-[#e2e6ed] shadow-sm p-5 sm:p-6 space-y-4">
      <h2 className="font-display font-semibold text-[#0B2344] border-b border-[#e2e6ed] pb-3 text-sm uppercase tracking-wide">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Row({ children, cols = 2 }: { children: React.ReactNode; cols?: number }) {
  return (
    <div className={cn("grid gap-4", {
      "grid-cols-1 sm:grid-cols-2": cols === 2,
      "grid-cols-1 sm:grid-cols-3": cols === 3,
      "grid-cols-2 sm:grid-cols-4": cols === 4,
    })}>
      {children}
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#0B2344]/70 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

// ── Seletor de características categorizado ──────────────────────
function FeaturesSection({
  features,
  onChange,
}: {
  features: string[];
  onChange: (v: string[]) => void;
}) {
  const [openCategories, setOpenCategories] = React.useState<string[]>(
    // abre de início as categorias que já têm itens selecionados
    () => FEATURES_CATEGORIES.filter((cat) => cat.options.some((o) => features.includes(o))).map((c) => c.id)
  );
  const [customInput, setCustomInput] = React.useState("");

  const toggle = (option: string) => {
    onChange(features.includes(option) ? features.filter((f) => f !== option) : [...features, option]);
  };

  const addCustom = () => {
    const v = customInput.trim();
    if (v && !features.includes(v)) {
      onChange([...features, v]);
      setCustomInput("");
    }
  };

  const toggleCategory = (id: string) => {
    setOpenCategories((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);
  };

  const totalSelected = features.length;

  return (
    <div className="bg-white rounded-2xl border border-[#e2e6ed] shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#e2e6ed]">
        <h2 className="font-display font-semibold text-[#0B2344] text-sm uppercase tracking-wide">
          Diferenciais e características
        </h2>
        {totalSelected > 0 && (
          <span className="bg-[#0B2344] text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
            {totalSelected} selecionado{totalSelected !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Categorias */}
      <div className="divide-y divide-[#e2e6ed]">
        {FEATURES_CATEGORIES.map((cat) => {
          const isOpen = openCategories.includes(cat.id);
          const selectedInCat = cat.options.filter((o) => features.includes(o)).length;

          return (
            <div key={cat.id}>
              {/* Category header */}
              <button
                type="button"
                onClick={() => toggleCategory(cat.id)}
                className="w-full flex items-center justify-between px-5 sm:px-6 py-3.5 hover:bg-[#F7F8FA] transition-colors text-left"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg leading-none">{cat.emoji}</span>
                  <span className="font-medium text-[#0B2344] text-sm">{cat.label}</span>
                  {selectedInCat > 0 && (
                    <span className="bg-[#C79A3B] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                      {selectedInCat}
                    </span>
                  )}
                </div>
                <ChevronDown
                  className={cn("h-4 w-4 text-[#0B2344]/40 transition-transform duration-200", isOpen && "rotate-180")}
                />
              </button>

              {/* Options */}
              {isOpen && (
                <div className="px-5 sm:px-6 pb-4 flex flex-wrap gap-2">
                  {cat.options.map((option) => {
                    const selected = features.includes(option);
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => toggle(option)}
                        className={cn(
                          "px-3 py-1.5 rounded-xl border text-sm font-medium transition-all duration-150 select-none",
                          selected
                            ? "bg-[#0B2344] text-white border-[#0B2344]"
                            : "bg-white text-[#0B2344]/60 border-[#e2e6ed] hover:border-[#0B2344]/30 hover:text-[#0B2344]"
                        )}
                      >
                        {selected && <span className="mr-1 text-[#C79A3B]">✓</span>}
                        {option}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Custom feature */}
      <div className="px-5 sm:px-6 py-4 bg-[#F7F8FA] border-t border-[#e2e6ed]">
        <p className="text-xs font-semibold text-[#0B2344]/40 uppercase tracking-wide mb-2.5">
          Adicionar característica personalizada
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ex: Jardim zen, Piso de mármore..."
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustom())}
            className="flex-1 rounded-xl border border-[#e2e6ed] bg-white px-3 py-2 text-sm text-[#0B2344] placeholder:text-[#0B2344]/35 focus:outline-none focus:ring-2 focus:ring-[#C79A3B]/40 focus:border-[#C79A3B]"
          />
          <button
            type="button"
            onClick={addCustom}
            disabled={!customInput.trim()}
            className="flex items-center gap-1.5 bg-[#0B2344] disabled:opacity-40 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#0B2344]/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Adicionar
          </button>
        </div>

        {/* Custom / non-category features (e.g. from older data or custom additions) */}
        {features.filter((f) => !FEATURES_CATEGORIES.flatMap((c) => c.options).includes(f)).length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {features
              .filter((f) => !FEATURES_CATEGORIES.flatMap((c) => c.options).includes(f))
              .map((f) => (
                <span
                  key={f}
                  className="inline-flex items-center gap-1.5 bg-[#0B2344] text-white text-xs font-medium px-3 py-1.5 rounded-xl"
                >
                  {f}
                  <button type="button" onClick={() => toggle(f)} className="hover:text-red-300 transition-colors">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface PropertyFormProps {
  property?: Property;
  mode: "create" | "edit";
}

type FormData = {
  title: string;
  description: string;
  price: string;
  condoFee: string;
  iptu: string;
  type: PropertyType;
  transactionType: TransactionType;
  status: PropertyStatus;
  bedrooms: string;
  bathrooms: string;
  parkingSpots: string;
  area: string;
  usefulArea: string;
  city: string;
  neighborhood: string;
  address: string;
  state: string;
  code: string;
  images: string[];
  features: string[];
  isFeatured: boolean;
  isAvailable: boolean;
  floor: string;
  totalFloors: string;
  yearBuilt: string;
  sunPosition: string;
  finishingLevel: string;
};

function toFormData(property?: Property): FormData {
  if (!property) {
    return {
      title: "", description: "", price: "", condoFee: "", iptu: "",
      type: "sobrado", transactionType: "venda", status: "disponivel",
      bedrooms: "", bathrooms: "", parkingSpots: "", area: "", usefulArea: "",
      city: "São Paulo", neighborhood: "", address: "", state: "SP",
      code: generateCode(), images: [], features: [],
      isFeatured: false, isAvailable: true,
      floor: "", totalFloors: "", yearBuilt: "", sunPosition: "", finishingLevel: "",
    };
  }
  return {
    title: property.title, description: property.description,
    price: String(property.price), condoFee: property.condoFee ? String(property.condoFee) : "",
    iptu: property.iptu ? String(property.iptu) : "",
    type: property.type, transactionType: property.transactionType, status: property.status,
    bedrooms: String(property.bedrooms), bathrooms: String(property.bathrooms),
    parkingSpots: String(property.parkingSpots), area: String(property.area),
    usefulArea: property.usefulArea ? String(property.usefulArea) : "",
    city: property.city, neighborhood: property.neighborhood, address: property.address || "",
    state: property.state, code: property.code, images: [...property.images],
    features: [...property.features], isFeatured: property.isFeatured, isAvailable: property.isAvailable,
    floor: property.floor ? String(property.floor) : "",
    totalFloors: property.totalFloors ? String(property.totalFloors) : "",
    yearBuilt: property.yearBuilt ? String(property.yearBuilt) : "",
    sunPosition: property.sunPosition || "", finishingLevel: property.finishingLevel || "",
  };
}

export function PropertyForm({ property, mode }: PropertyFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(() => toFormData(property));
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagesUploading, setImagesUploading] = useState(false);

  // Stable property ID for image uploads
  const [propertyId] = useState(() => property?.id || generatePropertyId());

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleFeature = (feature: string) => {
    if (formData.features.includes(feature)) {
      update("features", formData.features.filter((f) => f !== feature));
    } else {
      update("features", [...formData.features, feature]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Trava de segurança: nunca salvar enquanto alguma foto ainda está subindo.
    // Sem isso, fotos com upload mais lento ficariam de fora do imóvel salvo.
    if (imagesUploading) {
      setError("Aguarde o upload de todas as fotos terminar antes de salvar.");
      return;
    }

    setLoading(true);

    const data = {
      title: formData.title,
      description: formData.description,
      price: Number(formData.price) || 0,
      condoFee: formData.condoFee ? Number(formData.condoFee) : undefined,
      iptu: formData.iptu ? Number(formData.iptu) : undefined,
      type: formData.type,
      transactionType: formData.transactionType,
      status: formData.status,
      bedrooms: Number(formData.bedrooms) || 0,
      bathrooms: Number(formData.bathrooms) || 0,
      parkingSpots: Number(formData.parkingSpots) || 0,
      area: Number(formData.area) || 0,
      usefulArea: formData.usefulArea ? Number(formData.usefulArea) : undefined,
      city: formData.city,
      neighborhood: formData.neighborhood,
      address: formData.address || undefined,
      state: formData.state,
      code: formData.code,
      images: formData.images,
      features: formData.features,
      isFeatured: formData.isFeatured,
      isAvailable: formData.isAvailable,
      floor: formData.floor ? Number(formData.floor) : undefined,
      totalFloors: formData.totalFloors ? Number(formData.totalFloors) : undefined,
      yearBuilt: formData.yearBuilt ? Number(formData.yearBuilt) : undefined,
      sunPosition: formData.sunPosition || undefined,
      finishingLevel: formData.finishingLevel || undefined,
    };

    try {
      let savedSlug: string | undefined;

      if (mode === "create") {
        const created = await adminCreateProperty(data);
        if (!created) throw new Error("Erro ao criar imóvel");
        savedSlug = created.slug;
      } else if (property) {
        const updated = await adminUpdateProperty(property.id, data);
        if (!updated) throw new Error("Erro ao atualizar imóvel");
        savedSlug = updated.slug;
      }

      // Limpa o cache da página pública imediatamente — sem isso, a
      // galeria do imóvel podia mostrar fotos antigas por até 60s (ISR).
      fetch("/api/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: savedSlug, oldSlug: property?.slug }),
      }).catch((e) => console.warn("[Revalidate] Falhou ao atualizar cache:", e));

      setSaved(true);
      setTimeout(() => router.push("/admin/imoveis"), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 sm:p-6 max-w-4xl mx-auto space-y-5 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-display font-bold text-[#0B2344] text-xl sm:text-2xl truncate">
            {mode === "create" ? "Novo imóvel" : "Editar imóvel"}
          </h1>
          <p className="text-[#0B2344]/45 text-xs sm:text-sm mt-0.5 truncate">
            {mode === "create" ? "Preencha os dados para cadastrar" : property?.title}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button type="button" variant="outline" size="sm" onClick={() => router.push("/admin/imoveis")}>
            <X className="h-4 w-4 sm:mr-1" />
            <span className="hidden sm:inline">Cancelar</span>
          </Button>
          <button
            type="submit"
            disabled={loading || saved || imagesUploading}
            className={cn(
              "hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200",
              saved
                ? "bg-emerald-600 text-white"
                : "bg-[#0B2344] hover:bg-[#0B2344]/90 text-white disabled:opacity-60"
            )}
          >
            {loading ? (
              <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Salvando...</>
            ) : saved ? (
              <><CheckCircle2 className="h-4 w-4" /> Salvo!</>
            ) : imagesUploading ? (
              <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Enviando fotos...</>
            ) : (
              <><Save className="h-4 w-4" /> Salvar imóvel</>
            )}
          </button>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm"
        >
          ⚠️ {error}
        </motion.div>
      )}

      {/* Informações básicas */}
      <Section title="Informações básicas">
        <Field label="Título" required>
          <Input type="text" placeholder="Ex: Sobrado Alto Padrão — Penha com 3 suítes"
            value={formData.title} onChange={(e) => update("title", e.target.value)} required />
        </Field>
        <Field label="Descrição" required>
          <textarea rows={5} placeholder="Descreva o imóvel em detalhes..."
            value={formData.description} onChange={(e) => update("description", e.target.value)} required
            className="w-full rounded-[10px] border border-zinc-200 bg-white px-4 py-2.5 text-sm text-[#0B2344] placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#C79A3B]/40 focus:border-[#C79A3B] resize-none hover:border-zinc-300 transition-all" />
        </Field>
        <Row cols={3}>
          <Field label="Tipo" required>
            <Select value={formData.type} onChange={(e) => update("type", e.target.value as PropertyType)} required>
              {PROPERTY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </Select>
          </Field>
          <Field label="Operação" required>
            <Select value={formData.transactionType} onChange={(e) => update("transactionType", e.target.value as TransactionType)}>
              <option value="venda">Venda</option>
              <option value="aluguel">Aluguel</option>
              <option value="ambos">Venda e Aluguel</option>
            </Select>
          </Field>
          <Field label="Status" required>
            <Select value={formData.status} onChange={(e) => update("status", e.target.value as PropertyStatus)}>
              <option value="disponivel">Disponível</option>
              <option value="reservado">Reservado</option>
              <option value="vendido">Vendido</option>
              <option value="alugado">Alugado</option>
            </Select>
          </Field>
        </Row>
        <Row>
          <Field label="Código do imóvel" required>
            <Input type="text" value={formData.code} onChange={(e) => update("code", e.target.value)} required />
          </Field>
          <div className="flex items-center gap-5 pt-7">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.isFeatured} onChange={(e) => update("isFeatured", e.target.checked)}
                className="h-4 w-4 rounded border-zinc-300 accent-[#C79A3B] cursor-pointer" />
              <span className="text-sm font-medium text-[#0B2344]/70">⭐ Destacar</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.isAvailable} onChange={(e) => update("isAvailable", e.target.checked)}
                className="h-4 w-4 rounded border-zinc-300 accent-[#0B2344] cursor-pointer" />
              <span className="text-sm font-medium text-[#0B2344]/70">Disponível</span>
            </label>
          </div>
        </Row>
      </Section>

      {/* Valores */}
      <Section title="Valores">
        <Row cols={3}>
          <Field label="Preço (R$)" required>
            <Input type="number" placeholder="410000" value={formData.price} onChange={(e) => update("price", e.target.value)} required />
          </Field>
          <Field label="Condomínio (R$/mês)">
            <Input type="number" placeholder="800" value={formData.condoFee} onChange={(e) => update("condoFee", e.target.value)} />
          </Field>
          <Field label="IPTU (R$/ano)">
            <Input type="number" placeholder="2400" value={formData.iptu} onChange={(e) => update("iptu", e.target.value)} />
          </Field>
        </Row>
      </Section>

      {/* Características */}
      <Section title="Características do imóvel">
        <Row cols={4}>
          <Field label="Dormitórios">
            <Input type="number" min="0" placeholder="0" value={formData.bedrooms} onChange={(e) => update("bedrooms", e.target.value)} />
          </Field>
          <Field label="Banheiros">
            <Input type="number" min="0" placeholder="0" value={formData.bathrooms} onChange={(e) => update("bathrooms", e.target.value)} />
          </Field>
          <Field label="Vagas">
            <Input type="number" min="0" placeholder="0" value={formData.parkingSpots} onChange={(e) => update("parkingSpots", e.target.value)} />
          </Field>
          <Field label="Área (m²)" required>
            <Input type="number" placeholder="63" value={formData.area} onChange={(e) => update("area", e.target.value)} required />
          </Field>
        </Row>
        <Row>
          <Field label="Área útil (m²)">
            <Input type="number" placeholder="58" value={formData.usefulArea} onChange={(e) => update("usefulArea", e.target.value)} />
          </Field>
          <Field label="Acabamento">
            <Select value={formData.finishingLevel} onChange={(e) => update("finishingLevel", e.target.value)}>
              <option value="">Selecionar</option>
              {["Padrão","Médio padrão","Médio-alto padrão","Alto padrão","Altíssimo padrão","Luxo"].map(o => <option key={o}>{o}</option>)}
            </Select>
          </Field>
        </Row>
        <Row>
          <Field label="Andar">
            <Input type="number" placeholder="2" value={formData.floor} onChange={(e) => update("floor", e.target.value)} />
          </Field>
          <Field label="Total de andares">
            <Input type="number" placeholder="2" value={formData.totalFloors} onChange={(e) => update("totalFloors", e.target.value)} />
          </Field>
        </Row>
        <Row>
          <Field label="Ano de construção">
            <Input type="number" placeholder="2020" value={formData.yearBuilt} onChange={(e) => update("yearBuilt", e.target.value)} />
          </Field>
          <Field label="Posição solar">
            <Select value={formData.sunPosition} onChange={(e) => update("sunPosition", e.target.value)}>
              <option value="">Selecionar</option>
              {["Norte","Sul","Leste","Oeste","Nordeste","Noroeste","Sudeste","Sudoeste"].map(o => <option key={o}>{o}</option>)}
            </Select>
          </Field>
        </Row>
      </Section>

      {/* Localização */}
      <Section title="Localização">
        <Row>
          <Field label="Cidade" required>
            <Select value={formData.city} onChange={(e) => update("city", e.target.value)}>
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
          </Field>
          <Field label="Estado">
            <Input type="text" value={formData.state} onChange={(e) => update("state", e.target.value)} placeholder="SP" />
          </Field>
        </Row>
        <Row>
          <Field label="Bairro" required>
            <Input type="text" placeholder="Ex: Penha" value={formData.neighborhood} onChange={(e) => update("neighborhood", e.target.value)} required />
          </Field>
          <Field label="Endereço">
            <Input type="text" placeholder="Ex: Rua Francisco Coimbra, 333" value={formData.address} onChange={(e) => update("address", e.target.value)} />
          </Field>
        </Row>
      </Section>

      {/* Fotos */}
      <Section title="Fotos do imóvel">
        <p className="text-sm text-[#0B2344]/50 -mt-2">
          Adicione quantas fotos quiser. A primeira foto será a imagem principal nos cards.
        </p>
        <ImageUploadZone
          images={formData.images}
          onChange={(images) => update("images", images)}
          propertyId={propertyId}
          onUploadingChange={setImagesUploading}
        />
        {imagesUploading && (
          <p className="flex items-center gap-2 text-sm text-[#C79A3B] font-medium">
            <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            Enviando fotos — o botão Salvar será liberado assim que terminar.
          </p>
        )}
      </Section>

      {/* Diferenciais categorizados */}
      <FeaturesSection features={formData.features} onChange={(f) => update("features", f)} />

      {/* Submit footer */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/imoveis")} className="w-full sm:w-auto">
          Cancelar
        </Button>
        <button
          type="submit"
          disabled={loading || saved || imagesUploading}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0B2344] hover:bg-[#0B2344]/90 disabled:opacity-60 text-white font-bold px-8 py-3 rounded-xl transition-all duration-200"
        >
          {loading ? (
            <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Salvando...</>
          ) : saved ? (
            <><CheckCircle2 className="h-4 w-4 text-emerald-300" /> Salvo com sucesso!</>
          ) : imagesUploading ? (
            <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Enviando fotos...</>
          ) : (
            <><Save className="h-4 w-4" />{mode === "create" ? "Cadastrar imóvel" : "Salvar alterações"}</>
          )}
        </button>
      </div>
    </form>
  );
}
