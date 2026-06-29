-- ================================================================
-- AGUIAR IMÓVEIS — Supabase Schema
-- Execute este SQL no SQL Editor do seu projeto Supabase
-- ================================================================

-- Extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Tabela de imóveis ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS properties (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug          TEXT UNIQUE NOT NULL,
  code          TEXT UNIQUE NOT NULL,
  title         TEXT NOT NULL,
  description   TEXT NOT NULL DEFAULT '',
  price         NUMERIC NOT NULL DEFAULT 0,
  condo_fee     NUMERIC,
  iptu          NUMERIC,
  type          TEXT NOT NULL DEFAULT 'sobrado',
  transaction_type TEXT NOT NULL DEFAULT 'venda',
  status        TEXT NOT NULL DEFAULT 'disponivel' CHECK (status IN ('disponivel','vendido','alugado','reservado')),
  bedrooms      INTEGER NOT NULL DEFAULT 0,
  bathrooms     INTEGER NOT NULL DEFAULT 0,
  parking_spots INTEGER NOT NULL DEFAULT 0,
  area          NUMERIC NOT NULL DEFAULT 0,
  useful_area   NUMERIC,
  city          TEXT NOT NULL DEFAULT 'São Paulo',
  neighborhood  TEXT NOT NULL DEFAULT '',
  address       TEXT,
  state         TEXT NOT NULL DEFAULT 'SP',
  lat           NUMERIC,
  lng           NUMERIC,
  images        TEXT[] NOT NULL DEFAULT '{}',
  features      TEXT[] NOT NULL DEFAULT '{}',
  is_featured   BOOLEAN NOT NULL DEFAULT false,
  is_available  BOOLEAN NOT NULL DEFAULT true,
  floor         INTEGER,
  total_floors  INTEGER,
  year_built    INTEGER,
  sun_position  TEXT,
  finishing_level TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Trigger para updated_at ─────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON properties;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── Row Level Security ──────────────────────────────────────────
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Leitura pública (site)
CREATE POLICY "properties_public_read" ON properties
  FOR SELECT USING (true);

-- Escrita irrestrita via anon key (para o admin)
-- Em produção, troque por autenticação real via Supabase Auth
CREATE POLICY "properties_admin_all" ON properties
  FOR ALL USING (true) WITH CHECK (true);

-- ── Storage bucket ──────────────────────────────────────────────
-- Execute esta parte separada se necessário
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'property-images',
  'property-images',
  true,
  52428800, -- 50MB por arquivo
  ARRAY['image/jpeg','image/jpg','image/png','image/webp','image/avif']
)
ON CONFLICT (id) DO NOTHING;

-- Políticas de storage
CREATE POLICY "storage_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'property-images');

CREATE POLICY "storage_admin_insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'property-images');

CREATE POLICY "storage_admin_update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'property-images');

CREATE POLICY "storage_admin_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'property-images');

