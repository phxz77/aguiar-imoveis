import { Property, Testimonial, Region } from "@/types";

export const MOCK_PROPERTIES: Property[] = [
  {
    id: "1",
    slug: "sobrado-venda-penha-2-suites",
    code: "AGI001",
    title: "Sobrado à Venda — Penha",
    description:
      "Sobrado impecável localizado na Penha, um dos bairros mais valorizados da Zona Leste de São Paulo. O imóvel conta com 2 suítes, sala integrada, cozinha planejada, lavanderia, lavabo e 1 vaga de garagem, tudo em 63m² muito bem aproveitados.\n\nO condomínio é extremamente pequeno, com apenas 9 unidades, garantindo tranquilidade, segurança e baixo custo de manutenção. Ambiente familiar e silencioso.\n\nLocalização estratégica: a poucos minutos da Basílica Nossa Senhora da Penha, do Shopping Penha e da Estação Penha do Metrô Linha 3-Vermelha. A região oferece excelente infraestrutura com supermercados, escolas, bancos, farmácias e comércio completo ao redor.\n\nIdeal para quem busca qualidade de vida com praticidade no acesso ao centro de São Paulo.\n\nValor de proposta aprovada disponível: R$ 390.000.",
    price: 410000,
    type: "sobrado",
    transactionType: "venda",
    status: "disponivel",
    bedrooms: 2,
    bathrooms: 2,
    parkingSpots: 1,
    area: 63,
    city: "São Paulo",
    neighborhood: "Penha",
    state: "SP",
    lat: -23.5270,
    lng: -46.5460,
    images: [
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&q=85",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=85",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=85",
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=1200&q=85",
      "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1200&q=85",
    ],
    features: [
      "2 suítes",
      "Lavabo",
      "Lavanderia",
      "Condomínio com apenas 9 unidades",
      "Aceita financiamento",
      "Documentação ok",
    ],
    isFeatured: true,
    isAvailable: true,
    createdAt: "2026-06-01T10:00:00Z",
    updatedAt: "2026-06-20T10:00:00Z",
    finishingLevel: "Médio-alto padrão",
  },
  {
    id: "2",
    slug: "sobrado-condominio-penha-2-suites",
    code: "AGI002",
    title: "Sobrado em Condomínio — Penha",
    description:
      "Excelente sobrado em condomínio fechado no Centro da Penha. Com 60m² distribuídos de forma inteligente, o imóvel oferece 2 suítes, sala ampla com excelente iluminação natural, cozinha espaçosa, lavabo, área de serviço e 2 vagas de garagem.\n\nEndereço privilegiado na Rua Francisco Coimbra, 333, próximo ao SENAC da Penha e com fácil acesso ao Metrô Penha — apenas minutos caminhando. A Penha é uma das regiões mais valorizadas da Zona Leste, com forte infraestrutura comercial, cultural e de transporte.\n\nCondomínio seguro, bem conservado e com excelente custo-benefício. Oportunidade ideal para famílias que buscam conforto e praticidade na Zona Leste de São Paulo.\n\nDocumentação em ordem. Aceita financiamento.",
    price: 430000,
    type: "sobrado",
    transactionType: "venda",
    status: "disponivel",
    bedrooms: 2,
    bathrooms: 2,
    parkingSpots: 2,
    area: 60,
    city: "São Paulo",
    neighborhood: "Penha",
    address: "Rua Francisco Coimbra, 333",
    state: "SP",
    lat: -23.5268,
    lng: -46.5440,
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&q=85",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=85",
      "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1200&q=85",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=85",
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=1200&q=85",
    ],
    features: [
      "2 suítes",
      "Sala ampla",
      "Lavabo",
      "Área de serviço",
      "2 vagas",
      "Aceita financiamento",
      "Documentação ok",
    ],
    isFeatured: true,
    isAvailable: true,
    createdAt: "2026-06-05T10:00:00Z",
    updatedAt: "2026-06-20T10:00:00Z",
    finishingLevel: "Médio-alto padrão",
  },
  {
    id: "3",
    slug: "sobrado-alto-padrao-vila-granada",
    code: "AGI003",
    title: "Sobrado Alto Padrão — Vila Granada",
    description:
      "Imóvel de alto padrão na Vila Granada, um dos endereços mais sofisticados da Zona Leste. Com impressionantes 180m² de área total, este sobrado foi projetado para quem exige o melhor em conforto, design e qualidade de vida.\n\nA planta contempla 3 suítes completas, área gourmet integrada, espaço preparado para jacuzzi, escada interna em vidro temperado com iluminação especial, acabamentos premium em toda a extensão do imóvel e 2 vagas de garagem cobertas.\n\nLocalização privilegiada: próximo ao Metrô Guilhermina–Esperança (Linha 3-Vermelha), com acesso rápido às principais avenidas da Zona Leste e ao centro de São Paulo.\n\nImóvel com valor abaixo da média para a região — oportunidade única de investimento. Aceita imóvel como parte do pagamento (permuta).",
    price: 899000,
    type: "sobrado",
    transactionType: "venda",
    status: "disponivel",
    bedrooms: 3,
    bathrooms: 3,
    parkingSpots: 2,
    area: 180,
    city: "São Paulo",
    neighborhood: "Vila Granada",
    state: "SP",
    lat: -23.5330,
    lng: -46.5380,
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=85",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=85",
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&q=85",
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1200&q=85",
      "https://images.unsplash.com/photo-1615873968403-89e068629265?w=1200&q=85",
    ],
    features: [
      "3 suítes",
      "Área gourmet",
      "Espaço para jacuzzi",
      "Escada em vidro",
      "Alto padrão",
      "2 vagas",
      "Aceita permuta",
      "Aceita financiamento",
    ],
    isFeatured: true,
    isAvailable: true,
    createdAt: "2026-05-15T10:00:00Z",
    updatedAt: "2026-06-20T10:00:00Z",
    finishingLevel: "Alto padrão",
  },
  {
    id: "4",
    slug: "sobrado-novo-penha-projeto-moderno",
    code: "AGI004",
    title: "Sobrado Novo — Penha",
    description:
      "Sobrado novo com projeto arquitetônico moderno na Penha. Imóvel de 180m², terreno 4x24m, com acabamento impecável e atenção a cada detalhe.\n\nA planta inovadora conta com 3 dormitórios espaçosos, ampla área gourmet perfeita para receber, lavanderia fechada com revestimento em vidro — um diferencial estético único —, jardim de inverno integrado à área social, banheiros com box de vidro, e generosa garagem com capacidade para 3 a 4 veículos.\n\nProjeto moderno e contemporâneo, com grandes aberturas que trazem luz natural para todos os ambientes. Materiais de primeira linha em toda a construção.\n\nLocalização privilegiada: próximo à Avenida Governador Carvalho Pinto, Avenida Amador Bueno da Veiga e Marginal Tietê — facilitando o acesso a toda São Paulo.\n\nDocumentação em ordem. Pronto para morar.",
    price: 890000,
    type: "sobrado",
    transactionType: "venda",
    status: "disponivel",
    bedrooms: 3,
    bathrooms: 3,
    parkingSpots: 4,
    area: 180,
    city: "São Paulo",
    neighborhood: "Penha",
    state: "SP",
    lat: -23.5280,
    lng: -46.5450,
    images: [
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&q=85",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=85",
      "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=1200&q=85",
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&q=85",
      "https://images.unsplash.com/photo-1599619351208-3e6c839d6828?w=1200&q=85",
    ],
    features: [
      "Projeto moderno",
      "Área gourmet",
      "Jardim de inverno",
      "Lavanderia em vidro",
      "3–4 vagas",
      "Terreno 4x24m",
      "Documentação ok",
    ],
    isFeatured: true,
    isAvailable: true,
    createdAt: "2026-05-20T10:00:00Z",
    updatedAt: "2026-06-20T10:00:00Z",
    finishingLevel: "Alto padrão",
  },
  {
    id: "5",
    slug: "sobrado-jardim-tres-marias-3-dorms",
    code: "AGI005",
    title: "Sobrado — Jardim Três Marias",
    description:
      "Sobrado charmoso no Jardim Três Marias com excelente localização e muito espaço para toda a família. Com 106,84m² de área construída, o imóvel entrega uma planta completa e funcional.\n\nEndereço: Rua Pinheiro Domingues, 219 — referência de qualidade no bairro.\n\nA planta conta com 3 dormitórios sendo 1 suíte, sacada com vista privilegiada, área gourmet completa, churrasqueira, jardim de inverno integrado e 2 vagas de garagem cobertas.\n\nPróximo às Avenidas São Miguel e Águia de Haia, com fácil acesso a transporte público, escolas, supermercados e comércio local.\n\nPreço reduzido de R$ 650.000 por R$ 599.000 — oportunidade real de negócio. Documentação em ordem. Aceita financiamento e FGTS.",
    price: 599000,
    type: "sobrado",
    transactionType: "venda",
    status: "disponivel",
    bedrooms: 3,
    bathrooms: 2,
    parkingSpots: 2,
    area: 106.84,
    city: "São Paulo",
    neighborhood: "Jardim Três Marias",
    address: "Rua Pinheiro Domingues, 219",
    state: "SP",
    lat: -23.5450,
    lng: -46.5120,
    images: [
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=1200&q=85",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=85",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=85",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=85",
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&q=85",
    ],
    features: [
      "1 suíte",
      "Sacada",
      "Área gourmet",
      "Churrasqueira",
      "Jardim de inverno",
      "2 vagas",
      "Aceita FGTS",
      "Aceita financiamento",
    ],
    isFeatured: false,
    isAvailable: true,
    createdAt: "2026-06-10T10:00:00Z",
    updatedAt: "2026-06-20T10:00:00Z",
    finishingLevel: "Médio-alto padrão",
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Marcela Ferreira",
    role: "Compradora — Penha",
    content:
      "O Ediel foi extremamente profissional e atencioso durante toda a negociação. Encontrei meu sobrado em menos de 2 semanas e o processo foi muito tranquilo. Recomendo de olhos fechados!",
    rating: 5,
    date: "2026-05-10",
  },
  {
    id: "2",
    name: "Roberto e Ana Lima",
    role: "Família — Vila Granada",
    content:
      "Buscávamos um imóvel de alto padrão na Zona Leste e o Ediel encontrou exatamente o que precisávamos. Conhecimento impecável do mercado local. Negociação justa e transparente do início ao fim.",
    rating: 5,
    date: "2026-04-15",
  },
  {
    id: "3",
    name: "Carlos Eduardo Santos",
    role: "Investidor — Penha",
    content:
      "Já fechei dois negócios com o Ediel. Ele conhece cada detalhe da Zona Leste e sempre traz as melhores oportunidades. Profissional de alto nível que entende o mercado como poucos.",
    rating: 5,
    date: "2026-03-20",
  },
  {
    id: "4",
    name: "Patrícia Oliveira",
    role: "Compradora — Jardim Três Marias",
    content:
      "Atendimento personalizado e muito paciente. O Ediel me mostrou as opções certas para meu perfil e me ajudou a tomar a melhor decisão. Hoje moro no imóvel dos meus sonhos na Zona Leste.",
    rating: 5,
    date: "2026-06-01",
  },
  {
    id: "5",
    name: "Anderson Costa",
    role: "Vendedor — Penha",
    content:
      "Vendi meu sobrado rapidamente e pelo valor que esperava. O Ediel trouxe compradores qualificados e cuidou de toda a documentação. Experiência excelente do começo ao fim.",
    rating: 5,
    date: "2026-05-25",
  },
];

