import React, { useEffect } from 'react';
import { useEvent } from '../context/EventContext';

/**
 * The single source of truth for the canonical public domain.
 * Every public-facing route MUST resolve its canonical URL and social tags to this origin.
 */
export const CANONICAL_DOMAIN = 'https://aa-eventmaker.my.id';
export const PRODUCTION_DOMAIN = CANONICAL_DOMAIN; // Alias for compatibility

export interface SeoMetadataProps {
  /**
   * Custom page title (e.g. "The Wedding of Andi & Ayu | AA Event Maker").
   * If omitted, will be derived automatically based on active route context.
   */
  title?: string;

  /**
   * Custom meta description.
   * If omitted, will be derived automatically based on active route context.
   */
  description?: string;

  /**
   * The canonical route path (e.g. "/" or "/invitation/andi-ayu-wedding").
   * Will always be sanitized, stripped of query strings/hashes, and anchored to CANONICAL_DOMAIN.
   */
  canonicalPath?: string;

  /**
   * OpenGraph & Twitter preview image.
   * Relative paths (e.g. "/pwa-512x512.png") will be automatically prefixed with CANONICAL_DOMAIN.
   */
  imageUrl?: string;

  /**
   * OpenGraph type ('website' | 'article' | 'profile'). Defaults to 'website'.
   */
  type?: 'website' | 'article' | 'profile';

  /**
   * When true, applies "noindex, nofollow" and removes canonical tag to protect private dashboard views.
   */
  noIndex?: boolean;

  /**
   * Schema.org JSON-LD object or array. Injected into #seo-schema-structured-data.
   */
  jsonLd?: object | null;

  /**
   * Additional meta keywords.
   */
  keywords?: string;
}

/**
 * Sanitizes and normalizes any path or URL specifically to the canonical https://aa-eventmaker.my.id origin.
 * Removes hash fragments, query params, and non-canonical domain names.
 */
export function buildCanonicalUrl(pathOrUrl?: string): string {
  if (!pathOrUrl || pathOrUrl.trim() === '' || pathOrUrl === '/') {
    return `${CANONICAL_DOMAIN}/`;
  }

  let clean = pathOrUrl.trim();

  // Strip query string and hash fragments
  clean = clean.split('?')[0].split('#')[0];

  // Strip domain names if full URL was passed
  clean = clean
    .replace(/^https?:\/\/www\.aa-eventmaker\.my\.id/i, '')
    .replace(/^https?:\/\/aa-eventmaker\.my\.id/i, '')
    .replace(/^https?:\/\/www\.aa-eventmaker\.com/i, '')
    .replace(/^https?:\/\/aa-eventmaker\.com/i, '')
    .replace(/^https?:\/\/[^/]+/i, ''); // Strip any arbitrary host

  if (!clean.startsWith('/')) {
    clean = `/${clean}`;
  }

  // Remove trailing slashes for sub-paths (keep root /)
  if (clean.length > 1 && clean.endsWith('/')) {
    clean = clean.slice(0, -1);
  }

  return `${CANONICAL_DOMAIN}${clean}`;
}

/**
 * Ensures an image URL is an absolute URL pointing to the canonical domain or valid CDN.
 */
export function normalizeImageUrl(img?: string): string {
  if (!img || img.trim() === '') {
    return `${CANONICAL_DOMAIN}/pwa-512x512.png`;
  }

  const trimmed = img.trim();

  // Data URLs can be used directly for transient previews
  if (trimmed.startsWith('data:')) {
    return trimmed;
  }

  // Replace legacy domain references
  let replaced = trimmed
    .replace(/^https?:\/\/(www\.)?aa-eventmaker\.com/i, CANONICAL_DOMAIN)
    .replace(/^https?:\/\/www\.aa-eventmaker\.my\.id/i, CANONICAL_DOMAIN);

  // If relative path, prefix with CANONICAL_DOMAIN
  if (replaced.startsWith('/')) {
    return `${CANONICAL_DOMAIN}${replaced}`;
  }

  // If already absolute http/https
  if (replaced.startsWith('http://') || replaced.startsWith('https://')) {
    return replaced;
  }

  return `${CANONICAL_DOMAIN}/${replaced}`;
}

