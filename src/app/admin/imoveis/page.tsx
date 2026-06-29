"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Plus, Search, Edit, Trash2, Copy, Archive, Star, Eye, MoreHorizontal, MapPin, Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  adminGetProperties, adminDeleteProperty, adminDuplicateProperty, adminArchiveProperty,
} from "@/lib/supabaseAdmin";
import { formatCurrency, getRelativeTime } from "@/lib/utils";
import { Property } from "@/types";

const STATUS_MAP = {
  disponivel: { label: "Disponível", variant: "available" as const },
  vendido:    { label: "Vendido",    variant: "sold" as const },
  alugado:    { label: "Alugado",   variant: "rented" as const },
  reservado:  { label: "Reservado", variant: "reserved" as const },
};

export default function AdminImoveisPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const data = await adminGetProperties();
    setProperties(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = properties.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase()) ||
      p.neighborhood.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    await adminDeleteProperty(id);
    await load();
    setConfirmDelete(null);
  };

  const handleDuplicate = async (id: string) => {
    await adminDuplicateProperty(id);
    await load();
    setOpenMenu(null);
  };

  const handleArchive = async (id: string) => {
    await adminArchiveProperty(id);
    await load();
    setOpenMenu(null);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-[#0B2344] text-2xl">Imóveis</h1>
          <p className="text-[#0B2344]/45 text-sm">{properties.length} imóvel{properties.length !== 1 ? "is" : ""} cadastrado{properties.length !== 1 ? "s" : ""}</p>
        </div>
        <Link href="/admin/imoveis/novo">
          <Button className="gap-2 bg-[#0B2344] hover:bg-[#0B2344]/90">
            <Plus className="h-4 w-4" />
            Novo imóvel
          </Button>
        </Link>
      </div>

      {/* Search */}
      <Input
        type="text"
        placeholder="Buscar por título, código, bairro ou cidade..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        icon={<Search className="h-4 w-4" />}
      />

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#e2e6ed] shadow-sm overflow-hidden">
        {loading ? (
          <div className="divide-y divide-[#e2e6ed]/60">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4">
                <div className="h-12 w-20 rounded-xl skeleton flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-48 skeleton rounded" />
                  <div className="h-3 w-32 skeleton rounded" />
                </div>
                <div className="h-6 w-20 skeleton rounded-full" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Building2 className="h-10 w-10 text-[#0B2344]/20 mx-auto mb-3" />
            <p className="text-[#0B2344]/50 text-sm">Nenhum imóvel encontrado</p>
            <Link href="/admin/imoveis/novo" className="mt-3 inline-block">
              <Button size="sm" className="gap-2 bg-[#0B2344]">
                <Plus className="h-4 w-4" />
                Cadastrar imóvel
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e2e6ed] bg-[#F7F8FA]">
                  {["Imóvel", "Localização", "Preço", "Status", "Cadastrado", ""].map((h) => (
                    <th key={h} className="text-left text-[11px] font-bold text-[#0B2344]/40 uppercase tracking-widest px-4 py-3 first:pl-5 last:pr-5">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e6ed]/50">
                {filtered.map((property, i) => {
                  const st = STATUS_MAP[property.status] ?? STATUS_MAP.disponivel;
                  return (
                    <motion.tr
                      key={property.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-[#F7F8FA]/60 transition-colors"
                    >
                      {/* Image + title */}
                      <td className="pl-5 pr-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-16 rounded-xl overflow-hidden bg-[#F7F8FA] flex-shrink-0">
                            {property.images[0] ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={property.images[0]} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full flex items-center justify-center">
                                <Building2 className="h-5 w-5 text-[#0B2344]/20" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="font-medium text-[#0B2344] text-sm truncate max-w-[180px]">{property.title}</p>
                              {property.isFeatured && <Star className="h-3.5 w-3.5 text-[#C79A3B] fill-[#C79A3B] flex-shrink-0" />}
                            </div>
                            <p className="text-xs text-[#0B2344]/35 mt-0.5 font-mono">#{property.code}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <p className="text-sm text-[#0B2344]/60 flex items-center gap-1.5 max-w-[140px] truncate">
                          <MapPin className="h-3.5 w-3.5 text-[#C79A3B] flex-shrink-0" />
                          {property.neighborhood}, {property.city}
                        </p>
                      </td>

                      <td className="px-4 py-3.5 hidden lg:table-cell">
                        <p className="font-display font-bold text-[#0B2344] text-sm">
                          {formatCurrency(property.price)}
                          {property.transactionType === "aluguel" && <span className="text-[11px] font-normal text-[#0B2344]/40">/mês</span>}
                        </p>
                      </td>

                      <td className="px-4 py-3.5 hidden sm:table-cell">
                        <Badge variant={st.variant}>{st.label}</Badge>
                      </td>

                      <td className="px-4 py-3.5 hidden lg:table-cell">
                        <p className="text-xs text-[#0B2344]/35">{getRelativeTime(property.createdAt)}</p>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <a
                            href={`/imoveis/${property.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-8 w-8 rounded-lg flex items-center justify-center text-[#0B2344]/40 hover:text-[#0B2344] hover:bg-[#F7F8FA] transition-all"
                            title="Ver no site"
                          >
                            <Eye className="h-4 w-4" />
                          </a>
                          <Link
                            href={`/admin/imoveis/${property.id}/editar`}
                            className="h-8 w-8 rounded-lg flex items-center justify-center text-[#0B2344]/40 hover:text-[#C79A3B] hover:bg-[#C79A3B]/8 transition-all"
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>

                          <div className="relative">
                            <button
                              onClick={() => setOpenMenu(openMenu === property.id ? null : property.id)}
                              className="h-8 w-8 rounded-lg flex items-center justify-center text-[#0B2344]/40 hover:text-[#0B2344] hover:bg-[#F7F8FA] transition-all"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                            {openMenu === property.id && (
                              <>
                                <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                                <div className="absolute right-0 top-9 w-44 bg-white border border-[#e2e6ed] rounded-xl shadow-xl z-20 py-1">
                                  <button onClick={() => handleDuplicate(property.id)} className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-[#0B2344]/70 hover:bg-[#F7F8FA] transition-colors">
                                    <Copy className="h-4 w-4" />Duplicar
                                  </button>
                                  <button onClick={() => handleArchive(property.id)} className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-[#0B2344]/70 hover:bg-[#F7F8FA] transition-colors">
                                    <Archive className="h-4 w-4" />Arquivar
                                  </button>
                                  <div className="border-t border-[#e2e6ed] my-1" />
                                  <button onClick={() => { setConfirmDelete(property.id); setOpenMenu(null); }} className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                    <Trash2 className="h-4 w-4" />Excluir
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirm delete */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-[#0B2344]/40 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-[#e2e6ed]"
          >
            <div className="h-12 w-12 rounded-xl bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="font-display font-bold text-[#0B2344] text-center mb-1">Confirmar exclusão</h3>
            <p className="text-[#0B2344]/50 text-sm text-center mb-5">Esta ação não pode ser desfeita.</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setConfirmDelete(null)}>Cancelar</Button>
              <Button variant="destructive" className="flex-1" onClick={() => handleDelete(confirmDelete)}>Excluir</Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