export const REGIONS: Region[] = [
  {
    id: "1",
    name: "Penha",
    city: "São Paulo — SP",
    propertyCount: 3,
    // Basílica Nossa Senhora da Penha — marco visual do bairro
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Bas%C3%ADlica_de_Nossa_Senhora_da_Penha.jpg/1280px-Bas%C3%ADlica_de_Nossa_Senhora_da_Penha.jpg",
  },
  {
    id: "2",
    name: "Tatuapé",
    city: "São Paulo — SP",
    propertyCount: 0,
    // Parque do Tatuapé / vista aérea do bairro
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Tatuap%C3%A9_-_S%C3%A3o_Paulo.jpg/1280px-Tatuap%C3%A9_-_S%C3%A3o_Paulo.jpg",
  },
  {
    id: "3",
    name: "Vila Granada",
    city: "São Paulo — SP",
    propertyCount: 1,
    // Vista aérea de área residencial da Zona Leste de SP
    image: "https://images.unsplash.com/photo-1578632749014-ca77f29ad0e9?w=800&q=80",
  },
  {
    id: "4",
    name: "São Miguel Paulista",
    city: "São Paulo — SP",
    propertyCount: 0,
    // Igreja de São Miguel Arcanjo (1622) — monumento histórico do bairro
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Igreja_de_S%C3%A3o_Miguel_Arcanjo_%28S%C3%A3o_Paulo%29.jpg/1280px-Igreja_de_S%C3%A3o_Miguel_Arcanjo_%28S%C3%A3o_Paulo%29.jpg",
  },
  {
    id: "5",
    name: "Vila Matilde",
    city: "São Paulo — SP",
    propertyCount: 0,
    // Área residencial da Zona Leste
    image: "https://images.unsplash.com/photo-1609220136736-443140cfeaa3?w=800&q=80",
  },
  {
    id: "6",
    name: "Jardim Três Marias",
    city: "São Paulo — SP",
    propertyCount: 1,
    // Área residencial arborizada próxima a São Miguel
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80",
  },
  {
    id: "7",
    name: "Guilhermina",
    city: "São Paulo — SP",
    propertyCount: 0,
    // Estação Guilhermina-Esperança / Zona Leste urbana
    image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80",
  },
  {
    id: "8",
    name: "Grande São Paulo",
    city: "Região Metropolitana",
    propertyCount: 0,
    // Skyline de São Paulo
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/S%C3%A3o_Paulo_-_Pinheiros_e_Berrini_by_night_%2811952418636%29.jpg/1280px-S%C3%A3o_Paulo_-_Pinheiros_e_Berrini_by_night_%2811952418636%29.jpg",
  },
];

export function getProperties(): Property[] {
  return MOCK_PROPERTIES;
}

export function getPropertyBySlug(slug: string): Property | undefined {
  return MOCK_PROPERTIES.find((p) => p.slug === slug);
}

export function getPropertyById(id: string): Property | undefined {
  return MOCK_PROPERTIES.find((p) => p.id === id);
}

export function getFeaturedProperties(): Property[] {
  return MOCK_PROPERTIES.filter((p) => p.isFeatured && p.isAvailable);
}

export function getAvailableProperties(): Property[] {
  return MOCK_PROPERTIES.filter((p) => p.isAvailable);
}

export function getSimilarProperties(property: Property, limit = 3): Property[] {
  return MOCK_PROPERTIES.filter(
    (p) =>
      p.id !== property.id &&
      p.isAvailable &&
      (p.type === property.type || p.neighborhood === property.neighborhood)
  ).slice(0, limit);
}
