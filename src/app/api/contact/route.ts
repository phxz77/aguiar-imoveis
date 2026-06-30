import { NextRequest, NextResponse } from "next/server";
import { sendTelegramMessage, formatLeadMessage, isTelegramConfigured } from "@/lib/telegram";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, interest, message } = body;

    if (!name || !message) {
      return NextResponse.json({ ok: false, error: "Nome e mensagem são obrigatórios." }, { status: 400 });
    }

    const text = formatLeadMessage({ name, phone, email, interest, message, source: "Formulário de contato" });
    const sent = await sendTelegramMessage(text);

    return NextResponse.json({
      ok: true,
      telegram: sent,
      configured: isTelegramConfigured,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro desconhecido";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
