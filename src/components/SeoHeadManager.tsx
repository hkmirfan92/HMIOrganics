import React, { useEffect } from 'react';
import { SiteSeoSettings, PageId, Product, BrandSettings, AnalyticsSettings } from '../types';

interface SeoHeadManagerProps {
  currentPage: PageId;
  seoSettings: SiteSeoSettings;
  activeProduct?: Product | null;
  settings?: BrandSettings;
  analyticsSettings?: AnalyticsSettings;
}

export const SeoHeadManager: React.FC<SeoHeadManagerProps> = ({
  currentPage,
  seoSettings,
  activeProduct,
  settings,
  analyticsSettings,
}) => {
  useEffect(() => {
    // Determine active title, description, and keywords
    let title = seoSettings.siteTitle;
    let description = seoSettings.siteDescription;
    let keywords = seoSettings.keywords;
    let ogImage = seoSettings.ogImageUrl;
    let canonical = `${seoSettings.canonicalBaseUrl}/${currentPage === 'home' ? '' : currentPage}`;

    // Per-page override
    const pageConfig = seoSettings.pages[currentPage];
    if (pageConfig) {
      if (pageConfig.title) title = pageConfig.title;
      if (pageConfig.description) description = pageConfig.description;
      if (pageConfig.keywords) keywords = pageConfig.keywords;
      if (pageConfig.ogImage) ogImage = pageConfig.ogImage;
      if (pageConfig.canonicalUrl) canonical = pageConfig.canonicalUrl;
    }

    // Per-product override if a product modal is active
    if (activeProduct) {
      const override = seoSettings.productOverrides[activeProduct.id];
      title = override?.customTitle || `${activeProduct.name} — HMI Organics Herbal Care`;
      description = override?.customDescription || activeProduct.description;
      if (override?.focusKeyword) {
        keywords = `${override.focusKeyword}, ${keywords}`;
      }
      if (activeProduct.imageUrl) {
        ogImage = activeProduct.imageUrl;
      }
      canonical = `${seoSettings.canonicalBaseUrl}/product/${activeProduct.id}`;
    }

    // 1. Update Document Title
    document.title = title;

    // Helper to set or create meta tag
    const setMeta = (attrName: string, attrVal: string, contentVal: string) => {
      let el = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrVal);
        document.head.appendChild(el);
      }
      el.setAttribute('content', contentVal);
    };

    // Helper to set link canonical
    const setCanonical = (href: string) => {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', href);
    };

    // 2. Dynamic Favicon & Apple Touch Icon
    const activeFavicon = settings?.faviconUrl || '/favicon.png';
    const setFavicon = (iconUrl: string) => {
      let iconLink = document.querySelector('link[rel="icon"]') as HTMLLinkElement | null;
      if (!iconLink) {
        iconLink = document.createElement('link');
        iconLink.rel = 'icon';
        document.head.appendChild(iconLink);
      }
      iconLink.href = iconUrl;

      let appleLink = document.querySelector('link[rel="apple-touch-icon"]') as HTMLLinkElement | null;
      if (!appleLink) {
        appleLink = document.createElement('link');
        appleLink.rel = 'apple-touch-icon';
        document.head.appendChild(appleLink);
      }
      appleLink.href = iconUrl;
    };
    setFavicon(activeFavicon);

    // 3. Standard Meta Tags
    setMeta('name', 'description', description);
    setMeta('name', 'keywords', keywords);
    setMeta('name', 'robots', pageConfig?.noIndex ? 'noindex, nofollow' : 'index, follow');
    if (seoSettings.googleVerificationCode) {
      const cleanCode = seoSettings.googleVerificationCode.replace(/^google-site-verification=/, '').trim();
      setMeta('name', 'google-site-verification', cleanCode);
    }

    // 4. OpenGraph Tags
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', activeProduct ? 'product' : 'website');
    setMeta('property', 'og:site_name', seoSettings.ogSiteName || 'HMI Organics');
    setMeta('property', 'og:image', ogImage);
    setMeta('property', 'og:url', canonical);

    // 5. Twitter Card Tags
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', ogImage);
    if (seoSettings.twitterHandle) {
      setMeta('name', 'twitter:site', seoSettings.twitterHandle);
    }

    // 6. Canonical Link
    setCanonical(canonical);

    // 7. Schema.org JSON-LD Structured Data
    if (seoSettings.enableJsonLd) {
      const scriptId = 'hmi-structured-data-jsonld';
      let scriptEl = document.getElementById(scriptId) as HTMLScriptElement | null;
      if (!scriptEl) {
        scriptEl = document.createElement('script');
        scriptEl.id = scriptId;
        scriptEl.type = 'application/ld+json';
        document.head.appendChild(scriptEl);
      }

      let schemaData: any;

      if (activeProduct) {
        // Product Rich Snippet Schema
        schemaData = {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: activeProduct.name,
          description: activeProduct.description,
          image: [ogImage],
          brand: {
            '@type': 'Brand',
            name: 'HMI Organics',
          },
          category: activeProduct.category === 'personal-care' ? 'Personal Care' : 'Home Cleaning',
          offers: {
            '@type': 'Offer',
            priceCurrency: 'PKR',
            price: activeProduct.pricePkr || 500,
            availability: 'https://schema.org/InStock',
            seller: {
              '@type': 'Organization',
              name: 'HMI Organics',
            },
          },
        };
      } else {
        // Organization & Local Business Schema
        const activeOrgLogo = settings?.logoUrl || seoSettings.organizationLogo || '/hmi-organics-logo.png';
        schemaData = {
          '@context': 'https://schema.org',
          '@type': 'Store',
          name: seoSettings.organizationName || 'HMI Organics',
          url: seoSettings.canonicalBaseUrl,
          logo: activeOrgLogo,
          description: seoSettings.siteDescription,
          telephone: settings?.phone || '+923052211093',
          priceRange: 'PKR 250 - PKR 1800',
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'PK',
          },
        };
      }

      scriptEl.textContent = JSON.stringify(schemaData, null, 2);
    }

    // 8. Google Analytics 4 (GA4) Integration
    const gaId = analyticsSettings?.gaMeasurementId?.trim();
    if (gaId && gaId.startsWith('G-')) {
      const gaScriptId = 'google-analytics-gtag-script';
      if (!document.getElementById(gaScriptId)) {
        const gaScript = document.createElement('script');
        gaScript.id = gaScriptId;
        gaScript.async = true;
        gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(gaScript);

        const initScript = document.createElement('script');
        initScript.id = 'google-analytics-gtag-init';
        initScript.text = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { send_page_view: true });
        `;
        document.head.appendChild(initScript);
      } else {
        if (typeof (window as any).gtag === 'function') {
          (window as any).gtag('config', gaId, {
            page_title: title,
            page_path: canonical,
          });
        }
      }
    }

    // 9. Google Tag Manager (GTM) Integration
    const gtmId = analyticsSettings?.gtmContainerId?.trim();
    if (gtmId && gtmId.startsWith('GTM-')) {
      const gtmScriptId = 'google-tag-manager-script';
      if (!document.getElementById(gtmScriptId)) {
        const gtmScript = document.createElement('script');
        gtmScript.id = gtmScriptId;
        gtmScript.text = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`;
        document.head.appendChild(gtmScript);
      }
    }

  }, [currentPage, seoSettings, activeProduct, settings, analyticsSettings]);

  return null;
};
