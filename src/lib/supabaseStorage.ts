/**
 * Upload de imagens para Supabase Storage usando o SDK oficial.
 */

import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const BUCKET = "property-images";
const UPLOAD_TIMEOUT_MS = 45000;

export interface UploadResult {
  url: string | null;
  error?: string;
}

function withTimeout<T>(promise: Promise<T>, ms: number, timeoutMsg: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(timeoutMsg)), ms);
    promise.then(
      (val) => { clearTimeout(timer); resolve(val); },
      (err) => { clearTimeout(timer); reject(err); }
    );
  });
}

export async function uploadPropertyImage(
  file: File,
  propertyId: string,
  onProgress?: (pct: number) => void
): Promise<UploadResult> {
  if (!isSupabaseConfigured || !supabase) {
    onProgress?.(100);
    return { url: URL.createObjectURL(file) };
  }

  const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
  const safeExt = ["jpg", "jpeg", "png", "webp", "avif"].includes(ext) ? ext : "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExt}`;
  const storagePath = `properties/${propertyId}/${filename}`;

  let simulated = 8;
  onProgress?.(simulated);
  const progressTimer = setInterval(() => {
    simulated = Math.min(simulated + Math.random() * 12 + 3, 90);
    onProgress?.(Math.round(simulated));
  }, 220);

  try {
    const { error } = await withTimeout(
      supabase.storage.from(BUCKET).upload(storagePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type || "image/jpeg",
      }),
      UPLOAD_TIMEOUT_MS,
      "Tempo esgotado ao enviar a imagem. Verifique sua conexão e tente novamente."
    );

    clearInterval(progressTimer);

    if (error) {
      console.error(`[Storage] Upload falhou: ${error.message} | ${storagePath}`);
      return { url: null, error: error.message };
    }

    onProgress?.(100);
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
    return { url: data.publicUrl };
  } catch (e) {
    clearInterval(progressTimer);
    const msg = e instanceof Error ? e.message : "Erro desconhecido no upload";
    console.error(`[Storage] Exceção no upload: ${msg}`);
    return { url: null, error: msg };
  }
}

export async function deletePropertyImage(url: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return true;
  if (url.startsWith("blob:")) return true;

  try {
    const marker = `/object/public/${BUCKET}/`;
    const idx = url.indexOf(marker);
    if (idx === -1) return false;

    const path = decodeURIComponent(url.slice(idx + marker.length).split("?")[0]);
    const { error } = await supabase.storage.from(BUCKET).remove([path]);
    if (error) console.error("[Storage] Erro ao deletar:", error.message);
    return !error;
  } catch (e) {
    console.error("[Storage] deletePropertyImage:", e);
    return false;
  }
}

export async function deletePropertyFolder(propertyId: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;

  const prefix = `properties/${propertyId}`;
  const { data: files } = await supabase.storage.from(BUCKET).list(prefix);
  if (!files?.length) return;

  const paths = files.map((f) => `${prefix}/${f.name}`);
  await supabase.storage.from(BUCKET).remove(paths);
}

export function generatePropertyId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}
