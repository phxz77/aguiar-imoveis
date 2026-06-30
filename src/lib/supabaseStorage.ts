/**
 * Upload de imagens para Supabase Storage usando o SDK oficial.
 *
 * Usa supabase.storage.upload() (em vez de XHR manual) para garantir
 * que headers de autenticação/CORS sejam sempre os corretos — a SDK
 * usa fetch() internamente e não expõe progresso real por bytes, por
 * isso simulamos uma barra de progresso suave enquanto aguarda.
 */

import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const BUCKET = "property-images";
const UPLOAD_TIMEOUT_MS = 45000; // 45s — evita travar para sempre se a rede engasgar

export interface UploadResult {
  url: string | null;
  error?: string;
}

/** Rejeita com timeoutMsg se `promise` não resolver dentro de `ms`. */
function withTimeout<T>(promise: Promise<T>, ms: number, timeoutMsg: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(timeoutMsg)), ms);
    promise.then(
      (val) => { clearTimeout(timer); resolve(val); },
      (err) => { clearTimeout(timer); reject(err); }
    );
  });
}

/**
 * Faz upload de um arquivo para o Supabase Storage.
 * Retorna a URL pública, ou o motivo do erro para exibir ao usuário.
 */
export async function uploadPropertyImage(
  file: File,
  propertyId: string,
  onProgress?: (pct: number) => void
): Promise<UploadResult> {
  const tag = "[UPLOAD-DEBUG]";
  console.log(`${tag} Iniciando upload: nome="${file.name}" tamanho=${(file.size / 1024).toFixed(0)}KB tipo="${file.type}" propertyId="${propertyId}"`);
  console.log(`${tag} isSupabaseConfigured =`, isSupabaseConfigured, "| supabase client existe =", !!supabase);

  // Sem Supabase configurado: retorna blob URL como preview local (não persiste)
  if (!isSupabaseConfigured || !supabase) {
    console.warn(`${tag} Supabase NÃO está configurado — usando blob URL local (a imagem NÃO será salva de verdade).`);
    onProgress?.(100);
    return { url: URL.createObjectURL(file) };
  }

  // Gera nome de arquivo único
  const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
  const safeExt = ["jpg", "jpeg", "png", "webp", "avif"].includes(ext) ? ext : "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExt}`;
  const storagePath = `properties/${propertyId}/${filename}`;
  console.log(`${tag} Caminho no Storage: "${storagePath}" | bucket="${BUCKET}"`);

  // Progresso simulado: a SDK não expõe progresso real por bytes (usa fetch)
  let simulated = 8;
  onProgress?.(simulated);
  const progressTimer = setInterval(() => {
    simulated = Math.min(simulated + Math.random() * 12 + 3, 90);
    onProgress?.(Math.round(simulated));
  }, 220);

  try {
    console.log(`${tag} Chamando supabase.storage.from("${BUCKET}").upload(...) agora...`);
    const t0 = Date.now();

    const { error } = await withTimeout(
      supabase.storage.from(BUCKET).upload(storagePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type || "image/jpeg",
      }),
      UPLOAD_TIMEOUT_MS,
      "Tempo esgotado ao enviar a imagem. Verifique sua conexão e tente novamente."
    );

    console.log(`${tag} supabase.storage.upload() retornou após ${Date.now() - t0}ms`);
    clearInterval(progressTimer);

    if (error) {
      console.error(`${tag} ERRO retornado pelo Supabase:`, error);
      console.error(`${tag} Detalhe: ${error.message} | path: ${storagePath}`);
      return { url: null, error: error.message };
    }

    onProgress?.(100);
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
    console.log(`${tag} SUCESSO. URL pública: ${data.publicUrl}`);
    return { url: data.publicUrl };
  } catch (e) {
    clearInterval(progressTimer);
    const msg = e instanceof Error ? e.message : "Erro desconhecido no upload";
    console.error(`${tag} EXCEÇÃO capturada:`, e);
    console.error(`${tag} Mensagem: ${msg} | path: ${storagePath}`);
    return { url: null, error: msg };
  }
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
