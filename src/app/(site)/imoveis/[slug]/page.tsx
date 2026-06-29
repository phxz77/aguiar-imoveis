import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchPropertyBySlug, fetchAllSlugs } from "@/lib/supabaseData";
import { SITE_CONFIG } from "@/lib/constants";
import { PropertyPageClient } from "./PropertyPageClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await fetchAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = await fetchPropertyBySlug(slug);
  if (!property) return {};

  const title = `${property.title} | ${SITE_CONFIG.name}`;
  const description = `${property.type === "sobrado" ? "Sobrado" : "Imóvel"} em ${property.neighborhood}, ${property.city}. ${property.bedrooms > 0 ? `${property.bedrooms} dormitório${property.bedrooms > 1 ? "s" : ""}` : ""} ${property.area}m². Código: ${property.code}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: property.images.slice(0, 1),
      type: "article",
    },
  };
}

export default async function PropertyPage({ params }: Props) {
  const { slug } = await params;
  const property = await fetchPropertyBySlug(slug);
  if (!property) notFound();
  return <PropertyPageClient property={property!} />;
}
