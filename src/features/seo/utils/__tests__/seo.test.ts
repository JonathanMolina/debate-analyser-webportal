import { describe, it, expect, beforeEach } from 'vitest';
import { updateDocumentMeta, resetDocumentMeta, DEFAULT_TITLE, DEFAULT_DESCRIPTION } from '../updateMeta';
import {
  generateWebSiteSchema,
  generateOrganizationSchema,
  generateBreadcrumbSchema,
  generateDebateVideoSchema,
  generateClaimReviewsSchema,
  generateDebateFullJsonLd
} from '../jsonLdGenerators';
import type { DebateJob } from '@/features/debates/types/debate.types';

describe('SEO & Metadata Management', () => {
  beforeEach(() => {
    // Limpar tags criadas entre os testes
    document.head.innerHTML = '';
    document.title = '';
  });

  it('deve atualizar o document.title e meta tags básicas corretamente', () => {
    updateDocumentMeta({
      title: 'Debate Teste',
      description: 'Descrição de teste para SEO',
      canonicalUrl: 'https://argumeta.com.br/debates/123'
    });

    expect(document.title).toBe('Debate Teste | Argumeta');

    const descMeta = document.querySelector('meta[name="description"]');
    expect(descMeta?.getAttribute('content')).toBe('Descrição de teste para SEO');

    const canonicalLink = document.querySelector('link[rel="canonical"]');
    expect(canonicalLink?.getAttribute('href')).toBe('https://argumeta.com.br/debates/123');

    const ogTitle = document.querySelector('meta[property="og:title"]');
    expect(ogTitle?.getAttribute('content')).toBe('Debate Teste | Argumeta');

    const twitterCard = document.querySelector('meta[name="twitter:card"]');
    expect(twitterCard?.getAttribute('content')).toBe('summary_large_image');
  });

  it('deve injetar script JSON-LD quando fornecido', () => {
    const jsonLdData = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Argumeta'
    };

    updateDocumentMeta({
      title: 'Página com JSON-LD',
      jsonLd: jsonLdData
    });

    const script = document.getElementById('argumeta-dynamic-json-ld');
    expect(script).not.toBeNull();
    expect(script?.getAttribute('type')).toBe('application/ld+json');
    expect(JSON.parse(script?.textContent || '{}')).toEqual(jsonLdData);
  });

  it('deve restaurar metadados padrões ao chamar resetDocumentMeta', () => {
    updateDocumentMeta({
      title: 'Página Específica',
      description: 'Descrição personalizada'
    });

    resetDocumentMeta();

    expect(document.title).toBe(DEFAULT_TITLE);
    const desc = document.querySelector('meta[name="description"]');
    expect(desc?.getAttribute('content')).toBe(DEFAULT_DESCRIPTION);
  });
});

describe('Schema.org JSON-LD Generators', () => {
  const siteUrl = 'https://argumeta.com.br';

  it('deve gerar schema de WebSite com SearchAction válido', () => {
    const schema = generateWebSiteSchema(siteUrl);
    expect(schema['@type']).toBe('WebSite');
    expect(schema['url']).toBe(siteUrl);
    expect(schema['potentialAction']).toBeDefined();
  });

  it('deve gerar schema de Organization', () => {
    const schema = generateOrganizationSchema(siteUrl);
    expect(schema['@type']).toBe('Organization');
    expect(schema['name']).toBe('Argumeta');
    expect(schema['logo']).toBe(`${siteUrl}/logo-512.png`);
  });

  it('deve gerar breadcrumb schema', () => {
    const breadcrumbs = [
      { name: 'Home', url: siteUrl },
      { name: 'Debates', url: `${siteUrl}/debates` }
    ];
    const schema = generateBreadcrumbSchema(breadcrumbs);
    expect(schema['@type']).toBe('BreadcrumbList');
    expect((schema['itemListElement'] as unknown[]).length).toBe(2);
  });

  it('deve gerar VideoObject e ClaimReviews para um debate', () => {
    const mockDebate: DebateJob = {
      id: 'job_teste_1',
      title: 'Debate Candidato A vs Candidato B',
      description: 'Discussão sobre economia e saúde pública.',
      youtubeUrl: 'https://youtube.com/watch?v=abc12345',
      youtubeId: 'abc12345',
      speakers: [{ name: 'Candidato A' }, { name: 'Candidato B' }],
      status: 'completed',
      progress: 100,
      createdAt: 1726700000000,
      completedAt: 1726701000000,
      durationSeconds: 3600,
      factChecks: [
        {
          id: 'fc_1',
          timestamp: 120,
          speaker: 'Candidato A',
          claim: 'O PIB cresceu 10% no ano passado.',
          verdict: 'Falso',
          evidence: 'O crescimento apurado foi de 2.9%.',
          sources: ['IBGE']
        },
        {
          id: 'fc_2',
          timestamp: 240,
          speaker: 'Candidato B',
          claim: 'A taxa de desemprego caiu para 7.5%.',
          verdict: 'Verdadeiro',
          evidence: 'Dados confirmados pela PNAD Contínua.',
          sources: ['IBGE']
        }
      ]
    };

    const videoSchema = generateDebateVideoSchema(mockDebate, siteUrl);
    expect(videoSchema['@type']).toBe('VideoObject');
    expect(videoSchema['name']).toBe(mockDebate.title);
    expect(videoSchema['duration']).toBe('PT60M');

    const claimReviews = generateClaimReviewsSchema(mockDebate, siteUrl);
    expect(claimReviews.length).toBe(2);
    expect(claimReviews[0]['@type']).toBe('ClaimReview');
    expect(claimReviews[0]['claimReviewed']).toBe('O PIB cresceu 10% no ano passado.');
    const ratingObj = claimReviews[0]['reviewRating'] as { ratingValue: number; alternateName: string };
    expect(ratingObj.ratingValue).toBe(1); // Falso
    expect(ratingObj.alternateName).toBe('Falso');

    const fullSchemas = generateDebateFullJsonLd(mockDebate, siteUrl);
    // 1 Breadcrumb + 1 VideoObject + 2 ClaimReviews = 4 schemas
    expect(fullSchemas.length).toBe(4);
  });
});
