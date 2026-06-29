"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Building2, TrendingUp, CheckCircle2, Star, Plus, ArrowRight, Calendar, MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { adminGetStats } from "@/lib/supabaseAdmin";
import { formatCurrency, getRelativeTime } from "@/lib/utils";
import { isSupabaseConfigured } from "@/lib/supabase";

type Stats = Awaited<ReturnType<typeof adminGetStats>>;

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminGetStats().then((s) => {
      setStats(s);
      setLoading(false);
    });
  }, []);

  const statCards = [
    { label: "Total de imóveis", value: stats?.total ?? 0, icon: <Building2 className="h-5 w-5" />, color: "text-[#0B2344]", bg: "bg-[#0B2344]/8" },
    { label: "Disponíveis", value: stats?.available ?? 0, icon: <CheckCircle2 className="h-5 w-5" />, color: "text-emerald-700", bg: "bg-emerald-50" },
    { label: "Vendidos", value: stats?.sold ?? 0, icon: <TrendingUp className="h-5 w-5" />, color: "text-[#C79A3B]", bg: "bg-[#C79A3B]/10" },
    { label: "Em destaque", value: stats?.featured ?? 0, icon: <Star className="h-5 w-5" />, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-[#0B2344] text-2xl">Dashboard</h1>
          <p className="text-[#0B2344]/45 text-sm mt-0.5">
            {isSupabaseConfigured ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-600 text-xs font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Conectado ao Supabase
              </span>
            ) : (
              <span className="text-amber-600 text-xs font-medium">⚠️ Usando dados locais — configure o Supabase</span>
            )}
          </p>
        </div>
        <Link href="/admin/imoveis/novo">
          <Button className="gap-2 bg-[#0B2344] hover:bg-[#0B2344]/90">
            <Plus className="h-4 w-4" />
            Novo imóvel
          </Button>
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-white rounded-2xl border border-[#e2e6ed] shadow-sm p-5"
          >
            <div className={`h-10 w-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-3`}>
              {stat.icon}
            </div>
            {loading ? (
              <div className="h-8 w-12 skeleton rounded-lg mb-1" />
            ) : (
              <p className="font-display font-extrabold text-[#0B2344] text-2xl">{stat.value}</p>
            )}
            <p className="text-[#0B2344]/45 text-sm mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent properties */}
      <div className="bg-white rounded-2xl border border-[#e2e6ed] shadow-sm">
        <div className="flex items-center justify-between p-5 border-b border-[#e2e6ed]">
          <h2 className="font-display font-semibold text-[#0B2344]">Últimos imóveis</h2>
          <Link href="/admin/imoveis">
            <Button variant="outline" size="sm" className="gap-1.5">
              Ver todos
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
        <div className="divide-y divide-[#e2e6ed]/60">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4">
                  <div className="h-14 w-20 rounded-xl skeleton flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-48 skeleton rounded" />
                    <div className="h-3 w-32 skeleton rounded" />
                  </div>
                </div>
              ))
            : stats?.recent.map((property, i) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  className="flex items-center gap-4 p-4 hover:bg-[#F7F8FA] transition-colors"
                >
                  <div className="h-14 w-20 rounded-xl overflow-hidden bg-[#F7F8FA] flex-shrink-0">
                    {property.images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={property.images[0]} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-[#0B2344]/20" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#0B2344] text-sm truncate">{property.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-[#0B2344]/45 flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-[#C79A3B]" />
                        {property.neighborhood}, {property.city}
                      </span>
                      <span className="text-[#0B2344]/20">·</span>
                      <span className="text-xs text-[#0B2344]/45 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {getRelativeTime(property.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="font-display font-semibold text-[#0B2344] text-sm">{formatCurrency(property.price)}</p>
                      <p className="text-xs text-[#0B2344]/35">#{property.code}</p>
                    </div>
                    <Badge variant={property.status === "disponivel" ? "available" : property.status === "vendido" ? "sold" : "rented"}>
                      {property.status === "disponivel" ? "Disponível" : property.status === "vendido" ? "Vendido" : "Alugado"}
                    </Badge>
                    <Link href={`/admin/imoveis/${property.id}/editar`}>
                      <Button variant="ghost" size="sm" className="text-[#0B2344]/50 hover:text-[#0B2344]">
                        Editar
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
        </div>
      </div>
    </div>
  );
}
