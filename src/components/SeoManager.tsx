import React from 'react';
import { SeoMetadata, SeoMetadataProps, CANONICAL_DOMAIN, PRODUCTION_DOMAIN } from './SeoMetadata';

export { CANONICAL_DOMAIN, PRODUCTION_DOMAIN, SeoMetadata };
export type { SeoMetadataProps };

/**
 * Backward-compatible wrapper delegating to the unified SeoMetadata component.
 */
export const SeoManager: React.FC<SeoMetadataProps> = (props) => {
  return <SeoMetadata {...props} />;
};

export default SeoManager;
