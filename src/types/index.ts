export type ProductCategory = 'personal-care' | 'home-care';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  subCategory: string;
  tagline: string;
  description: string;
  volumeOrWeight: string;
  pricePkr?: number;
  keyIngredients: string[];
  benefits: string[];
  howToUse: string;
  isBestseller?: boolean;
  isVisible?: boolean;
  ecoHighlights: string[];
  customEmoji?: string;
  imageUrl?: string;
}

export interface BrandSettings {
  name: string;
  tagline: string;
  phone: string;
  phoneRaw: string;
  email: string;
  whatsAppUrl: string;
  location: string;
  deliveryNotice: string;
  topBannerNotice?: string;
  logoUrl?: string;
  faviconUrl?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type PageId = 'home' | 'personal-care' | 'home-care' | 'about' | 'contact' | 'admin';

export interface HomePageContent {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBtnPrimaryText: string;
  heroBtnSecondaryText: string;
  heroImageUrl: string;
  heroGuaranteeTitle: string;
  heroGuaranteeSubtitle: string;
  heroTrustBadges: string[];
  introBadge: string;
  introTitle: string;
  introDescription: string;
  introPillars: Array<{
    title: string;
    description: string;
  }>;
  categoryPersonalTitle: string;
  categoryPersonalSubtitle: string;
  categoryHomeTitle: string;
  categoryHomeSubtitle: string;
  bannerTitle: string;
  bannerSubtitle: string;
  bannerHighlight: string;
}

export interface CategoryPageContent {
  badge: string;
  title: string;
  description: string;
  imageUrl: string;
  highlights: string[];
}

export interface AboutPageContent {
  headerBadge: string;
  headerTitle: string;
  headerDescription: string;
  storyBadge: string;
  storyTitle: string;
  storyParagraphs: string[];
  storyHighlights: string[];
  storyImageUrl: string;
  storyImageCaption: string;
  missionTitle: string;
  missionDescription: string;
  visionTitle: string;
  visionDescription: string;
  stats: Array<{
    value: string;
    label: string;
  }>;
}

export interface ContactPageContent {
  headerBadge: string;
  headerTitle: string;
  headerDescription: string;
  formTitle: string;
  formSubtitle: string;
  operatingHours: string;
  dispatchWarehouse: string;
  faqs: Array<{
    q: string;
    a: string;
  }>;
}

export interface GlobalSiteContent {
  topAnnouncement: string;
  topBannerNotice?: string;
  footerTagline: string;
  footerAboutText: string;
}

export interface SitePagesContent {
  home: HomePageContent;
  personalCare: CategoryPageContent;
  homeCare: CategoryPageContent;
  about: AboutPageContent;
  contact: ContactPageContent;
  global: GlobalSiteContent;
}

// ==========================================
// SEO & SOCIAL METADATA TYPES
// ==========================================
export interface PageSeoConfig {
  title: string;
  description: string;
  keywords: string;
  ogImage?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

export interface ProductSeoConfig {
  productId: string;
  customTitle?: string;
  customDescription?: string;
  focusKeyword?: string;
}

export interface SiteSeoSettings {
  siteTitle: string;
  siteDescription: string;
  keywords: string;
  canonicalBaseUrl: string;
  ogSiteName: string;
  ogImageUrl: string;
  twitterHandle: string;
  googleVerificationCode: string;
  bingVerificationCode?: string;
  enableJsonLd: boolean;
  organizationName: string;
  organizationLogo: string;
  pages: Record<string, PageSeoConfig>;
  productOverrides: Record<string, ProductSeoConfig>;
}

// ==========================================
// ANALYTICS & STORE METRICS TYPES
// ==========================================
export type AnalyticsEventType =
  | 'page_view'
  | 'product_view'
  | 'cart_add'
  | 'whatsapp_click'
  | 'inquiry_submit';

export interface AnalyticsEvent {
  id: string;
  type: AnalyticsEventType;
  path: string;
  productId?: string;
  productName?: string;
  valuePkr?: number;
  referrer?: string;
  timestamp: number;
  city?: string;
  device?: 'mobile' | 'desktop' | 'tablet';
}

export interface AnalyticsSettings {
  gaMeasurementId: string;
  gtmContainerId: string;
  metaPixelId: string;
  tiktokPixelId: string;
  enableInternalTracker: boolean;
}

export interface AnalyticsSummary {
  totalVisitors: number;
  totalPageViews: number;
  totalWhatsAppClicks: number;
  totalCartAdds: number;
  estimatedRevenuePkr: number;
  conversionRate: number;
  topProducts: Array<{
    id: string;
    name: string;
    views: number;
    cartAdds: number;
    orders: number;
    revenuePkr: number;
  }>;
  topPages: Array<{
    path: string;
    views: number;
  }>;
  dailyViews: Array<{
    date: string;
    views: number;
    conversions: number;
  }>;
  channelBreakdown: Array<{
    channel: string;
    visitors: number;
    percentage: number;
  }>;
  deviceBreakdown: Array<{
    device: string;
    count: number;
    percentage: number;
  }>;
  recentEvents: AnalyticsEvent[];
}

// ==========================================
// ADMIN ROLES & SUBADMIN MANAGEMENT
// ==========================================
export type AdminRole = 'super_admin' | 'product_manager';

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  role: AdminRole;
  createdAt: number;
  lastLoginAt?: number;
}

export interface SubadminCreateInput {
  username: string;
  name: string;
  password: string;
  role?: 'product_manager';
}



