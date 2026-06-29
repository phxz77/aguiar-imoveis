"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PropertyForm } from "@/components/admin/PropertyForm";
import { adminGetPropertyById } from "@/lib/supabaseAdmin";
import { Property } from "@/types";
import { Building2 } from "lucide-react";

export default function EditarImovelPage() {
  const params = useParams();
  const id = params?.id as string;
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    adminGetPropertyById(id).then((p) => {
      if (!p) setNotFound(true);
      else setProperty(p);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-5">
        <div className="h-8 w-48 skeleton rounded-xl" />
        <div className="bg-white rounded-2xl border border-[#e2e6ed] p-6 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 skeleton rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (notFound || !property) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[50vh] text-center">
        <Building2 className="h-12 w-12 text-[#0B2344]/20 mb-3" />
        <p className="text-[#0B2344]/50">Imóvel não encontrado.</p>
      </div>
    );
  }

  return <PropertyForm property={property} mode="edit" />;
}
