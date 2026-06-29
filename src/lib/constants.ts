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

export const FEATURES_LIST = [
  "Suíte master",
  "Suíte",
  "Varanda",
  "Sacada",
  "Churrasqueira",
  "Área gourmet",
  "Jardim de inverno",
  "Lavabo",
  "Lavanderia",
  "Área de serviço",
  "Quintal",
  "Jardim",
  "Piscina",
  "Academia",
  "Salão de festas",
  "Playground",
  "Portaria 24h",
  "Câmeras de segurança",
  "Interfone",
  "Elevador",
  "Gerador",
  "Armários planejados",
  "Ar-condicionado",
  "Jacuzzi",
  "Escada em vidro",
  "Cobertura em vidro",
  "Aceita permuta",
  "Aceita financiamento",
  "Documentação ok",
  "2 vagas",
  "3 vagas",
  "4 vagas",
];
