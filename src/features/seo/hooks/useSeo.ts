import { useEffect } from 'react';
import type { SeoMetaProps } from '../types/seo.types';
import { updateDocumentMeta, resetDocumentMeta } from '../utils/updateMeta';

export const useSeo = (props: SeoMetaProps): void => {
  useEffect(() => {
    updateDocumentMeta(props);

    return () => {
      // Opcional: restaurar metadados padrão se o componente for desmontado
      resetDocumentMeta();
    };
  }, [
    props.title,
    props.description,
    props.canonicalUrl,
    props.ogType,
    props.ogImage,
    props.ogImageAlt,
    props.publishedTime,
    props.modifiedTime,
    props.noIndex,
    JSON.stringify(props.keywords),
    JSON.stringify(props.jsonLd)
  ]);
};
