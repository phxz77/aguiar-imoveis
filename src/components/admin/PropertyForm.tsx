"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Save, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ImageUploadZone } from "@/components/admin/ImageUploadZone";
import { Property, PropertyType, PropertyStatus, TransactionType } from "@/types";
import { adminCreateProperty, adminUpdateProperty } from "@/lib/supabaseAdmin";
import { PROPERTY_TYPES, CITIES, FEATURES_LIST } from "@/lib/constants";
import { generateCode } from "@/lib/utils";
import { generatePropertyId } from "@/lib/supabaseStorage";
import { cn } from "@/lib/utils";

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
      if (mode === "create") {
        const created = await adminCreateProperty(data);
        if (!created) throw new Error("Erro ao criar imóvel");
      } else if (property) {
        const updated = await adminUpdateProperty(property.id, data);
        if (!updated) throw new Error("Erro ao atualizar imóvel");
      }
      setSaved(true);
      setTimeout(() => router.push("/admin/imoveis"), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-2xl border border-[#e2e6ed] shadow-sm p-5 sm:p-6 space-y-4">
      <h2 className="font-display font-semibold text-[#0B2344] border-b border-[#e2e6ed] pb-3 text-sm uppercase tracking-wide">
        {title}
      </h2>
      {children}
    </div>
  );

  const Row = ({ children, cols = 2 }: { children: React.ReactNode; cols?: number }) => (
    <div className={cn("grid gap-4", {
      "grid-cols-1 sm:grid-cols-2": cols === 2,
      "grid-cols-1 sm:grid-cols-3": cols === 3,
      "grid-cols-2 sm:grid-cols-4": cols === 4,
    })}>
      {children}
    </div>
  );

  const Field = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
    <div>
      <label className="block text-sm font-medium text-[#0B2344]/70 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );

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
            disabled={loading || saved}
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
        />
      </Section>

      {/* Diferenciais */}
      <Section title="Diferenciais e características">
        <div className="flex flex-wrap gap-2">
          {FEATURES_LIST.map((feature) => (
            <button
              key={feature}
              type="button"
              onClick={() => toggleFeature(feature)}
              className={cn(
                "px-3 py-1.5 rounded-xl border text-sm font-medium transition-all duration-150",
                formData.features.includes(feature)
                  ? "bg-[#0B2344] text-white border-[#0B2344]"
                  : "bg-white text-[#0B2344]/60 border-[#e2e6ed] hover:border-[#0B2344]/30 hover:text-[#0B2344]"
              )}
            >
              {feature}
            </button>
          ))}
        </div>
      </Section>

      {/* Submit footer */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/imoveis")} className="w-full sm:w-auto">
          Cancelar
        </Button>
        <button
          type="submit"
          disabled={loading || saved}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0B2344] hover:bg-[#0B2344]/90 disabled:opacity-60 text-white font-bold px-8 py-3 rounded-xl transition-all duration-200"
        >
          {loading ? (
            <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Salvando...</>
          ) : saved ? (
            <><CheckCircle2 className="h-4 w-4 text-emerald-300" /> Salvo com sucesso!</>
          ) : (
            <><Save className="h-4 w-4" />{mode === "create" ? "Cadastrar imóvel" : "Salvar alterações"}</>
          )}
        </button>
      </div>
    </form>
  );
}
