import type { SeoMetaProps } from '../types/seo.types';

export const DEFAULT_TITLE = 'Argumeta — Inteligência e Análise Imparcial de Debates';
export const DEFAULT_DESCRIPTION =
  'Plataforma de inteligência artificial, verificação de fatos (fact-checking) e análise retórica imparcial de debates políticos e temáticos.';
export const DEFAULT_IMAGE = '/logo-512.png';
export const DEFAULT_KEYWORDS = [
  'Argumeta',
  'análise de debates',
  'debates políticos',
  'fact-checking',
  'checagem de fatos',
  'falácias lógicas',
  'retórica',
  'inteligência artificial política',
  'ranking de debatedores',
  'transparência'
];

const setMetaTag = (attribute: 'name' | 'property', name: string, content?: string): void => {
  if (typeof document === 'undefined') return;

  const selector = `meta[${attribute}="${name}"]`;
  let element = document.querySelector(selector);

  if (!content) {
    if (element) element.remove();
    return;
  }

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
};

const setCanonicalUrl = (url?: string): void => {
  if (typeof document === 'undefined') return;

  let element = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!url) {
    if (element) element.remove();
    return;
  }

  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }

  element.setAttribute('href', url);
};

const JSON_LD_SCRIPT_ID = 'argumeta-dynamic-json-ld';

const setJsonLd = (data?: Record<string, unknown> | Array<Record<string, unknown>>): void => {
  if (typeof document === 'undefined') return;

  let script = document.getElementById(JSON_LD_SCRIPT_ID);

  if (!data) {
    if (script) script.remove();
    return;
  }

  if (!script) {
    script = document.createElement('script');
    script.id = JSON_LD_SCRIPT_ID;
    script.setAttribute('type', 'application/ld+json');
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(data);
};

export const updateDocumentMeta = (props: SeoMetaProps): void => {
  if (typeof document === 'undefined') return;

  const fullTitle = props.title
    ? props.title.includes('Argumeta')
      ? props.title
      : `${props.title} | Argumeta`
    : DEFAULT_TITLE;

  document.title = fullTitle;

  const desc = props.description || DEFAULT_DESCRIPTION;
  const canonical =
    props.canonicalUrl || (typeof window !== 'undefined' ? window.location.href : '');
  const image = props.ogImage || DEFAULT_IMAGE;
  const absoluteImage =
    image.startsWith('http') || typeof window === 'undefined'
      ? image
      : `${window.location.origin}${image}`;

  // Tags Básicas
  setMetaTag('name', 'description', desc);
  const keywords = props.keywords && props.keywords.length > 0 ? props.keywords.join(', ') : DEFAULT_KEYWORDS.join(', ');
  setMetaTag('name', 'keywords', keywords);

  // Robôs
  if (props.noIndex) {
    setMetaTag('name', 'robots', 'noindex, nofollow');
  } else {
    setMetaTag('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
  }

  // Canonical
  if (canonical) {
    setCanonicalUrl(canonical);
  }

  // Open Graph
  setMetaTag('property', 'og:title', fullTitle);
  setMetaTag('property', 'og:description', desc);
  setMetaTag('property', 'og:type', props.ogType || 'website');
  if (canonical) setMetaTag('property', 'og:url', canonical);
  setMetaTag('property', 'og:image', absoluteImage);
  if (props.ogImageAlt) setMetaTag('property', 'og:image:alt', props.ogImageAlt);
  setMetaTag('property', 'og:site_name', 'Argumeta');
  setMetaTag('property', 'og:locale', 'pt_BR');

  // Twitter Cards
  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:title', fullTitle);
  setMetaTag('name', 'twitter:description', desc);
  setMetaTag('name', 'twitter:image', absoluteImage);

  // Article / Published Timestamps se disponível
  if (props.publishedTime) {
    setMetaTag('property', 'article:published_time', props.publishedTime);
  }
  if (props.modifiedTime) {
    setMetaTag('property', 'article:modified_time', props.modifiedTime);
  }

  // Schema.org JSON-LD
  setJsonLd(props.jsonLd);
};

export const resetDocumentMeta = (): void => {
  updateDocumentMeta({
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    keywords: DEFAULT_KEYWORDS
  });
};
