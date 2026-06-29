import { Metadata } from "next";
import { AboutPageClient } from "./AboutPageClient";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Sobre Ediel Aguiar | ${SITE_CONFIG.name}`,
  description:
    "Conheça a história de Ediel Aguiar, corretor de imóveis especializado em São Paulo e Região Metropolitana com mais de 10 anos de experiência.",
};

export default function SobrePage() {
  return <AboutPageClient />;
}
