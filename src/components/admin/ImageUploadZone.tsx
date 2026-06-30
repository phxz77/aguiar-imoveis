"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  X,
  ImagePlus,
  ChevronLeft,
  ChevronRight,
  Star,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Link as LinkIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadPropertyImage } from "@/lib/supabaseStorage";
import { isSupabaseConfigured } from "@/lib/supabase";

type UploadStatus = "uploading" | "done" | "error";

interface ImageItem {
  id: string;
  previewUrl: string;   // blob URL ou URL remota (para preview imediato)
  finalUrl: string;     // URL Supabase após upload (ou igual ao previewUrl se já existia)
  file?: File;
  status: UploadStatus;
  progress: number;
  errorMsg?: string;
}

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB por foto

interface ImageUploadZoneProps {
  images: string[];
  onChange: (images: string[]) => void;
  propertyId: string;
  /** Notifica o pai sempre que algum upload entra/sai de andamento — usado para travar o botão Salvar. */
  onUploadingChange?: (isUploading: boolean) => void;
}

export function ImageUploadZone({ images, onChange, propertyId, onUploadingChange }: ImageUploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [rejectionMsg, setRejectionMsg] = useState<string | null>(null);

  const [items, setItems] = useState<ImageItem[]>(() =>
    images.map((url, i) => ({
      id: `existing-${i}-${Date.now()}`,
      previewUrl: url,
      finalUrl: url,
      status: "done",
      progress: 100,
    }))
  );

  // Notifica o formulário com apenas URLs finais (já enviadas)
  const notify = useCallback((list: ImageItem[]) => {
    const finalUrls = list
      .filter((item) => item.status === "done" && item.finalUrl)
      .map((item) => item.finalUrl);
    onChange(finalUrls);
  }, [onChange]);

  const uploadFile = useCallback(
    async (item: ImageItem) => {
      if (!item.file) return;

      const updateItem = (patch: Partial<ImageItem>) =>
        setItems((prev) =>
          prev.map((p) => (p.id === item.id ? { ...p, ...patch } : p))
        );

      updateItem({ status: "uploading", progress: 5 });

      const url = await uploadPropertyImage(item.file, propertyId, (pct) => {
        updateItem({ progress: pct });
      });

      if (url) {
        setItems((prev) => {
          const next = prev.map((p) =>
            p.id === item.id
              ? { ...p, finalUrl: url, previewUrl: url, status: "done" as const, progress: 100, file: undefined }
              : p
          );
          notify(next);
          return next;
        });
      } else {
        updateItem({ status: "error", errorMsg: "Falha no upload" });
      }
    },
    [propertyId, notify]
  );

  const processFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const wrongType = fileArray.filter((f) => !f.type.startsWith("image/"));
      const tooLarge = fileArray.filter((f) => f.type.startsWith("image/") && f.size > MAX_FILE_SIZE);
      const valid = fileArray.filter((f) => f.type.startsWith("image/") && f.size <= MAX_FILE_SIZE);

      if (wrongType.length > 0 || tooLarge.length > 0) {
        const parts: string[] = [];
        if (wrongType.length > 0) parts.push(`${wrongType.length} arquivo(s) não são imagens`);
        if (tooLarge.length > 0) parts.push(`${tooLarge.length} arquivo(s) acima de 15MB`);
        setRejectionMsg(`Ignorado(s): ${parts.join(" · ")}.`);
        setTimeout(() => setRejectionMsg(null), 6000);
      }

      if (valid.length === 0) return;

      const newItems: ImageItem[] = valid.map((file) => ({
        id: `new-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        previewUrl: URL.createObjectURL(file),
        finalUrl: "",
        file,
        status: "uploading",
        progress: 0,
      }));

      setItems((prev) => [...prev, ...newItems]);

      // Upload em paralelo
      newItems.forEach((item) => uploadFile(item));
    },
    [uploadFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      processFiles(e.dataTransfer.files);
    },
    [processFiles]
  );

  const removeItem = (id: string) => {
    setItems((prev) => {
      // Libera blob URL se local
      const removing = prev.find((i) => i.id === id);
      if (removing?.file && removing.previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(removing.previewUrl);
      }
      const next = prev.filter((i) => i.id !== id);
      notify(next);
      return next;
    });
  };

  const moveItem = (index: number, dir: "left" | "right") => {
    setItems((prev) => {
      const next = [...prev];
      const target = dir === "left" ? index - 1 : index + 1;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      notify(next);
      return next;
    });
  };

  const retryItem = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item?.file) uploadFile(item);
  };

  const addByUrl = () => {
    const url = urlInput.trim();
    if (!url) return;
    const newItem: ImageItem = {
      id: `url-${Date.now()}`,
      previewUrl: url,
      finalUrl: url,
      status: "done",
      progress: 100,
    };
    setItems((prev) => {
      const next = [...prev, newItem];
      notify(next);
      return next;
    });
    setUrlInput("");
    setShowUrlInput(false);
  };

  const uploadingCount = items.filter((i) => i.status === "uploading").length;
  const doneCount = items.filter((i) => i.status === "done").length;
  const errorCount = items.filter((i) => i.status === "error").length;

  // Avisa o formulário pai sempre que o estado "em andamento" mudar,
  // para que o botão Salvar fique bloqueado até todas as fotos terminarem.
  useEffect(() => {
    onUploadingChange?.(uploadingCount > 0);
  }, [uploadingCount, onUploadingChange]);

  return (
    <div className="space-y-4">

      {/* Aviso sem Supabase */}
      {!isSupabaseConfigured && (
        <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0 text-amber-500" />
          <span>
            <strong>Supabase não configurado.</strong> Configure <code className="text-xs bg-amber-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code> e{" "}
            <code className="text-xs bg-amber-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> no <code className="text-xs bg-amber-100 px-1 rounded">.env.local</code> para persistir imagens.
          </span>
        </div>
      )}

      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-200 cursor-pointer select-none",
          isDragging
            ? "border-[#C79A3B] bg-[#C79A3B]/5 scale-[1.01]"
            : "border-[#e2e6ed] hover:border-[#0B2344]/30 hover:bg-[#F7F8FA]"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png,image/webp,image/avif"
          className="hidden"
          onChange={(e) => {
            if (e.target.files) {
              processFiles(e.target.files);
              e.target.value = ""; // reseta input para permitir selecionar os mesmos arquivos novamente
            }
          }}
        />

        <AnimatePresence mode="wait">
          {isDragging ? (
            <motion.div
              key="dragging"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="h-14 w-14 rounded-2xl bg-[#C79A3B]/10 flex items-center justify-center">
                <Upload className="h-7 w-7 text-[#C79A3B]" />
              </div>
              <p className="font-semibold text-[#C79A3B] text-lg">Solte aqui!</p>
              <p className="text-[#0B2344]/40 text-sm">Todas as imagens serão enviadas em paralelo</p>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="h-14 w-14 rounded-2xl bg-[#0B2344]/5 flex items-center justify-center">
                <ImagePlus className="h-7 w-7 text-[#0B2344]/40" />
              </div>
              <div>
                <p className="font-semibold text-[#0B2344] text-base">
                  Arraste todas as fotos de uma vez
                </p>
                <p className="text-sm text-[#0B2344]/40 mt-1">
                  ou <span className="text-[#0B2344] font-medium underline underline-offset-2">clique para selecionar</span>
                </p>
                <p className="text-xs text-[#0B2344]/30 mt-2">
                  JPG · PNG · WebP · Sem limite de fotos · Upload em paralelo
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Badge de progresso global */}
        {uploadingCount > 0 && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white border border-[#e2e6ed] shadow-sm rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#0B2344]/60">
            <Loader2 className="h-3 w-3 animate-spin text-[#C79A3B]" />
            {uploadingCount} enviando...
          </div>
        )}
      </div>

      {/* Mensagem de arquivos rejeitados */}
      <AnimatePresence>
        {rejectionMsg && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5 text-sm text-red-700"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            {rejectionMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status bar */}
      {items.length > 0 && (
        <div className="flex items-center justify-between text-sm flex-wrap gap-2">
          <div className="flex items-center gap-3">
            {doneCount > 0 && (
              <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                <CheckCircle2 className="h-4 w-4" />
                {doneCount} pronta{doneCount !== 1 ? "s" : ""}
              </span>
            )}
            {uploadingCount > 0 && (
              <span className="flex items-center gap-1.5 text-[#C79A3B] font-medium">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                {uploadingCount} enviando
              </span>
            )}
            {errorCount > 0 && (
              <span className="flex items-center gap-1.5 text-red-500 font-medium">
                <AlertCircle className="h-3.5 w-3.5" />
                {errorCount} com erro
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setShowUrlInput(!showUrlInput); }}
            className="flex items-center gap-1.5 text-[#0B2344]/40 hover:text-[#0B2344] text-xs font-medium transition-colors"
          >
            <LinkIcon className="h-3.5 w-3.5" />
            Adicionar por URL
          </button>
        </div>
      )}

      {/* URL Input */}
      <AnimatePresence>
        {showUrlInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://exemplo.com/foto.jpg"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addByUrl()}
                onClick={(e) => e.stopPropagation()}
                className="flex-1 rounded-xl border border-[#e2e6ed] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C79A3B]/40 focus:border-[#C79A3B] bg-white"
              />
              <button
                type="button"
                onClick={addByUrl}
                className="bg-[#0B2344] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#0B2344]/90 transition-colors"
              >
                Adicionar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid de imagens */}
      {items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <AnimatePresence>
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="relative group rounded-xl overflow-hidden bg-[#F7F8FA] border border-[#e2e6ed] aspect-[4/3]"
              >
                {/* Preview — usa <img> nativo para suportar blob URLs */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.previewUrl}
                  alt={`Foto ${index + 1}`}
                  className={cn(
                    "w-full h-full object-cover transition-all duration-300",
                    item.status === "uploading" && "opacity-50 blur-[1px]",
                    item.status === "error" && "opacity-20"
                  )}
                />

                {/* Overlay de upload */}
                {item.status === "uploading" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0B2344]/50 backdrop-blur-[2px]">
                    <Loader2 className="h-5 w-5 text-white animate-spin mb-2" />
                    <div className="w-3/4 bg-white/25 rounded-full h-1.5">
                      <div
                        className="bg-[#C79A3B] h-1.5 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                    <span className="text-white/80 text-[10px] mt-1 font-medium tabular-nums">
                      {item.progress}%
                    </span>
                  </div>
                )}

                {/* Overlay de erro */}
                {item.status === "error" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/70 gap-1">
                    <AlertCircle className="h-5 w-5 text-red-300" />
                    <p className="text-red-200 text-[11px] font-medium">Falha no upload</p>
                    <button
                      type="button"
                      onClick={() => retryItem(item.id)}
                      className="mt-1 text-[11px] bg-white/15 hover:bg-white/25 text-white px-3 py-1 rounded-lg transition-colors"
                    >
                      Tentar novamente
                    </button>
                  </div>
                )}

                {/* Badge "Principal" na primeira imagem */}
                {index === 0 && item.status === "done" && (
                  <div className="absolute top-1.5 left-1.5 bg-[#C79A3B] text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                    <Star className="h-2.5 w-2.5 fill-current" />
                    Principal
                  </div>
                )}

                {/* Controles no hover */}
                {item.status === "done" && (
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B2344]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {/* Botão remover */}
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="absolute top-1.5 right-1.5 h-7 w-7 rounded-lg bg-red-500/85 hover:bg-red-500 flex items-center justify-center text-white transition-colors shadow-sm"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>

                    {/* Reordenar */}
                    <div className="absolute bottom-2 left-0 right-0 flex items-center justify-between px-2">
                      <span className="text-white/50 text-[10px] font-medium">
                        {index + 1} / {items.length}
                      </span>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => moveItem(index, "left")}
                          disabled={index === 0}
                          className="h-6 w-6 rounded-md bg-white/15 hover:bg-white/30 flex items-center justify-center text-white disabled:opacity-25 transition-colors"
                        >
                          <ChevronLeft className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveItem(index, "right")}
                          disabled={index === items.length - 1}
                          className="h-6 w-6 rounded-md bg-white/15 hover:bg-white/30 flex items-center justify-center text-white disabled:opacity-25 transition-colors"
                        >
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}

            {/* Botão adicionar mais */}
            <motion.button
              layout
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="aspect-[4/3] rounded-xl border-2 border-dashed border-[#e2e6ed] hover:border-[#C79A3B]/50 hover:bg-[#C79A3B]/3 flex flex-col items-center justify-center gap-2 text-[#0B2344]/30 hover:text-[#C79A3B] transition-all duration-200"
            >
              <Upload className="h-5 w-5" />
              <span className="text-[11px] font-medium">Adicionar mais</span>
            </motion.button>
          </AnimatePresence>
        </div>
      )}

      {/* Dicas */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#0B2344]/35">
        <span>✓ Sem limite de fotos · até 15MB cada</span>
        <span>✓ Upload simultâneo de várias fotos</span>
        <span>✓ A primeira foto é a capa do card</span>
        <span>✓ Arraste para reordenar com as setas</span>
        <span>✓ Salvar fica bloqueado até todo upload terminar</span>
      </div>
    </div>
  );
}
