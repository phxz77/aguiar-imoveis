import { Metadata } from "next";
import { ContactPageClient } from "./ContactPageClient";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Contato | ${SITE_CONFIG.name}`,
  description: `Entre em contato com Ediel Aguiar, corretor de imóveis em São Paulo. WhatsApp: ${SITE_CONFIG.whatsappDisplay}, E-mail: ${SITE_CONFIG.email}`,
};

export default function ContatoPage() {
  return <ContactPageClient />;
}
