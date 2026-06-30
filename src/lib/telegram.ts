/**
 * Integração com Telegram Bot API.
 * Envia notificações de leads direto no chat do corretor.
 *
 * Setup:
 *  1. Crie um bot via @BotFather → copie o token
 *  2. Descubra seu chat_id via @userinfobot
 *  3. Adicione as variáveis abaixo no Vercel (Settings → Environment Variables)
 *     e no .env.local para testes locais:
 *       TELEGRAM_BOT_TOKEN=7812345678:AAHxxx...
 *       TELEGRAM_CHAT_ID=123456789
 */

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID   = process.env.TELEGRAM_CHAT_ID;

export const isTelegramConfigured = !!(BOT_TOKEN && CHAT_ID);

/**
 * Envia uma mensagem formatada para o Telegram do corretor.
 * Retorna true em caso de sucesso.
 */
export async function sendTelegramMessage(text: string): Promise<boolean> {
  if (!isTelegramConfigured) {
    console.warn("[Telegram] Bot não configurado — defina TELEGRAM_BOT_TOKEN e TELEGRAM_CHAT_ID.");
    return false;
  }

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      }
    );

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      console.error("[Telegram] Erro ao enviar mensagem:", body);
      return false;
    }

    return true;
  } catch (e) {
    console.error("[Telegram] Exceção:", e);
    return false;
  }
}

// ── Formatadores de mensagem ────────────────────────────────────

export function formatLeadMessage(data: {
  name: string;
  phone?: string;
  email?: string;
  interest: string;
  message: string;
  source?: string;
}): string {
  const interestMap: Record<string, string> = {
    compra: "🏠 Comprar imóvel",
    aluguel: "🔑 Alugar imóvel",
    venda: "💰 Vender imóvel",
    outros: "💬 Outros",
  };

  return `
🔔 <b>Novo lead — Aguiar Imóveis</b>

👤 <b>Nome:</b> ${escapeHtml(data.name)}
${data.phone ? `📱 <b>Telefone:</b> ${escapeHtml(data.phone)}` : ""}
${data.email ? `📧 <b>E-mail:</b> ${escapeHtml(data.email)}` : ""}

🎯 <b>Interesse:</b> ${interestMap[data.interest] ?? data.interest}
${data.source ? `📍 <b>Origem:</b> ${escapeHtml(data.source)}` : ""}

💬 <b>Mensagem:</b>
${escapeHtml(data.message)}

${data.phone ? `\n👉 <a href="https://wa.me/55${data.phone.replace(/\D/g, "")}">Responder no WhatsApp</a>` : ""}
`.trim();
}

export function formatPropertyInquiryMessage(data: {
  propertyCode: string;
  propertyTitle: string;
  propertySlug: string;
  visitorMessage?: string;
}): string {
  return `
🏡 <b>Interesse em imóvel — Aguiar Imóveis</b>

📋 <b>Código:</b> ${data.propertyCode}
📌 <b>Imóvel:</b> ${escapeHtml(data.propertyTitle)}
${data.visitorMessage ? `\n💬 <b>Mensagem:</b> ${escapeHtml(data.visitorMessage)}` : ""}

👉 <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/imoveis/${data.propertySlug}">Ver imóvel no site</a>
`.trim();
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
