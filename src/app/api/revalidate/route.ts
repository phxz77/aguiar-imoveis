import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

/**
 * Endpoint chamado pelo painel admin logo após salvar um imóvel.
 * Sem isso, a página pública do imóvel (ISR, revalidate=60s) podia
 * mostrar dados/fotos antigos por até 1 minuto após uma edição.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const slugs: string[] = [
      ...(body.slug ? [body.slug as string] : []),
      ...(body.oldSlug ? [body.oldSlug as string] : []),
    ];

    revalidatePath("/imoveis");
    revalidatePath("/");
    for (const slug of slugs) {
      revalidatePath(`/imoveis/${slug}`);
    }

    return NextResponse.json({ revalidated: true, slugs, now: Date.now() });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erro desconhecido";
    return NextResponse.json({ revalidated: false, error: message }, { status: 500 });
  }
}