-- ── Seed: 5 imóveis reais ───────────────────────────────────────
INSERT INTO properties (
  id, slug, code, title, description, price, type, transaction_type,
  status, bedrooms, bathrooms, parking_spots, area,
  city, neighborhood, state, images, features,
  is_featured, is_available, finishing_level, created_at
) VALUES
(
  uuid_generate_v4(),
  'sobrado-venda-penha-2-suites',
  'AGI001',
  'Sobrado à Venda — Penha',
  'Sobrado impecável localizado na Penha, próximo à Basílica Nossa Senhora da Penha, Shopping Penha e Estação Penha do Metrô. Com 2 suítes, sala integrada, cozinha planejada, lavanderia, lavabo e 1 vaga. Condomínio com apenas 9 unidades, garantindo tranquilidade e segurança. Excelente infraestrutura na região com supermercados, escolas, bancos e comércio completo.',
  410000, 'sobrado', 'venda', 'disponivel',
  2, 2, 1, 63, 'São Paulo', 'Penha', 'SP',
  ARRAY[
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&q=85',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=85',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=85',
    'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=1200&q=85',
    'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1200&q=85'
  ],
  ARRAY['2 suítes','Lavabo','Lavanderia','Condomínio com 9 unidades','Aceita financiamento','Documentação ok'],
  true, true, 'Médio-alto padrão', NOW() - INTERVAL '20 days'
),
(
  uuid_generate_v4(),
  'sobrado-condominio-penha-2-suites',
  'AGI002',
  'Sobrado em Condomínio — Penha',
  'Excelente sobrado em condomínio fechado no Centro da Penha. Com 60m² distribuídos de forma inteligente, o imóvel oferece 2 suítes, sala ampla, cozinha espaçosa, lavabo, área de serviço e 2 vagas. Endereço privilegiado na Rua Francisco Coimbra, 333, próximo ao SENAC e ao Metrô Penha.',
  430000, 'sobrado', 'venda', 'disponivel',
  2, 2, 2, 60, 'São Paulo', 'Penha', 'SP',
  ARRAY[
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&q=85',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=85',
    'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1200&q=85',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=85',
    'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=1200&q=85'
  ],
  ARRAY['2 suítes','Sala ampla','Lavabo','Área de serviço','2 vagas','Aceita financiamento','Documentação ok'],
  true, true, 'Médio-alto padrão', NOW() - INTERVAL '15 days'
),
(
  uuid_generate_v4(),
  'sobrado-alto-padrao-vila-granada',
  'AGI003',
  'Sobrado Alto Padrão — Vila Granada',
  'Imóvel de alto padrão na Vila Granada com 180m² totais. 3 suítes completas, área gourmet integrada, espaço preparado para jacuzzi, escada interna em vidro temperado, acabamentos premium e 2 vagas cobertas. Próximo ao Metrô Guilhermina–Esperança. Valor abaixo da média da região. Aceita permuta.',
  899000, 'sobrado', 'venda', 'disponivel',
  3, 3, 2, 180, 'São Paulo', 'Vila Granada', 'SP',
  ARRAY[
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=85',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=85',
    'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&q=85',
    'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1200&q=85',
    'https://images.unsplash.com/photo-1615873968403-89e068629265?w=1200&q=85'
  ],
  ARRAY['3 suítes','Área gourmet','Espaço para jacuzzi','Escada em vidro','Alto padrão','2 vagas','Aceita permuta'],
  true, true, 'Alto padrão', NOW() - INTERVAL '35 days'
),
(
  uuid_generate_v4(),
  'sobrado-novo-penha-projeto-moderno',
  'AGI004',
  'Sobrado Novo — Penha',
  'Sobrado novo com projeto arquitetônico moderno na Penha. 180m² em terreno 4x24m. 3 dormitórios, área gourmet, lavanderia fechada em vidro, jardim de inverno, banheiros com box e 3–4 vagas. Próximo à Av. Governador Carvalho Pinto, Av. Amador Bueno da Veiga e Marginal Tietê.',
  890000, 'sobrado', 'venda', 'disponivel',
  3, 3, 4, 180, 'São Paulo', 'Penha', 'SP',
  ARRAY[
    'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&q=85',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=85',
    'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=1200&q=85',
    'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&q=85',
    'https://images.unsplash.com/photo-1599619351208-3e6c839d6828?w=1200&q=85'
  ],
  ARRAY['Projeto moderno','Área gourmet','Jardim de inverno','Lavanderia em vidro','3–4 vagas','Terreno 4x24m'],
  true, true, 'Alto padrão', NOW() - INTERVAL '30 days'
),
(
  uuid_generate_v4(),
  'sobrado-jardim-tres-marias-3-dorms',
  'AGI005',
  'Sobrado — Jardim Três Marias',
  'Sobrado no Jardim Três Marias com 106,84m². Endereço: Rua Pinheiro Domingues, 219. 3 dormitórios sendo 1 suíte, sacada, área gourmet com churrasqueira, jardim de inverno e 2 vagas cobertas. Próximo às Avenidas São Miguel e Águia de Haia. Preço reduzido de R$ 650.000 por R$ 599.000.',
  599000, 'sobrado', 'venda', 'disponivel',
  3, 2, 2, 106.84, 'São Paulo', 'Jardim Três Marias', 'SP',
  ARRAY[
    'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=1200&q=85',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=85',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=85',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=85',
    'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&q=85'
  ],
  ARRAY['1 suíte','Sacada','Área gourmet','Churrasqueira','Jardim de inverno','2 vagas','Aceita FGTS'],
  false, true, 'Médio-alto padrão', NOW() - INTERVAL '10 days'
)
ON CONFLICT (slug) DO NOTHING;
