import React from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  ArrowUpRight,
  Heart,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { Logo } from "@/components/ui/Logo";

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const footerLinks = {
  imoveis: [
    { label: "Todos os imóveis", href: "/imoveis" },
    { label: "Sobrados à venda", href: "/imoveis?type=sobrado&transactionType=venda" },
    { label: "Imóveis na Penha", href: "/imoveis?neighborhood=Penha" },
    { label: "Imóveis em Vila Granada", href: "/imoveis?neighborhood=Vila+Granada" },
    { label: "Jardim Três Marias", href: "/imoveis?neighborhood=Jardim+Tr%C3%AAs+Marias" },
  ],
  empresa: [
    { label: "Quem é Ediel Aguiar", href: "/sobre" },
    { label: "Área de atuação", href: "/sobre#atuacao" },
    { label: "Depoimentos", href: "/#depoimentos" },
    { label: "Política de privacidade", href: "/privacidade" },
  ],
  contato: [
    { label: "Falar no WhatsApp", href: `https://wa.me/${SITE_CONFIG.whatsapp}`, external: true },
    { label: "Enviar e-mail", href: `mailto:${SITE_CONFIG.email}`, external: true },
    { label: "Formulário de contato", href: "/contato" },
    { label: "Painel administrativo", href: "/admin" },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();
  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(
    "Olá, Ediel! Vi o site da Aguiar Imóveis e gostaria de mais informações."
  )}`;

  return (
    <footer className="bg-[#0B2344] text-white/60">
      {/* CTA Banner */}
      <div className="border-t border-white/8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <h2 className="font-display font-bold text-white text-2xl sm:text-3xl mb-1">
              Encontre seu próximo imóvel hoje.
            </h2>
            <p className="text-white/50 text-sm">
              Atendimento personalizado de segunda a sábado.
            </p>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-2.5 bg-[#C79A3B] hover:bg-[#b8882d] text-white font-bold px-6 py-3.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-[#C79A3B]/20"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Falar com Ediel
          </a>
        </div>
      </div>

      {/* Main */}
      <div className="border-t border-white/8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            {/* Brand */}
            <div className="lg:col-span-1">
              <Logo variant="light" size="md" className="mb-5" />

              <p className="text-white/45 text-sm leading-relaxed mb-6 max-w-[230px]">
                Especialista em sobrados e imóveis na Zona Leste de São Paulo. Atendimento exclusivo e personalizado.
              </p>

              <div className="space-y-2.5 text-sm mb-6">
                {[
                  { icon: <Phone className="h-3.5 w-3.5" />, value: SITE_CONFIG.whatsappDisplay, href: `https://wa.me/${SITE_CONFIG.whatsapp}`, external: true },
                  { icon: <Mail className="h-3.5 w-3.5" />, value: SITE_CONFIG.email, href: `mailto:${SITE_CONFIG.email}`, external: false },
                  { icon: <MapPin className="h-3.5 w-3.5" />, value: SITE_CONFIG.region, href: undefined, external: false },
                ].map((item, i) =>
                  item.href ? (
                    <a
                      key={i}
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      className="flex items-center gap-2.5 text-white/45 hover:text-[#C79A3B] transition-colors"
                    >
                      <span className="text-[#C79A3B]/60">{item.icon}</span>
                      <span>{item.value}</span>
                    </a>
                  ) : (
                    <div key={i} className="flex items-center gap-2.5 text-white/40">
                      <span className="text-[#C79A3B]/60">{item.icon}</span>
                      <span>{item.value}</span>
                    </div>
                  )
                )}
              </div>

              {/* Social */}
              <div className="flex items-center gap-2">
                {[
                  { href: SITE_CONFIG.social.instagram, icon: <InstagramIcon />, label: "Instagram" },
                  { href: SITE_CONFIG.social.facebook, icon: <FacebookIcon />, label: "Facebook" },
                  { href: SITE_CONFIG.social.linkedin, icon: <LinkedinIcon />, label: "LinkedIn" },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="h-9 w-9 rounded-xl bg-white/6 border border-white/8 flex items-center justify-center text-white/50 hover:bg-[#C79A3B]/15 hover:text-[#C79A3B] hover:border-[#C79A3B]/30 transition-all duration-200"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            {[
              { title: "Imóveis", links: footerLinks.imoveis },
              { title: "Empresa", links: footerLinks.empresa },
              { title: "Contato", links: footerLinks.contato },
            ].map((section) => (
              <div key={section.title}>
                <h3 className="text-white text-xs font-bold uppercase tracking-[0.18em] mb-5">
                  {section.title}
                </h3>
                <ul className="space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      {(link as { external?: boolean }).external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-white/45 hover:text-[#C79A3B] transition-colors duration-150 flex items-center gap-1.5 group"
                        >
                          {link.label}
                          <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-sm text-white/45 hover:text-[#C79A3B] transition-colors duration-150 flex items-center gap-1.5 group"
                        >
                          {link.label}
                          <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>

                {section.title === "Contato" && (
                  <div className="mt-6 p-3.5 rounded-xl bg-white/5 border border-white/8">
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">
                      Registro profissional
                    </p>
                    <p className="text-sm font-semibold text-[#C79A3B]">
                      {SITE_CONFIG.creci}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom */}
          <div className="mt-12 pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-white/30">
              © {currentYear} {SITE_CONFIG.name}. Todos os direitos reservados.
            </p>
            <p className="text-[11px] text-white/20 flex items-center gap-1">
              Feito com <Heart className="h-3 w-3 text-[#C79A3B] fill-current" /> na Zona Leste de SP
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
