export const SITE_CONFIG = {
  name: "Aguiar Imóveis",
  shortName: "Aguiar Imóveis",
  description:
    "Corretor de imóveis especializado em São Paulo e Zona Leste. Sobrados, casas e apartamentos com o atendimento exclusivo de Ediel Aguiar.",
  url: "https://aguiarimoveis.com.br",
  ogImage: "/og-image.jpg",
  author: "Ediel Aguiar",
  email: "edielkp@gmail.com",
  whatsapp: "5511975838666",
  whatsappDisplay: "(11) 97583-8666",
  phone: "(11) 97583-8666",
  region: "São Paulo e Zona Leste",
  creci: "CRECI-SP 123.456",
  address: "São Paulo – SP",
  social: {
    instagram: "https://instagram.com/aguiarimoveis",
    facebook: "https://facebook.com/aguiarimoveis",
    linkedin: "https://linkedin.com/in/edielaguiar",
    youtube: "https://youtube.com/@aguiarimoveis",
  },
};

export const BRAND_COLORS = {
  navy: "#0B2344",
  gold: "#C79A3B",
  white: "#FFFFFF",
  surface: "#F7F8FA",
};

export const PROPERTY_TYPES = [
  { value: "apartamento", label: "Apartamento" },
  { value: "casa", label: "Casa" },
  { value: "terreno", label: "Terreno" },
  { value: "comercial", label: "Comercial" },
  { value: "cobertura", label: "Cobertura" },
  { value: "studio", label: "Studio" },
  { value: "kitnet", label: "Kitnet" },
  { value: "sobrado", label: "Sobrado" },
  { value: "chacara", label: "Chácara" },
  { value: "flat", label: "Flat" },
] as const;

export const TRANSACTION_TYPES = [
  { value: "venda", label: "Comprar" },
  { value: "aluguel", label: "Alugar" },
] as const;

export const PROPERTY_STATUS = [
  { value: "disponivel", label: "Disponível", color: "gold" },
  { value: "vendido", label: "Vendido", color: "navy" },
  { value: "alugado", label: "Alugado", color: "navy" },
  { value: "reservado", label: "Reservado", color: "gold" },
] as const;

export const BEDROOMS_OPTIONS = [1, 2, 3, 4, 5];
export const BATHROOMS_OPTIONS = [1, 2, 3, 4, 5];
export const PARKING_OPTIONS = [0, 1, 2, 3, 4];

export const CITIES = [
  "São Paulo",
  "Guarulhos",
  "Osasco",
  "Santo André",
  "São Bernardo do Campo",
  "São Caetano do Sul",
  "Mauá",
  "Diadema",
  "Mogi das Cruzes",
  "Cotia",
  "Barueri",
  "Taboão da Serra",
];

export const NEIGHBORHOODS_ZONA_LESTE = [
  "Penha",
  "Vila Granada",
  "Jardim Três Marias",
  "Tatuapé",
  "Moóca",
  "Água Rasa",
  "Belém",
  "Anália Franco",
  "Vila Prudente",
  "Sapopemba",
  "Itaquera",
  "São Mateus",
  "São Lucas",
  "Carrão",
  "Vila Formosa",
];

export const WHATSAPP_MESSAGES = {
  general:
    "Olá, Ediel! Vi o site da Aguiar Imóveis e gostaria de mais informações.",
  property: (code: string, title: string) =>
    `Olá, Ediel! Tenho interesse no imóvel *${title}* (Código: ${code}). Poderia me dar mais informações?`,
  visit: (title: string) =>
    `Olá, Ediel! Gostaria de agendar uma visita ao imóvel *${title}*. Quando é possível?`,
  contact: (name: string) =>
    `Olá, Ediel! Meu nome é *${name}* e gostaria de falar sobre um imóvel.`,
};

export const NAV_LINKS = [
  { href: "/", label: "Início" },
  { href: "/imoveis", label: "Imóveis" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

// ── Características categorizadas ───────────────────────────────
// Estrutura escalável: adicione novas categorias ou opções aqui
// sem alterar nenhum outro arquivo. O banco armazena TEXT[] com
// os valores selecionados, compatível com as opções antigas.

export interface FeatureCategory {
  id: string;
  label: string;
  emoji: string;
  options: string[];
}

export const FEATURES_CATEGORIES: FeatureCategory[] = [
  {
    id: "garagem",
    label: "Garagem",
    emoji: "🚗",
    options: [
      "Sem vaga",
      "1 vaga",
      "2 vagas",
      "3 vagas",
      "4 vagas",
      "5 ou mais vagas",
      "Vaga coberta",
      "Vaga descoberta",
      "Vaga para moto",
    ],
  },
  {
    id: "area_externa",
    label: "Área Externa",
    emoji: "🌿",
    options: [
      "Quintal",
      "Jardim",
      "Jardim de inverno",
      "Área gourmet",
      "Churrasqueira",
      "Piscina",
      "Jacuzzi",
      "Varanda",
      "Sacada",
      "Terraço",
      "Rooftop",
    ],
  },
  {
    id: "suites_quartos",
    label: "Suítes & Quartos",
    emoji: "🛏️",
    options: [
      "Suíte master",
      "1 suíte",
      "2 suítes",
      "3 suítes",
      "Closet",
      "Quarto de serviço",
    ],
  },
  {
    id: "acabamento",
    label: "Acabamento",
    emoji: "✨",
    options: [
      "Alto padrão",
      "Altíssimo padrão",
      "Piso porcelanato",
      "Piso laminado",
      "Piso cerâmico",
      "Escada em vidro",
      "Cobertura em vidro",
      "Iluminação em LED",
      "Móveis planejados",
      "Cozinha planejada",
      "Armários planejados",
    ],
  },
  {
    id: "conforto",
    label: "Conforto",
    emoji: "🏠",
    options: [
      "Ar-condicionado",
      "Preparação para ar-condicionado",
      "Lavanderia",
      "Lavabo",
      "Área de serviço",
      "Despensa",
      "Depósito",
      "Escritório",
      "Home Office",
      "Sala de TV",
      "Gerador",
    ],
  },
  {
    id: "seguranca",
    label: "Segurança",
    emoji: "🔒",
    options: [
      "Condomínio fechado",
      "Portaria 24 horas",
      "Portão eletrônico",
      "Cerca elétrica",
      "Sistema de câmeras",
      "Interfone",
      "Alarme",
    ],
  },
  {
    id: "lazer_condominio",
    label: "Lazer / Condomínio",
    emoji: "🎾",
    options: [
      "Academia",
      "Salão de festas",
      "Playground",
      "Quadra esportiva",
      "Elevador",
      "Condomínio pequeno",
    ],
  },
  {
    id: "documentacao",
    label: "Documentação & Negociação",
    emoji: "📄",
    options: [
      "Aceita financiamento",
      "Aceita FGTS",
      "Documentação OK",
      "Aceita permuta",
      "Aceita imóvel como parte do pagamento",
      "Pronto para morar",
    ],
  },
];

// Flat list derivada das categorias — usada na exibição pública do imóvel.
// Adicionando opções customizadas que não estejam nas categorias,
// elas ainda serão exibidas normalmente (retrocompatível).
export const FEATURES_LIST = FEATURES_CATEGORIES.flatMap((c) => c.options);
