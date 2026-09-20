import { FC } from 'react';
import type { SeoMetaProps } from '../types/seo.types';
import { useSeo } from '../hooks/useSeo';

export const SeoHead: FC<SeoMetaProps> = (props) => {
  useSeo(props);
  return null;
};
