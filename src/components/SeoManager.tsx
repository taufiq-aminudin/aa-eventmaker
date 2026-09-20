import React, { useEffect } from 'react';
import { useEvent } from '../context/EventContext';

export const PRODUCTION_DOMAIN = 'https://aa-eventmaker.my.id';

function setMetaTag(nameOrProperty: 'name' | 'property', key: string, content: string) {
  let element = document.querySelector(`meta[${nameOrProperty}="${key}"]`) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(nameOrProperty, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function setCanonical(href: string) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

function setJsonLd(id: string, data: object | null) {
  let script = document.getElementById(id) as HTMLScriptElement | null;
  if (!data) {
    if (script) {
      script.remove();
    }
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

export const SeoManager: React.FC = () => {
  const {
    showPublicLanding,
    showPublicPreview,
    invitation,
    currentUser,
    activeRole,
  } = useEvent();

  useEffect(() => {
    // 1. Hostname Redirect Safety Check: Redirect non-canonical hosts to canonical https://aa-eventmaker.my.id
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (
        hostname === 'aa-eventmaker.com' ||
        hostname === 'www.aa-eventmaker.com' ||
        hostname === 'www.aa-eventmaker.my.id'
      ) {
        const destination = `${PRODUCTION_DOMAIN}${window.location.pathname}${window.location.search}${window.location.hash}`;
        window.location.replace(destination);
        return;
      }
    }

    // Determine current route state
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
    const isInvitationRoute =
      showPublicPreview ||
      hash.startsWith('#invitation') ||
      pathname.startsWith('/invitation');

    if (isInvitationRoute) {
      // -------------------------------------------------------------
      // PUBLIC INVITATION PAGE SEO
      // -------------------------------------------------------------
      // Extract clean slug for canonical
      let slug = invitation.slug || 'andi-ayu-wedding';
      if (hash.startsWith('#invitation/')) {
        const extracted = hash.replace('#invitation/', '').split('?')[0];
        if (extracted) slug = extracted;
      } else if (pathname.startsWith('/invitation/')) {
        const extracted = pathname.replace('/invitation/', '').split('?')[0];
        if (extracted) slug = extracted;
      }

      const canonicalUrl = `${PRODUCTION_DOMAIN}/invitation/${slug}`;
      const title = `${invitation.title} – Undangan Digital | AA Event Maker`;
      const description = `Undangan digital resmi ${invitation.title} (${invitation.hosts}). Acara pada ${invitation.date} di ${invitation.venue}. Buka undangan digital Anda di sini.`;
      const imageUrl = invitation.coverPhoto || `${PRODUCTION_DOMAIN}/pwa-512x512.png`;

      // Document Title
      document.title = title;

      // Meta Tags
      setCanonical(canonicalUrl);
      setMetaTag('name', 'title', title);
      setMetaTag('name', 'description', description);
      setMetaTag('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

      // Open Graph
      setMetaTag('property', 'og:type', 'website');
      setMetaTag('property', 'og:url', canonicalUrl);
      setMetaTag('property', 'og:title', title);
      setMetaTag('property', 'og:description', description);
      setMetaTag('property', 'og:image', imageUrl);
      setMetaTag('property', 'og:site_name', 'AA-EventMaker');

      // Twitter Card
      setMetaTag('name', 'twitter:card', 'summary_large_image');
      setMetaTag('name', 'twitter:url', canonicalUrl);
      setMetaTag('name', 'twitter:title', title);
      setMetaTag('name', 'twitter:description', description);
      setMetaTag('name', 'twitter:image', imageUrl);

      // JSON-LD Structured Data: Event Schema
      setJsonLd('seo-schema-structured-data', {
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
        image: [imageUrl],
        url: canonicalUrl,
      });
    } else if (showPublicLanding) {
      // -------------------------------------------------------------
      // PUBLIC HOMEPAGE / MARKETING PORTAL SEO
      // -------------------------------------------------------------
      const canonicalUrl = `${PRODUCTION_DOMAIN}/`;
      const title = 'AA Event Maker – Create Beautiful Digital Invitations';
      const description =
        'Create beautiful animated digital invitations for weddings, engagements, birthdays, and special events with AA Event Maker.';
      const imageUrl = `${PRODUCTION_DOMAIN}/pwa-512x512.png`;

      // Document Title
      document.title = title;

      // Canonical & Robots
      setCanonical(canonicalUrl);
      setMetaTag('name', 'title', title);
      setMetaTag('name', 'description', description);
      setMetaTag('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

      // Open Graph
      setMetaTag('property', 'og:type', 'website');
      setMetaTag('property', 'og:url', canonicalUrl);
      setMetaTag('property', 'og:title', title);
      setMetaTag('property', 'og:description', description);
      setMetaTag('property', 'og:image', imageUrl);
      setMetaTag('property', 'og:site_name', 'AA-EventMaker');

      // Twitter Card
      setMetaTag('name', 'twitter:card', 'summary_large_image');
      setMetaTag('name', 'twitter:url', canonicalUrl);
      setMetaTag('name', 'twitter:title', title);
      setMetaTag('name', 'twitter:description', description);
      setMetaTag('name', 'twitter:image', imageUrl);

      // JSON-LD Structured Data: WebSite, Organization, SoftwareApplication
      setJsonLd('seo-schema-structured-data', {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebSite',
            '@id': `${PRODUCTION_DOMAIN}/#website`,
            url: `${PRODUCTION_DOMAIN}/`,
            name: 'AA Event Maker',
            description: description,
            inLanguage: 'id-ID',
          },
          {
            '@type': 'Organization',
            '@id': `${PRODUCTION_DOMAIN}/#organization`,
            name: 'AA-EventMaker',
            url: `${PRODUCTION_DOMAIN}/`,
            logo: `${PRODUCTION_DOMAIN}/icon.svg`,
            slogan: 'Plan • Manage • Make It Happen',
          },
          {
            '@type': 'SoftwareApplication',
            '@id': `${PRODUCTION_DOMAIN}/#software`,
            name: 'AA-EventMaker',
            url: `${PRODUCTION_DOMAIN}/`,
            applicationCategory: 'BusinessApplication, LifestyleApplication',
            operatingSystem: 'All',
            description: description,
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'IDR',
            },
          },
        ],
      });
    } else {
      // -------------------------------------------------------------
      // PRIVATE / AUTHENTICATED DASHBOARD (ORGANIZER, VENDOR, CLIENT, GUEST)
      // Protect from Google Indexing
      // -------------------------------------------------------------
      const canonicalUrl = `${PRODUCTION_DOMAIN}/`;
      const title = `Dasbor ${activeRole} | AA Event Maker`;

      document.title = title;
      // Remove canonical tag on private authenticated routes to prevent conflicting signals with noindex
      const canonicalElement = document.querySelector('link[rel="canonical"]');
      if (canonicalElement) canonicalElement.remove();
      setMetaTag('name', 'title', title);
      setMetaTag('name', 'robots', 'noindex, nofollow');

      // Clear public event structured data on private pages
      setJsonLd('seo-schema-structured-data', null);
    }
  }, [showPublicLanding, showPublicPreview, invitation, currentUser, activeRole]);

  return null;
};
