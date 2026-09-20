import type { DebateJob, FactCheckItem } from '@/features/debates/types/debate.types';

export const generateWebSiteSchema = (siteUrl: string): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Argumeta',
  url: siteUrl,
  description: 'Plataforma de inteligência artificial, verificação de fatos e análise retórica imparcial de debates.',
  potentialAction: {
    '@type': 'SearchAction',
    target: `${siteUrl}/?search={search_term_string}`,
    'query-input': 'required name=search_term_string'
  },
  inLanguage: 'pt-BR'
});

export const generateOrganizationSchema = (siteUrl: string): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Argumeta',
  url: siteUrl,
  logo: `${siteUrl}/logo-512.png`,
  sameAs: [],
  description: 'Inteligência e Análise Algorítmica Imparcial de Debates.'
});

export const generateBreadcrumbSchema = (
  items: Array<{ name: string; url: string }>
): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url
  }))
});

export const generateDebateVideoSchema = (
  debate: DebateJob,
  siteUrl: string
): Record<string, unknown> => {
  const durationInMinutes = debate.durationSeconds ? Math.floor(debate.durationSeconds / 60) : 30;
  const isoDuration = `PT${durationInMinutes}M`;
  const uploadDate = new Date(debate.completedAt || debate.createdAt).toISOString();
  const thumbnailUrl =
    debate.thumbnailUrl ||
    (debate.youtubeId ? `https://img.youtube.com/vi/${debate.youtubeId}/hqdefault.jpg` : `${siteUrl}/logo-512.png`);

  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: debate.title || 'Debate Audiovisual',
    description:
      debate.description ||
      `Análise retórica algorítmica e checagem de fatos do debate com ${(debate.speakers || []).map((s) => s.name).join(', ')}.`,
    thumbnailUrl: [thumbnailUrl],
    uploadDate,
    duration: isoDuration,
    contentUrl: debate.youtubeUrl,
    embedUrl: debate.youtubeId ? `https://www.youtube.com/embed/${debate.youtubeId}` : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'Argumeta',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo-512.png`
      }
    }
  };
};

const mapVerdictToRating = (verdict: FactCheckItem['verdict']): { value: number; alternate: string } => {
  switch (verdict) {
    case 'Verdadeiro':
      return { value: 5, alternate: 'Verdadeiro' };
    case 'Impreciso':
    case 'Disputado':
      return { value: 3, alternate: 'Impreciso / Disputado' };
    case 'Falso':
    default:
      return { value: 1, alternate: 'Falso' };
  }
};

export const generateClaimReviewsSchema = (
  debate: DebateJob,
  siteUrl: string
): Array<Record<string, unknown>> => {
  if (!debate.factChecks || debate.factChecks.length === 0) {
    return [];
  }

  const debateUrl = `${siteUrl}/debates/${debate.id}`;
  const pubDate = new Date(debate.completedAt || debate.createdAt).toISOString();

  // Limitar aos primeiros 10 fatos checados para manter o schema conciso e relevante
  return debate.factChecks.slice(0, 10).map((fc) => {
    const { value, alternate } = mapVerdictToRating(fc.verdict);

    return {
      '@context': 'https://schema.org',
      '@type': 'ClaimReview',
      datePublished: pubDate,
      url: debateUrl,
      claimReviewed: fc.claim,
      itemReviewed: {
        '@type': 'CreativeWork',
        author: {
          '@type': 'Person',
          name: fc.speaker
        },
        datePublished: pubDate,
        name: debate.title
      },
      author: {
        '@type': 'Organization',
        name: 'Argumeta Fact-Checking',
        url: siteUrl
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: value,
        bestRating: 5,
        worstRating: 1,
        alternateName: alternate
      },
      reviewBody: fc.evidence
    };
  });
};

export const generateDebateFullJsonLd = (
  debate: DebateJob,
  siteUrl: string
): Array<Record<string, unknown>> => {
  const schemas: Array<Record<string, unknown>> = [];

  // 1. Breadcrumbs
  schemas.push(
    generateBreadcrumbSchema([
      { name: 'Início', url: siteUrl },
      { name: 'Debates', url: `${siteUrl}/` },
      { name: debate.title || 'Debate', url: `${siteUrl}/debates/${debate.id}` }
    ])
  );

  // 2. VideoObject
  schemas.push(generateDebateVideoSchema(debate, siteUrl));

  // 3. ClaimReviews para o Google Fact Check Explorer
  const claimReviews = generateClaimReviewsSchema(debate, siteUrl);
  schemas.push(...claimReviews);

  return schemas;
};
