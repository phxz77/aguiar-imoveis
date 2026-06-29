/**
 * Upload de imagens para Supabase Storage via XHR (progresso real).
 */

import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const BUCKET = "property-images";

/**
 * Faz upload de um arquivo para o Supabase Storage.
 * Usa XHR diretamente para rastrear progresso em tempo real.
 * Retorna a URL pública ou null em caso de erro.
 */
export async function uploadPropertyImage(
  file: File,
  propertyId: string,
  onProgress?: (pct: number) => void
): Promise<string | null> {
  // Sem Supabase configurado: retorna blob URL como preview local (não persiste)
  if (!isSupabaseConfigured || !supabase) {
    onProgress?.(100);
    return URL.createObjectURL(file);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  // Gera nome de arquivo único
  const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
  const safeExt = ["jpg", "jpeg", "png", "webp", "avif"].includes(ext) ? ext : "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExt}`;
  const storagePath = `properties/${propertyId}/${filename}`;

  return new Promise<string | null>((resolve) => {
    const xhr = new XMLHttpRequest();

    // Progresso real do upload
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        onProgress?.(Math.min(95, Math.round((e.loaded / e.total) * 95)));
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress?.(100);
        // Constrói URL pública manualmente (evita chamada extra ao Supabase)
        const publicUrl = `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${storagePath}`;
        resolve(publicUrl);
      } else {
        let detail = `HTTP ${xhr.status}`;
        try {
          const body = JSON.parse(xhr.responseText);
          detail = body.message ?? body.error ?? detail;
        } catch { /* ignore */ }
        console.error(`[Storage] Upload falhou: ${detail} | ${storagePath}`);
        resolve(null);
      }
    });

    xhr.addEventListener("error", () => {
      console.error("[Storage] Erro de rede:", storagePath);
      resolve(null);
    });

    xhr.addEventListener("abort", () => {
      console.warn("[Storage] Upload abortado:", storagePath);
      resolve(null);
    });

    // Endpoint do Supabase Storage
    const endpoint = `${supabaseUrl}/storage/v1/object/${BUCKET}/${storagePath}`;
    xhr.open("POST", endpoint);
    xhr.setRequestHeader("Authorization", `Bearer ${anonKey}`);
    xhr.setRequestHeader("Content-Type", file.type || "image/jpeg");
    xhr.setRequestHeader("x-upsert", "false");
    xhr.send(file); // Envia o arquivo como raw bytes
  });
}

/**
 * Remove uma imagem do Storage pela URL pública.
 */
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

/**
 * Remove todas as imagens de uma pasta de imóvel.
 */
export async function deletePropertyFolder(propertyId: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;

  const prefix = `properties/${propertyId}`;
  const { data: files } = await supabase.storage.from(BUCKET).list(prefix);
  if (!files?.length) return;

  const paths = files.map((f) => `${prefix}/${f.name}`);
  await supabase.storage.from(BUCKET).remove(paths);
}

/** Gera um ID único para usar como pasta do imóvel no Storage. */
export function generatePropertyId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}