/**
 * DOM Helper to set or create a <meta> tag
 */
function setMeta(attribute: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector(`meta[${attribute}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attribute, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/**
 * DOM Helper to set or remove canonical <link>
 */
function updateCanonicalTag(url: string | null) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!url) {
    if (link) link.remove();
    return;
  }

  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

/**
 * DOM Helper to set or remove JSON-LD schema
 */
function updateJsonLd(id: string, data: object | null) {
  let script = document.getElementById(id) as HTMLScriptElement | null;
  if (!data) {
    if (script) script.remove();
    return;
  }

  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data, null, 2);
}

/**
 * Unified SEO Metadata Component.
 * Automatically synchronizes <title>, <link rel="canonical">, OpenGraph, Twitter cards,
 * and Schema.org JSON-LD to ensure all public routes strictly point to aa-eventmaker.my.id.
 */
export const SeoMetadata: React.FC<SeoMetadataProps> = ({
  title: propTitle,
  description: propDescription,
  canonicalPath: propCanonicalPath,
  imageUrl: propImageUrl,
  type: propType = 'website',
  noIndex: propNoIndex,
  jsonLd: propJsonLd,
  keywords: propKeywords,
}) => {
  const {
    showPublicLanding,
    showPublicPreview,
    invitation,
    activeRole,
  } = useEvent();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Hostname redirect guard: Enforce canonical domain if visiting legacy or non-canonical hosts
    const currentHost = window.location.hostname;
    if (
      currentHost === 'aa-eventmaker.com' ||
      currentHost === 'www.aa-eventmaker.com' ||
      currentHost === 'www.aa-eventmaker.my.id'
    ) {
      const destination = `${CANONICAL_DOMAIN}${window.location.pathname}${window.location.search}${window.location.hash}`;
      window.location.replace(destination);
      return;
    }

    // 2. Identify route and defaults if not provided in props
    const hash = window.location.hash || '';
    const pathname = window.location.pathname || '';

    const isInvitation =
      showPublicPreview ||
      hash.startsWith('#invitation') ||
      pathname.startsWith('/invitation');

    const isPublicLanding = showPublicLanding || pathname === '/' || hash === '#portal';

    // Determine if this route is private/authenticated
    const isPrivate = propNoIndex !== undefined ? propNoIndex : (!isInvitation && !isPublicLanding);

    // Private Route Handling: Shield authenticated panels from indexers
    if (isPrivate) {
      const privateTitle = propTitle || `Dasbor ${activeRole} | AA Event Maker`;
      document.title = privateTitle;
      setMeta('name', 'title', privateTitle);
      setMeta('name', 'robots', 'noindex, nofollow');
      updateCanonicalTag(null); // Eliminate conflicting signals
      updateJsonLd('seo-schema-structured-data', null);
      return;
    }

    // 3. Public Route Handling
    let resolvedTitle = propTitle;
    let resolvedDescription = propDescription;
    let resolvedCanonicalUrl = '';
    let resolvedImageUrl = normalizeImageUrl(propImageUrl);
    let resolvedJsonLd = propJsonLd;

    if (isInvitation) {
      // Determine invitation slug
      let slug = invitation.slug || 'andi-ayu-wedding';
      if (hash.startsWith('#invitation/')) {
        const extracted = hash.replace('#invitation/', '').split('?')[0];
        if (extracted) slug = extracted;
      } else if (pathname.startsWith('/invitation/')) {
        const extracted = pathname.replace('/invitation/', '').split('?')[0];
        if (extracted) slug = extracted;
      }

      resolvedCanonicalUrl = buildCanonicalUrl(propCanonicalPath || `/invitation/${slug}`);
      resolvedTitle = propTitle || `${invitation.title} – Undangan Digital | AA Event Maker`;
      resolvedDescription =
        propDescription ||
        `Undangan digital resmi ${invitation.title} (${invitation.hosts}). Acara pada ${invitation.date} di ${invitation.venue}. Buka undangan digital Anda di sini.`;
      
      if (!propImageUrl) {
        resolvedImageUrl = normalizeImageUrl(invitation.coverPhoto);
      }

      if (resolvedJsonLd === undefined) {
        resolvedJsonLd = {
          '@context': 'https://schema.org',
          '@type': 'Event',
          name: invitation.title,
          description: `Undangan perayaan ${invitation.title} (${invitation.hosts})`,
          eventStatus: 'https://schema.org/EventScheduled',
          eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
          location: {
            '@type': 'Place',
            name: invitation.venue,
            address: {
              '@type': 'PostalAddress',
              streetAddress: invitation.address,
              addressCountry: 'ID',
            },
          },
          organizer: {
            '@type': 'Person',
            name: invitation.hosts,
          },
          image: [resolvedImageUrl],
          url: resolvedCanonicalUrl,
        };
      }
    } else {
      // Public Homepage / Landing
      resolvedCanonicalUrl = buildCanonicalUrl(propCanonicalPath || '/');
      resolvedTitle =
        propTitle || 'AA Event Maker – Create Beautiful Digital Invitations';
      resolvedDescription =
        propDescription ||
        'Create beautiful animated digital invitations for weddings, engagements, birthdays, and special events with AA Event Maker.';

      if (!propImageUrl) {
        resolvedImageUrl = `${CANONICAL_DOMAIN}/pwa-512x512.png`;
      }

      if (resolvedJsonLd === undefined) {
        resolvedJsonLd = {
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'WebSite',
              '@id': `${CANONICAL_DOMAIN}/#website`,
              url: `${CANONICAL_DOMAIN}/`,
              name: 'AA Event Maker',
              description: resolvedDescription,
              inLanguage: 'id-ID',
            },
            {
              '@type': 'Organization',
              '@id': `${CANONICAL_DOMAIN}/#organization`,
              name: 'AA-EventMaker',
              url: `${CANONICAL_DOMAIN}/`,
              logo: `${CANONICAL_DOMAIN}/icon.svg`,
              slogan: 'Plan • Manage • Make It Happen',
            },
            {
              '@type': 'SoftwareApplication',
              '@id': `${CANONICAL_DOMAIN}/#software`,
              name: 'AA-EventMaker',
              url: `${CANONICAL_DOMAIN}/`,
              applicationCategory: 'BusinessApplication, LifestyleApplication',
              operatingSystem: 'All',
              description: resolvedDescription,
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'IDR',
              },
            },
          ],
        };
      }
    }

    // 4. Commit all meta tags to the document head
    document.title = resolvedTitle;

    // Canonical link
    updateCanonicalTag(resolvedCanonicalUrl);

    // Standard meta tags
    setMeta('name', 'title', resolvedTitle);
    setMeta('name', 'description', resolvedDescription);
    setMeta(
      'name',
      'robots',
      'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    );

    if (propKeywords) {
      setMeta('name', 'keywords', propKeywords);
    }

    // Open Graph
    setMeta('property', 'og:type', propType);
    setMeta('property', 'og:url', resolvedCanonicalUrl);
    setMeta('property', 'og:title', resolvedTitle);
    setMeta('property', 'og:description', resolvedDescription);
    setMeta('property', 'og:image', resolvedImageUrl);
    setMeta('property', 'og:image:alt', resolvedTitle);
    setMeta('property', 'og:site_name', 'AA-EventMaker');

    // Twitter Card
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:url', resolvedCanonicalUrl);
    setMeta('name', 'twitter:title', resolvedTitle);
    setMeta('name', 'twitter:description', resolvedDescription);
    setMeta('name', 'twitter:image', resolvedImageUrl);

    // Schema.org Structured Data
    updateJsonLd('seo-schema-structured-data', resolvedJsonLd || null);
  }, [
    propTitle,
    propDescription,
    propCanonicalPath,
    propImageUrl,
    propType,
    propNoIndex,
    propJsonLd,
    propKeywords,
    showPublicLanding,
    showPublicPreview,
    invitation,
    activeRole,
  ]);

  return null;
};

export default SeoMetadata;
